import PostModel from '../models/Post.js'

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({path: 'user', select: ['fullName', 'imageUrl']}).exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json('Failed to retrieve articles')
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1}
            },
            {
                returnDocument: 'after'
            }
        ).populate('user')

        if (!doc) {
            return res.status(404).json({
                message: 'Article was not found'
            })
        }

        res.json(doc)
    } catch (err) {
        console.log(err)
        res.status(500).json('Failed to find the article')
    }
}

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to create article'
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        )

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to update article'
        })
    }
}

export const removePost = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await PostModel.findOneAndDelete({_id: postId})

        if (!doc) {
            return res.status(404).json({
                message: 'Article was not deleted'
            })
        }

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to delete article'
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(post => post.tags).flat().slice(0, 5);

        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to retrieve last tags'
        })
    }
}