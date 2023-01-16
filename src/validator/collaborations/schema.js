import Joi from "joi";

const collaborationPayloadSchema = Joi.object({
  noteId: Joi.string().required(),
  userId: Joi.string().required(),
});

export default collaborationPayloadSchema;

