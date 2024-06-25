import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import { Link } from 'react-router-dom'

const Sidebar = () => {

    const [extended, setExtended] = useState(false)
    const {onSent, prevPrompts, setRecentPrompt, newChat} = useContext(Context)

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt)
        await onSent(prompt)
    }

    return (
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev=>!prev)} className="menu" src={assets.menu} alt=""/>
                {/* <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.add} alt=""/>
                    {extended? <p>New Chat</p> : null}
                </div> */}
                <div className="space"></div>
                <Link to="/transcript-videos">
                    <div className="top-item recent-entry">
                        <img className="footage" src={assets.footage} alt="" />
                        {extended ? <p>Videos</p> : null}
                    </div>
                </Link>
                <Link to="/practise-speech">
                    <div className="top-item recent-entry">
                        <img className="chat" src={assets.chat} alt="" />
                        {extended ? <p>Train</p> : null}
                    </div>
                </Link>
                <Link to="/search-prompts">
                    <div className="top-item recent-entry">
                        <img className="shines" src={assets.shines} alt="" />
                        {extended ? <p>Prompt</p> : null}
                    </div>
                </Link>
            </div>
            <div>
                {extended 
                    ? <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => {
                            return (
                                <div onClick={() => loadPrompt(item)} className="recent-entry">
                                    <img src="#" alt=""/>
                                    <p>{item.slice(0, 18)} ...</p>
                                </div>
                            )
                        })}
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default Sidebar