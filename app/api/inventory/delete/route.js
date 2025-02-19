import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inventory from "@/models/Inventory";

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required." }, { status: 400 });
    }

    const deletedProduct = await Inventory.findOneAndDelete({ slug });

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Product '${slug}' deleted successfully.` });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
