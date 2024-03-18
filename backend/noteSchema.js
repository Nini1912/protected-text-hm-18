import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    password: String,
  }
);

export const Note = new mongoose.model("Note", noteSchema);
