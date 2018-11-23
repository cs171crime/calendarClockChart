// Data in 
// data/NewUpdatedData/DrugsByhour.csv
// ... /DrugsDAY_OF_WEEK.csv

var clockChart;

d3.csv("data/NewUpdatedData/DrugsByhour.csv", function(data) {

    console.log(data);

    clockChart = new Clockchart("#clock-chart", data);

});