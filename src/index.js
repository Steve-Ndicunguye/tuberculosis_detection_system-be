
import bodyParser from "body-parser";
import express from "express";
const app = express();

import cors from "cors";
import mongoose from "mongoose";
import contactRoute from "./routes/contactRoute.js";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
  }


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use("/contact", cors(corsOptions), contactRoute);
app.use("/register", cors(corsOptions), registerRoute);
app.use("/login", cors(corsOptions), loginRoute);




mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true});

mongoose.connection.once("open", ()=>{
    console.log("connected to Mongo DB");
})



const port = process.env.PORT_NUMBER;
app.listen(port, ()=>{
    console.log(`The server is running on ${port}`);
})


