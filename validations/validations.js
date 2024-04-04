import { body } from 'express-validator'
import {validationResult} from 'express-validator'

export const registerValidation = (req, res, next) => {
    const validations = [
        body('email', 'Wrong email format').isEmail(),
        body('password', 'Password must be at least 5 characters').isLength({min: 5}),
        body('fullName', 'Enter your name').isLength({min: 3}),
        body('avatarUrl', 'Wrong link').optional().isURL()
    ]

    Promise.all(validations.map(validation => validation.run(req))).then(() => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        next()
    })
}

export const loginValidation = (req, res, next) => {
    const validations = [
        body('email', 'Wrong email format').isEmail(),
        body('password', 'Password must be at lease 5 characters').isLength({min: 5})
    ]

    Promise.all(validations.map(validation => validation.run(req))).then(() => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        next()
    })
}

export const postCreateValidation = (req, res, next) => {
    const validations = [
        body('title', 'Enter article title').isLength({min: 3}).isString(),
        body('text', 'Enter article text').isLength({min: 10}).isString(),
        body('tags', 'Incorrect tag format (specify an array)').optional().isString(),
        body('imageUrl', 'Invalid image link').optional().isString()
    ]

    Promise.all(validations.map(validation => validation.run(req))).then(() => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        next()
    })
}