import InvariantError from "../../exceptions/InvariantError.js";
import { deleteAuthenticationPayloadSchema,
  postAuthenticationPayloadSchema,
  putAutheticationPayloadSchema } from "./schema.js";

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) =>{
    const validationResult = postAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) =>{
    const validationResult = putAutheticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) =>{
    const validationResult =
    deleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

export default AuthenticationsValidator;
