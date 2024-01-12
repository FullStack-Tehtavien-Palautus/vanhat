import React from 'react'

const Create = ({ handleCreate,
  title, handleTitle,
  author, handleAuthor,
  url, handleUrl }) => (
  <div>
    <h3>create new</h3>
    <form onSubmit={handleCreate}>
      <div>
        title:
        <input type="text" name="Title"
          value={title} onChange={handleTitle} />
      </div>
      <div>
        author:
        <input type="text" name="Author"
          value={author} onChange={handleAuthor} />
      </div>
      <div>
        url:
        <input type="text" name="Url"
          value={url} onChange={handleUrl} />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)

export default Create
