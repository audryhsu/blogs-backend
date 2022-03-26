// unit tests for api backend
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = testHelper.initialBlogs.map(async (blog) => {
    const blogObject = new Blog(blog)
    return await blogObject.save()
  })
  await Promise.all(blogs)

})

describe('creating a new blog post', function () {

  test('returns 201 for a valid blog post', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    expect(blogsAtStart).toHaveLength(3)

    // NOTE: must send a javascript object, not a mongoose Blog object since we are sending over http
    const newBlog = {
      title: 'new test blog',
      author: 'mason wong',
      url: 'brewcrewlabs.com',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await testHelper.blogsInDb()
    const titles = blogsAtEnd.map((blog) => blog.title)

    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(titles).toContain('new test blog')
  })

  test('has a default like count of 0', async () => {
    const newBlog = {
      title: 'draft blog post has no likes',
      author: 'dua lipa',
      url: 'abc.com'
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)

  })

  test('without a title returns 400', async () => {
    const noTitle = {
      title: '',
      author: 'dua lipa',
      url: 'happy'
    }

    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(400)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
  })

  test('without url returns 400', async () => {
    const noUrl = {
      title: 'happy',
      author: 'dua lipa',
      url: ''
    }

    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(400)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
  })

})

describe('when there are initial notes saved', () => {

  test('blogs are returned in json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are fetched', async () => {
    let response = await api
      .get('/api/blogs')
      .expect(200)

    let allBlogs = response.body
    expect(allBlogs).toHaveLength(testHelper.initialBlogs.length)
  })

  test('id fields exists', async () => {
    let response = await api
      .get('/api/blogs')
      .expect(200)

    let allBlogs = response.body
    const ids = allBlogs.map((blog) => blog.id)
    expect(ids).toBeDefined()
    expect(ids).toHaveLength(3)

  })

})

describe('accessing a specific blog by id', function () {
  test('succeeds when id is valid', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToGet = blogsAtStart[0]

    const response = await api
      .get(`/api/blogs/${blogToGet.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toMatch('my first blog post')
  })

  test('400 when id is invalid', async () => {
    const invalidId = 123456
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

  test('404 when id is valid but no longer exists', async () => {
    const deletedId = await testHelper.nonExistingId()
    await api
      .get(`/api/blogs/${deletedId}`)
      .expect(404)
  })

})

describe('deleting a blog post', function () {
  test('return 204 when valid id', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const idToDelete = blogsAtStart[0].id

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(204)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length - 1)
  })
})

describe('updating a blog post', function () {
  test('returns 20 when id is valid', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const id = blogsAtStart[2].id

    const updatedBlog = {
      title: 'testing is NOT FUN AT ALL',
      author: 'david malan',
      url: 'cs50.harvard.edu',
      likes: 0
    }
    const response = await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toMatch('testing is NOT FUN AT ALL')
    expect(response.body.likes).toBe(0)
  })

  test('400 when id is invalid', async () => {
    const updatedBlog = {
      title: 'testing is NOT FUN AT ALL',
      author: 'david malan',
      url: 'cs50.harvard.edu',
      likes: 0
    }
    const invalidId = 123456
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(400)
  })

  test('404 when id is valid but no longer exists', async () => {
    const updatedBlog = {
      title: 'testing is NOT FUN AT ALL',
      author: 'david malan',
      url: 'cs50.harvard.edu',
      likes: 0
    }

    const deletedId = await testHelper.nonExistingId()

    await api
      .put(`/api/blogs/${deletedId}`)
      .send(updatedBlog)
      .expect(404)
  })
})

afterAll(() => mongoose.connection.close())
