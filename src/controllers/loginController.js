import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"


const loginUser = async(request, response) =>{
    try{
        const userEmail = await User.findOne({email: request.body.email})

        if (!userEmail) 
            return response.status(400).json({
                "message": "Invalid email, Please try again"
            })

        
        const userPassword = await bcrypt.compare(request.body.password, userEmail.password)

        if (!userPassword)
            return response.status(400).json({
                "message": "Invalid password, Please try again"
            })

        
        const token = Jwt.sign({userEmail: {id: userEmail.id, role: userEmail.role}} , process.env.ACCESS_TOKEN_SECRET)
        

        const userRole = userEmail.role;
        response.set("token", token).send({
            "message": "You are successfully logged in", "Access_Token": token, "role": userRole
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}



export default {loginUser}