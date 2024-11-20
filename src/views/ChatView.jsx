import { useEffect, useRef, useState } from 'react';
import data from '../data/Chatbot - stock data.json';
import { IoSend } from 'react-icons/io5';
import { VscRobot } from 'react-icons/vsc';
import toast from 'react-hot-toast';
import { processString, getMaxHeight, saveOption } from '../utils/utils';
import SavedData from '../components/chat/SavedData';
import FinalOptions from '../components/chat/FinalOptions';
import BotAnswer from '../components/chat/BotAnswer';

function ChatView() {

  // Reference for message div -> used for automatical scrolling to the bottom of conversation,into chat view, whenever a new message is added
  const scrollRef = useRef(null);

  // Use case: Browser Window becomes scrollable whenever ChatView is getting higher
  // Solution: Create ChatView content (messages stack) scrollable by seting up its maxHeight and overflow: auto
  // maxHeight is calculated by using the heights of the following:
  //    ->savedData (data saved by user in localStorage if he opts for it) - which will be displayed in the header area
  //    ->chatHeader: a static area added in the header of ChatView content(see design)
  //    ->chatBottom: the disabled input added in the bottom of ChatView content
  // I created a reference for each of the prevoius elements described above
  const savedDataRef = useRef(null);
  const chatHeaderRef = useRef(null);
  const chatBottomRef = useRef(null);

  // dataHeight handles the states of heights for those elements
  const [dataHeight, setDataHeight] = useState({
    savedDataHeight: 0,
    chatHeaderHeight: 0,
    chatBottomHeight: 0
  });

  // chatMessages handles the state of the conversation between bot and user
  // Usually a chatMessage contains a textMessage ( a simple phrase), or a botResult (an array of strings displayed by bot at the end of conversation)
  // I created botResult array to emphasize the main data displayed at the end of process (stock name and price), by adding additional classes
  const [chatMessages, setChatMessages] = useState([
    {
      textMessage: 'Please select a Stock Exchange',
      sender: 'chatbot',
      options: data,
      botResult: []
    }
  ]);
  // For every step, a new message is pushed in chatMessages

  //Used for storing the user's choice
  const [chosenOption, setChosenOption] = useState({
    code: '',
    stockExchange: '',
    stock: {}
  });

  //Used for storing data in local storage
  const [savedData, setSavedData] = useState([]);

  // Used for handling the steps of conversation; e.g. if a stockExchange is chosen then the stockEchange atribute is becoming true
  // In the end of the process all the atributes are true
  const [choicesState, setChoicesState] = useState({
    stockExchange: false,
    stockName: false
  });

  // Get data from localStorage
  useEffect(() => {
    let retrievedData = JSON.parse(localStorage.getItem('stocksHistory'));
    if (retrievedData && retrievedData.length > 0) {
      setSavedData(retrievedData);
    }
  }, []);

  //Get Heights for the elements described previously
  useEffect(() => {
    if (
      savedDataRef.current &&
      chatHeaderRef.current &&
      chatBottomRef.current
    ) {
      const savedDataHeight =
        savedDataRef.current.getBoundingClientRect().height;
      const chatHeaderHeight =
        chatHeaderRef.current.getBoundingClientRect().height;
      const chatBottomHeight =
        chatBottomRef.current.getBoundingClientRect().height;

      setDataHeight({
        savedDataHeight: savedDataHeight,
        chatHeaderHeight: chatHeaderHeight,
        chatBottomHeight: chatBottomHeight
      });
    }
  }, []);

  // Set up data height for savedData - when it is initialized:
  useEffect(() => {
    if (savedData.length > 0) {
      setDataHeight({
        ...dataHeight,
        savedDataHeight: savedDataRef.current.getBoundingClientRect().height
      });
    }
  }, [savedData]);

  // Used for automatical scrolling to the bottom of conversation,into chat view, whenever a new message is added
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);


  // Called whenever a new message is added by sender (chatbot or user)
  const addToConversation = (
    textMessage,
    sender,
    options = null,
    botResult = null
  ) => {

    // Keep the prevoius messages
    // Add the new object 
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { textMessage, sender, options, botResult }
    ]);
  };

  // Updates the chosenOption object when a new option is selected by user
  const addToChosenOption = (newOption, key = '') => {
    setChosenOption((prevOption) => {
      let newOptionsData = { ...prevOption };

      // if a stock (object from topStocks) is added then stock atribute is updated with the newOption -> call: addToChosenOption(newOption, 'stock') -> see handleStockSelect
      // else a stock exchange was selected-> call: addToChosenOption(newOption) -> see handleStockExchangeSelect
      // see structure: 
                // {
                //   code: '',
                //   stockExchange: '',
                //   stock: {}
                // }
                
      if (key && key.length > 0) {
        newOptionsData = { ...prevOption, stock: newOption };
      } else {
        newOptionsData = {
          ...prevOption,
          code: newOption.code,
          stockExchange: newOption.stockExchange
        };
      }

      return newOptionsData;
    });
  };

  // Triggered when a stock exchange is selected
  const handleStockExchangeSelect = (stock) => {
    if (stock) {
      addToChosenOption(stock);

      // Show the message sent by user
      addToConversation(stock.stockExchange, 'user');

      // Chat offers the topStocks options
      addToConversation('Please select a stock', 'chatbot', stock.topStocks);

      // A stock Exchange was selected
      setChoicesState({
        ...choicesState,
        stockExchange: true
      });
    } else {
      toast.error('An error occured. Please try again later.');
    }
  };

  // Triggered when a stock is selected
  const handleStockSelect = (stock) => {
    if (stock) {
      addToChosenOption(stock, 'stock');
      addToConversation(stock.stockName, 'user');

      // Chat displays the price for the top stock selected
      const stringPrice = `Stock Price of ${stock.stockName} is ${stock.price}. Please select an option`;

      // processString used for turning a string into an array of substrings.
      // or much easier:
      // const stringsArray=[{text:'Stock Price of ', type:'info'},{text:stock.stockName,type:'name'},{...}]
      const stringsArray = processString(stringPrice);
      addToConversation('', 'chatbot', null, stringsArray);

      // A stock was selected => The process is ended
      setChoicesState({ ...choicesState, stockName: true });
    } else {
      toast.error('An error occured. Please try again later.');
    }
  };

  // Triggered when user opts for restart conversation option (in original design is main menu )
  // The states needed for this process are initialized with their default values
  const handleRestartConversation = () => {
    setChatMessages([]);
    setChoicesState({
      stockExchange: false,
      stockName: false
    });
    setChosenOption({});
    addToConversation('Please select a Stock Exchange', 'chatbot', data);
  };

  // Triggered when user opts for save data option
  const handleSaveData = (newOption) => {
    if (newOption) {

      // saveOption adds a new element to a an array 
      // Parameters: the new element and the array and returns an object with two attributes: 
      //    -> the updated array 
      //    -> a boolean(exists) which checks if the element already exists
      
      let resultedDataObject = saveOption(newOption, savedData);
      let newSavedData = resultedDataObject.newData;
      let exists = resultedDataObject.exists;

      if (newSavedData) {
        setSavedData(newSavedData);
      }

      // I created exists to display specific messages to user
      if (exists) {
        toast.error('Data already exists');
      } else {
        toast.success('Data saved successfully');
      }
    } else {
      toast.error('An error occured. Please try again later.');
    }
  };

  //Disable hover effect for disabled options
  useEffect(() => {
    const options = document.querySelectorAll('.option');

    if (choicesState.stockExchange || choicesState.stockName) {
      if (options && options.length > 0) {
        options.forEach((btn) => {
          if (btn.disabled) {
            btn.style.pointerEvents = 'none';
          }
        });
      }
    } else {
      if (options && options.length > 0) {
        options.forEach((btn) => {
          btn.style.pointerEvents = 'auto';
        });
      }
    }
  }, [choicesState]);

  return (
    <>
      <div className="container max-w-screen-lg my-5  mx-auto">
        {/* If there is data in local storage then it's displayed */}
        {savedData && (
          <SavedData
            savedData={savedData}
            savedDataRef={savedDataRef}
          />
        )}
        <div className="rounded-xl shadow-lg">
          {/* Start ChatView content Header */}
          <div
            ref={chatHeaderRef}
            className="flex items-center bg-primary color-white p-3 rounded-t-xl"
          >
            <div className="mr-2">
              <VscRobot className="color-white size-6" />
            </div>
            <div className="font-semibold" style={{ fontSize: '1.2rem' }}>
              LSEG chatbot
            </div>
          </div>
          {/* End ChatView content Header */}

          {/* Start ChatView content*/}
          <div
            className="wrapper pr-10"
            style={{
              maxHeight: getMaxHeight(
                dataHeight.savedDataHeight,
                dataHeight.chatHeaderHeight,
                dataHeight.chatBottomHeight
              ),
              overflowY: 'auto'
            }}
          >
            {/* Map the elements from chatMessages */}
            {chatMessages.map((message, index) =>
              
              // If the sender is chatbot
              message.sender === 'chatbot' ? (
                // scrollRef -> reference for automatically scroll
                <div
                  key={index}
                  ref={scrollRef}
                  className="flex items-end w-1/2 mr-auto"
                >
                  <div className="avatar-wrapper mr-1">
                    <VscRobot className="color-primary size-5" />
                  </div>

                  <div className="chatbot-content">
                    {/* The introduction message displayed whenever a new conversation is started */}
                    {!choicesState.stockExchange && !choicesState.stockName && (
                      <div className="mt-2  text-start chatbot max-w-lg font-normal px-4 py-2">
                        <span>
                          Hello! Welcome to LSEG. I'm here to help ypu.
                        </span>
                      </div>
                    )}
                    <div className="mt-2  text-start chatbot max-w-lg font-normal px-4 py-2">
                      {/* Component for handling bot answer */}
                      <BotAnswer
                        message={message}
                        choicesState={choicesState}
                        handleStockExchangeSelect={handleStockExchangeSelect}
                        handleStockSelect={handleStockSelect}
                        chosenOption={chosenOption}
                      />

                      {/* The choices displayed by chatbot when all the choicesState fields are becoming true (at the end of conv) */}
                      {choicesState.stockExchange &&
                        choicesState.stockName &&
                        // display only after the last message: chatMessages[length-1]
                        index === chatMessages.length - 1 && (
                          <FinalOptions
                            handleRestartConversation={handleRestartConversation}
                            handleSaveData={handleSaveData}
                            chosenOption={chosenOption}
                          />
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                // If the sender is the user
                // scrollRef reference for automatically scroll
                <div
                  key={index}
                  ref={scrollRef}
                  className="flex justify-end mt-3 w-1/2 ml-auto"
                >
                  <div className="user max-w-lg w-fit font-normal  px-4 py-2">
                    {message.textMessage}
                  </div>
                </div>
              )
            )}
          </div>
          {/* End ChatView content*/}

          {/* Disabled input placed at the bottom */}
          <div ref={chatBottomRef} className="relative">
            <input
              disabled
              type="text"
              placeholder="Please pick an option"
              className="w-full p-3 rounded-b-xl opacity-65"
            />
            <IoSend className="absolute right-4 top-4 opacity-25" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatView;
