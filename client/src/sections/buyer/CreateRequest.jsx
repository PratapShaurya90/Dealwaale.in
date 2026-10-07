
import { useState } from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageFileNames, setImageFileNames] = useState([])
  const [form, setForm] = useState({
    companyName: '',
    productType: '',
    productName: '',
    productImages: [],
    companyLocation: '',
    pricePerProduct: '',
    phoneNumber: '',
    email: '',
    supplyType: 'Decide After Meeting',
  })

  const handleChange = async (e) => {
    const { name, value, files } = e.target
    
    if (name === 'productImages') {
      const selectedFiles = Array.from(files).slice(0, 2)
      setImageFileNames(selectedFiles.map(f => f.name))
      setImageUploading(true)
      try {
        const token = localStorage.getItem('Token')
        const formData = new FormData()
        selectedFiles.forEach(file => formData.append('images', file))

        const res = await axios.post('http://localhost:5000/api/upload/images', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        })
        setForm(prev => ({ ...prev, productImages: res.data.urls }))
      } catch (err) {
        toast.error('Image upload failed. Please try again.')
      } finally {
        setImageUploading(false)
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('Token')
      const response = await axios.post('http://localhost:5000/api/buyer/tickets', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      const ticketId = response.data?.ticket?._id;
      if (ticketId) {
        toast.success("Ticket has been created successfully!");
        setForm({
          companyName: '',
          productType: '',
          productName: '',
          productImages: [],
          companyLocation: '',
          pricePerProduct: '',
          phoneNumber: '',
          email: '',
          supplyType: 'Decide After Meeting',
        });
        setImageFileNames([]);
      } else {
        toast.error('Something went wrong');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'h-12 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 outline-none transition focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 w-full'

  const selectClass =
    'h-12 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 outline-none transition focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 w-full'

  return (
    <div className="w-full h-auto flex flex-col gap-8">

      {/* ── Heading ── */}
      <div className="w-full h-auto">
        <h1 className="text-8xl font-extrabold uppercase">Create Request</h1>
        <p className="text-xl font-medium">Post a request and let sellers come to you</p>
      </div>



      {/* ── Form Card ── */}
      <form onSubmit={handleSubmit} className="w-full  p-8 flex flex-col gap-8 border-1 border-dashed border-gray-800">

        {/* SECTION 01 — Product Information */}
        <div className="flex flex-col gap-5">

          {/* Section Header */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md tracking-widest">
              01
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Product Information</p>
              <p className="text-xs text-gray-400 mt-0.5">Basic details about what you are selling</p>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Fields Grid */}
          <div className="grid grid-cols-2 gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Product Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productType"
                value={form.productType}
                onChange={handleChange}
                placeholder="e.g. Clothing, Electronics"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Needed Product <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Company Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyLocation"
                value={form.companyLocation}
                onChange={handleChange}
                placeholder="City, State"
                className={inputClass}
                required
              />
            </div>

            {/* File Upload — full width */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Product Images <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-white min-h-[80px] px-6 py-4 cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition">
                <input
                  type="file"
                  name="productImages"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
                {imageUploading ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-600">
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-sm font-medium">Uploading to cloud...</span>
                  </div>
                ) : form.productImages.length > 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-emerald-600 text-lg">✅</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {imageFileNames.map((name, i) => (
                        <span key={i} className="text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md">
                          📷 {name}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">Uploaded successfully · Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <span className="text-xl">⬆</span>
                    <span className="text-sm">Click to upload images</span>
                    <span className="text-xs text-gray-400">Max 2 images · JPG, PNG, WEBP</span>
                  </div>
                )}
              </label>
            </div>

          </div>
        </div>

        {/* SECTION 02 — Pricing & Contact */}
        <div className="flex flex-col gap-5">

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md tracking-widest">
              02
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Pricing & Contact</p>
              <p className="text-xs text-gray-400 mt-0.5">How buyers can reach you and what to expect</p>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="grid grid-cols-2 gap-5">

            {/* Price with ₹ prefix */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Offered Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700 transition">
                <span className="h-12 flex items-center px-4 bg-gray-100 text-sm font-semibold text-gray-600 border-r border-gray-200">
                  ₹
                </span>
                 <input
                type="number"
                name="pricePerProduct"
                value={form.pricePerProduct}
                onChange={handleChange}
                placeholder="0.00"
                className="flex-1 h-12 px-4 text-sm text-gray-900 outline-none bg-transparent"
                required
              />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Supply Type <span className="text-red-500">*</span>
              </label>
              <select
                name="supplyType"
                value={form.supplyType}
                onChange={handleChange}
                className={selectClass}
              >
                <option>Decide After Meeting</option>
                <option>Quick</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Email <span className="text-xs text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={inputClass}
              />
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-7 bg-emerald-950 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Request →'}
          </button>
        </div>

      </form>

      {/* ── Your Tickets ── */}
      <div className="w-full h-auto flex justify-end">
        <button 
          onClick={() => navigate('/buyer/myrequests')}
          className="w-auto px-8 flex h-14 items-center gap-2 bg-emerald-950 text-white rounded-md hover:bg-emerald-800 transition-all cursor-pointer"
        >
          View Your Tickets <FaArrowRight />
        </button>
      </div>

    </div>
  )
}

export default CreateRequest
