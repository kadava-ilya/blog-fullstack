import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res
                .status(404)
                .json({
                    message: "User is not registered"
                })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPassword) {
            return res
                .status(400)
                .json(
                    {message: 'Invalid login or password'}
                )
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (error) {
        res
            .status(500)
            .json(
                {
                    message: 'Unable to log in'}
            )
    }
}

export const registerUser = async (req, res) => {
    try {


        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json(
                {
                    message: 'Failed to register'
                }
            )
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: "User was not found"
            })
        }

        const {passwordHash, ...userData} = user._doc

        res.json(userData)
    } catch (error) {
        res.status(500).json({
            message: "No access"
        })
    }
}