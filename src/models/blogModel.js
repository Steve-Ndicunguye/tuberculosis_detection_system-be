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
        type: String
    },

    authorName: {
        type: String
    },

    authorImage: {
        type: String
    },

    likes:[{
        likingUser: {
            type: String
        }  
    }],

    unlikes:[{
        unlikingUser: {
            type: String
        }  
    }],

    comments:[{
        commentBody: {
            type: String
        },
    
        dateCommented: {
            type: String
        },
    
        commentorName: {
            type: String
        },
    
        commentorImage: {
            type: String
        }
    }],

})


export default mongoose.model("Blog", blogSchema)