import {useState, useEffect} from 'react';

function App(){

const [habits, setHabits] = useState([]);
const [inputVal, setInputVal] = useState('');
const [isSuccess, setIsSuccess] = useState(false);
const [displayMsg, setDisplayMsg] = useState('');

useEffect(() =>{
  fetch('http://localhost:3000/api/habits')
    .then(res => res.json())
    .then(data => setHabits(data))

}, []);

const fetchData = async() =>{

  if(inputVal.trim() === ''){
    return;
  }

  const response = await fetch('http://localhost:3000/api/habits',{
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({name: inputVal})
});

if(response.ok){
  setIsSuccess(true);
}

const newHabit = await response.json();
setHabits([...habits, newHabit]);

setInputVal('');

}

const markComplete = async(habitId) =>{
  const completed = await fetch(`http://localhost:3000/api/habits/${habitId}/complete`,{
    method: 'POST',
  });

  if(completed.ok){
    setIsSuccess(true);
    setDisplayMsg("Habit Completed!")
  }
  else if(completed.status === 400){
    setIsSuccess(false);
    setDisplayMsg("Already done");
  }
}

const deleteHabit = async(habitId) =>{
  const sendDelete = await fetch(`http://localhost:3000/api/habits/${habitId}`,{
    method: 'DELETE'
  });

  const data = await sendDelete.json();
  if(sendDelete.ok){
    setIsSuccess(true);
    setDisplayMsg(data.message);
    setHabits(habits.filter(habit  => habit.id !== habitId));
  }
  else if(sendDelete.status ===400){
    setIsSuccess(false);
    setDisplayMsg(data.message)
  }
  else{
    setIsSuccess(false);
    setDisplayMsg(data.message);
  }

}

return (
<div>
<h1>Habit Tracker</h1>
{displayMsg && <h4>{displayMsg}</h4>}
<ul>
  {habits.map(habit =>(
    <div>
       <li key={habit.id}>{habit.name}</li>
       <button onClick={() => markComplete(habit.id)}>Completed</button>
       <button onClick={() => deleteHabit(habit.id)}>Delete</button>
    </div>
   
    
  ))}
</ul>

<label>Enter a habit</label>
<input
value={inputVal}
onChange={(e) => setInputVal(e.target.value)}
type='text'
autoFocus
/>

<button onClick={fetchData}>Add</button>
</div>

);

}


export default App;