import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { INITIAL_VIEW_STATE } from './config/mapConfig';
import { CSVLoader } from '@loaders.gl/csv';
import { load } from '@loaders.gl/core';  
import ControlPanel from './components/ControlPanel';
import { createLayers } from './utils/layerCreator'; 
import { calculateStatistics } from './utils/calculateStatistics';
import StatisticsArea from './components/StatisticsArea';
import StackedBarChart from './components/StackedBarChart';
import { aggregateDataByDate } from './utils/aggregateDataByDate';  
import SelectedDataCount from './components/SelectedDataCount';


const BATTLES_DATA_URL = 'https://raw.githubusercontent.com/14-TR/data/main/acled_data_battles.csv';
const EXPLOSIONS_DATA_URL = 'https://raw.githubusercontent.com/14-TR/data/main/acled_data_explosions.csv';
// const VIIRS_DATA_URL = 'https://raw.githubusercontent.com/14-TR/data/main/viirs_2012-2020.csv';


export default function App() {
  const [battlesData, setBattlesData] = useState([]);
  const [explosionsData, setExplosionsData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);  // State for selected data
  const [radius, setRadius] = useState(1000);
  const [upperPercentile, setUpperPercentile] = useState([0, 100]);
  const [coverage, setCoverage] = useState(1);
  const [brushingEnabled, setBrushingEnabled] = useState(false);
  const [brushingRadius, setBrushingRadius] = useState(10000);
  const [showHexControls, setShowHexControls] = useState(false);
  const [showBattlesLayer, setShowBattlesLayer] = useState(true);
  const [showExplosionsLayer, setShowExplosionsLayer] = useState(true);
  const [battlesStatistics, setBattlesStatistics] = useState({});
  const [explosionsStatistics, setExplosionsStatistics] = useState({});
  const [tooltip, setTooltip] = useState(null);
  const [aggregatedData, setAggregatedData] = useState([]);  
  const [showChart, setShowChart] = useState(false);  
  const deckRef = useRef(null);

  // Fetch data from URL and set it to state
  const fetchData = useCallback(async (url, setData) => {
    try {
      const result = await load(url, CSVLoader);
      const parsedData = result?.data || [];
      setData(
        parsedData.map((row) => ({
          id: row.event_id_cnty,
          longitude: parseFloat(row.longitude),
          latitude: parseFloat(row.latitude),
          event_date: new Date(row.event_date),
          fatalities: parseInt(row.fatalities, 10) || 0,
        }))
      );
    } catch (error) {
      console.error(`Error loading data from ${url}:`, error);
    }
  }, []);

  useEffect(() => {
    fetchData(BATTLES_DATA_URL, setBattlesData);
    fetchData(EXPLOSIONS_DATA_URL, setExplosionsData);
  }, [fetchData]);

  // Handle interaction on the map
  const handleInteraction = useCallback(async (x, y) => {
    if (deckRef.current) {
      const selectionRadius = brushingEnabled ? brushingRadius : 0;

      const results = await deckRef.current.pickMultipleObjects({
        x,
        y,
        radius: selectionRadius,
        layerIds: ['battles', 'explosions'],
      });

      let selectedBattles = [];
      let selectedExplosions = [];

      results.forEach((result) => {
        if (result.object?.points) {
          const points = result.object.points.map((p) => p.source);
          if (result.layer.id === 'battles') {
            selectedBattles.push(...points);
          } else if (result.layer.id === 'explosions') {
            selectedExplosions.push(...points);
          }
        }
      });

      setSelectedData([...selectedBattles, ...selectedExplosions]);  // Update selected data
      setBattlesStatistics(calculateStatistics(selectedBattles));
      setExplosionsStatistics(calculateStatistics(selectedExplosions));
      setAggregatedData(aggregateDataByDate(selectedBattles, selectedExplosions));
    }
  }, [brushingEnabled, brushingRadius]);

  const layers = useMemo(() => {
    return createLayers({
      battlesData,
      explosionsData,
      radius,
      upperPercentile,
      coverage,
      brushingEnabled,
      brushingRadius,
      showBattlesLayer,
      showExplosionsLayer,
      handleInteraction,
      setTooltip,
    });
  }, [
    battlesData,
    explosionsData,
    radius,
    upperPercentile,
    coverage,
    brushingEnabled,
    brushingRadius,
    showBattlesLayer,
    showExplosionsLayer,
    handleInteraction,
  ]);

  return (
    <div>
      <DeckGL ref={deckRef} layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true}>
        <Map reuseMaps mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
      </DeckGL>

      {tooltip && tooltip.object && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '5px',
            borderRadius: '3px',
            pointerEvents: 'none',
          }}
        >
          <div>Events: {tooltip.object.points.length}</div>
          <div>Layer: {tooltip.layer.id}</div>
        </div>
      )}

      <StatisticsArea battlesStatistics={battlesStatistics} explosionsStatistics={explosionsStatistics} />

      {showChart && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#2e2e2e',
            padding: '10px',
            width: '33.33vw',
            height: '40vh',
            overflow: 'hidden',
            color: '#f5f5f5',
            display: 'flex',
            border: '1px solid #f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <StackedBarChart data={aggregatedData} />
        </div>
      )}

      <ControlPanel
        radius={radius}
        setRadius={setRadius}
        upperPercentile={upperPercentile}
        setUpperPercentile={setUpperPercentile}
        coverage={coverage}
        setCoverage={setCoverage}
        brushingEnabled={brushingEnabled}
        setBrushingEnabled={setBrushingEnabled}
        brushingRadius={brushingRadius}
        setBrushingRadius={setBrushingRadius}
        showHexControls={showHexControls}
        setShowHexControls={setShowHexControls}
        showBattlesLayer={showBattlesLayer}
        setShowBattlesLayer={setShowBattlesLayer}
        showExplosionsLayer={showExplosionsLayer}
        setShowExplosionsLayer={setShowExplosionsLayer}
        battlesStatistics={battlesStatistics}
        explosionsStatistics={explosionsStatistics}
        showChart={showChart}
        setShowChart={setShowChart}
      />

      {/* Display the count of selected data items in the bottom-right corner */}
      <SelectedDataCount selectedData={selectedData} />
    </div>
  );
}

export function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);
}
