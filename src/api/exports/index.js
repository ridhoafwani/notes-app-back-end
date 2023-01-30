import ExportHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: '_exports',
  version: '1.0.0',
  register: async (server, { service, validator }) =>{
    const exportHandler = new ExportHandler(service, validator);

    server.route(routes(exportHandler));
  },
};
