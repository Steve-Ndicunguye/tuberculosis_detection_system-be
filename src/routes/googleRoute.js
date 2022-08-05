import express from "express"
import passport from "passport"
import googleCredentials from "../controllers/googleContoller.js"

googleCredentials(passport)

const router = express.Router()


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), (req, res) => {
    res.redirect(process.env.SUCCESS_REDIRECT_URL);
});


export default router