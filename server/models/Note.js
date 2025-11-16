const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['general', 'academics', 'exam', 'assignment', 'project', 'resources'],
      default: 'general',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    // Sharing configuration
    isPublic: {
      type: Boolean,
      default: false,
    },
    sharedWith: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view',
      },
      sharedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
noteSchema.index({ author: 1, createdAt: -1 });
noteSchema.index({ category: 1, createdAt: -1 });
noteSchema.index({ isPublic: 1, createdAt: -1 });
noteSchema.index({ 'sharedWith.user': 1 });
noteSchema.index({ shareToken: 1 });

module.exports = mongoose.model('Note', noteSchema);

