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
            service:"gmail",
            auth: {
                user: "elannodeveloper@gmail.com",
                pass: process.env.NODEMAILER_PASSWORD
            },
            tls: {
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
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword,
            emailToken: crypto.randomBytes(64).toString("hex"),
            isVerified: false
        })

        const receiverEmail = await User.findOne({email: request.body.email})

        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: receiverEmail.email,
            subject: "Ernest's portfolio verify your email",
            html: `
            <div style="padding: 10px;">
                <h3> <span style="color: #cba10a;">${receiverEmail.firstName} ${receiverEmail.lastName} - </span> Thank you for registering on my website! </h3> 
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

        response.status(200).json({"Registered users": RegisterUsers})
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

export default {createNewUser, getAllUsers, verifyEmail}