import blogSchema from "../models/blogModel.js";
import blogValidationSchema from "../validations/blogValidation.js";



// Creating the post
const createPost = async(request, response) =>{
    try{
        const {error} = blogValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const newPost = new blogSchema();

        const postImageLink = `${request.protocol}://${request.get("host")}/postImages/${request.files.postImage[0].filename}`
        const headerImageLink = `${request.protocol}://${request.get("host")}/postImages/${request.files.headerImage[0].filename}`

        newPost.title = request.body.title,
        newPost.postBody = request.body.postBody,
        newPost.postImage = postImageLink,
        newPost.headerImage = headerImageLink,
        newPost.authorName = request.body.authorName,
        newPost.authorImage = request.body.authorImage,
        newPost.dateCreated = request.body.dateCreated

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
                post.postImage = `${request.protocol}://${request.get("host")}/postImages/${request.files.postImage[0].filename}` || post.postImage
                post.headerImage = `${request.protocol}://${request.get("host")}/postImages/${request.files.headerImage[0].filename}` || post.headerImage
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

// Creating the comment
const createComment = async(request, response) =>{
    try{
        const {error} = blogValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const comment = {
            commentBody : request.body.commentBody,
            commentorName : request.body.commentorName,
            commentorImage : request.body.commentorImage,
            dateCommented : request.body.dateCommented
        }

        const postComment = await blogSchema.findByIdAndUpdate({_id: request.params.id},{
            $push:{comments:comment}
        },{
            new:true
        })

        await postComment.save()

        response.status(200).json({
            "successMessage": "Comment created successfully!",
            "commentContent": postComment.comments
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

// Get all comments
const getAllComments = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        const comments = post.comments
        
        if (comments){
            response.status(200).json({"fetchedComments": comments})
        }

        else{
            response.status(400).json({
                "commentFetchedError": "No Comments!"
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

// Like post
const likePost = async(request, response) =>{
    try{

        const like = {
            likingUser : request.body.likingUser,
        }

        const postLikes = await blogSchema.findByIdAndUpdate({_id: request.params.id},{
            $push:{likes:like}
        },{
            new:true
        })

        await postLikes.save()

        response.status(200).json({
            "successMessage": "Like added successfully!",
            "likeContent": postLikes.likes
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

// Get all Likes
const getAllLikes = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        const likes = post.likes
        
        if (likes){
            response.status(200).json({"fetchedLikes": likes})
        }

        else{
            response.status(400).json({
                "likeFetchedError": "No Likes!"
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

// Like post
const unlikePost = async(request, response) =>{
    try{

        const unlike = {
            unlikingUser : request.body.unlikingUser,
        }

        const postUnlikes = await blogSchema.findByIdAndUpdate({_id: request.params.id},{
            $push:{unlikes:unlike}
        },{
            new:true
        })

        await postUnlikes.save()

        response.status(200).json({
            "successMessage": "Like added successfully!",
            "likeContent": postUnlikes.unlikes
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

// Get all Likes
const getAllUnlikes = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        const unlikes = post.unlikes
        
        if (unlikes){
            response.status(200).json({"fetchedUnlikes": unlikes})
        }

        else{
            response.status(400).json({
                "likeFetchedError": "No Likes!"
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

export default {createPost, getPosts, getSinglePost, updatePost, deletePost, 
    createComment, getAllComments, likePost, getAllLikes, unlikePost, getAllUnlikes};