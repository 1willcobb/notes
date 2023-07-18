const fs = require('fs');
const uuid = require('../helpers/uuid')
const app = require('express').Router();

let storedNotesJson = [];

app.get('/', (req, res) => {
    const storedNotes = fs.readFileSync('./db/db.json', 'utf8')
    storedNotesJson = JSON.parse(storedNotes)
    console.log(`${req.method} request received to get notes`)
    res.status(201).json(storedNotesJson)
})

app.post('/', (req, res) => {
    console.log(`${req.method} request received to add note`)

    const { title, text, } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text, 
            id: uuid(),
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
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
})

app.delete('/:id', (req, res) => {
    const { id } = req.params;

    const deleted = storedNotesJson.find(note => note.id === id)
    if (deleted) {
        storedNotesJson = storedNotesJson.filter(note => note.id !== id)

        const newList = JSON.stringify(storedNotesJson, null, 4);

        fs.writeFile(`./db/db.json`, newList, (err) => {
            err
                ? console.log(err)
                : console.log(`note deleted`);
        });
        res.status(200).json(deleted);
    } else {
        res.status(404).json({message: "no note found"});
    }
    
    console.log(`${req.method} requested of note ${id}`);
})

module.exports = app;