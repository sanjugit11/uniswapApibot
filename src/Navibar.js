import React from "react";
import logo from './image/loggo.jpg';
import "./Navibar.css";
const Navibar = ()=> {
    return(
    <>
    <div className="navbar">
      <div className="logo">
      <img src={logo} alt="Logo" />
      <p>SAITASWAP</p>
      </div>
      </div>
    </>
    )
 }
export default Navibar;