import results from "../models/resultModel.js";
import nodemailer from "nodemailer"

const saveResult = async(request, response) =>{

    try{
        const savedResult = await results.create({
            patientName: request.body.patientName,
            doctorName: request.body.doctorName,
            result: request.body.result,
            tbStage: request.body.tbStage,
            treatments: request.body.treatments,
            description: request.body.description
        })
    
        response.status(201).json({
            "successMessage": "result saved successfully!",
            "received message": savedResult
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



const getAllResults = async(request, response) =>{
    try{
        const patientResults = await results.find();

        response.status(200).json({
            "status": "Successfully retrieved all the results!",
            "patientResults": patientResults
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

const getResultById = async(request, response) =>{
    try{
        const patientResult = await results.findOne({_id: request.params.id});

        response.status(200).json({
            "resultMessageSuccess": "Successfully retrieved the result!",
            "resultMessage": patientResult
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



const deleteResult = async(request, response) =>{
    try{
        const resultToBeDeleted = await results.findOne({_id: request.params.id});

        await resultToBeDeleted.deleteOne({_id: request.params.id});

        response.status(200).json({
            "status": "success",
            "deletedResult": "Result deleted successfully!"
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


export default {saveResult, getAllResults, deleteResult, getResultById};