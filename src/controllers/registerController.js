import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import UserValidationSchema from "../validations/registerValidation.js";
import nodemailer from "nodemailer"
import crypto from "crypto"



const createNewUser = async(request, response) =>{

    const {error} = UserValidationSchema.validate(request.body)

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})


    const duplicatedEmail = await User.findOne({email: request.body.email})

    if (duplicatedEmail)
        return response.status(409).json({"message": `The user with email "${request.body.email}" already exist`})

    try{
        const sender = nodemailer.createTransport({
            service: "gmail",
           auth: {
             user: "ndicunguyesteve4@gmail.com",
             pass: "qlbtvfaoozcoyvzb"
           },
           tls:{
            rejectUnauthorized: false
           }
        })


        const salt = await bcrypt.genSalt()

        const hashedPassword = await bcrypt.hash(request.body.password, salt)

        const hashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, salt)
        

        await User.create({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            medicalCareer: request.body.medicalCareer,
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword,
            emailToken: crypto.randomBytes(64).toString("hex"),
            isVerified: false
        })

        const receiverEmail = await User.findOne({email: request.body.email})

        const mailOptions = {
            from: ' "Verify your email" <ndicunguyesteve4@gmail.com>',
            to: receiverEmail.email,
            
            subject: "Lung Detection System - verify your email",
            html: `
            <div style="padding: 10px;">
                <h3> <span>${receiverEmail.firstName} ${receiverEmail.lastName} - </span> Thank you for registering on my website! </h3> 
                <h4> Please verify your email to continue... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #cba10a;" 
                href="http://${request.headers.host}/register/verifyEmail?token=${receiverEmail.emailToken}"> 
                Verify Email </a>
            </div>
            `
        }

        sender.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Verification email sent to your account")
            }
        })

        response.status(201).json({"successMessage": `"${request.body.firstName}" account is created successfully!, check your email to verify your account`})
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


const verifyEmail = async(request, response) =>{
    try{
        const token = request.query.token;
        const emailUser = await User.findOne({
            emailToken: token
        })

        if(emailUser){
            emailUser.emailToken = null;
            emailUser.isVerified = true;

            await emailUser.save()

            response.redirect(process.env.EMAILVERIFIED_REDIRECT_URL)
        }
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}


const getAllUsers = async(request, response) =>{
    try{
        const RegisterUsers = await User.find()

        response.status(200).json({"RegisteredUsers": RegisterUsers})
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

const getUserById = async (req, res) => {

    try{
        const user = await User.findOne({_id: req.params.id});
        if(user){
            res.status(200).json({ "fetchedUser": user });
        }

        else{
            res.status(400).json({
                "userFetchedError": "User not found",
            });
        }

    }

    catch (error){
        console.log(error);
        res.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }

}

const assignUserRole = async(request, response) =>{
    try{
        const user = await User.findOne({_id: request.params.id});

        user.role = request.body.role

        await user.save();

        response.status(200).json({ "successMessage": `Role updated successfully!`, "role": user.role })
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

export default {createNewUser, getAllUsers, verifyEmail, assignUserRole, getUserById}