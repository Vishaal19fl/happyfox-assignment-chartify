import React from 'react';

import './Landing.scss'
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className='hero'>
      <div className='container'>
        <div className='content'>
          <p className='subtitle'>Chart Your Organization</p>
          <h1 className='title'>
    Build & Manage <span>Team Structures</span> with{' '}
    <span>Drag-and-Drop</span> Ease
</h1>
<p className='description'>
    Create, visualize, and update your organization chart effortlessly. Empower your team with a clear and dynamic hierarchy.
</p>

<Link to="/chart-page" className='link'>  <button className='get-started-btn'>
         
           View Demo
          </button>
          </Link>
        </div>

        <div className='image'>
          <img src="/img/team.png" alt="Hero" />
        </div>
      </div>
    </div>
  );
};

