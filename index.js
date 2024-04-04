import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";
import {UserController, PostController} from './controllers/index.js'
import { handleValidationErrors, checkAuth } from './utils/index.js'

const app = express();
app.use(express.json())
app.use('/uploads', express.static('uploads'))
mongoose
    .connect('mongodb+srv://ilyatrader97:q7j96eU5CaKl8Yjj@blogcluster.rvwr40j.mongodb.net/blog?retryWrites=true&w=majority&appName=BlogCluster')
    .then(() => console.log('DB OK!'))
    .catch(error => console.log('DB error: ' + error))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

// User routes
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.loginUser)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.registerUser)
app.get('/auth/me', checkAuth, UserController.getMe)

// Post routes
app.get('/posts', PostController.getAllPosts)
app.get('/posts/:id', PostController.getPostById)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.createPost)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.updatePost)
app.delete('/posts/:id', checkAuth, PostController.removePost)

// Upload image
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.listen(4000, (error) => {
    if (error) {
        return console.log('Server has error: ' + error)
    }

    console.log('Server OK!')
})