import React from 'react';
import * as d3 from "d3";

const BarChart = ({dataset}) => {
  const doThing = (event) => {
    alert("hi");
  };

  const width = 960;
  const height = 500;

  const maxDatum = d3.max(dataset, (d) => +d.value); // (dataset.map(datum => datum.value));

  const y = d3.scaleLinear()
    .domain([0, maxDatum])
    .range([height, 0]);

  const barWidth = width / dataset.length;


  const bars = dataset.map(({name, value}, i) => (
    <g transform={`translate(${i * barWidth}, 0)`} key={name}>
      <rect y={y(value)} height={height - y(value)} width={barWidth - 1} />
    </g>
  ));

  return (
    <svg width={width} height={height}>
      {bars}
    </svg>
  )
}

BarChart.propTypes = {
  dataset: React.PropTypes.array.isRequired
};

export default BarChart;
