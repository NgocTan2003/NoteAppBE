const express = require('express');
const Note = require('../../models/note.model');
const router = express.Router();
const { authenticateToken } = require('../../utils/authenToken');

// Add note
router.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required' });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        })

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Note added successfully'
        })
    } catch (e) {
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        })
    }
})

// Edit note
router.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: 'Không có sự thay đổi' });
    }

    try {
        const note = await Note.findOne({ _id: req.params.noteId, userId: user._id });
        if (!note) {
            return re.status(404).json({ error: true, message: 'Note not found' });
        }
        if (title) note.title = title
        if (content) note.content = content
        if (tags) note.tags = tags
        if (isPinned) note.isPinned = isPinned

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Note updated successfully'
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});

// get all notes
router.get('/get-all-notes', authenticateToken, async (req, res) => {
    const { user } = req.user;
    console.log(user);

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: 'GetAll notes successfully'
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});

// delete note
router.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const note = await Note.findOne({ _id: req.params.noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: 'Note not found' });
        }

        await Note.deleteOne(note);

        return res.json({
            error: false,
            message: 'Note deleted successfully'
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});

// update isPinned
router.get('/search-notes/', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    console.log(user._id);

    if (!query) {
        res.status(400).json({ error: true, message: "query is require" })
    }

    try {
        const matchingNotes = await Note.findOne({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ],
        });
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server Error"
        })
    }
});

// Search Note 
router.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    const { noteId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return re.status(404).json({ error: true, message: 'Note not found' });
        }

        note.isPinned = isPinned
        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Note isPinned updated successfully'
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});


module.exports = router;