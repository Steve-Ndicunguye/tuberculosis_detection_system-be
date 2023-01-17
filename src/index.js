
import bodyParser from "body-parser";
import express from "express";
const app = express();

import cors from "cors";
import mongoose from "mongoose";
import resultRoute from "./routes/resultRoute.js";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import passport from "passport";
import expressSession from "express-session";
import MemoryStore from "memorystore";
import cookieParser from "cookie-parser";




const ourMemoryStore = MemoryStore(expressSession);

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
  }


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('random'));

app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new ourMemoryStore(),
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/", cors(corsOptions), resultRoute);
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


