import UserGoogle from "../models/userGoogleModel.js"
import {Strategy as googleStrategy} from "passport-google-oauth20"





const googleCredentials = (passport)=>{
    passport.use(new googleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/callback"
    }, 
    
    (accessToken, refreshToken, profile, done)=>{
        console.log(profile.emails[0].value),
        UserGoogle.findOne({
            email: profile.emails[0].value
        })
        .then((data)=>{
            if (data){
                return done(null, data)
            }

            else {
                UserGoogle.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: null,
                    provider: "google",
                    isVerified: true
                })
                return done(null, data)
            } 
        })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserGoogle.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


export default googleCredentials