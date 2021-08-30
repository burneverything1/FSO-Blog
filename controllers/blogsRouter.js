const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    try {
        const savedBlog = await blog.save()
        response.json(savedBlog)
    } catch(exception){
        next(exception)
    }
})

module.exports = blogsRouter