require('dotenv').config();
const express = require('express');
const router = require('./routes');
const DbConnect = require('./database');
const cors = require('cors');

const app = express();

const corsOption = {
    origin: ['http://localhost:3000'],
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOption));
const PORT = process.env.PORT || 5500;

DbConnect();
app.use(express.json());
app.use(router);

app.get('/', (req, res)=> {
    res.send('hello');
})

app.listen(PORT, ()=> console.log(`Listening on port ${PORT}...`));