import React from 'react';

const BotAnswer = ({
  message,
  choicesState,
  handleStockExchangeSelect,
  handleStockSelect,
  chosenOption
}) => {
  return (
    <div>
      {/* Check if the message contains a text to display. If there is no text then display the final result which is an array of strings */}
      {message.textMessage ? (
        <span>{message.textMessage}</span>
      ) : (
        <div>
          {/* className attribute is added only for price and name types */}
          {message.botResult &&
            message.botResult.map((res, index) => (
              <span
                key={index}
                {...(res.type === 'price'
                  ? {
                      className: 'color-primary font-semibold '
                    }
                  : res.type === 'name'
                  ? { className: 'font-semibold ' }
                  : '')}
              >
                {res.text}
              </span>
            ))}
        </div>
      )}

      {message.options && (
        <div className="mt-2">
          {/* Display the options for selection */}
          {message.options.map((option) => (
            <button
              key={option.code}
                  //   Condition for buttons disablement after every step
                //   check if (stockExchange is true AND there is no stockName attribute for option object (FIRST STEP)) OR (stockName is true (FINAL STEP))
              disabled={
                (choicesState.stockExchange && !option.stockName) ||
                choicesState.stockName
              }
              // Triggers functions using choicesState values
              onClick={() =>
                !choicesState.stockExchange && !choicesState.stockName
                  ? handleStockExchangeSelect(option)
                  : choicesState.stockExchange && !choicesState.stockName
                  ? handleStockSelect(option)
                  : ''
              }
              // Add active class to highlight the chosen optionS
                  className={`${
                //   check if an option at the first step was selected
                      chosenOption?.code === option.code ||
                //   check if an option at the second step was selected
                chosenOption?.stock?.code === option.code
                  ? 'active'
                  : ''
              }  option w-full p-3 rounded-md my-2`}
            >
              <div className="flex items-center gap-x-3">
                <span className="cercle relative"></span>
                {/* Display the option text */}
                <span>{option.stockExchange || option.stockName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BotAnswer;
