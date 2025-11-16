import React, { useState } from 'react';
import '../styles/UploadNote.css';

const UploadNote = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    tags: '',
    branch: '',
    semester: '',
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const supportedFormats = ['pdf', 'doc', 'docx', 'txt', 'pptx', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'];
  const branches = ['CSE', 'AIML', 'ECE', 'EEE', 'ME', 'BT'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (!supportedFormats.includes(fileExtension)) {
        setError(`File format not supported. Supported formats: ${supportedFormats.join(', ')}`);
        return;
      }

      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.subject.trim() || !file || !formData.branch || !formData.semester) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('subject', formData.subject);
      uploadData.append('tags', formData.tags ? `${formData.tags}, ${formData.branch}, Sem${formData.semester}` : `${formData.branch}, Sem${formData.semester}`);
      uploadData.append('file', file);

      const response = await fetch(`${baseURL}/api/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload note');
      }

      const newNote = await response.json();
      setFormData({
        title: '',
        description: '',
        subject: '',
        tags: '',
        branch: '',
        semester: '',
      });
      setFile(null);
      setShowForm(false);

      if (onUploadSuccess) {
        onUploadSuccess(newNote);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload note');
    } finally {
      setIsUploading(false);
    }
  };

  if (!showForm) {
    return (
      <button className="btn-upload-toggle" onClick={() => setShowForm(true)}>
        ➕ Upload New Note
      </button>
    );
  }

  return (
    <div className="upload-note-container">
      <div className="upload-header">
        <h2>Upload Study Material</h2>
        <button className="close-btn" onClick={() => setShowForm(false)}>
          ✕
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter note title"
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject <span className="required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., Data Structures, Algorithms"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="branch">
              Branch <span className="required">*</span>
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semester">
              Semester <span className="required">*</span>
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the note (optional)"
            rows={3}
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Enter tags separated by commas (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">
            Upload File <span className="required">*</span>
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept={supportedFormats.map((fmt) => `.${fmt}`).join(',')}
            />
            <span className="file-name">
              {file ? file.name : 'Choose file...'}
            </span>
          </div>
          <small>Max 100MB. Supported: PDF, DOC, DOCX, TXT, PPTX, XLSX, Images</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNote;
