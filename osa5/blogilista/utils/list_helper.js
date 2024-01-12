const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (prev, cur) => prev + cur.likes, 0 )
}

const favoriteBlog = (blogs) => {
  const max=blogs.reduce( (prev, cur) => prev>cur.likes?prev:cur.likes, 0 )
  return blogs.find( b => b.likes === max )
}

const mostBlogs = (blogs) => {
  const authorRanks={}
  let max=0
  blogs.forEach( b => {
    authorRanks[b.author] = (b.author in authorRanks)
      ? authorRanks[b.author] + 1
      : 1
    max = max < authorRanks[b.author]
      ? authorRanks[b.author]
      : max
  })
  for (const [key, val] of Object.entries(authorRanks)) {
    if (val===max) return { author: key, blogs: val }
  }
}

const mostLikes = (blogs) => {
  const authorRanks={}
  let max=0
  blogs.forEach( b => {
    const likes = b.likes ? b.likes : 0
    authorRanks[b.author] = (b.author in authorRanks)
      ? authorRanks[b.author]+likes
      : likes
    max = max < authorRanks[b.author]
      ? authorRanks[b.author]
      : max
  })
  for (const [key, val] of Object.entries(authorRanks)) {
    if (val===max) return { author: key, likes: val }
  }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}