// Level 1: D3 Dabbler

// You need to create a scatter plot between two of the data variables such as Healthcare vs. Age or Smokers vs. Poverty.
// FD: poverty versus healthcare chosen. All number variables parsed out for reference only.

// Using the D3 techniques we taught you in class, create a scatter plot that represents each state with circle elements. You'll code this graphic in the app.js file of your homework directory—make sure you pull in the data from data.csv by using the d3.csv function. Your scatter plot should ultimately appear like the image at the top of this section.


// Include state abbreviations in the circles.
// Create and situate your axes and labels to the left and bottom of the chart.
// Note: You'll need to use python -m http.server to run the visualization. This will host the page at localhost:8000 in your web browser.

// ==============================
// Level 2: Impress the Boss (Optional Challenge Assignment)

// FD: Not done as this seemed to adversely affect scoring on prior assignment. I will do this functionality as part of the project.
// ==============================
// FD: a little extra playing around with showing words through SVG setup and jumbotron header setup in line with previous homework assignments
// ==============================

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Health Risks Demographics Data
d3.csv("assets/data/data.csv")
    .then(function (hrd) {
        // console.log(hrd); // specifically left in to allow for troubleshooting if this code is used for other activities
        // Step 1: Parse Data/Cast as numbers
        // ==============================
        hrd.forEach(function (data) {
            data.poverty = parseFloat(data.poverty);
            data.povertyMoe = parseFloat(data.povertyMoe);
            data.age = parseFloat(data.age);
            data.ageMoe = parseFloat(data.ageMoe);
            data.income = parseFloat(data.income);
            data.incomeMoe = parseFloat(data.incomeMoe);
            data.healthcare = parseFloat(data.healthcare);
            data.healthcareLow = parseFloat(data.healthcareLow);
            data.healthcareHigh = parseFloat(data.healthcareHigh);
            data.obesity = parseFloat(data.obesity);
            data.obesityLow = parseFloat(data.obesityLow);
            data.obesityHigh = parseFloat(data.obesityHigh);
            data.smokes = parseFloat(data.smokes);
            data.smokesLow = parseFloat(data.smokesLow);
            data.smokesHigh = parseFloat(data.smokesHigh);
        });
        // console.log(hrd); // specifically left in to allow for troubleshooting if this code is used for other activities

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(hrd, d => d.poverty)*0.9, d3.max(hrd, d => d.poverty)*1.1])
            .range([0, width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(hrd, d => d.healthcare)*0.9, d3.max(hrd, d => d.healthcare)*1.1])
            .range([height, 0]);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Step 5a: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(hrd)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "blue")
            .attr("opacity", ".5");

        // Step 5b: Create Circle Texts
        // ==============================
        var statesGroup = chartGroup.selectAll("stateText")
            .data(hrd)
            .enter()
            .append("text")
            .attr("x", d => (xLinearScale(d.poverty)-8)) // adjusted for radius
            .attr("y", d => (yLinearScale(d.healthcare)+5)) // adjusted for radius
            .attr("fill","white")
            .attr("font-size",12)
            // .attr("class","text-primary")
            .text(d => d.abbr);

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");
    });
