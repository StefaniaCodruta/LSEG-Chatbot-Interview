import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

const FinalOptions = ({ handleRestartConversation, handleSaveData, chosenOption }) => {
    const navigate = useNavigate();
    
    const buttons = [
        {
            text: 'Go Back',
            classes: 'option final-option w-full p-3 rounded-md my-1',
            onBtnClick: navigate,
            params: '/',
            style:{ borderColor: '#0F172A' }
        },
        {
            text: 'Restart Conversation',
            classes: 'bg-black final-option color-white w-full p-3 rounded-md my-1',
            onBtnClick: handleRestartConversation,
            params:  null
        },
        {
            text: 'Save Data',
            classes: 'bg-primary final-option color-white w-full p-3 rounded-md my-1',
            onBtnClick: handleSaveData,
            params:  chosenOption
        },
    ]
   
    return (
        <div className="mt-2">            
            {
                buttons.map((button, index) => (
                    <Button key={index} button={ button} />
                ))
            }
      </div>
    );
};

export default FinalOptions;