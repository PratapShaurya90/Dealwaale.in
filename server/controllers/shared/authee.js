const User = require('../../model/shared/user') // Corrected path
const generateToken = require('../../utils/generateTokens')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    try {
        const { username, email, password, phone, city, profession, role, categories } = req.body

        if (!username || !email || !password || !phone || !city || !profession || !role) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Use either phone or email to check for existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or phone already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedpass = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            email,
            password: hashedpass,
            phone,
            city,
            profession,
            role,
            categories
        })

        const { accessToken } = generateToken(res, user._id)

        res.status(201).json({
            message: "User created successfully",
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body // Changed from phone to email

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }

        const { accessToken } = generateToken(res, user._id)

        res.status(200).json({
            message: "Login successful",
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.Jwt_token

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no refresh token" })
        }

        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const { accessToken } = generateToken(res, user._id)

        res.status(200).json({
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(401).json({ message: "Not authorized, refresh token failed" })
    }
}

const Message = require('../../model/shared/Message')

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Count connected people from messages
        const messages = await Message.find({
            $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
        })

        const connectedUsers = new Set()
        messages.forEach(msg => {
            const senderStr = msg.senderId.toString()
            const receiverStr = msg.receiverId.toString()
            
            // Skip self chats
            if (senderStr === receiverStr) return;

            const otherUser = senderStr === req.user._id.toString() 
                ? receiverStr 
                : senderStr
            connectedUsers.add(otherUser)
        })

        res.status(200).json({
            success: true,
            user,
            connectedCount: connectedUsers.size
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, city, profession, about } = req.body

        // Prevent editing email and phone
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { username, city, profession, about },
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, getUserById, refreshToken, getProfile, updateProfile }
