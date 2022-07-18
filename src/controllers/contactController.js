import { request, response } from "express";
import contact from "../models/contactModel.js";


const sendMessage = async(request, response) =>{
    try{
        const receivedMessage = await contact.create({
            names: request.body.names,
            email: request.body.email,
            phoneNumber: request.body.phoneNumber,
            message: request.body.message
        })
    
        response.status(201).json({
            "status": "message sent successfully!",
            "data": {"received message": receivedMessage}
        })
    }
    
    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": "Internal server error"
        })
    } 
}





const getAllMessages = async(request, response) =>{
    try{
        const clientMessages = await contact.find();

        response.status(200).json({
            "status": "Successfully retrieved all the messages!",
            "data": {"messages from clients": clientMessages}
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": "Internal server error"
        })
    }
}



const deleteMessage = async(request, response) =>{
    try{
        const MessageToBeDeleted = await contact.findOne({_id: request.params.id});

        await MessageToBeDeleted.deleteOne({_id: request.params.id});

        response.status(200).json({
            "status": "success",
            "message": "The message was deleted successfully!"
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": "Internal server error"
        })
    }
}

export default {sendMessage, getAllMessages, deleteMessage};