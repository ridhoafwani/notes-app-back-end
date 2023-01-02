import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

class NotesService {
  constructor() {
    this._notes = [];
  }

  addNote({ title, body, tags }) {
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

    this._notes.push(newNote);
    const isSuccess = this._notes.filter((note)=>note.id === id).length >0;
    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return id;
  }

  getAllNotes() {
    return this._notes;
  }

  getNoteById(id) {
    const note = this._notes.filter((note)=>note.id===id)[0];
    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return note;
  }

  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note)=> note.id === id);
    const now = new Date();
    const updatedAt = now.toISOString();
    if (index===-1) {
      throw new NotFoundError('Gagal memperbarui catatan, Id tidak ditemukan');
    }

    this._notes[index] = {
      ...this._notes[index],
	  title,
	  body,
	  tags,
	  updatedAt,
    };
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note)=> note.id===id);
    if (index===-1) {
      throw new NotFoundError('Gagal menghapus catatan, Id tidak ditemukan');
	  }
    this._notes.splice(index, 1);
  }
}

export default NotesService;
