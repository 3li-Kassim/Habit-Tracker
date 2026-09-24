import { useState, useEffect } from "react";

function App() {
  const [habits, setHabits] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const [streak, setStreak] = useState({});
  const [heapmap, setHeapmap] = useState([]);
  const [activeHabitId, setActiveHabitId] = useState(null);

  const alertClass = isSuccess ? "alert-success" : "alert-danger";

  useEffect(() => {
    fetch("http://localhost:3000/api/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data));
  }, []);

  useEffect(() => {
    const habitStreaks = habits.map((habit) => {
      fetch(`http://localhost:3000/api/habits/${habit.id}/streak`)
        .then((res) => res.json())
        .then((data) =>
          setStreak((prevStreak) => ({
            ...prevStreak,
            [habit.id]: data.currentStreak,
          })),
        );
    });
  }, [habits]);

  useEffect(() =>{
    if (displayMsg){
      const timer = setTimeout(() =>{
        setDisplayMsg('');
      },3000);

      return () => clearTimeout(timer);

    }
  },[displayMsg]);

  const fetchData = async () => {
    if (inputVal.trim() === "") {
      return;
    }

    const response = await fetch("http://localhost:3000/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: inputVal }),
    });

    if (response.ok) {
      setIsSuccess(true);
    }

    const newHabit = await response.json();
    setHabits([...habits, newHabit]);

    setInputVal("");
  };

  const markComplete = async (habitId) => {
    const completed = await fetch(
      `http://localhost:3000/api/habits/${habitId}/complete`,
      {
        method: "POST",
      },
    );

    //to be checked
    const data = await completed.json();
    if (completed.ok) {
      setIsSuccess(true);
      setDisplayMsg("Habit Completed!");
    } else if (completed.status === 400) {
      setIsSuccess(false);
      setDisplayMsg(data.message);
    }
  };

  const deleteHabit = async (habitId) => {
    const sendDelete = await fetch(
      `http://localhost:3000/api/habits/${habitId}`,
      {
        method: "DELETE",
      },
    );

    const data = await sendDelete.json();
    if (sendDelete.ok) {
      setIsSuccess(true);
      setDisplayMsg(data.message);
      setHabits(habits.filter((habit) => habit.id !== habitId));
    } else if (sendDelete.status === 400) {
      setIsSuccess(false);
      setDisplayMsg(data.message);
    } else {
      setIsSuccess(false);
      setDisplayMsg(data.message);
    }
  };


  const last90Days = [];
  for (let i =0; i< 90; i++){
    const day = new Date();
    day.setDate(day.getDate() -i);
    last90Days.push(day);
  }

const fetchHeap = async(habitId) =>{
  if (activeHabitId === habitId) {
        setActiveHabitId(null);
        return;
    }
  const response = await fetch(`http://localhost:3000/api/habits/${habitId}/heapmap`)
  const data = await response.json();
 
  const cleanedCompletedDates = data.completedDates.map(d => d.split('T')[0]);
  if(response.ok){
    const heapmapData = last90Days.map(day =>{
      const dayString = day.toISOString().split('T')[0];
      const isCompleted = cleanedCompletedDates.includes(dayString);
      return {date: dayString, completed: isCompleted};
    });
    setHeapmap(heapmapData);
   
    setActiveHabitId(habitId);
  }
}

  return (
       <div>
        <nav className="navbar navbar-dark bg-dark mb-4">
            <div className="container d-flex justify-content-center">
                <span className="navbar-brand mb-0 h1">Habit Tracker</span>
            </div>
        </nav>

        <div className="container" style={{ maxWidth: '600px', paddingTop: '10px' }}>

            {displayMsg && <div className={`alert text-center ${alertClass}`}>{displayMsg}</div>}

            <div className="input-group mb-4">
                <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="Enter a habit"
                    autoFocus
                />
                <button onClick={fetchData} className="btn btn-primary">Add</button>
            </div>

           {habits.map(habit => (
    <div key={habit.id} className="card mb-3 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
            <span>{habit.name} — Streak: {streak[habit.id] ?? '...'}</span>
            <div>
                <button onClick={() => markComplete(habit.id)} className="btn btn-success btn-sm me-2">
                    <i className="bi bi-check-lg"></i> Completed
                </button>
                <button onClick={() => deleteHabit(habit.id)} className="btn btn-danger btn-sm me-2">
                    <i className="bi bi-trash"></i> Delete
                </button>
                <button onClick={() => fetchHeap(habit.id)} className="btn btn-secondary btn-sm">
                    <i className="bi bi-calendar3"></i> View Heatmap
                </button>
            </div>
        </div>

        {activeHabitId === habit.id && (
            <div className="card-footer">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {heapmap.map(day => (
                        <div
                            key={day.date}
                            title={day.date}
                            style={{
                                width: '14px',
                                height: '14px',
                                backgroundColor: day.completed ? '#16a34a' : '#e5e7eb',
                                borderRadius: '2px'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        )}
    </div>
))}

        </div>
    </div>
  );
}

export default App;
