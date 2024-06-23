import React, { useState } from 'react';
import axios from 'axios';
import './TranscribeForm.css';

const TranscribeForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading and transcribing...');

    const formData = new FormData();
    formData.append('audioFile', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);

      // Download the subtitles file
      const downloadResponse = await axios.get('http://localhost:5000/download', {
        params: {
          filePath: response.data.filePath,
        },
        responseType: 'blob',
      });

      // Create a URL for the file and download it
      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'subtitles.srt');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
    <img src="https://i.imgur.com/CF9mJEk.png" alt="InterviU logo"></img>
      <h1>Video Transcription</h1>
      <h2>By Group InclusiveAI for SECJ3563-05 </h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="audio/*,video/*" />
        <button type="submit">Transcribe</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default TranscribeForm;
