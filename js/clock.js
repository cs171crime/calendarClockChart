
/*
 * Clockchart - Object constructor function
 * @param _parentElement -- the HTML element in which to draw the line chart
 * @param _data	-- the data
 */

Clockchart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.measure = "HeroinCrimes";

    this.initVis();
};


Clockchart.prototype.initVis = function() {
    var vis = this;

    // SVG drawing area
    vis.height = 1000;
    vis.width = 1000;
    vis.radius = 200;
    vis.p = Math.PI * 2;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width);

    vis.color = d3.scaleLinear()
        .range(["white", "red"]);


    vis.g = vis.svg.append("g")
        .attr("transform", "translate(200,200)");

    vis.arc = d3.arc()
        .innerRadius(0)
        .outerRadius(vis.radius)
        //.startAngle(0)
        .endAngle(vis.p);


    vis.clock = d3.pie()
        .sort(null)
        .value(function(d) {
            //return d.value
            return d.angle;
        });

    vis.arcs = vis.g.selectAll(".arc")
        .data(vis.clock(vis.data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .style('stroke','white')




    // call wrangleData
    vis.wrangleData();
};


Clockchart.prototype.wrangleData = function() {
    var vis = this;

    // Update color domain
    vis.maxForColorScale = d3.max(vis.data, function(d) { return d[vis.measure]; });
    vis.color.domain([0, vis.maxForColorScale]);

    // call updateVis
    vis.updateVis();
};


Clockchart.prototype.updateVis = function() {
    var vis = this;

    vis.arcs.append("path")
        .attr("d", vis.arc)
        .style("fill", function(d) {
            return vis.color(d.data.HeroinCrimes);
        });
};









