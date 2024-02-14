//contains the business logic 
import express  from "express";

const app = express();

app.get('/', (req,res) =>{
    res.send('welcome to dumbbelldoor');
});

export { app };