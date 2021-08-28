const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let maxfinder = (max, blog) => {
        return Math.max(max, blog.likes)
    }
    let maxLikes = blogs.reduce(maxfinder, 0)
    let ret

    blogs.forEach(blog => {
        if (blog.likes === maxLikes) {
            ret = blog
        }
    })

    return ret
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}