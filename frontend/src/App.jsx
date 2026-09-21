import {useState, useEffect} from 'react';

function App(){

const [habits, setHabits] = useState([]);

useEffect(() =>{
  fetch('http://localhost:3000/api/habits')
    .then(res => res.json())
    .then(data => setHabits(data))

}, []);

return (
<div>
<h1>Habit Tracker</h1>
<ul>
  {habits.map(habit =>(
    <li key={habit.id}>{habit.name}</li>
  ))}
</ul>
</div>
);

}


export default App;