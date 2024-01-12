import React from 'react'


const Header = ({course}) => <h1>{course}</h1>;

const Part = ({name, exc}) => <p>{name} {exc}</p>;

const Content = ({parts}) => 
    parts.map( p => <Part name={p.name} exc={p.excersises} /> );

const Total = ({parts}) => <p>Number of excersises {parts.reduce( 
    (s,a) => s + a.excersises, 0 )} </p>;

const App = () => {
  const course = {
    name: "Half Stack application developement",
    parts: [
      {
        name: "Fundamentals of React",
        excersises: 10
      },
      {
        name: "Using props to pass data",
        excersises: 7
      },
      {
        name: "State of component",
        excersises: 14
      }
    ]
  }
  
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App;
