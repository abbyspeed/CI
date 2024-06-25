import React, { useContext } from 'react'
import { Context } from '../context/Context'
import Sidebar from "../components/sidebar/Sidebar";
import { assets } from '../assets/assets'
import { Link } from "react-router-dom";
import './SearchPrompts.css'

const SearchPrompts = () => {
  const {onSent, recentPrompt, showResult, loading, resultData, setInput, input, newChat} = useContext(Context)

  return (
    <>
        <Sidebar/>
        <div className="search">
            <div className="nav">
                <Link to='/'>
                    <img className="logo" src={assets.interviu_logo} alt="" />
                </Link>
                <img src="#" alt="" />
            </div>
            <div className="search-container">
              {!showResult 
                ? <>
                  <div className="intro">
                    <p><span>Hi! I am your career coach.</span></p>
                    <p>Type anything in the box below and I will happily help you!</p>
                </div>
                </>
                : <div className="result">
                    <div className="result-title">
                        <img className="user" src={assets.user} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src="#" alt="" />
                        {loading
                            ? <div className="loader">
                                <hr />
                                <hr />
                                <hr />
                            </div>
                            : <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                        }
                    </div>
                </div>
              }
              <div className="search-bottom">
                  <div className="search-box">
                      <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                      <div>
                          <img onClick={() => newChat()} src={assets.add} alt="" />
                          <img onClick={()=>onSent()} src={assets.send} alt="" />
                      </div>
                  </div>
                  <p className="bottom-info">Our AI coach may make mistakes sometimes, but rest assured you can relieve your job anxiousness by asking away!</p>
              </div>
            </div>
        </div>
    </>
  )
}

export default SearchPrompts