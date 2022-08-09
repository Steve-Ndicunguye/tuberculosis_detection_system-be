import express from "express"
import passport from "passport"
import githubCredentials from "../controllers/githubController.js"

githubCredentials(passport)

const router = express.Router()


router.get('/github', passport.authenticate('github', { scope: ['email']}));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), (req, res) => {
    res.redirect(process.env.SUCCESS_REDIRECT_URL);
});


export default router