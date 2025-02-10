import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Inventory from "@/models/Inventory";

export async function POST(request) {
  try {
    await connectToDatabase();
    
    // Parse request body
    const { action, slug, initialQuantity } = await request.json();

    // Validate input
    if (!slug || !initialQuantity || !["plus", "minus"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please provide 'slug', 'initialQuantity', and a valid 'action' ('plus' or 'minus')." },
        { status: 400 }
      );
    }

    // Ensure initialQuantity is a valid number
    const currentQuantity = parseInt(initialQuantity);
    if (isNaN(currentQuantity)) {
      return NextResponse.json(
        { success: false, message: "Invalid quantity provided." },
        { status: 400 }
      );
    }

    // Calculate new quantity
    let newQuantity = action === "plus" ? currentQuantity + 1 : currentQuantity - 1;

    // Prevent quantity from going below zero
    if (newQuantity < 0) {
      return NextResponse.json(
        { success: false, message: "Quantity cannot be negative." },
        { status: 400 }
      );
    }

    // Update the inventory item
    const updatedProduct = await Inventory.findOneAndUpdate(
      { slug },
      { quantity: newQuantity },
      { new: true, upsert: false } // Ensure item exists, don't create new if missing
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated quantity to ${updatedProduct.quantity}`,
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
