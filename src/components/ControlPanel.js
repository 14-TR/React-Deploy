import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import SliderControl from './SliderControl';

const ControlPanel = ({
  radius,
  setRadius,
  upperPercentile,
  setUpperPercentile,
  coverage,
  setCoverage,
  brushingEnabled,
  setBrushingEnabled,
  brushingRadius,
  setBrushingRadius,
  showHexControls,
  setShowHexControls,
  showBattlesLayer,
  setShowBattlesLayer,
  showExplosionsLayer,
  setShowExplosionsLayer,
  showChart,
  setShowChart,
}) => {

  const handleRadiusChange = (newValue) => {
    if (typeof newValue === 'number') {
      setRadius(newValue);
    }
  };

  const handleUpperPercentileChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setUpperPercentile([newValue[0], newValue[1]]);
    }
  };

  const handleCoverageChange = (newValue) => {
    if (typeof newValue === 'number') {
      setCoverage(newValue);
    }
  };

  const handleBrushingRadiusChange = (newValue) => {
    if (typeof newValue === 'number') {
      setBrushingRadius(newValue);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#f5f5f5',
        padding: '10px',
        borderRadius: '8px',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,  
      }}
    >
      {/* Toggle Hex Controls */}
      <ToggleSwitch
        label="Show Hex Controls"
        checked={showHexControls}
        onChange={(checked) => setShowHexControls(checked)}
      />

      {showHexControls && (
        <>
          {/* Layer Visibility Switches */}
          <ToggleSwitch
            label="Show Battles Layer"
            checked={showBattlesLayer}
            onChange={(checked) => setShowBattlesLayer(checked)}
          />
          <ToggleSwitch
            label="Show Explosions Layer"
            checked={showExplosionsLayer}
            onChange={(checked) => setShowExplosionsLayer(checked)}
          />

          {/* Radius Slider */}
          <SliderControl
            label={`Radius: ${radius} meters`}
            value={radius}
            min={100}
            max={20000}
            step={100}
            onChange={handleRadiusChange}
          />

          {/* Percentile Range Slider */}
          <SliderControl
            label={`Percentile Range: ${upperPercentile[0]}% - ${upperPercentile[1]}%`}
            value={upperPercentile}
            min={0}
            max={100}
            step={1}
            onChange={handleUpperPercentileChange}
            isRange={true}
          />

          {/* Coverage Slider */}
          <SliderControl
            label={`Coverage: ${coverage}`}
            value={coverage}
            min={0}
            max={1}
            step={0.01}
            onChange={handleCoverageChange}
          />
        </>
      )}

      {/* Brushing Controls */}
      <ToggleSwitch
        label="Enable Brushing"
        checked={brushingEnabled}
        onChange={(checked) => setBrushingEnabled(checked)}
      />

      {brushingEnabled && (
        <SliderControl
          label={`Brushing Radius: ${brushingRadius} meters`}
          value={brushingRadius}
          min={100}
          max={100000}
          step={1000}
          onChange={handleBrushingRadiusChange}
        />
      )}

      {/* Add ToggleSwitch for showing/hiding the chart */}
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
        <ToggleSwitch
          label="Analysis Chart"
          checked={showChart}
          onChange={(checked) => setShowChart(checked)}  // Toggle chart visibility
        />
      </div>
    </div>
  );
};

export default ControlPanel;
