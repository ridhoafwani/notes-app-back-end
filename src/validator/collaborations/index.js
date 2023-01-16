import InvariantError from "../../exceptions/InvariantError.js";
import collaborationPayloadSchema from "./schema.js";

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) =>{
    const validationResult = collaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default CollaborationsValidator;
