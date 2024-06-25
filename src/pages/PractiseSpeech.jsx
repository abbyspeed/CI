import { useState, useEffect } from "react";
import { Recorder } from 'react-voice-recorder';
import "react-voice-recorder/dist/index.css";
import axios from 'axios';
import Status from "../components/status/Status";
import Result from "../components/result/Result";
import Sidebar from "../components/sidebar/Sidebar";
import './PractiseSpeech.css'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { assets } from '../assets/assets'
import { Link } from "react-router-dom";

const assemblyAPI = axios.create({
    baseURL: 'https://api.assemblyai.com/v2',
    headers: {
        "Authorization": "3ecdd2ff01504d8ba4ff0b10b3c52bd1",
        'content-type': 'application/json'
    }
})

const initialState = {
    url: null,
    blob: null,
    chunks: null,
    duration: {
        h: 0,
        m: 0,
        s: 0
    }
}

function PractiseSpeech(){
    const [audioDetails, setAudioDetails] = useState(initialState);

    const [transcript, setTranscript] = useState({id: ''});
    const [audioIsLoading, setAudioIsLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if(transcript.id && transcript.status !== 'completed' && audioIsLoading){
                try{
                    const { data: transcriptData } = await assemblyAPI.get(
                        `/transcript/${transcript.id}`
                    );
                    setTranscript({ ...transcript, ...transcriptData });

                } catch(err){
                    console.error(err);

                }
            } else{
                setAudioIsLoading(false);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [audioIsLoading, transcript]);

    const handleAudioStop = (data) => {
        setAudioDetails(data);
    }

    const handleReset = () => {
        setAudioDetails({...initialState});
        setTranscript({id: ''});
    }

    const handleAudioUpload = async (audioFile) => {
        setAudioIsLoading(true);

        const { data: uploadResponse } = await assemblyAPI.post(
            '/upload', audioFile);

        const { data } = await assemblyAPI.post('/transcript', {
            audio_url: uploadResponse.upload_url,
            sentiment_analysis: true,
            entity_detection: true,
            iab_categories: true
        });

        setTranscript({ id: data.id });
    }

    return (
        <>
            <Sidebar/>
            <div className="practise">
                <div className="nav">
                    <Link to='/'>
                        <img className="logo" src={assets.interviu_logo} alt="" />
                    </Link>
                    <img src="#" alt="" />
                </div>
                <div className="practise-container">
                    <div className="prompt">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={100}
                        >
                            <SwiperSlide>Tell me about yourself</SwiperSlide>
                            <SwiperSlide>If someone leaves a bad review about our company, what would you do?</SwiperSlide>
                            <SwiperSlide>Why are you interested in this position?</SwiperSlide>
                            <SwiperSlide>Give an example of a time you had to deal with a difficult coworker.</SwiperSlide>
                            <SwiperSlide>Are you willing to relocate?</SwiperSlide>
                            <SwiperSlide>Describe a time you went above and beyond in your previous role.</SwiperSlide>
                            <SwiperSlide>What are your career goals?</SwiperSlide>
                        </Swiper>
                    </div>
                    <div className="mic">
                        <Recorder
                            record={true}
                            audioURL={audioDetails.url}
                            handleAudioStop={handleAudioStop}
                            handleAudioUpload={handleAudioUpload}
                            handleReset={handleReset}
                        />
                        {transcript.text && transcript.status === 'completed'
                            ? <Result transcript={transcript}/>
                            : <Status audioIsLoading={audioIsLoading} status={transcript.status}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default PractiseSpeech