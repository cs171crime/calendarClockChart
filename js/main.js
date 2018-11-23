// Data in 
// data/NewUpdatedData/DrugsByhour.csv
// ... /DrugsDAY_OF_WEEK.csv

// see final response here:
// https://stackoverflow.com/questions/35608105/how-to-divide-donut-chart-into-fixed-portion

var clockChartMorning;
var clockChartAfternoon;

d3.csv("data/NewUpdatedData/DrugsByhour.csv", function(data) {

    data.forEach(function(d) {
        d.hourofday = +d.hourofday;
        d.HeroinCrimes = +d.HeroinCrimes;
        d.WeedCrimes = +d.WeedCrimes;
        d.angle = +d.angle;
    });

    var morning = [];
    var afternoon = [];

    for (var i = 0; i < data.length; i++) {
        if (i < data.length/2) { morning.push(data[i]) }
        else { afternoon.push(data[i]) }
    }

    clockChartMorning = new Clockchart("#clock-chart-morning", morning);

    clockChartAfternoon = new Clockchart("#clock-chart-afternoon", afternoon)

});
