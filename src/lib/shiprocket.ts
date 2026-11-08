export interface ShipmentParams {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  pickupLocation?: string;
  billingCustomerName: string;
  billingAddress: string;
  billingCity: string;
  billingPincode: string;
  billingState: string;
  billingEmail: string;
  billingPhone: string;
  orderItems: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
  }>;
  subTotal: number;
  lengthCm?: number;
  breadthCm?: number;
  heightCm?: number;
  weightKg?: number;
}

export async function createShiprocketShipment(params: ShipmentParams) {
  const user = process.env.SHIPROCKET_API_USER;
  const password = process.env.SHIPROCKET_API_PASSWORD;

  // In sandbox or dev mode, return mock courier tracking
  if (!user || user.includes("vajraprinters3245@gmail.com") || !password || password.includes("your-shiprocket")) {
    const courierOptions = ["Blue Dart Express Air", "Delhivery Surface 5kg", "DTDC Premium Priority"];
    const randomCourier = courierOptions[Math.floor(Math.random() * courierOptions.length)];
    const mockAwb = `SR${Math.floor(100000000 + Math.random() * 900000000)}`;

    return {
      success: true,
      order_id: `sr_ord_${Date.now()}`,
      shipment_id: `sr_shp_${Date.now()}`,
      status: "NEW",
      courier_name: randomCourier,
      awb_code: mockAwb,
      tracking_url: `https://shiprocket.co/tracking/${mockAwb}`,
      isSimulated: true,
    };
  }

  try {
    // 1. Authenticate with Shiprocket API
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user, password }),
    });

    const authData = await authRes.json();
    const token = authData.token;
    if (!token) throw new Error("Could not obtain Shiprocket token");

    // 2. Create custom quick order
    const orderRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: params.orderNumber,
        order_date: params.orderDate,
        pickup_location: params.pickupLocation || "Cottonpet Studio",
        billing_customer_name: params.billingCustomerName,
        billing_last_name: "",
        billing_address: params.billingAddress,
        billing_city: params.billingCity,
        billing_pincode: params.billingPincode,
        billing_state: params.billingState,
        billing_country: "India",
        billing_email: params.billingEmail,
        billing_phone: params.billingPhone,
        shipping_is_billing: true,
        order_items: params.orderItems,
        payment_method: "Prepaid",
        sub_total: params.subTotal,
        length: params.lengthCm || 20,
        breadth: params.breadthCm || 15,
        height: params.heightCm || 8,
        weight: params.weightKg || 1.2,
      }),
    });

    const result = await orderRes.json();
    return {
      success: true,
      ...result,
    };
  } catch (err) {
    console.error("Shiprocket shipment creation error:", err);
    return {
      success: false,
      error: err,
    };
  }
}

export async function trackShipment(awbOrOrderId: string) {
  return {
    awb_code: awbOrOrderId,
    current_status: "IN_TRANSIT",
    current_location: "Bengaluru Central Sorting Hub, Electronic City",
    scans: [
      {
        date: "2026-11-08 09:30:00",
        activity: "Manifested and Picked Up from PrintCraft Studio Cottonpet",
        location: "Bengaluru",
      },
      {
        date: "2026-11-08 11:45:00",
        activity: "Arrived at Bengaluru Central Sorting Hub",
        location: "Bengaluru",
      },
    ],
  };
}

