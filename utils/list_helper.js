/*
blog list helper functions
*/

const totalLikes = (blogs) => {
  if (!blogs.length) return 0
  return blogs.reduce((sum, blog) => {
    return sum += blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs.reduce((mostLiked, current) => {
    if (current.likes === Math.max(mostLiked.likes, current.likes)) {
      mostLiked = current
    }
    return mostLiked
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }

}

const mostBlogs = (blogs) => {
  // return author with most number of blogs and blog count
  if (blogs.length === 0) return null

  const authors = {}
  blogs.forEach(blog => {
    if (!authors[blog.author]) {
      authors[blog.author] = 1
    } else {
      authors[blog.author] += 1
    }
  })

  const authMostBlogs = Object.keys(authors).reduce((mostAuth, currentAuth) => {
    let countBlogs = Math.max(authors[mostAuth], authors[currentAuth])
    return authors[mostAuth] === countBlogs ? mostAuth : currentAuth
  })

  return {
    author: authMostBlogs,
    blogs: authors[authMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = {}
  blogs.forEach(({ author, likes }) => {
    if (!authors[author]) authors[author] = likes
    else {
      authors[author] += likes
    }
  })

  const authMostLikes = Object.keys(authors).reduce((mostAuth, currentAuth) => {
    let countLikes = Math.max(authors[mostAuth], authors[currentAuth])
    return authors[mostAuth] === countLikes ? mostAuth : currentAuth
  })
  return {
    author: authMostLikes,
    likes: authors[authMostLikes]
  }
}


module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
