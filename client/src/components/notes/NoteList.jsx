import React, { useEffect, useState } from 'react';
import NoteCard from './NoteCard';
import '../styles/NoteList.css';

const NoteList = ({ refreshTrigger, currentUserId }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, [searchTerm, selectedSubject, sortBy, refreshTrigger]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError('');

      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      let url = `${baseURL}/api/notes?`;
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (selectedSubject) params.append('subject', selectedSubject);
      params.append('sort', sortBy);

      url += params.toString();

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);

      // Extract unique subjects
      const uniqueSubjects = [...new Set(data.map((note) => note.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseURL}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (err) {
      setError(err.message || 'Failed to delete note');
    }
  };

  const handleLikeNote = (noteId, likeCount) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteId ? { ...note, likes: { length: likeCount } } : note
      )
    );
  };

  return (
    <div className="note-list-container">
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="subject-filter"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Downloaded</option>
            <option value="liked">Most Liked</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="no-notes">
          <p>No notes found. Be the first to upload! 📝</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDeleteNote}
              onLike={handleLikeNote}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
