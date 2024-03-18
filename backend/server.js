import express from "express";
import mongoose from "mongoose";
import { Note } from "./noteSchema.js";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/note-status/:title", async (req, res) => {
  const note = await Note.find({ title: req.params.title });
  if (note.length > 0) {
    return res.status(302).json({ note });
  }

  return res.status(404).json({ message: "Note Not Found" });
});

app.post("/note", async (req, res) => {
  const newNoteValues = req.body;
  const hashedPassword = await bcrypt.hash(newNoteValues.password, 12);

  const newNote = await Note.create({
    title: newNoteValues.title,
    text: newNoteValues.text,
    password: hashedPassword,
  });
  res.status(201).json({
    title: newNote.title,
    text: newNote.text,
  });
});

app.post("/note/:title", async (req, res) => {
  const noteValues = req.body;

  const existingNote = await Note.findOne({ title: noteValues.title });

  if (await bcrypt.compare(noteValues.password, existingNote.password)) {
    return res.json({
      message: "Right password",
      note: {
        title: existingNote.title,
        text: existingNote.text,
      },
    });
  }

  res.status(401).json({ message: "Password is incorrect" });
});

app.listen(3000, async () => {
  console.log("listening on port 3000");
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/note");
    console.log("Connected to Database");
  } catch (e) {
    console.log(e);
  }
});
