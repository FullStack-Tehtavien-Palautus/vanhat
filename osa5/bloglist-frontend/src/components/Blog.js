import React, { useState } from 'react'
import '../blog.css'

const Blog = ({ blog, username, handleLike, handleDelete }) => {
  const [detailed, setDetailed] = useState( false )
  const toggleDetailed = () => {setDetailed(!detailed)}

  return (
    <div className='blogBox'>
      <p>{blog.title} {blog.author}
        <button onClick={toggleDetailed}>
          {detailed?'hide':'show'}
        </button></p>
      { detailed && <>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button blogid={blog.id} onClick={handleLike}>
            like</button></p>
        <p>{blog.user.name}</p>
        {username===blog.user.username &&
          <button blogid={blog.id} onClick={handleDelete}>delete</button>
        }
      </> }
    </div>
  )
}

export default Blog