
/*
 * Clockchart - Object constructor function
 * @param _parentElement -- the HTML element in which to draw the line chart
 * @param _data	-- the data
 */

Clockchart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.measure = "HeroinCrimes";

    // set up the clock look
    this.tickLength = 10;

     this.getCoordFromCircle = function(deg, cx, cy, r) {
         var rad = degToRad(deg);
         var x = cx + r * Math.cos(rad);
         var y = cy + r * Math.sin(rad);
         return [x, y];
     };
     this.splitDegrees = function(num) {
        var angle = circleDegree / num;
        var degrees = [];

        for (var ang = 0; ang < circleDegree; ang += angle) {
            degrees.push(ang);
        }

        return degrees;
    };

    this.initVis();
};


Clockchart.prototype.initVis = function() {
    var vis = this;

    // SVG drawing area
    vis.height = 500;
    vis.width = 500;
    vis.radius = 200;
    vis.p = Math.PI * 2;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width);


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
            return d.angle;
        });

    vis.arcs = vis.g.selectAll(".arc")
        .data(vis.clock(vis.data))
        .enter()
        .append("g")
        .attr("class", "arc")




    // call wrangleData
    vis.wrangleData();
};


Clockchart.prototype.wrangleData = function() {
    var vis = this;

    // Update color scale
    vis.maxForColorScale = d3.max(vis.data, function(d) { return d[vis.measure]; });

    console.log(vis.maxForColorScale);

    vis.color = d3.scaleLinear()
        .domain([0, vis.maxForColorScale]);
    if (vis.measure == "HeroinCrimes") {
        vis.color.range(["white","red"]);
    }
    else if (vis.measure == "WeedCrimes") {
        vis.color.range(["white","green"]);
    }

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

    vis.g.append('g')
        .attr('class', 'ticks')
        .selectAll('path')
        .data(splitDegrees(12))
        .enter()
        .append('path')
        .attr('d', function(d) {
            var coord = {
                outer: getCoordFromCircle(d, 0, 0, vis.radius),
                inner: getCoordFromCircle(d, 0, 0, vis.radius - vis.tickLength)
            };
            return 'M' + coord.outer[0] + ' ' + coord.outer[1] + 'L' + coord.inner[0] + ' ' + coord.inner[1] + 'Z';
        })
        .attr('stroke', 'black');
};


// trial
function getCoordFromCircle(deg, cx, cy, r) {
    var rad = degToRad(deg);
    var x = cx + r * Math.cos(rad);
    var y = cy + r * Math.sin(rad);
    return [x, y];
}

function splitDegrees(num) {
    var angle = circleDegree / num;
    var degrees = [];

    for (var ang = 0; ang < circleDegree; ang += angle) {
        degrees.push(ang);
    }

    return degrees;
}



