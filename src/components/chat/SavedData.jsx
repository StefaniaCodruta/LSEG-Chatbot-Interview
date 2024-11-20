import React from 'react';
import SavedDataCard from './SavedDataCard';

const SavedData = ({ savedData, savedDataRef }) => {
  return (
    <div ref={savedDataRef} className="grid grid-cols-3 gap-4 mb-4">
      {savedData.map((data) => (
        <SavedDataCard
          key={data.code}
          data={data} />
      ))}
    </div>
  );
};

export default SavedData;
