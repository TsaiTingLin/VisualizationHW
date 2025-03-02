import * as d3 from 'd3';

// Sample data
const data = [
  {name: "A", value: 5},
  {name: "B", value: 10},
  {name: "C", value: 15},
  {name: "D", value: 20},
  {name: "E", value: 25}
];

// Set dimensions and margins
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const x = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .nice()
  .range([height, 0]);

// Add x-axis
svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

// Add y-axis
svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y));

// Add bars
svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.name))
  .attr("y", d => y(d.value))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.value));