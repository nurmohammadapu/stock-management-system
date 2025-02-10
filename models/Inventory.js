import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true 
    },
  quantity: { 
    type: Number, 
    required: true, 
    default: 0 
    },
});

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);
