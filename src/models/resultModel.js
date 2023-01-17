import mongoose from "mongoose";

const Schema = mongoose.Schema

const resultSchema = new Schema ({
    patientName: {
        type: String
    },

    doctorName: {
        type: String
    },

    result: {
        type: String
    },

    tbStage: {
        type: String
    },

    description: {
        type: String
    },

    treatments: {
        type: String
    },

    dateCreated: {
        type: Date, 
        default: Date.now
    },
})

export default mongoose.model("Results", resultSchema);