import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { getProductBySlug } from "@/lib/wordpress";

/* ── WooCommerce REST helpers ────────────────────────────── */

function wcAuthHeader(): string {
  const key    = process.env.WC_CONSUMER_KEY    ?? "";
  const secret = process.env.WC_CONSUMER_SECRET ?? "";
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

async function createWooOrder(body: {
  productId: number;
  quantity:  number;
  fullName:  string;
  phone:     string;
  city:      string;
  address:   string;
  model:     string;
}): Promise<{ id: number } | null> {
  const wcUrl = process.env.WC_REST_URL ?? "https://admin.nakamastore.ma/wp-json/wc/v3";
  const key   = process.env.WC_CONSUMER_KEY;
  if (!key) return null; // env not configured — skip silently

  const [firstName, ...rest] = body.fullName.trim().split(" ");
  const lastName = rest.join(" ") || firstName;

  const payload = {
    status:          "pending",
    customer_note:   `Website order — ${body.model}`,
    billing: {
      first_name: firstName,
      last_name:  lastName,
      address_1:  body.address,
      city:       body.city,
      country:    "MA",
      phone:      body.phone,
    },
    line_items: [
      { product_id: body.productId, quantity: body.quantity },
    ],
  };

  try {
    const res = await fetch(`${wcUrl}/orders`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": wcAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[WC order error]", res.status, err);
      return null;
    }

    return (await res.json()) as { id: number };
  } catch (e) {
    console.error("[WC order fetch error]", e);
    return null;
  }
}

/* ── Route handler ───────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { model, quantity, fullName, phone, city, address } = parsed.data;

    // Look up the WooCommerce product to get its numeric ID
    const product = await getProductBySlug(model);
    console.log("[NEW ORDER]", { model, quantity, fullName, city });

    let orderId: number | null = null;

    if (product?.databaseId) {
      const wcOrder = await createWooOrder({
        productId: product.databaseId,
        quantity,
        fullName,
        phone,
        city,
        address,
        model,
      });
      orderId = wcOrder?.id ?? null;
    }

    return NextResponse.json({
      success:  true,
      orderId:  orderId ?? `NK-${Date.now()}`,
      message:  "Order received.",
    });
  } catch (err) {
    console.error("[order route]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
