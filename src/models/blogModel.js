import mongoose from "mongoose";

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    postBody: {
        type: String,
        required: true,
    },

    postImage: {
        type: String,
        required: true,
    },

    headerImage:{
        type: String,
        required: true,
    },

    dateCreated: {
        type: Date,
        default: Date.now,
    }

})


export default mongoose.model("Blog", blogSchema)