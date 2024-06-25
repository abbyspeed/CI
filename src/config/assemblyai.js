// backend for transcripting videos
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const msToTime = (duration) => {
  let milliseconds = parseInt((duration % 1000), 10);
  let seconds = parseInt((duration / 1000) % 60, 10);
  let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 100) ? "0" + milliseconds : milliseconds;
  milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

  return hours + ":" + minutes + ":" + seconds + "," + milliseconds;
};

app.post('/upload', upload.single('audioFile'), async (req, res) => {
  const filePath = req.file.path;

  try {
    console.log('Uploading file to AssemblyAI...');

    // Upload the file to AssemblyAI
    const file = fs.readFileSync(filePath);
    const uploadResponse = await axios({
      method: 'post',
      url: 'https://api.assemblyai.com/v2/upload',
      headers: {
        'Authorization': '1df4a9e7779244ecb835d4a65b3cc1b5',
        'content-type': 'application/json'
      },
      data: file
    });

    console.log('File uploaded to AssemblyAI, URL:', uploadResponse.data.upload_url);

    const audio_url = uploadResponse.data.upload_url;

    // Request transcription
    console.log('Requesting transcription...');
    const transcriptResponse = await axios({
      method: 'post',
      url: 'https://api.assemblyai.com/v2/transcript',
      headers: {
        'Authorization': '1df4a9e7779244ecb835d4a65b3cc1b5',
        'content-type': 'application/json'
      },
      data: {
        audio_url: audio_url
      }
    });

    console.log('Transcription requested, ID:', transcriptResponse.data.id);

    const transcriptId = transcriptResponse.data.id;

    // Poll for the transcription result
    let transcript = null;
    while (!transcript || transcript.status !== 'completed') {
      console.log('Polling for transcription result...');
      await new Promise(r => setTimeout(r, 1000)); // Wait for 1 second
      const result = await axios({
        method: 'get',
        url: `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        headers: {
          'Authorization': '1df4a9e7779244ecb835d4a65b3cc1b5'
        }
      });
      transcript = result.data;
    }

    console.log('Transcription completed, generating subtitles...');

    const subtitles = transcript.words.map((word, index) => {
      const startTime = msToTime(word.start);
      const endTime = msToTime(word.end);
      return `${index + 1}\n${startTime} --> ${endTime}\n${word.text}`;
    }).join('\n\n');

    // Write subtitles to a file
    const subtitlePath = path.join(__dirname, 'subtitles.srt');
    fs.writeFile(subtitlePath, subtitles, (err) => {
      if (err) {
        console.error('Error saving subtitles:', err);
        res.status(500).send('Error saving subtitles');
      } else {
        console.log('Subtitles saved to', subtitlePath);
        res.json({ message: 'Subtitles saved', filePath: subtitlePath });
      }
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error during transcription:', error.response ? error.response.data : error.message);
    res.status(500).send('Error transcribing audio');
  }
});

app.get('/download', (req, res) => {
  const filePath = req.query.filePath;
  res.download(filePath, 'subtitles.srt', (err) => {
    if (err) {
      console.error('Error downloading subtitles:', err);
      res.status(500).send('Error downloading subtitles');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});