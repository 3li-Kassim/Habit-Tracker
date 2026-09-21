const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM habits');
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO habits (name) VALUES ($1) RETURNING *',
        [name]
    );
    res.json(result.rows[0]);
});

router.post('/:id/complete', async (req, res) => {
    const habitId = Number(req.params.id);

    const existing = await pool.query(
        'SELECT * FROM completions WHERE habit_id = $1 AND completed_on = CURRENT_DATE',
        [habitId]
    );

    if (existing.rows.length > 0) {
        return res.status(400).json({ message: "Already completed today" });
    }

    const result = await pool.query(
        'INSERT INTO completions (habit_id, completed_on) VALUES ($1, CURRENT_DATE) RETURNING *',
        [habitId]
    );
    res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const habitId = Number(req.params.id);

    try {
        const result = await pool.query(
            'DELETE FROM habits WHERE id = $1',
            [habitId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({ message: "Habit Deleted!" });

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ message: "Cannot delete habit with existing completion" });
        }
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get('/:id/streak', async(req,res) => {
    const habitId = Number(req.params.id);

    const result = await pool.query(
        'SELECT completed_on FROM completions WHERE habit_id = $1 ORDER BY completed_on DESC',
        [habitId]
    );

    const dates = result.rows.map(row => row.completed_on);

    let currentStreak = 0;
    
    for (let i = 0; i < dates.length - 1; i++){
        const diffInDays = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);

        if (diffInDays === 1){
            currentStreak++;
        } else{
            break;
        }
    }

      if (dates.length > 0 ){
            currentStreak++;
    

    res.json({currentStreak})
      }
});

router.get('/:id/heapmap', async (req,res) => {
    const habitId = Number(req.params.id);

    const result = await pool.query(
        'SELECT completed_on FROM completions WHERE habit_id = $1 ORDER BY completed_on DESC',
        [habitId]
    );

    const dates = result.rows.map(row => row.completed_on);

    res.json({ CompletedDates:dates});
});

module.exports = router;