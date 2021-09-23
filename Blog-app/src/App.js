import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {     // upon rerender, check for logged in user and repopulate in app
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyUser = (message) => {
    setNotifMessage(message)
    setTimeout(() => {
      setNotifMessage(null)
    }, 3000)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: 0,
      userId: user.id
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notifyUser(`blog ${newBlogTitle} successfully created`)
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
      })
  }

  const handleLogin = async (userObj) => {
    try {
      const user = await loginService.login(userObj)

      window.localStorage.setItem(      // save user login to local storage
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notifyUser('wrong credentials')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <LoginForm handleLogin={handleLogin}/>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
          <input
          type='text'
          value={newBlogTitle}
          name='Title'
          onChange={({ target }) => setNewBlogTitle(target.value)}
          />
      </div>
      <div>
        author:
          <input
          type='text'
          value={newBlogAuthor}
          name='Author'
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
      </div>
      <div>
        url:
          <input
          type='text'
          value={newBlogUrl}
          name='Url'
          onChange={({ target }) => setNewBlogUrl(target.value)}
          />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  if (user === null) {    // conditional app if user isn't logged in
    return (
      <div>
        <Notification message={notifMessage} />

        <h2>log in to application</h2>
        {loginForm()}
    </div>
    )
  }

  return (
    <div>
      <Notification message={notifMessage} />

      <h2>blogs</h2>
      <p>{user.name} logged-in
        <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
  </div>
  )
}

export default App