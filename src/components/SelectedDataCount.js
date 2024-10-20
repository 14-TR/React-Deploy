import React from 'react';

function SelectedDataCount({ selectedData }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '5px',
        right: '20px',
        backgroundColor: '#2e2e2e',
        padding: '3px',
        borderRadius: '3px',
        color: '#f5f5f5',
        border: '1px solid #f5f5f5',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h4>Event Count in Selected Items</h4>
      <p>{selectedData.length}</p>
    </div>
  );
}

export default SelectedDataCount;
