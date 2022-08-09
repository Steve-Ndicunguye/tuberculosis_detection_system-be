import UserGithub from "../models/userGithubModel.js"
import {Strategy as githubStrategy} from "passport-github"





const githubCredentials = (passport)=>{
    passport.use(new githubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/github/callback"
    }, 
    
    (accessToken, refreshToken, profile, done)=>{
        console.log(profile),
        UserGithub.findOne({
            githubId: profile.id
        })
        .then((data)=>{
            if (data){
                return done(null, data)
            }

            else {
                UserGithub.create({
                    userName: profile.displayName,
                    githubId: profile.id,
                    password: null,
                    provider: "github",
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
        UserGithub.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


export default githubCredentials