import React, { useState } from 'react';
import axios from 'axios';
import './TranscriptVideos.css';
import Sidebar from '../components/sidebar/Sidebar';
import { assets } from '../assets/assets'
import { Link } from "react-router-dom";

const TranscriptVideos = () => {
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
          'Authorization': '1df4a9e7779244ecb835d4a65b3cc1b5',
          'content-type': 'multipart/form-data',
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
    <>
      <Sidebar/>
      <div className="transcript">
        <div className="nav">
            <Link to='/'>
                <img className="logo" src={assets.interviu_logo} alt="" />
            </Link>
            <img src="#" alt="" />
        </div>
        <div className="transcript-container">
          <div className="intro">
              <p><span>Found a job training video but it is all mumbling?</span></p>
              <p>Hand it over to us to transcript it for you</p>
          </div>
          <div className="bottom-upload">
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} accept="video/*" />
              <button type="submit">Transcribe</button>
            </form>
          </div>
          <div className="bottom-status">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranscriptVideos;