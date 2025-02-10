import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inventory from "@/models/Inventory";

export async function GET() {
  try {
    await connectToDatabase();
    
    const products = await Inventory.find({});
    
    if (products.length === 0) {
      return NextResponse.json({ success: true, message: "No products found.", products: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
