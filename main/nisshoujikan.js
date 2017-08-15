var Highcharts = require('highcharts')
window.$ = require("jquery")

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

//
var shoudoJikan = []
var arrayOfNishouDate = []

$("#nisshoujikanNav").click(function(){
  // show current pane
  hideOtherPaneNisshoujikan()	

	
  // set default fromDate to last month and toDate to today
  var fromDate = moment().subtract(1, 'months').format("YYYY/MM/DD")
  var toDate = moment().add(1, "days").format("YYYY/MM/DD")

  $("#nisshou_fromdate").val(moment(fromDate).format("YYYY-MM-DD"))
  $("#nisshou_todate").val(moment().format("YYYY-MM-DD"))
  
  var dateObject = { "fromDate": fromDate, "toDate":toDate}
  console.log("dateObject: ", dateObject)

  requestAndShowNishoudoGraph(dateObject)

})

// nisshoujikan graph kousin button
$("#nishou-kousin").click(() => {

  var fromDate = moment($("#nisshou_fromdate").val()).format("YYYY/MM/DD")
  var toDate = moment($("#nisshou_todate").val()).add(1, "days").format("YYYY/MM/DD")

  var dateObject = { "fromDate": fromDate, "toDate":toDate}

  console.log("dateObject: ", dateObject)


  //
  requestAndShowNishoudoGraph(dateObject)

})

var hideOtherPaneNisshoujikan = () => {
	// HIDE other pane
  $('#weekPane').hide()
  $('#monthPane').hide()
  $("#dayPane").hide()
  $("#sekisanPane").hide()
  $("#threemonthsPane").hide()
  $("#nisshoujikanPane").show()
 
}


//
var requestAndShowNishoudoGraph = (dateObject) => {
		// Post: get tenMin data by date from user
  $.post(url+":30000/getNisshoudojikan", dateObject, function(data){

      // init data
      reset_ShoudojikanGraph()

      console.log(data)

      arrayOfNishouDate = data.arrayOfNishouDate
      var NishoujikanByDate = data.NishoujikanByDate
      for(var i=0; i<arrayOfNishouDate.length; i++){

        var shoudoData = NishoujikanByDate[arrayOfNishouDate[i]]
        shoudoJikan.push(shoudoData)
      }

      console.log("arrayOfNishouDate: ", arrayOfNishouDate)
      console.log("shoudoJikan: ", shoudoJikan)

      //call graph
      initShoudoJikanGraph()

  })

}



// reset graph
var reset_ShoudojikanGraph = () => {
  shoudoJikan = []
  arrayOfNishouDate = []
}

//
var initShoudoJikanGraph = () => {
  nishoudoJikaChart(shoudoJikan, arrayOfNishouDate)
}


//Create sekisanondo graph
var nishoudoJikaChart = function(shoudoJikan, xUnit){
  Highcharts.setOptions({
    colors: ['#ff471a'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('nisshoujikanChart', {
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
       //categories: xUnit,
       tickInterval: 1,
       labels: {
          formatter: function(){
            return xUnit[this.value]
        },
        align: "center",
      }
     },
     yAxis: {
       title: {
         text: ""
       },
       labels: {
            format: '{value}h'
        }
     },
     plotOptions: {
     	series: {
     		fillOpacity: 0.2
     	}
     },
     series: [{
         name:"日照時間",
         data: shoudoJikan,
         marker: {
          enabled: false
      }
     }]

  });
}

