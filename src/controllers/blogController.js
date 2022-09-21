import blogSchema from "../models/blogModel.js";
import blogValidationSchema from "../validations/blogValidation.js";



// Creating the post
const createPost = async(request, response) =>{
    try{
        const {error} = blogValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const newPost = new blogSchema();

        const postImageLink = `${request.protocol}://${request.get("host")}/postImages/${request.file.filename}`

        newPost.title = request.body.title,
        newPost.postBody = request.body.postBody,
        newPost.postImage = postImageLink

        await newPost.save()

        response.status(200).json({
            "successMessage": "Post created successfully!",
            "postContent": newPost
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


// Getting all the posts
const getPosts = async(request, response) =>{
    try{
        const allPosts = await blogSchema.find();

        if (allPosts){
            response.status(200).json({"allAvailablePosts": allPosts})
        }

        else{
            response.status(400).json({"postError": "The blog posts not found"})  
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}



// Getting a single post
const getSinglePost = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        
        if (post){
            response.status(200).json({"fetchedPost": post})
        }

        else{
            response.status(400).json({
                "postFetchedError": "Post not found!"
            })  
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}




// Updating the post
const updatePost = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        if (post){

            if(!request.file){
                post.title = request.body.title || post.title,
                post.postBody = request.body.postBody || post.postBody
            }

            else{
                post.postImage = `${request.protocol}://${request.get("host")}/postImages/${request.file.filename}` || post.postImage
            }

            await post.save()

            response.status(200).json({
                "postUpdateSuccess": "This post is updated successfully!",
                "updatedPost": post
            })
        }
        else{
            response.status(400).json({
                "postUpdateError": "Post not found!"
            })
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}



// Deleting a post
const deletePost = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});

        await post.deleteOne()

        response.status(200).json({
            "deletedPost": `The post title ${post.title} has been deleted successfully!`
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

export default {createPost, getPosts, getSinglePost, updatePost, deletePost};