import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inventory from "@/models/Inventory";

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get search query from request parameters
    const query = request.nextUrl.searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json({ success: false, message: "Query parameter is required." }, { status: 400 });
    }

    // Perform case-insensitive search using regex
    const products = await Inventory.find({
      slug: { $regex: query, $options: "i" },
    });

    if (products.length === 0) {
      return NextResponse.json({ success: true, message: "No matching products found.", products: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, products }, { status: 200 });

  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
