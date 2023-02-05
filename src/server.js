/* eslint-disable max-len */
import Hapi from "@hapi/hapi";
import Jwt from '@hapi/jwt';
import * as path from 'path';
import Inert from '@hapi/inert';

// notes
import notes from "./api/notes/index.js";
import NotesService from "./services/postgres/NotesService.js";
import NotesValidator from "./validator/notes/index.js";

// users
import users from "./api/users/index.js";
import UsersService from "./services/postgres/UsersService.js";
import UsersValidator from "./validator/users/index.js";

// authentications
import authentications from "./api/authentications/index.js";
import AuthenticationsValidator from "./validator/authentications/index.js";
import AuthenticationsService from "./services/postgres/AuthenticationsService.js";
import TokenManager from "./tokenize/TokenManager.js";

// collaborations
import collaborations from "./api/collaborations/index.js";
import CollaborationsService from "./services/postgres/CollaborationsService.js";
import CollaborationsValidator from "./validator/collaborations/index.js";

// export
import _exports from "./api/exports/index.js";
import ExportsValidator from "./validator/exports/index.js";
import ProducerService from "./services/rabbitmq/ProdecerServices.js";

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import ClientError from "./exceptions/ClientError.js";
import uploads from "./api/uploads/index.js";
import UploadsValidator from "./validator/uploads/index.js";
import StorageService from "./services/storage/StorageService.js";


dotenv.config();
// const __dirname = path.resolve(path.dirname(''));
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const authenticationsService = new AuthenticationsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Eksternal plugin

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) =>({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  // Pre Response Error
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada host ${server.info.uri}`);
};

init();
