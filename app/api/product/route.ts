import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = "http://localhost:8001/api/web/v1/product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");
  if (!product_id) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }
  try {
    const response = await axios.get(API_URL, { params: { product_id } });
    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const response = await axios.post(API_URL, data);
    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const data = await req.json();
  try {
    const response = await axios.put(API_URL, data);
    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
