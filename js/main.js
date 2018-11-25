// see final response here:
// https://stackoverflow.com/questions/35608105/how-to-divide-donut-chart-into-fixed-portion

var clockChartMorning;
var clockChartAfternoon;

var treemaps = []

var weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

d3.csv('data/crime_calendar.csv', function(error, data) {
    if (error) throw error;

    weekdays.forEach(function(day) {
        treemaps.push(new Treemap(day, data))
    })
});


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

function updateVisualization(category) {

    // Grab user input and save it to measure attribute
    clockChartMorning.measure = category;
    clockChartAfternoon.measure = category;

    // update visual
    clockChartMorning.wrangleData();
    clockChartAfternoon.wrangleData();


};
