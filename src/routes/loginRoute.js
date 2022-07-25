import express from "express"
import loginController from "../controllers/loginController.js"


const router = express.Router()

router.post("/loginUser", loginController.loginUser)



export default router