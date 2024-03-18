import { useEffect, useState } from "react";
import { Button, Form, Modal, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

export const Note = () => {
  const [noteFound, setNoteFound] = useState(null);
  const [note, setNote] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [passwordCorrect, setPasswordCorrect] = useState(true);

  const { noteTitle } = useParams();

  useEffect(() => {
    const checkNote = async () => {
      const response = await fetch(
        `http://localhost:3000/note-status/${noteTitle}`
      );
      const data = await response.json();
      if (data.note) {
        setNoteFound(true);
      }
      if (data.message) {
        setNoteFound(false);
      }
    };

    checkNote();
  }, [noteTitle]);

  const createNote = async () => {
    const newNote = {
      title: noteTitle,
      text: note,
      password: password,
    };
    const response = await fetch("http://localhost:3000/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });
    const data = await response.json();
    console.log(data);
  };

  const getNote = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:3000/note/${noteTitle}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: noteTitle, password: password }),
    });
    const data = await response.json();
    console.log(data);
    if (data.note) {
      setNote(data.note.text);
      setShowModal(false);
    } else {
      setPassword("");
      setPasswordCorrect(false);
    }
    /*{message: "Right password" note: {title: 'nini', text: 'this is my note.'} */
  };

  return (
    <Container>
      <header className="my-4 d-flex justify-content-between">
        <h1 className="fs-4">🔐 Protected Text</h1>
      </header>
      <main>
        <>
          <Modal show={showModal} size="sm">
            <form onSubmit={getNote}>
              <Modal.Header>
                <Modal.Title>
                  {noteFound ? "Password required" : "Create new site?"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  {noteFound
                    ? "This site (this URL) is already occupied."
                    : "Great! This site doesn't exist, it can be yours!"}
                </p>
                <Form.Label htmlFor="password">
                  {noteFound ? "Password" : "New password"}
                </Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  id="passowrd"
                />
              </Modal.Body>
              <Modal.Footer>
                {noteFound ? (
                  <>
                    {!passwordCorrect && <p>password is incorrect</p>}
                    <Button variant="primary" size="sm" type="submit">
                      Check
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    Create
                  </Button>
                )}
              </Modal.Footer>
            </form>
          </Modal>
          <form onSubmit={createNote}>
            <Form.Control
              value={note}
              onChange={(e) => setNote(e.target.value)}
              name="note"
              as="textarea"
              id="note"
              cols="30"
              rows="10"
              placeholder="Your text goes here..."
            />
            <Button className="mt-2 d-block ms-auto" type="submit">
              Save
            </Button>
          </form>
        </>
      </main>
    </Container>
  );
};
