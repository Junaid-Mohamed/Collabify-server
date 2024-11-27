require(`dotenv`).config();

const mongoose = require("mongoose");

const mongoUri = process.env.DB_URL;

const initializeDb = async() =>{
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    .then(()=>{
        console.log("Connected to db successfully.")
    })
    .catch((error)=>{
        console.log(`Error while connecting to mongodb ${error}`)
    })
}

module.exports = {initializeDb};