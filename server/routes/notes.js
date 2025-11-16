const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Note = require('../models/Note');
const User = require('../models/User');

const router = express.Router();

// Debug: Log all requests to notes routes
router.use((req, res, next) => {
  console.log(`[NOTES] ${req.method} ${req.path}`);
  next();
});

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No authentication token' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub || decoded.userId || decoded.id;

    if (!req.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Helper to generate share token
const generateShareToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Test route to verify notes routes are loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Notes routes are working!' });
});

// Test POST route without auth to verify routing works
router.post('/test-post', (req, res) => {
  console.log('✅ POST /api/notes/test-post hit!');
  res.json({ message: 'POST route works!', body: req.body });
});

// GET /api/notes - Get all notes user can access (own, shared, or public)
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, search, sortBy = 'newest' } = req.query;

    // Build query for notes user can access
    const query = {
      isDeleted: false,
      $or: [
        { author: req.userId },
        { isPublic: true },
        { 'sharedWith.user': req.userId },
      ],
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        ...query.$or,
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortQuery = {};
    switch (sortBy) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'popular':
        sortQuery = { views: -1, downloads: -1 };
        break;
      case 'title':
        sortQuery = { title: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const notes = await Note.find(query)
      .populate('author', 'name email')
      .populate('sharedWith.user', 'name email')
      .sort(sortQuery);

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// GET /api/notes/my - Get user's own notes
router.get('/my', authenticate, async (req, res) => {
  try {
    const { category } = req.query;

    const query = {
      author: req.userId,
      isDeleted: false,
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const notes = await Note.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching user notes:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// GET /api/notes/users/search - Search users to share with
router.get('/users/search', authenticate, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: req.userId },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name email')
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// GET /api/notes/:id/download - Increment download count
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check access
    const hasAccess =
      note.author.toString() === req.userId ||
      note.isPublic ||
      note.sharedWith.some((share) => share.user.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    note.downloads += 1;
    await note.save();

    res.json({ downloads: note.downloads });
  } catch (error) {
    console.error('Error updating download count:', error);
    res.status(500).json({ message: 'Failed to update download count' });
  }
});

// GET /api/notes/:id - Get a single note
router.get('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate('author', 'name email')
      .populate('sharedWith.user', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user has access
    const hasAccess =
      note.author._id.toString() === req.userId ||
      note.isPublic ||
      note.sharedWith.some((share) => share.user._id.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment views
    note.views += 1;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Failed to fetch note' });
  }
});

// GET /api/notes/shared/:token - Get note by share token (public access)
router.get('/shared/:token', async (req, res) => {
  try {
    const note = await Note.findOne({
      shareToken: req.params.token,
      isDeleted: false,
    }).populate('author', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment views
    note.views += 1;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Error fetching shared note:', error);
    res.status(500).json({ message: 'Failed to fetch note' });
  }
});

// POST /api/notes - Create a new note
router.post('/', authenticate, async (req, res) => {
  console.log('[NOTES ROUTER] POST /api/notes - Creating note - Route matched!');
  console.log('[NOTES ROUTER] Request body:', req.body);
  console.log('[NOTES ROUTER] User ID:', req.userId);
  try {
    const { title, content, category, subject, tags, fileUrl, fileName, isPublic } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.create({
      title,
      content,
      author: req.userId,
      category: category || 'general',
      subject: subject || '',
      tags: tags || [],
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      isPublic: isPublic || false,
    });

    await note.populate('author', 'name email');

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    // Return more detailed error message for debugging
    const errorMessage = error.message || 'Failed to create note';
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    const { title, content, category, subject, tags, fileUrl, fileName, isPublic } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (subject !== undefined) note.subject = subject;
    if (tags !== undefined) note.tags = tags;
    if (fileUrl !== undefined) note.fileUrl = fileUrl;
    if (fileName !== undefined) note.fileName = fileName;
    if (isPublic !== undefined) note.isPublic = isPublic;

    await note.save();
    await note.populate('author', 'name email');
    await note.populate('sharedWith.user', 'name email');

    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete a note (soft delete)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    note.isDeleted = true;
    await note.save();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

// POST /api/notes/:id/share - Share note with specific users
router.post('/:id/share', authenticate, async (req, res) => {
  try {
    const { userIds, permission = 'view' } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    // Remove duplicates and author from user IDs
    const uniqueUserIds = [...new Set(userIds)].filter(
      (id) => id.toString() !== req.userId.toString()
    );

    // Remove existing shares for these users
    note.sharedWith = note.sharedWith.filter(
      (share) => !uniqueUserIds.includes(share.user.toString())
    );

    // Add new shares
    for (const userId of uniqueUserIds) {
      const userExists = await User.findById(userId);
      if (userExists) {
        note.sharedWith.push({
          user: userId,
          permission: permission || 'view',
          sharedAt: new Date(),
        });
      }
    }

    await note.save();
    await note.populate('author', 'name email');
    await note.populate('sharedWith.user', 'name email');

    res.json(note);
  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ message: 'Failed to share note' });
  }
});

// POST /api/notes/:id/share-link - Generate a public share link
router.post('/:id/share-link', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    // Generate share token if it doesn't exist
    if (!note.shareToken) {
      note.shareToken = generateShareToken();
      await note.save();
    }

    const shareUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/notes/shared/${note.shareToken}`;

    res.json({ shareToken: note.shareToken, shareUrl });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ message: 'Failed to generate share link' });
  }
});

// DELETE /api/notes/:id/share-link - Remove public share link
router.delete('/:id/share-link', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    note.shareToken = null;
    await note.save();

    res.json({ message: 'Share link removed successfully' });
  } catch (error) {
    console.error('Error removing share link:', error);
    res.status(500).json({ message: 'Failed to remove share link' });
  }
});

// DELETE /api/notes/:id/share/:userId - Remove share from a specific user
router.delete('/:id/share/:userId', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.userId,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    note.sharedWith = note.sharedWith.filter(
      (share) => share.user.toString() !== req.params.userId
    );

    await note.save();
    await note.populate('author', 'name email');
    await note.populate('sharedWith.user', 'name email');

    res.json(note);
  } catch (error) {
    console.error('Error removing share:', error);
    res.status(500).json({ message: 'Failed to remove share' });
  }
});

module.exports = router;

