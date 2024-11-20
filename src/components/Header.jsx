import React from 'react';
import { VscRobot } from 'react-icons/vsc';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const { pathname } = useLocation();
    return (
        <div className='flex justify-between items-center py-4 '>
            <div className="flex items-center">
            <div className="mr-2">
             <VscRobot className='color-primary size-6' />
            </div>
            <div className="font-bold color-primary" style={{ fontSize: '1.2rem' }}>
              LSEG chatbot
            </div>
            </div>
            <div className="header-links">
                <Link to="/" className={`p-2 mr-3 relative font-medium ${pathname==='/'?'link-active color-primary font-semibold':''}`}>Home</Link>
                <Link to="/chat" className={`p-2 mr-3 relative font-medium ${pathname==='/chat'?'link-active color-primary font-semibold':''}`}>Chat</Link>
            </div>
            
        </div>
    );
};

export default Header;