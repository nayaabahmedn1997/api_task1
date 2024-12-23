
import http from 'http';
import dotenv from 'dotenv';
import app from './server.js';



dotenv.config();

const server = http.createServer(app);
const PORT  = process.env.PORT || 3002;



server.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})


