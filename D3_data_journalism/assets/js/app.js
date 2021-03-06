var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var dotradius = 10
var labelArea = 100
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.smokes)])  //d3.min(healthData, d => d.smokes)
      .range([margin.left+labelArea, width-margin.right]);  //100==labelArea

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d.obesity), d3.max(healthData, d => d.obesity)])
      .range([height - margin.top-labelArea, margin.top]);
      //.range(height-margin.top-100, margin.bottom )


    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(-100, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .attr("transform", `translate(0, 0)`)
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    //create <g>....</g> container for circles and labels
    var dotsLabeled = svg.selectAll("dotsLabeled")
      .data(healthData)
      .enter()
      .append("g");

   //create filled circles on scatterplot   

    dotsLabeled.append("circle")
      .attr("class", "stateCircle")
      .attr("r", dotradius)
      .attr("cx", d => xLinearScale(d.smokes))
      .attr("cy", d => yLinearScale(d.obesity))
      //.attr("opacity", ".9")
      ;       

 //label the circles
    dotsLabeled.append("text")
      .text(d=>d.abbr)
      .attr("class", "stateText")
      .attr("font-size", dotradius)
      .attr("x", d => xLinearScale(d.smokes))
      //shift label down so that it centers in circle
      .attr("y", d => yLinearScale(d.obesity)+dotradius/4);



    //
    




    // // Step 6: Initialize tool tip
    // // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>Smoking Rate: ${d.smokes}<br>Obesity: ${d.obesity}`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("click", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });

    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Rate of Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Smoking Rate(%)");
  }).catch(function(error) {
    console.log(error);
  });
