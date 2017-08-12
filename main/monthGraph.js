var Highcharts = require('highcharts')
window.$ = require("jquery")

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
//const url = "http://localhost"
var month_tickInterval = 4    // 3 + 1(start point) = 4

var month_shoudo = [],
    month_inOndo = [],
    month_outOndo = [],
    month_inSitsudo = [],
    month_outSitsudo = [],
    month_houshasen = [],
    month_ame = [],
    month_jikoku = [],
    month_hitsuke = [],
    month_housachi = [],
    month_mist = [],
    month_fan1 = [],
    month_fan2 = [],
    month_fan3 = [],
    month_fan4 = []


 $("#monthNav").click(function(){
  console.log("monthPane was clicked")
  // HIDE dayPane
  hideOtherPaneForMonth()

  // GET tomorrow date using moment.js, coz mongodb will not includ toDate, so we hv to +1day
  var toDate = moment().add(1, "days").format("YYYY/MM/DD")

  // GET last month date in string, using moment.js
  var fromDate = moment().subtract(1, 'months').format("YYYY/MM/DD")

  var dateObject = { "fromDate": fromDate, "toDate":toDate}

  console.log("dateObject: ", dateObject)
  // USE Moment
  console.log("last month date from now", moment().subtract(1, 'months').format("YYYY/MM/DD"))


  // show date on screen
  $("#monthText").html(fromDate + " - " + moment().format("YYYY/MM/DD"))
  // Reset all data before showing new graph
  month_resetData()

  //Post: get tenMin data by date from user
  $.post(url+":30000/get1monthData", dateObject, function(data){
    if(data != "NODATA"){
      console.log("tenMinData: ", data[0])
      for(var i=0; i<data.length; i++){
        // push data to Array
        month_shoudo.push(data[i].shoudo)
        month_inOndo.push(data[i].inOndo)
        month_outOndo.push(data[i].outOndo)
        month_inSitsudo.push(data[i].inSitsudo)
        month_outSitsudo.push(data[i].outSitsudo)
        month_houshasen.push(data[i].houshasen)
        month_ame.push(data[i].ame)
        month_jikoku.push(data[i].jikoku)
        month_hitsuke.push(data[i].hitsuke)
        month_housachi.push(data[i].housachi)
        month_mist.push(data[i].mist)
        month_fan1.push(data[i].fan1)
        month_fan2.push(data[i].fan2)
        month_fan3.push(data[i].fan3)
        month_fan4.push(data[i].fan4)

      }
      console.log("month_hitsuke: ", month_hitsuke)
      // call graph
      month_initGraphs()
    }
    else{
      console.log("No data yet")
      alert("指定した日付にはデータがないです。")
    }

  })

 })

 // Reset data
 var month_resetData = function(){
   // reset Array data
    month_shoudo = []
    month_inOndo = []
    month_outOndo = []
    month_inSitsudo = []
    month_outSitsudo = []
    month_houshasen = []
    month_ame = []
    month_jikoku = []
    month_hitsuke = []
    month_housachi = []
    month_mist = []
    month_fan1 = []
    month_fan2 = []
    month_fan3 = []
    month_fan4 = []
 }


 // HIDE OTHER PANE
 var hideOtherPaneForMonth = ()=> {
  // HIDE other pane
  $('#weekPane').hide()
  $("#dayPane").hide()
  $("#sekisanPane").hide()
  $("#threemonthsPane").hide()
  $("#nisshoujikanPane").hide()
  $('#monthPane').show()

 }









/*################################################
                  All CHART 
###################################################*/

  // Create the chart
  var month_ondoChart = function(month_inOndo, month_outOndo, month_outSitsudo){
    Highcharts.setOptions({
       colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('month_ondoChart', {
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
          categories: month_hitsuke,
          tickInterval: month_tickInterval, // when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
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
           data: month_inOndo,
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
           data: month_inSitsudo,
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
           data: month_outOndo,
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
           data: month_outSitsudo,
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
var month_shoudoChart = function(month_shoudo){
  Highcharts.setOptions({
    colors: ['#ff3300'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('month_shoudoChart', {
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
       categories: month_hitsuke,
       tickInterval: month_tickInterval, // 1hour
        //tickAmount: 24,
     },
     yAxis: {
       title: {
         text: "lux"
       }
     },
     series: [{
         name:"照度",
         data: month_shoudo,
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
var month_housachiChart = function(month_housachi){
  Highcharts.setOptions({
    colors: ['#ff9900'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('month_housachiChart', {
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
       categories: month_hitsuke,
       tickInterval: month_tickInterval, // 1hour
        //tickAmount: 24,
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
         data: month_housachi,
         marker: {
            enabled: false
        }
     }]

  });
}

//Create the sitsudoChart
  var month_mistChart = function(month_mist){
    Highcharts.setOptions({
      colors: ['#0066cc'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('month_mistChart', {
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
         categories: month_hitsuke,
         tickInterval: month_tickInterval, // 1hour
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
           data: month_mist,
           marker: {
            enabled: false
        }
       }]

    });
  }


  ////Create the sitsudoChart
  var month_fan1Chart = function(month_fan1){
    Highcharts.setOptions({
      colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('month_fan1Chart', {
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
         categories: month_hitsuke,
         lineWidth: 0,
         tickInterval: month_tickInterval, // 1hour
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
           data: month_fan1,
           showInLegend: false, // hide series text
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var month_fan2Chart = function(month_fan2){
    Highcharts.setOptions({
      colors: ['#ff3300'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('month_fan2Chart', {
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
         categories: month_hitsuke,
         lineWidth: 0,
         tickInterval: month_tickInterval, // 1hour
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
           data: month_fan2,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var month_fan3Chart = function(month_fan3){
    Highcharts.setOptions({
      colors: ['#669999'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('month_fan3Chart', {
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
         categories: month_hitsuke,
         lineWidth: 0,
         tickInterval: month_tickInterval, // 1hour
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
           data: month_fan3,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var month_fan4Chart = function(month_fan4){
    Highcharts.setOptions({
      colors: ['#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('month_fan4Chart', {
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
         categories: month_hitsuke,
         tickInterval: month_tickInterval, // 1hour
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
           data: month_fan4,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }



// Create the Ame chart
var month_ameChart = function(month_ame){
  Highcharts.setOptions({
      colors: ['#009999'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('month_ameChart', {
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
       categories: month_hitsuke,
       tickInterval: month_tickInterval, 
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
         data: month_ame,
         marker: {
            enabled: false
        }
     }]

  });
}


// initialize graph
var month_initGraphs = function(){
    month_shoudoChart(month_shoudo)
    month_ondoChart(month_inOndo, month_outOndo, month_outSitsudo)
    // sitsudoChart(month_inSitsudo, outSitsudo)
    month_ameChart(month_ame)
    month_mistChart(month_mist)
    month_housachiChart(month_housachi)
    month_fan1Chart(month_fan1)
    month_fan2Chart(month_fan2)
    month_fan3Chart(month_fan3)
    month_fan4Chart(month_fan4)
}

month_initGraphs()
