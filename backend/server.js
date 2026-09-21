const express = require('express');
const app = express();


app.use(express.json());

const habitsRouter = require('./routes/habits');
app.use('/api/habits' , habitsRouter);

app.listen(3000, () =>{
    console.log('Server running on port 3000');
})