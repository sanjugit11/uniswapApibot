import React from 'react';
import bot from './image/bot.png';
import "./Sidebar.css";
import botGif from './image/bot.gif';
import { Link } from 'react-router-dom';
import InputFile from './InputFile';

function Sidebar() {
    return (
        <div className='sidebar'>
        <div className='content'>
       <h1>welcome to saitaswap bot management</h1>
       <br>
       </br>
       <img src={botGif} alt="loading..." />
       </div>
       <div className='sidemodule'>
            <div className='menu'>
                 MENU
            </div>
            <div className='buttonArea'>
            <button 
                type="button"
                onClick={(e) => {
                e.preventDefault();
                }}
              > 
                <img src={bot} alt="bot" />
                <Link to="/bot" >UniswapBot</Link> 
                </button>
          </div>
          <div className='version'>
            version 1.0<br></br>
            By saitama
          </div>
        </div>
        </div>
    );
}

export default Sidebar;