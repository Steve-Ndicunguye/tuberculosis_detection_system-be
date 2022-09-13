import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import { object } from "@hapi/joi"


const loginUser = async(request, response) =>{
    try{
        const userEmail = await User.findOne({email: request.body.email})

        if (!userEmail) 
            return response.status(400).json({
                "invalidEmail": "Invalid email or password, Please try again"
            })

        if(!userEmail.isVerified)
            return response.status(400).json({
                "invalidEmail": "Please go to your email to verify your account!"
            })

        
        const userPassword = await bcrypt.compare(request.body.password, userEmail.password)

        if (!userPassword)
            return response.status(400).json({
                "invalidPassword": "Invalid email or password, Please try again"
            })

        
        const token = Jwt.sign({userEmail} , process.env.ACCESS_TOKEN_SECRET)
        response.header("auth_token", token)

        const userRole = userEmail.role;
        response.set("token", token).json({
            "successMessage": "You are successfully logged in", "Access_Token": token, "role": userRole
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "Fail",
            "errorMessage": error.message
        })
    }
}


const loggedInUser = async(request, response) =>{
    try{
      const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                console.log(decodedToken)

                const myLoggedInUser = await User.findById(decodedToken.userEmail._id)
                response.status(200).json(myLoggedInUser)
            }
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// forgot password

const forgotPassword = async(request, response) =>{
    try{
        const userEmailResetPassword = await User.findOne({email: request.body.email})

        if (!userEmailResetPassword) 
            return response.status(400).json({
                "invalidEmail": `Email ${request.body.email} is not registered`
            })

        if(!userEmailResetPassword.isVerified)
            return response.status(400).json({
                "invalidEmail": "Please go to your email to verify your account!"
            })

        
        const secret = process.env.FORGOTPASSWORD_RESET_SECRET + userEmailResetPassword.password

        const resetPasswordToken = Jwt.sign({userEmailResetPassword}, secret)
            response.header("auth_token", resetPasswordToken)
    }
    

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// update user profile

const updateUser = async(request, response) =>{
    try{
      const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                const ourLoggedInUser = await User.findById(decodedToken.userEmail._id) 

                if (ourLoggedInUser){
                    if (!request.file){
                        ourLoggedInUser.firstName = request.body.firstName || ourLoggedInUser.firstName,
                        ourLoggedInUser.lastName = request.body.lastName || ourLoggedInUser.lastName,
                        ourLoggedInUser.email = request.body.email || ourLoggedInUser.email,
                        ourLoggedInUser.bio = request.body.bio || ourLoggedInUser.bio,
                        ourLoggedInUser.profileFacebook = request.body.profileFacebook || ourLoggedInUser.profileFacebook,
                        ourLoggedInUser.profileTwitter = request.body.profileTwitter || ourLoggedInUser.profileTwitter,
                        ourLoggedInUser.profileLinkedin = request.body.profileLinkedin || ourLoggedInUser.profileLinkedin,
                        ourLoggedInUser.profileInstagram = request.body.profileInstagram || ourLoggedInUser.profileInstagram
                    }
                    
                    else{
                        ourLoggedInUser.imageLink = request.file.filename || ourLoggedInUser.imageLink
                    }
                    
                    
                    const updatedUser = await ourLoggedInUser.save()
                    console.log(request.file)

                    const newUser = {
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        email: updatedUser.email,
                        bio: updatedUser.bio,
                        imageLink: updatedUser.imageLink,
                        profileFacebook: updatedUser.profileFacebook,
                        profileTwitter: updatedUser.profileTwitter,
                        profileLinkedin: updatedUser.profileLinkedin,   
                        profileInstagram: updatedUser.profileInstagram
                    }

                    if(request.body.profileFacebook == ""){
                        ourLoggedInUser.profileFacebook = undefined;
                        delete ourLoggedInUser.profileFacebook;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileTwitter == ""){
                        ourLoggedInUser.profileTwitter = undefined;
                        delete ourLoggedInUser.profileTwitter;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileInstagram == ""){
                        ourLoggedInUser.profileInstagram = undefined;
                        delete ourLoggedInUser.profileInstagram;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileLinkedin == ""){
                        ourLoggedInUser.profileLinkedin = undefined;
                        delete ourLoggedInUser.profileLinkedin;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.bio == ""){
                        ourLoggedInUser.bio = undefined;
                        delete ourLoggedInUser.bio;
                        await ourLoggedInUser.save()
                    }

                    response.status(200).json({
                        "message": "User updated successfully!",
                        "ourUpdatedUser": newUser
                    })
                }

                else{
                    response.status(404).json({"message": "User not found!"})
                }
            }
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


export default {loginUser, loggedInUser, updateUser, forgotPassword}