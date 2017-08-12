var Highcharts = require('highcharts')
window.$ = require("jquery")

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

//
var inOndo = []
var arrayOfDate = []


$("#sekisanNav").click(function(){
  // show current pane
  hideOtherPaneSekisan()

  // set default fromDate to last month and toDate to today
  var fromDate = moment().subtract(1, 'months').format("YYYY/MM/DD")
  var toDate = moment().add(1, "days").format("YYYY/MM/DD")

  $("#sekisan_fromdate").val(moment(fromDate).format("YYYY-MM-DD"))
  $("#sekisan_todate").val(moment().format("YYYY-MM-DD"))
  
  var dateObject = { "fromDate": fromDate, "toDate":toDate}
  requestAndShowSekisanGraph(dateObject)
	

})

$("#sekisan-kousin").click(() => {
  var fromDate = moment($("#sekisan_fromdate").val()).format("YYYY/MM/DD")
  var toDate = moment($("#sekisan_todate").val()).add(1, "days").format("YYYY/MM/DD")
  // GET tomorrow date using moment.js, coz mongodb will not includ toDate, so we hv to +1day
  //var toDate = moment().add(1, "days").format("YYYY/MM/DD")
  // GET last month date in string, using moment.js
  //var fromDate = moment().subtract(1, 'months').format("YYYY/MM/DD")

  var dateObject = { "fromDate": fromDate, "toDate":toDate}

  console.log("dateObject: ", dateObject)
  //
  requestAndShowSekisanGraph(dateObject)
})


var hideOtherPaneSekisan = () => {
	// HIDE other pane
  $('#weekPane').hide()
  $('#monthPane').hide()
  $("#dayPane").hide()
  $("#nisshoujikanPane").hide()
  $("#threemonthsPane").hide()
  $("#sekisanPane").show()

}



// Request and show Graph
var requestAndShowSekisanGraph = (dateObject) => {
  console.log("HERE")

	// Post: get tenMin data by date from user
  $.post(url+":30000/getSekisanOndo", dateObject, function(data){

      // init data
      reset_sekisanGraph()

      console.log(data)

      arrayOfDate = data.arrayOfDate
      var sekisanOndoByDate = data.sekisanOndoByDate
      for(var i=0; i<arrayOfDate.length; i++){

        inOndoData = sekisanOndoByDate[arrayOfDate[i]]
        inOndo.push(inOndoData)
      }

      console.log("arrayOfDate: ", arrayOfDate)
      console.log("inOndo: ", inOndo)

      // call graph
      initSekisanOndoGraph()
    
    

  })

}

var initSekisanOndoGraph = () => {
  sekisanOndoChart(inOndo, arrayOfDate)
}

// reset graph
var reset_sekisanGraph = () => {
  inOndo = []
  arrayOfDate = []
}

//Create sekisanondo graph
var sekisanOndoChart = function(inOndo, xUnit){
  Highcharts.setOptions({
    colors: ['#ff471a'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('sekisanOndoChart', {
     chart: {
         type: 'area',
         },
     legend:{
      enabled: true,
      verticalAlign: "top"
     },
     title: {
         text: ""
     },
     xAxis: {
       categories: xUnit,
      // labels: {
      //     // New added
      //     formatter: function(){
      //       return xUnit[this.value]
      //   },
      //   align: "right",
      //   rotation: -45
      // },
       tickInterval: 1
     },
     yAxis: {
       title: {
         text: ""
       }
     },
     plotOptions: {
      series: {
        fillOpacity: 0.2
      }
     },
     series: [{
         name:"積算温度",
         data: inOndo,
         marker: {
          enabled: false
      }
     }]

  });
}
