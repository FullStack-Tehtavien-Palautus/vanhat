import React from 'react'

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({name}) => <h2>{name}</h2>;

const Content = ({parts}) => 
    parts.map( p => <Part name={p.name} exc={p.exercises} key={p.id} /> );

const Part = ({name, exc}) => <p>{name} {exc}</p>;

const Total = ({parts}) => <p><b>total of {parts.reduce( 
    (s,a) => s + a.exercises, 0 )} exercises</b></p>;

export default Course;
 