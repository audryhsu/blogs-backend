const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.json(blog)
  else response.status(404).end() // couldn't find id
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { 'new': true })
  if (returnedBlog) response.json(returnedBlog)
  else response.status(404).end() // couldn't find id
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const newBlog = await blog.save()
  response.status(201).json(newBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  return response.status(204).end()
})

module.exports = blogRouter
