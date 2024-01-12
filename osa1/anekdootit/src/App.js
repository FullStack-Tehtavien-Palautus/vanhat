import React, { useState } from 'react'

const Header = () => <h1>Anecdote of the day</h1>
const Results = ({best}) => <><h1>Anecdote with most votes</h1><p>{best}</p></>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})
  
  const giveVote = () => {
    const newVotes={...votes}
    if (!(selected in newVotes)) newVotes[selected]=0;
    newVotes[selected]+=1;
    setVotes(newVotes);
  }
  
  const getVotes = () => {
    if (selected in votes) return votes[selected];
    return 0;
  }
  
  const nextRandom = () => 
      setSelected( Math.floor(Math.random()*anecdotes.length) );
      
  const getBest = () => {
    let maxv=0, maxk=0;
    for (const [k,v] of Object.entries(votes) ) {
      if (v>maxv) [maxv, maxk] = [v, k];
    }
    if (maxv===0) return "No votes given";
    return anecdotes[maxk];
  }
   

  return (
    <div>
      <Header />
      <p>{anecdotes[selected]}</p>
      <p>has {getVotes()} votes</p>
      <button onClick={giveVote}>vote</button>
      <button onClick={nextRandom}>next anecdote</button>
      <Results best={getBest()}/>
    </div>
  )
}

export default App
