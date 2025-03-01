import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>happyfox chartify.</h2>
            <span></span>
          </div>
          <div className="right">
           
            <div className="link">
              <img src="/img/language.png" alt="" />
              <span>English</span>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
