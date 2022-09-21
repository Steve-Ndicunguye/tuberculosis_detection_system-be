import Joi from "@hapi/joi";

const blogValidationSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "The title can not be empty"
    }),

    postBody: Joi.string().required().messages({
        "string.empty": "The body can not be empty"
    }),

    postImage: Joi.string()

})


export default blogValidationSchema