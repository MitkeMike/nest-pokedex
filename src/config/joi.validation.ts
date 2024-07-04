import * as Joi from 'joi';
// Define the Joi validation schema for the environment variables  npm install joi
export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().required(),
    DEFAULT_LIMIT: Joi.number().default(6),
})
