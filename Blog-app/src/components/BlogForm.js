import React, { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogUrl, setNewBlogUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
          title: newBlogTitle,
          author: newBlogAuthor,
          url: newBlogUrl,
          likes: 0,
          userId: user.id
        })

        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
    }

    return (
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
}

export default BlogForm