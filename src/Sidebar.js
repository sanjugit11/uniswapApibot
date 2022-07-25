import React,{useEffect,useState} from 'react';
import bot from './image/bot.png';
import "./Sidebar.css";
import botGif from './image/bot.gif';
import { Link } from 'react-router-dom';
// import react,{useEffect,useState} from "react";


function Sidebar() {
  const [pricenew, setPricenew] = useState( );
  const [price, setPrice] = useState( );
  useEffect(() => {
    setTimeout(() => {
      getPrice();
    }, 1000);
  });

  const getPrice = ()=>{
    const url = 'http://localhost:4000';
    const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    } };
    fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      setPricenew(data[0]);
      setPrice(data[1]);
      // console.log(data[0],"y wala");
      // console.log(data[1],"y wala");

    });
  }
    return (
        <div className='sidebar'>
        <div className='content'>
       <h1>Hi  i  am  saitama  bot</h1>
       <br>
       </br>
       <img src={botGif} alt="loading..." />
       {/* <div className='dataContent'> */}
          <table>
              <tr>
                <th>Pair</th>
                <th>Uniswap $</th>
                <th>Sushiswap $</th>
              </tr>
              <tr>
                <td><h6>USDT/Saita</h6></td>
                <td>{pricenew}</td>
                <td>{price}</td>
              </tr>
              <tr>
              <td><h6>USDT/Saita</h6></td>
                <td>{pricenew}</td>
                <td>{price}</td>
              </tr>
        </table>
       {/* </div>  */}
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
                <Link to="/bot" >SaitaswapBot</Link> 
                </button>
          </div>
          <div className='price'>pool Price
          <p> uniswap pool = {pricenew} $</p>
          <p>saitaswap pool = {price} $</p>
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