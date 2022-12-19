import { nanoid } from "nanoid";
import notes from "./notes.js";

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const now = new Date();
  const createdAt = now.toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllNoteHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const now = new Date();
  const updatedAt = now.toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return {
      status: "success",
      message: "Catatan berhasil diperbarui",
    };
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteNoteById = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    return {
      status: "success",
      message: "Catatan berhasil dihapus",
    };
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

export {
  addNoteHandler,
  getAllNoteHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteById,
};
