import React, { useRef } from "react";
import { useEffect, useState } from "react";
import "./Home.scss";

import { Link, useLocation } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { Landing } from "../landing/Landing";
import Marquee from "react-fast-marquee";


function Home() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef(0);
  const maxRef = useRef(10000);

  const { search } = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const textItems = [
    "Teamwork", "Hierarchy", "Collaboration", "Efficiency", "Organization", "Visualization", "Structure", "Productivity", "Alignment", "Management"
  ];

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);



  return (
    <div className="home">

    <Landing /> 
    
    <div className="marquee-container">
      <Marquee className="marquee black-bg" speed={40} direction="left" autoFill>
        {textItems.map((text, index) => (
          <div key={index} className="marquee-item">{text}</div>
        ))}
      </Marquee>
      <Marquee className="marquee orange-bg" speed={30} direction="right" autoFill>
        {textItems.map((text, index) => (
          <div key={index} className="marquee-item">{text}</div>
        ))}
      </Marquee>
    </div>
  
   
    <div className="features">
  <div className="container">
    <div className="item">
      <h1><strong>About Chartify</strong></h1>
      <div className="title">
        Visualize Team Hierarchies
      </div>
      <p>
        Chartify makes it easy to create and visualize your organization's structure. See team relationships, roles, and reporting lines at a glance.
      </p>
      <div className="title">
        Drag-and-Drop Simplicity
      </div>
      <p>
        Update your organization chart effortlessly with intuitive drag-and-drop functionality. Change roles, teams, and reporting lines in seconds.
      </p>
      <div className="title">
        Collaborative Team Management
      </div>
      <p>
        Chartify fosters collaboration by allowing teams to work together on organizational updates, ensuring everyone stays aligned and informed.
      </p>
      <button className="get-started-btn">Get Started with Chartify</button>
    </div>
    <div className="item">
      <video src="/img/chartifyvid1.mp4" autoPlay muted loop playsInline />
    </div>
  </div>
</div>
  



     

     
<div className="features dark">
  <div className="container">
    <div className="item">
      <h1>Transform Team Management with <strong>Chartify.</strong></h1>
      <img src="https://cdn.prod.website-files.com/61aa482275701e722856da7b/643dd917ac2bbd95d5232408_Org-chart.jpg" alt="Chartify Visual Organization Chart" />
    </div>
    <div className="item">
      <h1>
        Chartify: Visualize, Organize, and Optimize Your Team
      </h1>
      <p>
        Ready to revolutionize how you manage your organization? Chartify helps you create, update, and visualize team hierarchies with ease, ensuring clarity and alignment across your organization.
      </p>
      <div className="title">
        <img src="./img/check.png" alt="" />
        Build interactive organization charts with drag-and-drop simplicity
      </div>
      <div className="title">
        <img src="./img/check.png" alt="" />
        Filter and search employees by name, role, or team
      </div>
      <div className="title">
        <img src="./img/check.png" alt="" />
        Update team structures in real-time with seamless collaboration
      </div>
      <div className="title">
        <img src="./img/check.png" alt="" />
        Export and share organization charts for better communication
      </div>
      <Link className="link" to="/chart-page">
        <button className="get-started-btn">Get Started with Chartify</button>
      </Link>
    </div>
  </div>
</div>


    
  
      
      
    </div>
  );
}

export default Home;
