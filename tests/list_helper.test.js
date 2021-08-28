const listHelper = require('../utils/list_helper')

const listWithTwoBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b54a6762d17f8',
        title: 'test',
        author: 'testauthor',
        url: 'http://www.test.com',
        likes: 3,
        __v: 0
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('correctly return the sum of two blogs', () => {
        const result = listHelper.totalLikes(listWithTwoBlogs)
        expect(result).toBe(8)
    })
})

describe('favorite blog', () => {

    test('correctly find the blog with highest likes', () => {
        const result = listHelper.favoriteBlog(listWithTwoBlogs)
        expect(result).toEqual(listWithTwoBlogs[0])
    })
})