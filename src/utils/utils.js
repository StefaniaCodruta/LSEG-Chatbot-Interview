export const getMaxHeight = (
  savedDataHeight,
  chatBottomHeight,
  chatHeaderHeight
) => {
  return `calc(86vh - ${savedDataHeight}px - ${chatHeaderHeight}px - ${chatBottomHeight}px)`;
};

export const processString = (data) => {

  const dataOutput = [];

  if (data && data !== '') {
    const firstString = 'of';
    const indexStockName = data.indexOf(firstString) + firstString.length + 1;
    
    const secondString = 'is';
    const indexStockPrice =
      data.indexOf(secondString) + secondString.length + 1;

    const lastString = '. Please';
    const indexLastString = data.indexOf(lastString);

    dataOutput.push({
      text: data.slice(0, indexStockName),
      type: 'info'
    });
    dataOutput.push({
      text: data.slice(indexStockName, data.indexOf(secondString)),
      type: 'name'
    });
    dataOutput.push({
      text: data.slice(data.indexOf(secondString), indexStockPrice),
      type: 'info'
    });
    dataOutput.push({
      text: data.slice(indexStockPrice, indexLastString),
      type: 'price'
    });
    dataOutput.push({
      text: data.slice(indexLastString, data.length),
      type: 'info'
    });
  }

  return dataOutput;
};

export const saveOption = (newOption, prevData) => {
  let output = {
    exists: false,
    newData: []
  };

  // Used to keep the previous data and update it with new data
  const newSavedData = [...prevData];

  // Check if a Stock Exchange already exists by looking for the element which has the code equal with the new options's code
  const index = newSavedData.findIndex((elem) => elem.code === newOption.code);

  // If it is not found, then it is added as a new elemnent in newSavedData
  if (index === -1) {
    newSavedData.push({
      code: newOption.code,
      stockExchange: newOption.stockExchange,
      stocks: [{ ...newOption.stock }]
    });
  }

  // Otherwise it already exists. (Obviously :)) )
  // Now we have to check the stocks array for this stock exchange:
  //  -> if the stock object is a new one then it is added to the stocks array of the current stock exchange
  //  -> else exists variable is becoming true
  else {
    const stockIndex = newSavedData[index].stocks.findIndex(
      (elem) => elem.code === newOption.stock.code
    );
    if (stockIndex === -1) {
      newSavedData[index].stocks.push(newOption.stock);
    } else {
      output = { ...output, exists: true };
    }
  }
  output = { ...output, newData: newSavedData };
  // saved data in local storage
  localStorage.setItem('stocksHistory', JSON.stringify(newSavedData));

  return output;
};
