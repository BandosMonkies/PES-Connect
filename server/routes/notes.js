const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/socketAuth');
const Note = require('../models/Note');

module.exports = (upload) => {
  const router = express.Router();

  // Get all notes with filtering
  router.get('/', async (req, res) => {
    try {
      const { subject, search, sort = 'newest' } = req.query;

      let query = {};
      if (subject) {
        query.subject = new RegExp(subject, 'i');
      }
      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { tags: new RegExp(search, 'i') },
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'popular') {
        sortOption = { downloads: -1, createdAt: -1 };
      } else if (sort === 'liked') {
        sortOption = { 'likes': -1, createdAt: -1 };
      }

      const notes = await Note.find(query)
        .sort(sortOption)
        .populate('uploader', 'name email')
        .limit(50);

      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  // Get note by ID
  router.get('/:id', async (req, res) => {
    try {
      const note = await Note.findById(req.params.id)
        .populate('uploader', 'name email');

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  });

  // Create a new note with file upload
  router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    try {
      const { title, description, subject, tags } = req.body;

      if (!title || !subject || !req.file) {
        // Clean up uploaded file if validation fails
        if (req.file) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({ error: 'Missing required fields: title, subject, and file' });
      }

      const user = req.user;
      const fileType = req.file.mimetype.split('/')[1];
      
      const note = new Note({
        title,
        description: description || '',
        filePath: req.file.path,
        fileName: req.file.originalname,
        fileType,
        subject,
        uploader: user.id,
        uploaderName: user.name,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
      });

      await note.save();
      await note.populate('uploader', 'name email');

      res.status(201).json(note);
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

  // Update note
  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      if (note.uploader.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this note' });
      }

      const { title, description, subject, tags } = req.body;

      if (title) note.title = title;
      if (description !== undefined) note.description = description;
      if (subject) note.subject = subject;
      if (tags) note.tags = tags;

      await note.save();
      res.json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  });

  // Delete note
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      if (note.uploader.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this note' });
      }

      // Delete file from filesystem
      if (note.filePath && fs.existsSync(note.filePath)) {
        fs.unlink(note.filePath, () => {});
      }

      await Note.findByIdAndDelete(req.params.id);
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

  // Like/Unlike a note
  router.post('/:id/like', authenticateToken, async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      const userId = req.user.id;
      const isLiked = note.likes.includes(userId);

      if (isLiked) {
        note.likes = note.likes.filter((id) => id.toString() !== userId);
      } else {
        note.likes.push(userId);
      }

      await note.save();
      res.json({ likes: note.likes.length, isLiked: !isLiked });
    } catch (error) {
      console.error('Error liking note:', error);
      res.status(500).json({ error: 'Failed to like note' });
    }
  });

  // Increment download count and send file
  router.get('/:id/download', async (req, res) => {
    try {
      const note = await Note.findByIdAndUpdate(
        req.params.id,
        { $inc: { downloads: 1 } },
        { new: true }
      );

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      // Check if file exists
      if (!fs.existsSync(note.filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Send file
      res.download(note.filePath, note.fileName);
    } catch (error) {
      console.error('Error downloading note:', error);
      res.status(500).json({ error: 'Failed to download note' });
    }
  });

  // Get notes by subject
  router.get('/subject/:subject', async (req, res) => {
    try {
      const notes = await Note.find({
        subject: new RegExp(req.params.subject, 'i'),
      })
        .sort({ createdAt: -1 })
        .populate('uploader', 'name email');

      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes by subject:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  return router;
};
