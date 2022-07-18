
import bodyParser from "body-parser";
import express from "express";
const app = express();

import mongoose from "mongoose";

import contactRoute from "./routes/contactRoute.js";



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use("/contact", contactRoute);




mongoose.connect("mongodb+srv://ErnestRuzindana:epiphanie1973@ernestdb.466t9e4.mongodb.net/myPortfolio-db?retryWrites=true&w=majority",
{useNewUrlParser: true});

mongoose.connection.once("open", ()=>{
    console.log("connected to Mongo DB");
})



const port = 5000;
app.listen(port, ()=>{
    console.log(`The server is running on ${port}`);
})


