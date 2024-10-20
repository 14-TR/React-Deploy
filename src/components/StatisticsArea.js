import StatisticsDisplay from './StatisticsDisplay';

const StatisticsArea = ({ battlesStatistics, explosionsStatistics }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#f5f5f5',
        display: 'flex',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #f5f5f5',  
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Battles Statistics */}
      <div style={{ marginRight: '20px' }}>
        <StatisticsDisplay title="Battles Statistics" statistics={battlesStatistics} />
      </div>

      {/* Explosions Statistics */}
      <div>
        <StatisticsDisplay title="Explosions Statistics" statistics={explosionsStatistics} />
      </div>
    </div>
  );
};

export default StatisticsArea;
