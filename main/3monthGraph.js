var Highcharts = require('highcharts')
window.$ = require("jquery")

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
//const url = "http://localhost"
var threemonths_tickInterval = 14       // 13 + 1(start point) = 14 = 7days , 1point = 12 hour

var threemonths_shoudo = [],
    threemonths_inOndo = [],
    threemonths_outOndo = [],
    threemonths_inSitsudo = [],
    threemonths_outSitsudo = [],
    threemonths_houshasen = [],
    threemonths_ame = [],
    threemonths_jikoku = [],
    threemonths_hitsuke = [],
    threemonths_housachi = [],
    threemonths_mist = [],
    threemonths_fan1 = [],
    threemonths_fan2 = [],
    threemonths_fan3 = [],
    threemonths_fan4 = []


 $("#threemonthsNav").click(function(){
  console.log("threemonthsPane was clicked")
  // HIDE dayPane
  hideOtherPaneForthreeMonths()

  // GET today date in using moment
  var toDate = moment().add(1, "days").format("YYYY/MM/DD")

  // GET last threemonths date in string, using moment.js
  var fromDate = moment().subtract(3, 'months').format("YYYY/MM/DD")

  var dateObject = { "fromDate": fromDate, "toDate":toDate}

  console.log("dateObject: ", dateObject)
  // USE Moment
  console.log("last threemonths date from now", moment().subtract(3, 'months').format("YYYY/M/D"))


  // show date on screen
  $("#threemonthsText").html(fromDate + " - " + moment().format("YYYY/MM/DD"))
  // Reset all data before showing new graph
  threemonths_resetData()

  //Post: get tenMin data by date from user
  $.post(url+":30000/get3monthsData", dateObject, function(data){
    if(data != "NODATA"){
      console.log("tenMinData: ", data[0])
      for(var i=0; i<data.length; i++){
        // push data to Array
        threemonths_shoudo.push(data[i].shoudo)
        threemonths_inOndo.push(data[i].inOndo)
        threemonths_outOndo.push(data[i].outOndo)
        threemonths_inSitsudo.push(data[i].inSitsudo)
        threemonths_outSitsudo.push(data[i].outSitsudo)
        threemonths_houshasen.push(data[i].houshasen)
        threemonths_ame.push(data[i].ame)
        threemonths_jikoku.push(data[i].jikoku)
        threemonths_hitsuke.push(data[i].hitsuke)
        threemonths_housachi.push(data[i].housachi)
        threemonths_mist.push(data[i].mist)
        threemonths_fan1.push(data[i].fan1)
        threemonths_fan2.push(data[i].fan2)
        threemonths_fan3.push(data[i].fan3)
        threemonths_fan4.push(data[i].fan4)

      }
      console.log("threemonths_hitsuke: ", threemonths_hitsuke)
      // call graph
      threemonths_initGraphs()
    }
    else{
      console.log("No data yet")
      alert("指定した日付にはデータがないです。")
    }

  })

 })

 // Reset data
 var threemonths_resetData = function(){
   // reset Array data
    threemonths_shoudo = []
    threemonths_inOndo = []
    threemonths_outOndo = []
    threemonths_inSitsudo = []
    threemonths_outSitsudo = []
    threemonths_houshasen = []
    threemonths_ame = []
    threemonths_jikoku = []
    threemonths_hitsuke = []
    threemonths_housachi = []
    threemonths_mist = []
    threemonths_fan1 = []
    threemonths_fan2 = []
    threemonths_fan3 = []
    threemonths_fan4 = []
 }


 // HIDE OTHER PANE
 var hideOtherPaneForthreeMonths = ()=> {
  // HIDE other pane
  $("#dayPane").hide()
  $("#sekisanPane").hide()
  $("#nisshoujikanPane").hide()
  $('#monthPane').hide()
  $('#weekPane').hide()
  $("#threemonthsPane").show()
  

 }









