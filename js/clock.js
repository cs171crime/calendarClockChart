
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

    // first cut using generic params from here: http://bl.ocks.org/enjalot/1203641
    vis.w = 300;
    vis.h = 300;
    vis.r = 100;
    vis.color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888"]);

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .data(vis.data)
        .attr("width", vis.w)
        .attr("height", vis.h)
        .append("g")
        .attr("transform", "translate(" + vis.r + "," + vis.r + ")");

    vis.arc = d3.arc()
        .outerRadius(vis.r)
        .innerRadius(0);

    vis.clock = d3.pie()
        .value(function(d) { return d[vis.measure]; });

    // call wrangleData
    vis.wrangleData();
};


Clockchart.prototype.wrangleData = function() {
    var vis = this;

    vis.arcs = vis.svg.selectAll("slice")
        .data(vis.clock)
        .enter()
        .append("g")
        .attr("class", "slice");

    // call updateVis
    vis.updateVis();
};


Clockchart.prototype.updateVis = function() {
    var vis = this;

    vis.arcs.append("path")
        .attr("fill", function(d, i) { return vis.color(i); } )
        .attr("d", vis.arc);
};









