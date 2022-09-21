import Jwt from "jsonwebtoken"
import sessionStorage from "node-sessionstorage"


const socialMediaLoggedInUser = async(request, response) =>{
    try{
      const token = sessionStorage.getItem("set_token")
      
      if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                console.log(decodedToken)
                response.status(200).json(decodedToken)
            }
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


// Logout section

const socialMediaLogoutUser = async(request, response) =>{
    try{
      sessionStorage.removeItem("set_token")
      response.status(200).json({
        "message": "You are successfully logged out!"
      })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// Social media update user

const socialMediaUpdateUser = async(request, response) =>{
    try{
        const token = sessionStorage.getItem("set_token")
        
        if(!token)
            return response.status(401).json({
                "message": "Please login!"
            })

            Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
                if(err){
                    console.log(err.message)
                }

                else{
                    const ourSocialMediaLoggedInUser = await User.findById(decodedToken.userEmail._id) 

                    if (ourSocialMediaLoggedInUser){
                     
                            ourSocialMediaLoggedInUser.bio = request.body.bio || ourSocialMediaLoggedInUser.bio,
                            ourSocialMediaLoggedInUser.profileFacebook = request.body.profileFacebook || ourSocialMediaLoggedInUser.profileFacebook,
                            ourSocialMediaLoggedInUser.profileTwitter = request.body.profileTwitter || ourSocialMediaLoggedInUser.profileTwitter,
                            ourSocialMediaLoggedInUser.profileLinkedin = request.body.profileLinkedin || ourSocialMediaLoggedInUser.profileLinkedin,
                            ourSocialMediaLoggedInUser.profileInstagram = request.body.profileInstagram || ourSocialMediaLoggedInUser.profileInstagram

                        
                        const updatedUser = await ourSocialMediaLoggedInUser.save()

                        const newUser = {
                            bio: updatedUser.bio,
                            profileFacebook: updatedUser.profileFacebook,
                            profileTwitter: updatedUser.profileTwitter,
                            profileLinkedin: updatedUser.profileLinkedin,   
                            profileInstagram: updatedUser.profileInstagram
                        }

                        if(request.body.profileFacebook == ""){
                            ourSocialMediaLoggedInUser.profileFacebook = undefined;
                            delete ourSocialMediaLoggedInUser.profileFacebook;
                            await ourSocialMediaLoggedInUser.save()
                        }

                        if(request.body.profileTwitter == ""){
                            ourSocialMediaLoggedInUser.profileTwitter = undefined;
                            delete ourSocialMediaLoggedInUser.profileTwitter;
                            await ourSocialMediaLoggedInUser.save()
                        }

                        if(request.body.profileInstagram == ""){
                            ourSocialMediaLoggedInUser.profileInstagram = undefined;
                            delete ourSocialMediaLoggedInUser.profileInstagram;
                            await ourSocialMediaLoggedInUser.save()
                        }

                        if(request.body.profileLinkedin == ""){
                            ourSocialMediaLoggedInUser.profileLinkedin = undefined;
                            delete ourSocialMediaLoggedInUser.profileLinkedin;
                            await ourSocialMediaLoggedInUser.save()
                        }

                        if(request.body.bio == ""){
                            ourSocialMediaLoggedInUser.bio = undefined;
                            delete ourSocialMediaLoggedInUser.bio;
                            await ourSocialMediaLoggedInUser.save()
                        }

                        response.status(200).json({
                            "message": "User updated successfully!",
                            "ourUpdatedUser": newUser
                        })
                    }

                    else{
                        response.status(404).json({"message": "User not found!"})
                    }
                }
            })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}




export default{socialMediaLoggedInUser, socialMediaLogoutUser, socialMediaUpdateUser}