/*################################################
                  All CHART 
###################################################*/

  // Create the chart
  var threemonths_ondoChart = function(threemonths_inOndo, threemonths_outOndo, threemonths_outSitsudo){
    Highcharts.setOptions({
       colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('threemonths_ondoChart', {
       chart: {
           // type: 'line',
           zoomType: 'xy'
       },
       legend: {
        // layout: 'vertical',
         align: 'right',
        enabled: true,
        // x: 120,
        verticalAlign: 'top',
        // y: 100,
        floating: false,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
      },
       title: {
          text: "ハウス内外温湿度"
       },
       xAxis: {
          categories: threemonths_hitsuke,
          tickInterval: threemonths_tickInterval, //13 point + 1 -> 7day tick 
          //tickAmount: 24,
          labels: {
          }
       },
       yAxis: [{  // primary yAxis
        min: -25,
        max: 50,
           labels: {
            format: '{value}°C',
            style: {
                // color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: '温度',
            style: {
                // color: Highcharts.getOptions().colors[1]
            }
        }
        },{ // Secondary yAxis
        min: 0,
        max: 200,
        title: {
            text: '湿度',
            style: {
                // color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} %',
            style: {
                // color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
        }],
       series: [{
           name:"内温度",
           type: "line",
           yAxis:0,
           data: threemonths_inOndo,
           lineWidth: 3,
          tooltip: {
            valueSuffix: ' °C'
          },
          marker: {
            enabled: false
        }
      }
       ,{
           name:"内湿度",
           type: "line",
           yAxis: 1,
           data: threemonths_inSitsudo,
           lineWidth: 3,
          tooltip: {
            valueSuffix: ' %'
          },
          marker: {
            enabled: false
        }
       },
       {
           name:"外温度",
           type: "line",
           data: threemonths_outOndo,
           yAxis: 0,
           lineWidth: 1,
          tooltip: {
            valueSuffix: ' °C'
          },
          marker: {
            enabled: false
        }
       },
       {
           name:"外湿度",
           type: "line",
           data: threemonths_outSitsudo,
           yAxis: 1,
           lineWidth: 1,
          tooltip: {
            valueSuffix: ' %'
          },
          marker: {
            enabled: false
        }
       }
       ]

    });
}



  


// Create the chart
var threemonths_shoudoChart = function(threemonths_shoudo){
  Highcharts.setOptions({
    colors: ['#ff3300'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('threemonths_shoudoChart', {
     chart: {
         type: 'line',
         },
     legend:{
        enabled: true,
        verticalAlign: "top"
       },
     title: {
         text: ""
     },
     xAxis: {
       categories: threemonths_hitsuke,
       tickInterval: threemonths_tickInterval, // 1hour
        //tickAmount: 24,
     },
     yAxis: {
       title: {
         text: "lux"
       }
     },
     series: [{
         name:"照度",
         data: threemonths_shoudo,
         tooltip: {
          valueSuffix: " lux"
         },
         marker: {
            enabled: false
        }
     }]

  });
}


//Create the chart
var threemonths_housachiChart = function(threemonths_housachi){
  Highcharts.setOptions({
    colors: ['#ff9900'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('threemonths_housachiChart', {
     chart: {
         type: 'line',
         },
     legend:{
        enabled: true,
        verticalAlign: "top"
       },
     title: {
         text: ""
     }
     ,
     xAxis: {
       categories: threemonths_hitsuke,
       tickInterval: threemonths_tickInterval, // 1hour
       // plotBands: {
       //  from: 6,
       //  to: 8,
       //  zIndex: 0,
       //  color: "green",
       //  width: 1
       // }
     }
     ,
     yAxis: {
       title: {
         text: "g/m3"
       },
       min: 0,
       max: 10,
       plotLines: [{
        value: 4,
        color: "green",
        dashStyle: "shortdash",
        width: 1,
        label: {
          text:""
        }
       },{
        value: 5,
        color: "red",
        dashStyle: "shortdash",
        width: 1,
        zIndex: 2,
        label: {
          text: ""
        }
       }]


     },
     series: [{
         name:"飽差値",
         data: threemonths_housachi,
         marker: {
            enabled: false
        }
     }]

  });
}

//Create the sitsudoChart
  var threemonths_mistChart = function(threemonths_mist){
    Highcharts.setOptions({
      colors: ['#0066cc'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('threemonths_mistChart', {
       chart: {
           type: 'line',
           },
       legend:{
        enabled: true,
        verticalAlign: "top"
       },
       title: {
           text: ""
       },
       xAxis: {
         categories: threemonths_hitsuke,
         tickInterval: threemonths_tickInterval, // 1hour
          // tickAmount: 24,
       },
       yAxis: {
         title: {
           text: ""
         },
         min: 0,
         max: 1
       },
       series: [{
           name:"ミスト制御",
           data: threemonths_mist,
           marker: {
            enabled: false
        }
       }]

    });
  }


  ////Create the sitsudoChart
  var threemonths_fan1Chart = function(threemonths_fan1){
    Highcharts.setOptions({
      colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('threemonths_fan1Chart', {
       chart: {
           type: 'line',
           },
       legend:{
        // layout: 'vertical',
         //align: 'left',
        //enabled: true,
        //verticalAlign: "top"
       },
       title: {
           text: "【ファン制御】"
       },
       xAxis: {
         categories: threemonths_hitsuke,
         lineWidth: 0,
         tickInterval: threemonths_tickInterval, // 1hour
         visible: false   // make x axis invisible
       },
       yAxis: {
         title: {
           text: "ファン1"
         },
         min: 0,
         max: 1
       },
       series: [{
           //name:"ファン1",
           data: threemonths_fan1,
           showInLegend: false, // hide series text
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var threemonths_fan2Chart = function(threemonths_fan2){
    Highcharts.setOptions({
      colors: ['#ff3300'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('threemonths_fan2Chart', {
       chart: {
           type: 'line',
           },
       legend:{
        enabled: true,
        verticalAlign: "top"
       },
       title: {
           text: ""
       },
       xAxis: {
         categories: threemonths_hitsuke,
         lineWidth: 0,
         tickInterval: threemonths_tickInterval, // 2days
         visible: false
       },
       yAxis: {
         title: {
           text: "ファン2"
         },
         min: 0,
         max: 1
       },
       series: [{
           name:"ファン2",
           data: threemonths_fan2,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var threemonths_fan3Chart = function(threemonths_fan3){
    Highcharts.setOptions({
      colors: ['#669999'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('threemonths_fan3Chart', {
       chart: {
           type: 'line',
           },
       legend:{
        enabled: true,
        verticalAlign: "top"
       },
       title: {
           text: ""
       },
       xAxis: {
         categories: threemonths_hitsuke,
         lineWidth: 0,
         tickInterval: threemonths_tickInterval, // 1hour
         minTickInterval: 5000,
         visible: false
       },
       yAxis: {
         title: {
           text: "ファン3"
         },
         min: 0,
         max: 1
       },
       series: [{
           name:"ファン3",
           data: threemonths_fan3,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var threemonths_fan4Chart = function(threemonths_fan4){
    Highcharts.setOptions({
      colors: ['#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('threemonths_fan4Chart', {
       chart: {
           type: 'line',
           },
       legend:{
        enabled: true,
        verticalAlign: "top"
       },
       title: {
           text: ""
       },
       xAxis: {
         categories: threemonths_hitsuke,
         tickInterval: threemonths_tickInterval, // 1hour
       },
       yAxis: {
         title: {
           text: "ファン4"
         },
         min: 0,
         max: 1
       },
       series: [{
           name:"ファン4",
           data: threemonths_fan4,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }



// Create the Ame chart
var threemonths_ameChart = function(threemonths_ame){
  Highcharts.setOptions({
      colors: ['#009999'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('threemonths_ameChart', {
     chart: {
         type: 'line',
         },
     legend:{
        enabled: true,
        verticalAlign: "top",
       },
     title: {
         text: ""
     },
     xAxis: {
       categories: threemonths_hitsuke,
       tickInterval: threemonths_tickInterval, // 14point -> 7day (1point = 12hour )
     },
     yAxis: {
      title: {
         text: ""
       },
      min: 0,
      max: 1
     },
     series: [{
         name:"雨検知",
         data: threemonths_ame,
         marker: {
            enabled: false
        }
     }]

  });
}


// initialize graph
var threemonths_initGraphs = function(){
    threemonths_shoudoChart(threemonths_shoudo)
    threemonths_ondoChart(threemonths_inOndo, threemonths_outOndo, threemonths_outSitsudo)
    // sitsudoChart(threemonths_inSitsudo, outSitsudo)
    threemonths_ameChart(threemonths_ame)
    threemonths_mistChart(threemonths_mist)
    threemonths_housachiChart(threemonths_housachi)
    threemonths_fan1Chart(threemonths_fan1)
    threemonths_fan2Chart(threemonths_fan2)
    threemonths_fan3Chart(threemonths_fan3)
    threemonths_fan4Chart(threemonths_fan4)
}

threemonths_initGraphs()
