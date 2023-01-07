import mongoose from "mongoose";
import blogSchema from "../models/blogModel.js";
import blogLikeModel from "../models/blogLikeModel.js";
import commentLikeModel from "../models/commentLikeModel.js";
import blogValidationSchema from "../validations/blogValidation.js";
import Jwt from "jsonwebtoken"


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
      const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "commentError": "Please login to comment!"
        })

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

// Get single comment
const getSingleComment = async(request, response) =>{
    try{
        const singleComment = await blogSchema.find({ '_id': request.params.id, 'comments._id': request.params.commentId }, { 'comments.$': 1 });
        
        if (singleComment){
            response.status(200).json({"fetchedComment": singleComment})
        }

        else{
            response.status(400).json({
                "commentFetchedError": "comment not found!"
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
      let blog_id = request.params.blog_id
      if(!mongoose.Types.ObjectId.isValid(blog_id)){
        return response.status(400).json({ 
            "messageInvalidId": "Invalid blog Id",
            data: {}
        })
      }

      const blog = await blogSchema.findOne({_id: blog_id});

      if(!blog){
        return response.status(400).json({ 
            "messageNoBlog": "No blog found!",
            data: {}
        })
      }
      else{
        let current_user_id
        const token = request.header("auth_token")
      
       if(!token)
        return response.status(401).json({
            "messageLogin": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                current_user_id = decodedToken.userEmail._id
            }
        })
        
        const blog_like = await blogLikeModel.findOne({ blog_id: blog_id, user_id: current_user_id})

        if(!blog_like){
            const blogLikeDoc = new blogLikeModel ({
                blog_id: blog_id,
                user_id: current_user_id
            })
            await blogLikeDoc.save();

            await blogSchema.updateOne({_id: blog_id},
                {
                  $push:{blog_likes: current_user_id}
                })

                return response.status(200).json({ 
                    "messageLikeAdded": "Like successfully added!",
                    data: {}
                })
        }

        else{
            await blogLikeModel.deleteOne({
                _id:blog_like._id
            })

            await blogSchema.updateOne({_id: blog_like.blog_id},
                {
                  $pull:{blog_likes: current_user_id}
                })

                return response.status(200).json({ 
                    "messageLikeRemoved": "Like successfully removed!",
                    data: {}
                })
        }
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

// Get all Likes
const getAllLikes = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        const likes = post.blog_likes
        
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

// Like a comment
const likeComment = async(request, response) =>{
    try{
      let blog_id = request.params.blog_id
      if(!mongoose.Types.ObjectId.isValid(blog_id)){
        return response.status(400).json({ 
            "messageInvalidId": "Invalid blog Id",
            data: {}
        })
      }

      const blog = await blogSchema.findOne({_id: blog_id});

      if(!blog){
        return response.status(400).json({ 
            "messageNoBlog": "No blog found!",
            data: {}
        })
      }
      else{
        let current_user_id
        const token = request.header("auth_token")
      
       if(!token)
        return response.status(401).json({
            "messageLogin": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                current_user_id = decodedToken.userEmail._id
            }
        })
        
        const comment_like = await commentLikeModel.findOne({ blog_id: blog_id, user_id: current_user_id})

        if(!comment_like){
            const commentLikeDoc = new commentLikeModel ({
                blog_id: blog_id,
                user_id: current_user_id
            })
            await commentLikeDoc.save();

            await blogSchema.updateOne({_id: blog_id},
                {
                  $push:{comment_likes: current_user_id}
                })

                return response.status(200).json({ 
                    "messageLikeAdded": "Like successfully added!",
                    data: {}
                })
        }

        else{
            await commentLikeModel.deleteOne({
                _id:comment_like._id
            })

            await blogSchema.updateOne({_id: comment_like.blog_id},
                {
                  $pull:{comment_likes: current_user_id}
                })

                return response.status(200).json({ 
                    "messageLikeRemoved": "Like successfully removed!",
                    data: {}
                })
        }
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

// Get all comment Likes
const getAllCommentLikes = async(request, response) =>{
    try{
        const post = await blogSchema.findOne({_id: request.params.id});
        const likes = post.comment_likes
        
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

// Reply on comments
const commentReply = async(request, response) =>{
    try{
      const token = request.header("auth_token")
      
      if(!token)
        return response.status(401).json({
            "replyError": "Please login to reply on this comment!"
        })

        const {error} = blogValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const commentReply = {
            replyBody : request.body.replyBody,
            replierName : request.body.replierName,
            replierImage : request.body.replierImage,
            dateReplied : request.body.dateReplied
        }

        const commentReplies = await blogSchema.findByIdAndUpdate({_id: request.params.id},{
            $push: {"comments.$[element].commentReplies": commentReply } 
        },
        {
            arrayFilters: [{ "element._id": {_id: request.params.commentId} }],
            new:true
        })

        await commentReplies.save()

        response.status(200).json({
            "successMessage": "reply added successfully!",
            "replyContent": commentReplies.commentReplies
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

export default {createPost, getPosts, getSinglePost, updatePost, deletePost, 
    createComment, getAllComments, likePost, getAllLikes, likeComment, getAllCommentLikes,
    commentReply, getSingleComment};