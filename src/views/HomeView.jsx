import React from 'react';
import Button from './../components/Button';
import { useNavigate } from 'react-router-dom';

const HomeView = () => {
  const navigate = useNavigate();

  const button = {
    text: 'Start Conversation',
    classes:
      'bg-primary color-white font-semibold final-option w-2/3 mt-16 p-5 rounded-md my-1',
    onBtnClick: navigate,
    params: '/chat'
  };

  return (
    <div className="flex items-center justify-between mt-16">
      <div className="w-1/2">
        <h1 className="font-bold" style={{ fontSize: '3.4rem' }}>
          Welcome to <br></br>
          <span className="color-primary">LSEG Chatbot</span>
        </h1>
        <p className="mt-4 color-text-gray font-medium">
          Start a conversation and stay up to date with the last prices of our
          main Stock Exchanges
        </p>

        <Button button={button} />
      </div>
      <div className="w-1/2">
        <div className="w-3/4 ml-auto image-home">
          <img
            className="max-w-full"
            src="http://localhost:3000/images/robot-home.png"
            alt="Chat Image"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
