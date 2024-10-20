import React from 'react';

function SelectedDataCount({ selectedData }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#2e2e2e',
        padding: '10px',
        borderRadius: '8px',
        color: '#f5f5f5',
        border: '1px solid #f5f5f5',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h4>Selected Data</h4>
      <p>{selectedData.length} items selected</p>
    </div>
  );
}

export default SelectedDataCount;
