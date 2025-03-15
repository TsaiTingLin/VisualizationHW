import * as d3 from 'd3';

// Set dimensions and margins
const margin = {top: 20, right: 20, bottom: 30, left: 300};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create legend
const legend = d3.select("#legend")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", 50)
  .append("g")
  .attr("transform", `translate(${(width + margin.left + margin.right) / 2 - 100}, 10)`);

legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#1f77b4");

legend.append("text")
  .attr("x", 30)
  .attr("y", 15)
  .text("COSCUP 2024 各開源社群議程數");

// Fetch JSON data
fetch('https://coscup.org/2024/json/session.json')
  .then(response => response.json())
  .then(data => {
    const sessions = data.sessions;
    const sessionTypes = data.session_types;

    // Create a map of type ID to zh name
    const typeMap = new Map(sessionTypes.map(type => [type.id, type.zh.name]));

    // Count occurrences of each type
    const typeCounts = d3.rollup(sessions, v => v.length, d => d.type);
    const typeData = Array.from(typeCounts, ([type, count]) => ({
      type: typeMap.get(type),
      count
    }));

    // Sort data by count in descending order
    typeData.sort((a, b) => b.count - a.count);

    // Create scales
    const y = d3.scaleBand()
      .domain(typeData.map(d => d.type))
      .range([0, height])
      .padding(0.2); // Increase spacing between bars

    const x = d3.scaleLinear()
      .domain([0, d3.max(typeData, d => d.count)])
      .nice()
      .range([0, width]);

    // Add y-axis
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("class", "community-name");

    // Add x-axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add bars
    svg.selectAll(".bar")
      .data(typeData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.type))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.count))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#ff7f0e");
        d3.selectAll(".community-name").filter(function(name) {
          return name === d.type;
        }).attr("fill", "#ff7f0e");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("fill", "#1f77b4");
        d3.selectAll(".community-name").filter(function(name) {
          return name === d.type;
        }).attr("fill", "#333");
      });



    // Add top label to the right of the top three bars
    svg.selectAll(".label")
      .data(typeData.slice(0, 1))
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.count) + 5)
      .attr("y", d => y(d.type) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text(d => d.count);

  })
  .catch(error => console.error('Error loading JSON:', error));