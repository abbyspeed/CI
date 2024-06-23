import React, { useState } from 'react';
import axios from 'axios';

const Transcription = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const API_KEY = 'your_api_key_here    ';

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const uploadAudio = async () => {
    const formData = new FormData();
    formData.append('file', audioFile);

    const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
      headers: { authorization: API_KEY },
    });

    return uploadResponse.data.upload_url;
  };

  const requestTranscription = async (audioUrl) => {
    const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
      audio_url: audioUrl,
    }, {
      headers: { authorization: API_KEY },
    });

    return transcriptResponse.data.id;
  };

  const getTranscription = async (transcriptId) => {
    let status;
    let transcriptData;

    do {
      transcriptData = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: API_KEY },
      });

      status = transcriptData.data.status;
      if (status === 'completed') {
        setTranscript(transcriptData.data.text);
      } else if (status === 'failed') {
        throw new Error('Transcription failed');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (status !== 'completed');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const audioUrl = await uploadAudio();
      const transcriptId = await requestTranscription(audioUrl);
      await getTranscription(transcriptId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Audio Transcription</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="audio/*" />
        <button type="submit">Transcribe</button>
      </form>
      {transcript && (
        <div>
          <h2>Transcript</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default Transcription;
