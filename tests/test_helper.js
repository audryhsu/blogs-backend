/*
helper functions that use mongoose API to set up document objects to be used in jest testing files
*/

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'my first blog post',
    author: 'audry hsu',
    url: 'abc.com',
    likes: 0
  },
  {
    title: 'chicken and whiskey',
    author: 'bobby crumbaugh',
    url: 'cedf.com',
    likes: 5
  },
  {
    title: 'testing is fun',
    author: 'david malan',
    url: 'cs50.harvard.edu',
    likes: 100
  },
]

// returns all blogs in db
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

// returns a valid mongoDB id for deleted blog
const nonExistingId = async () => {

  // create a new Blog instance and save
  const tempBlog = new Blog({
    title: 'ephermeral blog',
    author: 'ghost in the shell',
    url: 'neverhere.com'
  })
  await tempBlog.save()
  const result = await Blog.deleteOne(tempBlog)

  console.log('result of delete', result)
  console.log(tempBlog._id.toString())
  return tempBlog._id.toString()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
}
