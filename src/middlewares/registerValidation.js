import Joi from "@hapi/joi";

const userValidationSchema = Joi.object({
    firstName: Joi.string().required().min(2).regex(/^[A-Za-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters"
    }),

    lastName: Joi.string().required().min(2).regex(/^[A-Za-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters"
    }),

    email: Joi.string().required().email(),

    password: Joi.string().required().regex(/^(?=(.*[A-Z]){1,})(?=(.*[a-z]){1,})(?=(.*[0-9]){1,}).{5,}$/).messages({
        "string.pattern.base": "The password should have at least one capital letter and number"
    }),

    repeatPassword: Joi.string().required().equal(Joi.ref("password")).messages({
        "any.only": "Passwords don't match"
    })
})


export default userValidationSchema