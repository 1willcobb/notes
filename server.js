const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid')

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
    
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    const storedNotes = fs.readFileSync('./db/db.json', 'utf8')
    let storedNotesJson = JSON.parse(storedNotes)
    console.log(`${req.method} request received to get notes`)
    res.json(storedNotesJson)
})

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received to add note`)

    const { title, text, } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text, 
            note_id: uuid(),
        };

        const storedNotes = fs.readFileSync('./db/db.json', 'utf8')
        let storedNotesJson = JSON.parse(storedNotes)
        storedNotesJson.push(newNote)

        const noteString = JSON.stringify(storedNotesJson, null, 4);


        fs.writeFile(`./db/db.json`, noteString, (err) => {
            err
                ? console.log(err)
                : console.log(`new note added titled: ${newNote.title}`)
        })
        const response = {
            status: 'success',
            body: newNote,
        }
        console.log(response);
        res.status(201).json(response)
    } else {
        res.status(500).json('Error in posting note')
    }
})

app.delete('/api/notes/:note_id', (req, res) => {
    const { note_id } = req.body;

    

    console.log(`${req.method} requested of note ${note_id}`)
    res.send("delete request made")
})




app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
