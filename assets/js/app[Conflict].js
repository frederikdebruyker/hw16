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
        // console.log(hrd);
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
        // console.log(hrd);

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(hrd, d => d.poverty)*0.8, d3.max(hrd, d => d.poverty)])
            .range([0, width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(hrd, d => d.healthcare)*0.8, d3.max(hrd, d => d.healthcare)])
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

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(hrd)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "blue")
            .attr("opacity", ".5")
            // .attr("text", d.state)
            .attr();
            // .append("text")
            // .text(d => d.state)
            // .attr('x', d => d.poverty)
            // .attr('y', d => d.healthcare);

        // Step 6: Initialize tool tip
        // ==============================
        // var toolTip = d3.tip()
        //     .attr("class", "tooltip")
        //     .offset([80, -60])
        //     .html(function (d) {
        //         return (`${d.state}<br>Hair length: ${d.poverty}<br>Hits: ${d.healthcare}`);
        //     });

        // Step 7: Create tooltip in the chart
        // ==============================
        // chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function (data) {
            toolTip.show(data, this);
        })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

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
