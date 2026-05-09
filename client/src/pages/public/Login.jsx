import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import axios from 'axios'

const Login = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const validateForm = () => {
        const email = formData.email.trim()
        const password = formData.password.trim()

        if (!email || !password) {
            return "All fields are required"
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return "Invalid email"
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long"
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
                "http://localhost:5000/api/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            setSuccess("Login successful")

            localStorage.setItem("Token", res?.data?.token)
            localStorage.setItem("User",JSON.stringify(res?.data?.user))



            setTimeout(() => {
                const role = res?.data?.user?.role
                if (role === "buyer") {
                    navigate("/buyer")
                } else if (role === "seller") {
                    navigate("/seller")
                } else {
                    navigate("/")
                }
            }, 1000)

        } catch (err) {
            setError(err?.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />

            <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl px-6 pt-24 md:pt-32 pb-16">

                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-semibold">Welcome Back</h1>
                        <p className="text-neutral-500 text-sm mt-2">
                            Log in to your account
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

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="input w-full"
                        />

                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="input w-full"
                        />

                        <button
                            disabled={loading}
                            className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-neutral-200 transition disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <p className="mt-8 text-sm text-neutral-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-white hover:underline">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </>
    )
}

export default Login
