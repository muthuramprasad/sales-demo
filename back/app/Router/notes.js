module.exports = (app) => {
    const express = require('express');
    const asynHandler = require('express-async-handler');
    const createNotes = require('../Controller/Notes').createNotes;
    const getNotes = require('../Controller/Notes').getNotes;
    const getNotesByLead = require('../Controller/Notes').getNotesByLead;
    const updateNote = require('../Controller/Notes').updateNote;
    const SoftDeleteNote = require('../Controller/Notes').SoftDeleteNote;

    const router = express.Router();

    router.post('/lead/:id/notes', asynHandler(createNotes));  // Add notes to a lead
    router.get('/notes', asynHandler(getNotes));      // Get notes for a lead
    router.get('/lead/:id/notes', asynHandler(getNotesByLead));      // Get notes for a lead
    router.put('/notes/:id', asynHandler(updateNote));         // Update a specific note
    router.patch('/notes/:id', asynHandler(SoftDeleteNote));   // Soft delete a specific note

    app.use("/api", router);
};
