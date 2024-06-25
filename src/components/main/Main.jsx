import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Link } from "react-router-dom";

const Main = () => {
    return (
        <div className='main'>
            <div className="nav">
                {/* <p>interviU</p> */}
                <img className="logo" src={assets.interviu_logo} alt="" />
                <img src="#" alt="" />
            </div>
            <div className="main-container">
                <div className="greet">
                    <p><span>Hello, interviUs.</span></p>
                    <p>Tell me about yourself</p>
                </div>
                <div className="cards">
                    <Link to='/transcript-videos'>
                        <div className="card">
                            <p>Watch our latest videos</p>
                            <img src={assets.footage_coloured} alt="" />
                        </div>
                    </Link>
                    <Link to='/practise-speech'>
                        <div className="card">
                            <p>Analyze how you appear to the interviewers</p>
                            <img src={assets.chat_coloured} alt="" />
                        </div>
                    </Link>
                    <Link to="/search-prompts">
                        <div className="card">
                            <p>Ask our AI everything you are clueless of</p>
                            <img src={assets.shines_coloured} alt="" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Main