import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axios from 'axios'

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    profession: "",
    role: "buyer",
    categories: []
  })

  const industryCategories = [
    "Clothings & Textiles",
    "Footwear",
    "Electronics & Mobiles",
    "Grocery & Kirana",
    "Hardware & Construction",
    "Automobile Parts",
    "Pharmacy & Healthcare",
    "Furniture & Home Decor",
    "Jewelry",
    "Stationery & Gifts"
  ]

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [customCategory, setCustomCategory] = useState("")

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    const trimmed = customCategory.trim();
    if (trimmed && !formData.categories.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, trimmed]
      }));
      setCustomCategory("");
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    const { username, email, password, phone } = formData

    if (!username.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      return "All required fields must be filled"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Invalid email"
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone)) {
      return "Phone must be 10 digits"
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )

      setSuccess("Account created successfully")

      // Auto-Login: save token and user data
      localStorage.setItem("Token", res?.data?.token)
      localStorage.setItem("User", JSON.stringify(res?.data?.user))

      setTimeout(() => {
        
        navigate("/login")
      }, 1000)

    } catch (err) {
      console.log(err.response.data.message)
      setError(err?.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center">

        <div className="w-full max-w-2xl px-6 pt-24 md:pt-32 pb-16">

          <div className="mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-semibold">Create Account</h1>
            <p className="text-neutral-500 text-sm mt-2">
              Start buying or selling in seconds
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-500 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="username" onChange={handleChange} value={formData.username} placeholder="Username" className="input" />
              <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" className="input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="password" type="password" onChange={handleChange} value={formData.password} placeholder="Password" className="input" />
              <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone" className="input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="city" onChange={handleChange} value={formData.city} placeholder="City" className="input" />
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="input bg-black text-white border border-neutral-700"
              >
                <option value="" disabled className="bg-black text-neutral-500">Select Profession</option>
                <option value="Retailer" className="bg-black text-white">Retailer</option>
                <option value="Wholesaler" className="bg-black text-white">Wholesaler</option>
                <option value="Distributor" className="bg-black text-white">Distributor</option>
                <option value="Manufacturer" className="bg-black text-white">Manufacturer</option>
                <option value="Professional" className="bg-black text-white">Professional</option>
                <option value="Other" className="bg-black text-white">Other</option>
              </select>
            </div>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input bg-black text-white border border-neutral-700"
            >
              <option value="buyer" className="bg-black text-white">Buyer</option>
              <option value="seller" className="bg-black text-white">Seller</option>
            </select>

            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-400">Business Categories (Select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {industryCategories.map(cat => (
                  <div 
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`cursor-pointer px-3 py-2 rounded-md border text-xs transition-all ${
                      formData.categories.includes(cat)
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    {cat}
                  </div>
                ))}
                
                {/* Custom selected categories */}
                {formData.categories
                  .filter(cat => !industryCategories.includes(cat))
                  .map(cat => (
                    <div 
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className="cursor-pointer px-3 py-2 rounded-md border text-xs transition-all bg-white text-black border-white"
                    >
                      {cat} ✕
                    </div>
                  ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCategory(e);
                    }
                  }}
                  placeholder="Other category? Type and press enter"
                  className="input flex-1 text-sm bg-transparent border border-neutral-700 text-white rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-4 py-2 bg-neutral-800 text-white font-medium rounded-md text-sm border border-neutral-700 hover:bg-neutral-700 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              disabled={loading || success}
              className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : success ? 'Success!' : 'Create Account'}
            </button>

          </form>

          <p className="mt-6 text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="text-white">
              Login
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default Register