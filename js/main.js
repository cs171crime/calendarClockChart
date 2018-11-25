// Data in 
// data/NewUpdatedData/DrugsByhour.csv
// ... /DrugsDAY_OF_WEEK.csv

// see final response here:
// https://stackoverflow.com/questions/35608105/how-to-divide-donut-chart-into-fixed-portion

var clockChartMorning;
var clockChartAfternoon;

d3.csv("data/NewUpdatedData/DrugsByhour.csv", function(data) {

    // Data processing
    data.forEach(function(d) {
        d.hourofday = +d.hourofday;
        d.HeroinCrimes = +d.HeroinCrimes;
        d.WeedCrimes = +d.WeedCrimes;
        d.angle = +d.angle;
    });

    // Put data in right form
    var morning = [];
    var afternoon = [];

    for (var i = 0; i < data.length; i++) {
        if (i < data.length/2) { morning.push(data[i]) }
        else { afternoon.push(data[i]) }
    }

    // Sanity check
    console.log("morning");
    console.log(morning);
    console.log("afternoon");
    console.log(afternoon);

    // instantiate charts
    clockChartMorning = new Clockchart("#clock-chart-morning", morning);
    clockChartAfternoon = new Clockchart("#clock-chart-afternoon", afternoon)

    // update charts
    d3.select("#var").on("change", updateVisualization);

});

function updateVisualization() {

    // Grab user input and save it to measure attribute
    clockChartMorning.measure = d3.select("#var").property("value");
    clockChartAfternoon.measure = d3.select("#var").property("value");

    // update visual
    clockChartMorning.wrangleData();
    clockChartAfternoon.wrangleData();


};

// ticks for clock
var clockGroup, fields, formatHour, formatMinute, formatSecond, height, offSetX, offSetY, pi, render, scaleHours, scaleSecsMins, vis, width;


var fromClock = 9;
var toClock = 6;

var radius = 80;
var tickLength = 10;
var circleDegree = 360;

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function clockToRad(clock, direction) {
    var unit = circleDegree / 12;
    var degree = direction > 0 ? unit * clock : unit * clock - circleDegree;
    return degToRad(degree);
}

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


formatSecond = d3.timeFormat("%S");

formatMinute = d3.timeFormat("%M");

formatHour = d3.timeFormat("%H");

fields = function() {
    var d, data, hour, minute, second;
    d = new Date();
    second = d.getSeconds();
    minute = d.getMinutes();
    hour = d.getHours() + minute / 60;
    return data = [{
        "unit": "seconds",
        "text": formatSecond(d),
        "numeric": second
    }, {
        "unit": "minutes",
        "text": formatMinute(d),
        "numeric": minute
    }, {
        "unit": "hours",
        "text": formatHour(d),
        "numeric": hour
    }];
};

width = 400;

height = 200;

offSetX = 100;

offSetY = 100;

pi = Math.PI;

scaleSecsMins = d3.scaleLinear()
    .domain([0, 59 + 59 / 60])
    .range([0, 2 * pi]);

scaleHours = d3.scaleLinear()
    .domain([0, 11 + 59 / 60])
    .range([0, 2 * pi]);

vis = d3.selectAll("body")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

clockGroup = vis.append("svg:g")
    .attr("transform", "translate(" + offSetX + "," + offSetY + ")");

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle(clockToRad(fromClock, -1))
    .endAngle(clockToRad(toClock, 1));

clockGroup.append('path')
    .attr('d', arc)
    .style('fill', 'orange');

clockGroup.append("svg:circle")
    .attr("r", radius)
    .attr("fill", "none")
    .attr("class", "clock outercircle")
    .attr("stroke", "black")
    .attr("stroke-width", 2);


clockGroup.append('g')
    .attr('class', 'ticks')
    .selectAll('path')
    .data(splitDegrees(12))
    .enter()
    .append('path')
    .attr('d', function(d) {
        var coord = {
            outer: getCoordFromCircle(d, 0, 0, radius),
            inner: getCoordFromCircle(d, 0, 0, radius - tickLength)
        };
        return 'M' + coord.outer[0] + ' ' + coord.outer[1] + 'L' + coord.inner[0] + ' ' + coord.inner[1] + 'Z';
    })
    .attr('stroke', 'black');



clockGroup.append("svg:circle")
    .attr("r", 4)
    .attr("fill", "black")
    .attr("class", "clock innercircle");



render = function(data) {
    var hourArc, minuteArc, secondArc;
    clockGroup.selectAll(".clockhand").remove();
    secondArc = d3.arc()
        .innerRadius(0)
        .outerRadius(70)
        .startAngle(function(d) {
            return scaleSecsMins(d.numeric);
        }).endAngle(function(d) {
            return scaleSecsMins(d.numeric);
        });

    minuteArc = d3.arc()
        .innerRadius(0)
        .outerRadius(70)
        .startAngle(function(d) {
            return scaleSecsMins(d.numeric);
        })
        .endAngle(function(d) {
            return scaleSecsMins(d.numeric);
        });

    hourArc = d3.arc()
        .innerRadius(0)
        .outerRadius(50)
        .startAngle(function(d) {
            return scaleHours(d.numeric % 12);
        }).endAngle(function(d) {
            return scaleHours(d.numeric % 12);
        });

    clockGroup.selectAll(".clockhand")
        .data(data)
        .enter()
        .append("svg:path")
        .attr("d", function(d) {
            if (d.unit === "seconds") {
                //return secondArc(d);
            } else if (d.unit === "minutes") {
                return minuteArc(d);
            } else if (d.unit === "hours") {
                return hourArc(d);
            }
        })
        .attr("class", "clockhand")
        .attr("stroke", "black")
        .attr("stroke-width", function(d) {
            if (d.unit === "seconds") {
                return 2;
            } else if (d.unit === "minutes") {
                return 3;
            } else if (d.unit === "hours") {
                return 3;
            }
        })
        .attr("fill", "none");
};

setInterval(function() {
    var data;
    data = fields();
    return render(data);
}, 1000);
