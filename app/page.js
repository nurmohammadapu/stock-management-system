"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [productForm, setProductForm] = useState({ slug: "", quantity: "", price: "" });
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

 
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/inventory/getAll");
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle quantity update for a product
  const updateQuantity = async (action, slug, initialQuantity) => {
    try {
      setLoadingAction(true);
  
      // Optimistic UI update
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.slug === slug
            ? { ...item, quantity: action === "plus" ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
            : item
        )
      );
  
      setDropdown((prevDropdown) =>
        prevDropdown.map((item) =>
          item.slug === slug
            ? { ...item, quantity: action === "plus" ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
            : item
        )
      );
  
      const { data } = await axios.post("/api/inventory/update", {
        action,
        slug,
        initialQuantity,
      });
  
      if (!data.success) {
        console.error("Update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoadingAction(false);
    }
  };
  
  // Handle product addition
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      setAlert("");
  
      const { data } = await axios.post("/api/inventory/add", productForm);
  
      if (data.success) {
        setAlert("Your product has been added!");
        setProductForm({ slug: "", quantity: "", price: "" });
        fetchProducts(); // Sync back products
      } else {
        console.error("Error adding product:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle product search
  const handleSearch = async (e) => {
    let value = e.target.value;
    setQuery(value);
  
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
  
      try {
        const { data } = await axios.get(`/api/inventory/search?query=${value}`);
        setDropdown(data.products);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setDropdown([]);
    }
  };
  

  return (
    <>
      <div className="container mx-auto my-8">
        {alert && <div className="text-green-800 text-center">{alert}</div>}
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>

        {/* ✅ Search Bar */}
        <div className="flex mb-2">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Enter a product name"
            className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md"
          />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>

        {loading && <div className="flex justify-center items-center"> <img width={74} src="/loading.svg" alt="Loading" /> </div>}

        {/* ✅ Search Dropdown */}
        <div className="dropcontainer absolute w-[72vw] border bg-purple-100 rounded-md">
          {dropdown.map((item) => (
            <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">
              <span> {item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className="mx-5">
                <button onClick={() => updateQuantity("minus", item.slug, item.quantity)} disabled={loadingAction} className="px-3 py-1 bg-purple-500 text-white rounded-lg shadow-md disabled:bg-purple-200">-</button>
                <span className="min-w-3 mx-3">{item.quantity}</span>
                <button onClick={() => updateQuantity("plus", item.slug, item.quantity)} disabled={loadingAction} className="px-3 py-1 bg-purple-500 text-white rounded-lg shadow-md disabled:bg-purple-200">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Add Product Form */}
      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
        <form onSubmit={addProduct}>
          <input value={productForm.slug} name="slug" onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} type="text" placeholder="Product Slug" className="w-full border border-gray-300 px-4 py-2 mb-4" />
          <input value={productForm.quantity} name="quantity" onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })} type="number" placeholder="Quantity" className="w-full border border-gray-300 px-4 py-2 mb-4" />
          <input value={productForm.price} name="price" onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} type="number" placeholder="Price" className="w-full border border-gray-300 px-4 py-2 mb-4" />
          <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">Add Product</button>
        </form>
      </div>

      {/* ✅ Display Current Stock */}
      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug}>
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">₹{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
