# Notes Sharing Feature Documentation

## Overview
The Notes Sharing feature allows PES Connect users to upload, share, and access study materials, notes, assignments, and other educational resources within the community.

## Features

### For Uploaders
- **Upload Resources**: Upload various file formats (PDF, DOC, DOCX, TXT, PPTX, XLSX, Images)
- **Organize by Subject**: Tag resources with subjects for easy categorization
- **Add Descriptions**: Include detailed descriptions and tags for better discoverability
- **Track Engagement**: View download and like counts for uploaded notes

### For Viewers
- **Search & Filter**: Find notes by keyword, subject, or tags
- **Sort Options**: View notes sorted by newest, most downloaded, or most liked
- **Like & Download**: Like favorite notes and download them for offline access
- **View Metadata**: See uploader information, upload date, and engagement metrics

## API Endpoints

### GET /api/notes
Retrieve all notes with optional filtering and sorting

**Query Parameters:**
- `search`: Search term for title, description, or tags
- `subject`: Filter by subject
- `sort`: Sort by 'newest' (default), 'popular', or 'liked'

**Response:** Array of note objects

### GET /api/notes/:id
Get a specific note by ID

### GET /api/notes/subject/:subject
Get all notes for a specific subject

### POST /api/notes
Create a new note (requires authentication)

**Request Body:**
```json
{
  "title": "String (required)",
  "description": "String (optional)",
  "fileUrl": "String (required)",
  "fileName": "String (required)",
  "fileType": "String (required) - pdf, doc, docx, txt, pptx, xlsx, image",
  "subject": "String (required)",
  "tags": ["Array of strings (optional)"]
}
```

### PUT /api/notes/:id
Update a note (only by uploader)

**Request Body:** Same as POST, but only title, description, subject, and tags can be updated

### DELETE /api/notes/:id
Delete a note (only by uploader)

### POST /api/notes/:id/like
Like or unlike a note (requires authentication)

**Response:**
```json
{
  "likes": "Number of total likes",
  "isLiked": "Boolean - whether user liked it"
}
```

### POST /api/notes/:id/download
Increment download counter for a note

## Database Schema

### Note Model
```javascript
{
  title: String (required, min: 3, max: 200),
  description: String (max: 1000),
  fileUrl: String (required),
  fileName: String (required),
  fileType: String (enum: ['pdf', 'doc', 'docx', 'txt', 'pptx', 'xlsx', 'image']),
  subject: String (required),
  uploader: ObjectId -> User (required),
  uploaderName: String (required),
  downloads: Number (default: 0),
  likes: [ObjectId -> User],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Components

### NoteCard
Displays individual note information with actions

**Props:**
- `note`: Note object
- `onDelete`: Callback for delete action
- `onLike`: Callback for like action
- `currentUserId`: Current user's ID

### NoteList
Displays a grid of notes with filtering and sorting options

**Props:**
- `refreshTrigger`: Trigger to refresh notes list
- `currentUserId`: Current user's ID

### UploadNote
Form component for uploading new notes

**Props:**
- `onUploadSuccess`: Callback when note is successfully uploaded

### NotesPage
Main page component containing upload form and notes list

## Usage

### Accessing Notes Feature
1. User must be logged in
2. Navigate to "Notes" in the navbar or Dashboard
3. Click "📚 Open Notes Sharing" from Dashboard

### Uploading a Note
1. Click "➕ Upload New Note" button
2. Fill in the form:
   - Title (required)
   - Subject (required)
   - Description (optional)
   - Tags (optional, comma-separated)
   - File (required, max 50MB)
3. Click "Upload Note"

### Finding Notes
1. Use search bar to search by keyword
2. Select a subject from the dropdown
3. Sort by newest, most downloaded, or most liked
4. Click on a note card to view details

### Interacting with Notes
- **Download**: Click "Download" button to download the file
- **Like**: Click "🤍 Like" to like a note
- **Delete**: If you're the uploader, click "Delete" to remove your note

## File Size & Format Limits

**Supported Formats:**
- Documents: PDF, DOC, DOCX, TXT
- Presentations: PPTX
- Spreadsheets: XLSX
- Images: JPG, JPEG, PNG, GIF

**Size Limit:** 50MB per file

## Error Handling

The feature includes comprehensive error handling for:
- File format validation
- File size validation
- Authentication errors
- Network errors
- Database errors

## Security Considerations

- Only authenticated users can upload notes
- Users can only delete/update their own notes
- File URLs are validated
- User IDs are securely managed via JWT tokens

## Future Enhancements

- Cloud storage integration (AWS S3, Google Drive)
- File preview functionality
- Advanced search with full-text indexing
- Comment system for notes
- Bookmark/save for later functionality
- Report inappropriate content
- Rating system (beyond just likes)
- Bulk download
- Export notes collection
- Collaborative notes editing

## Testing Notes

To test the notes feature:

1. Ensure server is running on `http://localhost:8000`
2. Ensure client is running on `http://localhost:5173`
3. Log in with a user account
4. Navigate to the Notes page
5. Try uploading a test note
6. Search, filter, and sort notes
7. Test like and download functionality
