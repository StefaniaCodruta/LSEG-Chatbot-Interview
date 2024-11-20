import React from 'react';

const SavedDataCard = ({ data }) => {
  return (
    <div className="card rounded-xl px-4 py-3 text-start">
      <div className="font-semibold">{data.stockExchange}</div>
      <div className="divider w-full my-3"></div>
      {data.stocks &&
        data.stocks.length > 0 &&
        data.stocks.map((stock) => (
          <div
            key={stock.code}
            className="flex justify-between my-1"
            style={{ fontSize: '0.9rem' }}
          >
            <div>{stock.stockName}</div>
            <div className="color-primary font-medium">{stock.price}</div>
          </div>
        ))}
    </div>
  );
};

export default SavedDataCard;
