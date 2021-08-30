const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')           // import express application from app.js and wrap it in supertest

const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'test',
        author: 'testauthor',
        url: 'http://www.test.com',
        likes: 3,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
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

    expect(response.body).toHaveLength(2)
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

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)

    const titles = response.body.map(n => n.title)
    expect(titles).toContain(
        'testpost'
    )
})

afterAll(() => {
    mongoose.connection.close()
})