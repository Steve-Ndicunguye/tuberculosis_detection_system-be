import joi from "@hapi/joi" 


const contactValidationSchema = joi.object({
    names: joi.string().required().min(2).regex(/^[A-Za-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters"
    }),

    email: joi.string().required().email(),

    phoneNumber: joi.string().regex(/^([+]\d{2})?\d{10}$/).required().messages({
        "string.pattern.base": "Invalid phone number"
    }),
    
    message: joi.string().required()
})





export default contactValidationSchema;