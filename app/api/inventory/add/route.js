import { NextResponse } from "next/server";
import Inventory from "@/models/Inventory";
import connectToDatabase from "@/lib/db";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Validate input
    if (!body.slug || !body.quantity) {
      return NextResponse.json({ success: false, message: "Slug and quantity are required." }, { status: 400 });
    }

    // Check if the item already exists
    const existingProduct = await Inventory.findOne({ slug: body.slug });
    if (existingProduct) {
      return NextResponse.json({ success: false, message: "Product with this slug already exists." }, { status: 409 });
    }

    // Create and save new product
    const newProduct = new Inventory(body);
    await newProduct.save();

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
