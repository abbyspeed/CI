import React, { useState } from 'react';
import axios from 'axios';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

const VideoTranscription = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const API_KEY = '4573092d97f64fdf9d241240ccda2be0';

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const uploadVideo = async () => {
    const formData = new FormData();
    formData.append('file', videoFile);

    const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
      headers: { authorization: API_KEY },
    });

    return uploadResponse.data.upload_url;
  };

  const requestTranscription = async (audioUrl) => {
    const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
      audio_url: audioUrl,
      // Add the following to get timestamps for subtitles
      'auto_chapters': true,
      'format_text': true,
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
        setSubtitles(transcriptData.data.subtitles); // Assuming subtitles data is in the response
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
      const audioUrl = await uploadVideo();
      const transcriptId = await requestTranscription(audioUrl);
      await getTranscription(transcriptId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Video Transcription</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="video/*" />
        <button type="submit">Transcribe</button>
      </form>
      {transcript && (
        <div>
          <h2>Transcript</h2>
          <p>{transcript}</p>
        </div>
      )}
      {subtitles && (
        <div>
          <h2>Video with Subtitles</h2>
          <Player src={URL.createObjectURL(videoFile)}>
            <track kind="subtitles" src={subtitles} default />
          </Player>
        </div>
      )}
    </div>
  );
};

export default VideoTranscription;
