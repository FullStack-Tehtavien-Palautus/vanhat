import React, { useState } from 'react'

const Header = () => <h1>give feedback</h1>;
const StatsHeader = () => <h1>statistics</h1>;

const StatisticLine = ({text, value}) => 
    <tr><td>{text}</td><td>{value}</td></tr>
const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad;
  if (all === 0) return <p>No feedback given</p>;
  const average = (( good - bad ) / all).toFixed(1);
  const positive = (100 * good / all).toFixed(1) + " %";
  
  return (
    <table><tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} />
    </tbody></table>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  
  const addGood = () => setGood(good+1) 
  const addNeutral = () => setNeutral(neutral+1) 
  const addBad = () => setBad(bad+1) 

  return (
    <div>
      <Header />
      <button onClick={addGood}>good</button>
      <button onClick={addNeutral}>neurtal</button>
      <button onClick={addBad}>bad</button>
      <StatsHeader />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
