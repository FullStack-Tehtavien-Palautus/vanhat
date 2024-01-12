import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Testing component',
    author: 'Testing author',
    likes: 666,
    url: 'http://testing.url'
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Testing component'
  )
  expect(component.container).toHaveTextContent(
    'Testing author'
  )
  expect(component.container).not.toHaveTextContent(
    '666'
  )
  expect(component.container).not.toHaveTextContent(
    'http://testing.url'
  )
})

test('detailed view is showed/hided', () => {
  const blog = {
    title: 'Testing component',
    author: 'Testing author',
    likes: 666,
    url: 'http://testing.url',
    user: {
      name: 'Test user'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )
  

  expect(component.container).not.toHaveTextContent(
    'http://testing.url'
  )

  const button = component.getByText('show')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'http://testing.url'
  )

  expect(component.container).toHaveTextContent(
    '666'
  )

  fireEvent.click(button)

  expect(component.container).not.toHaveTextContent(
    'http://testing.url'
  )

})

test('like button is wired', () => {
  const blog = {
    title: 'Testing component',
    author: 'Testing author',
    likes: 666,
    url: 'http://testing.url',
    user: {
      name: 'Test user'
    }
  }
  
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLike={mockHandler}/>
  )
  
  const button = component.getByText('show')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'http://testing.url'
  )
  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  
  expect(mockHandler.mock.calls).toHaveLength(1)
  
  fireEvent.click(likeButton)
  
  expect(mockHandler.mock.calls).toHaveLength(2)

})