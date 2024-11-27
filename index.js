const {initializeDb} = require("./db");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hi World");
})

initializeDb();

app.listen(3000, ()=>console.log('app listening on port 3000'))
