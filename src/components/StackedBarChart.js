import React, { useEffect, useRef } from 'react';
import { timeParse, timeFormat } from 'd3-time-format';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { stack } from 'd3-shape';
import { select } from 'd3-selection';

const StackedBarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log('No data available to draw chart');
      return;
    }

    drawChart(data);
    window.addEventListener('resize', () => drawChart(data));
    return () => window.removeEventListener('resize', () => drawChart(data));
  }, [data]);

  const drawChart = (data) => {
    const svg = select(chartRef.current);
    svg.selectAll('*').remove();

    const containerWidth = chartRef.current?.clientWidth || 500;
    const containerHeight = chartRef.current?.clientHeight || 300;

    const margin = { top: 20, right: 30, bottom: 70, left: 70 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const parseDate = timeParse('%Y-%m-%d');
    const parsedData = data
      .map(d => ({
        ...d,
        date: parseDate(d.date),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const x = scaleBand()
      .domain(parsedData.map((d) => d.date))
      .range([0, width])
      .padding(0.2);

    const y = scaleLinear()
      .domain([0, Math.max(...parsedData.map((d) => d.battles + d.explosions))])
      .nice()
      .range([height, 0]);

    const color = scaleOrdinal()
      .domain(['battles', 'explosions'])
      .range(['#1f77b4', '#ff7f0e']);

    const stackedData = stack().keys(['battles', 'explosions'])(parsedData);

    const barGroups = g.selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', (d) => color(d.key));

    barGroups.selectAll('rect')
      .data((d) => d)
      .enter().append('rect')
      .attr('x', (d) => x(d.data.date))
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

    const tickDates = parsedData
      .filter((d, i) => i % 90 === 0) 
      .map(d => d.date);

    const xAxis = axisBottom(x)
      .tickValues(tickDates)
      .tickFormat(timeFormat('%b %Y'));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '14px')
      .style('fill', '#f5f5f5');

    g.append('g')
      .call(axisLeft(y))
      .selectAll('text')
      .style('font-size', '14px')
      .style('fill', '#f5f5f5');
  };

  return (
    <svg ref={chartRef} style={{ width: '100%', height: '100%' }}>
    </svg>
  );
};

export default StackedBarChart;
