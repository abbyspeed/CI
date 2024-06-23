import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'

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
                    <div className="card">
                        <p>Watch our latest videos</p>
                        <img src={assets.footage_coloured} alt="" />
                    </div>
                    <div className="card">
                        <p>Analyze how you appear to the interviewers</p>
                        <img src={assets.chat_coloured} alt="" />
                    </div>
                    <div className="card">
                        <p>Ask our AI everything you are clueless of</p>
                        <img src={assets.shines_coloured} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main