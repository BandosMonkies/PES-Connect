import React, { useState } from 'react';
import UploadNote from '../../components/notes/UploadNote';
import NoteList from '../../components/notes/NoteList';
import './NotesPage.css';

const NotesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const currentUserId = localStorage.getItem('userId');

  const handleUploadSuccess = (newNote) => {
    // Trigger refresh of note list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <div className="notes-title">
          <h1>📚 Study Materials & Resources</h1>
          <p>Share and access study notes, assignments, and resources from the community</p>
        </div>
      </div>

      <div className="notes-content">
        <UploadNote onUploadSuccess={handleUploadSuccess} />
        <NoteList refreshTrigger={refreshTrigger} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default NotesPage;
