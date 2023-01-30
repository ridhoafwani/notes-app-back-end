const routes = (handler) => [
  {
    path: '/export/notes',
    method: 'POST',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

export default routes;
