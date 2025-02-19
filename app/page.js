"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FiSearch, FiPlus, FiMinus, FiTag, FiPackage, FiChevronDown, FiTrash2, FiLoader } from "react-icons/fi"

export default function Home() {
  const [productForm, setProductForm] = useState({ slug: "", quantity: "" })
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)
  const [dropdown, setDropdown] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  const categories = ["All", "Electronics", "Clothing", "Books", "Home & Garden"]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/inventory/getAll")
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle quantity update for a product
  const updateQuantity = async (action, slug, initialQuantity) => {
    try {
      setLoadingAction(true)

      const newQuantity = action === "plus" ? initialQuantity + 1 : initialQuantity - 1

      // Prevent UI update if quantity is already 0
      if (newQuantity < 0) {
        toast.error("Quantity cannot be less than 0!", {
          duration: 3000,
        })
        return // Stop execution
      }

      // Optimistic UI update
      setProducts((prevProducts) =>
        prevProducts.map((item) => (item.slug === slug ? { ...item, quantity: newQuantity } : item)),
      )

      setDropdown((prevDropdown) =>
        prevDropdown.map((item) => (item.slug === slug ? { ...item, quantity: newQuantity } : item)),
      )

      // API Call
      const response = await fetch("/api/inventory/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, slug, initialQuantity }),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error("Update failed: " + data.message)
      } else {
        toast.success(`Quantity updated to ${data.product.quantity}`)
      }
    } catch (error) {
      toast.error("Something went wrong!")
      console.error("Error updating quantity:", error)
    } finally {
      setLoadingAction(false)
    }
  }

  // Handle product addition
  const addProduct = async (e) => {
    e.preventDefault()
    try {


      const { data } = await axios.post("/api/inventory/add", productForm)

      if (data.success) {
        toast.success("Your product has been added!");
        setProductForm({ slug: "", quantity: "" })
        fetchProducts() // Sync back products
      } else {
        toast.error("Error adding product")
        console.error("Error adding product:", data.message)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // Handle product search
  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 3) {
      setLoading(true)
      setDropdown([])

      try {
        const { data } = await axios.get(`/api/inventory/search?query=${value}`)
        setDropdown(data.products)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    } else {
      setDropdown([])
    }
  }

  // Handle product deletion
  const deleteProduct = async (slug) => {
    try {
      setLoadingAction(true)
      const response = await axios.delete(`/api/inventory/delete?slug=${slug}`)

      if (response.data.success) {
        toast.success(`Product '${slug}' deleted successfully.`)
        setProducts((prevProducts) => prevProducts.filter((product) => product.slug !== slug))
        setDeleteConfirmation(null)
      } else {
        toast.error("Failed to delete product: " + response.data.message)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.")
    } finally {
      setLoadingAction(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Search Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search a Product</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                onChange={handleSearch}
                type="text"
                placeholder="Enter a product name"
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-full focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-300 ease-in-out"
              />
              <FiSearch className="absolute left-4 top-3.5 text-purple-400 text-xl" />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-48 px-4 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out flex items-center justify-between"
              >
                <span>{selectedCategory}</span>
                <FiChevronDown
                  className={`ml-2 transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setIsDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100 focus:outline-none focus:bg-purple-100 transition-colors duration-300"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="relative">
                <FiLoader className="animate-spin text-purple-600 text-4xl" />
                <div className="absolute top-0 left-0 w-full h-full animate-ping rounded-full bg-purple-400 opacity-75"></div>
              </div>
            </div>
          )}

          {/* Search Dropdown */}
          <div className="mt-4">
            {dropdown.map((item) => (
              <div
                key={item.slug}
                className="bg-white shadow-md rounded-lg p-4 mb-2 flex justify-between items-center hover:shadow-lg transition-shadow duration-300"
              >
                <span className="font-medium text-gray-700">
                  {item.slug} ({item.quantity} available)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity("minus", item.slug, item.quantity)}
                    disabled={loadingAction}
                    className="p-2 bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-300 transition-colors duration-300"
                  >
                    <FiMinus />
                  </button>
                  <span className="font-bold text-gray-700 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity("plus", item.slug, item.quantity)}
                    disabled={loadingAction}
                    className="p-2 bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:bg-purple-300 transition-colors duration-300"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add a Product</h1>
          <form onSubmit={addProduct} className="space-y-4">
            <div className="relative">
              <input
                value={productForm.slug}
                name="slug"
                onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                type="text"
                placeholder="Product Slug"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <FiTag className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <input
                value={productForm.quantity}
                name="quantity"
                onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                type="number"
                placeholder="Quantity"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <FiPackage className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Display Current Stock */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Current Stock</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setDeleteConfirmation(product.slug)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete the product '{deleteConfirmation}'?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

