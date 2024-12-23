import express from 'express';

const app = express();


//Route to get all textfile names from text_files folder
app.get("/",(req, res)=>{

    res.sendStatus(200);
    
})


export default app;