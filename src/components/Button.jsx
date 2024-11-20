import React from 'react';

const Button = ({ button }) => {
  return (
    <button
      onClick={
        button.params
          ? () => button.onBtnClick(button.params)
          : button.onBtnClick
      }
    // Add className and style attributes if they exist
      {...(button.classes
        ? {
          className: button.classes
          }
        : '')}
      {...(button.style
        ? {
            style: button.style
          }
        : '')}
 
    >
      {button.text}
    </button>
  );
};

export default Button;
