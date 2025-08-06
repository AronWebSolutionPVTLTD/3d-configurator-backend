const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const dbUrl = process.env.MONGODB_URI

const connectDB = async () => {
    try{
        await mongoose.connect(dbUrl).then((data) => {
            console.log(` Connected to ${data.connection.name} database`)
        });
    }catch (error){
        console.log(error.message);
        setTimeout(()=>{
            connectDB();
        }, 5000);
    }
}

module.exports = {connectDB};