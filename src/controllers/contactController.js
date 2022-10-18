import contact from "../models/contactModel.js";
import contactValidationSchema from "../validations/contactValidation.js";
import nodemailer from "nodemailer"

const sendMessage = async(request, response) =>{

    // inputvalidation
    const {error} = contactValidationSchema.validate(request.body);

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})


    try{
        const receivedMessage = await contact.create({
            names: request.body.names,
            email: request.body.email,
            phoneNumber: request.body.phoneNumber,
            message: request.body.message
        })
    
        response.status(201).json({
            "successMessage": "message sent successfully!",
            "received message": receivedMessage
        })

    }
    
    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "errorMessage": error.message
        })
    } 
}





const getAllMessages = async(request, response) =>{
    try{
        const clientMessages = await contact.find();

        response.status(200).json({
            "status": "Successfully retrieved all the messages!",
            "clientMessages": clientMessages
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}

const getMessageById = async(request, response) =>{
    try{
        const clientMessage = await contact .findOne({_id: request.params.id});

        response.status(200).json({
            "clientMessageSuccess": "Successfully retrieved the message!",
            "clientMessage": clientMessage
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}



const deleteMessage = async(request, response) =>{
    try{
        const MessageToBeDeleted = await contact.findOne({_id: request.params.id});

        await MessageToBeDeleted.deleteOne({_id: request.params.id});

        response.status(200).json({
            "status": "success",
            "deletedMessage": "The message was deleted successfully!"
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}

const replyMessage = async (request, response) => {
    try{
        const senderMessage = await contact.findOne({_id: request.params.id});

        senderMessage.replyMessage = request.body.replyMessage
        await senderMessage.save();

    // Email sender details
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: "elannodeveloper@gmail.com",
                pass: process.env.NODEMAILER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        // Send verification email to user
        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: senderMessage.email,
            subject: "Ernest's portfolio reply message",
            html: `
            <div style="padding: 10px;">
                <h4> 
                ${senderMessage.replyMessage}
                </h4>
            </div>
            `
        }

        // Sending the email
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Message sent!")
                 
            }
            response.status(200).json({
                "replyMessageSuccess": "Message sent!",
                "repliedMessage": senderMessage.replyMessage
            })
            console.log(senderMessage.replyMessage)
        })

    } 
    
    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

export default {sendMessage, getAllMessages, deleteMessage, replyMessage, getMessageById};