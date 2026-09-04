const express = require('express');
const app = express();
const pool = require('./db')

app.use(express.json());

app.get('/api/habits', async(req,res) =>{
    const result = await pool.query('SELECT * FROM habits');
    res.json(result.rows);
});

app.post('/api/habits', async(req, res) =>{
    const {name} = req.body;
    const result = await pool.query(
        'INSERT INTO habits (name) VALUES ($1) RETURNING *',
        [name]
    )
    res.json(result.rows[0]);
});

app.post('/api/habits/:id/complete', async(req,res) =>{
    const habitId = Number(req.params.id);

    const existing = await pool.query(
        'SELECT * FROM completions WHERE habit_id = $1 AND completed_on = CURRENT_DATE',
        [habitId]
    );

    if(existing.rows.length > 0 ){
        return res.status(400).json({message : "Already completed today"});
    }

    const result = await pool.query(
        'INSERT INTO completions (habit_id, completed_on) VALUES ($1, CURRENT_DATE) RETURNING *',
        [habitId] 
    );
    res.json(result.rows[0]);
})

app.delete('/api/habits/:id', async(req,res) => {
    const habitId = Number(req.params.id);

    try{
         const result = await pool.query(
        'DELETE FROM habits WHERE id = $1',
        [habitId]
    );

    if (result.rowCount === 0 ){
        return res.status(404).json({message : "Habit not found"});
    }

        res.json({message: "Habit Deleted!"});
    
    } catch(error) {
        if(error.code === '23503'){
            return res.status(400).json({message : "Cannot delete habit with existing completion"});
        }
        res.status(500).json({message : "Something went wrong"});
    }
   
});

app.listen(3000, () =>{
    console.log('Server running on port 3000');
})