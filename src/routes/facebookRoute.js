import express from "express"
import passport from "passport"
import facebookCredentials from "../controllers/facebookController.js"

facebookCredentials(passport)

const router = express.Router()


router.get('/facebook', passport.authenticate('facebook', { scope: ['email']}));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), (req, res) => {
    res.redirect(process.env.SUCCESS_REDIRECT_URL);
});


export default router