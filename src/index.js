
import bodyParser from "body-parser";
import express from "express";
const app = express();

import mongoose from "mongoose";

import contactRoute from "./routes/contactRoute.js";



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use("/contact", contactRoute);




mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true});

mongoose.connection.once("open", ()=>{
    console.log("connected to Mongo DB");
})



const port = process.env.PORT_NUMBER;
app.listen(port, ()=>{
    console.log(`The server is running on ${port}`);
})


