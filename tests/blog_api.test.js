const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')           // import express application from app.js and wrap it in supertest

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the first blog is about harmful statements', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe('Go To Statement Considered Harmful')
})

test('blog post is added correctly', async () => {
    const newBlog = {
        title: 'testpost',
        author: 'testauthor',
        url: 'http://www.test.com',
        likes: 1,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
        'testpost'
    )
})

describe('deletion of a blog', () => {
    test('204 upon successful deletion', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        // check that there is one less blog
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('updating of a blog', () => {
    test('title successfully changes', async () => {
        const blogsAtStart = await helper.blogsInDb()
        let blogToUpdate = blogsAtStart[0]

        const updates = {
            title: 'updatetest'
        }
        blogToUpdate = Object.assign(blogToUpdate, updates)

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(n => n.title)

        expect(titles).toContain(blogToUpdate.title)

    })
})

afterAll(() => {
    mongoose.connection.close()
})