import UserFacebook from "../models/userFacebookModel.js"
import {Strategy as facebookStrategy} from "passport-facebook"





const facebookCredentials = (passport)=>{
    passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/facebook/callback",
        profileFields: ["id", "displayName", "email", "name", "picture"]
    }, 
    
    (accessToken, refreshToken, profile, done)=>{
        console.log(profile),
        UserFacebook.findOne({
            facebookId: profile.id
        })
        .then((data)=>{
            if (data){
                return done(null, data)
            }

            else {
                UserFacebook.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    facebookId: profile.id,
                    password: null,
                    picture: profile.photos[0].value,
                    provider: "facebook",
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
        UserFacebook.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


export default facebookCredentials