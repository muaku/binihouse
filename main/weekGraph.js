var Highcharts = require('highcharts')
const moment = require("moment")
window.$ = require("jquery")

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
//const url = "http://localhost"
var week_tickInterval = 24

var week_shoudo = [],
    week_inOndo = [],
    week_outOndo = [],
    week_inSitsudo = [],
    week_outSitsudo = [],
    week_houshasen = [],
    week_ame = [],
    week_jikoku = [],
    week_hitsuke = [],
    week_housachi = [],
    week_mist = [],
    week_fan1 = [],
    week_fan2 = [],
    week_fan3 = [],
    week_fan4 = []


 $("#weekNav").click(function(){
  console.log("weekPane was clicked")
  // HIDE dayPane
  hideOtherPaneForWeek()

  // GET tomorrow date using moment.js, coz mongodb will not includ toDate, so we hv to +1day
  var toDate = moment().add(1, "days").format("YYYY/MM/DD")


  // GET last week date using moment.js
  // subtract 6 coz include start and end date
  var fromDate = moment().subtract(6, "days").format("YYYY/MM/DD")
  var dateObject = { "fromDate": fromDate, "toDate":toDate}

  console.log("dateObject: ", dateObject)

  // show date on screen
  $("#weekText").html(fromDate + " - " + moment().format("YYYY/MM/DD"))
  
  requestAndShowWeekGraph(dateObject)

 

 })


 //
 $("#week_kousin").click(() => {
    var toDate = moment($("#week_todate").val()).add(1, "days").format("YYYY/MM/DD")
    var fromDate = moment($("#week_todate").val()).subtract(6, "days").format("YYYY/MM/DD")
    var dateObject = { "fromDate": fromDate, "toDate":toDate}
    

    $("#weekText").html(fromDate + " - " + moment($("#week_todate").val()).format("YYYY/MM/DD"))
    console.log("dateObject: ", dateObject)


    //
    requestAndShowWeekGraph(dateObject)
 })


 //
 var requestAndShowWeekGraph = (dateObject) => {
   //Post: get tenMin data by date from user
    $.post(url+":30000/1hourData", dateObject, function(data){
      if(data != "NODATA"){

        // Reset all data before showing new graph
        week_resetData()

        console.log("tenMinData: ", data[0])
        for(var i=0; i<data.length; i++){
          // push data to Array
          week_shoudo.push(data[i].shoudo)
          week_inOndo.push(data[i].inOndo)
          week_outOndo.push(data[i].outOndo)
          week_inSitsudo.push(data[i].inSitsudo)
          week_outSitsudo.push(data[i].outSitsudo)
          week_houshasen.push(data[i].houshasen)
          week_ame.push(data[i].ame)
          week_jikoku.push(data[i].jikoku)
          week_hitsuke.push(data[i].hitsuke)
          week_housachi.push(data[i].housachi)
          week_mist.push(data[i].mist)
          week_fan1.push(data[i].fan1)
          week_fan2.push(data[i].fan2)
          week_fan3.push(data[i].fan3)
          week_fan4.push(data[i].fan4)

        }
        console.log("week_hitsuke: ", week_hitsuke)
        // call graph
        week_initGraphs()
      }
      else{
        console.log("No data yet")
        alert("指定した日付にはデータがないです。")
      }

    })

 }

 // Reset data
 var week_resetData = function(){
   // reset Array data
    week_shoudo = []
    week_inOndo = []
    week_outOndo = []
    week_inSitsudo = []
    week_outSitsudo = []
    week_houshasen = []
    week_ame = []
    week_jikoku = []
    week_hitsuke = []
    week_housachi = []
    week_mist = []
    week_fan1 = []
    week_fan2 = []
    week_fan3 = []
    week_fan4 = []
 }


 // HIDE OTHER PANE
 var hideOtherPaneForWeek = ()=> {
  // HIDE other pane
  $("#dayPane").hide()
  $("#sekisanPane").hide()
  $("#threemonthsPane").hide()
  $("#nisshoujikanPane").hide()
  $('#monthPane').hide()
  $('#weekPane').show()

 }









/*################################################
                  All CHART 
###################################################*/

  // Create the chart
  var week_ondoChart = function(week_inOndo, week_outOndo, week_outSitsudo){
    Highcharts.setOptions({
       colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('week_ondoChart', {
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
          //categories: week_hitsuke,
          tickInterval: week_tickInterval, //1day
          //tickAmount: 24,
          labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
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
           data: week_inOndo,
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
           data: week_inSitsudo,
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
           data: week_outOndo,
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
           data: week_outSitsudo,
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
var week_shoudoChart = function(week_shoudo){
  Highcharts.setOptions({
    colors: ['#ff3300'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('week_shoudoChart', {
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
       //categories: week_hitsuke,
       tickInterval: week_tickInterval, // 1hour
        //tickAmount: 24,
        labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
     },
     yAxis: {
       title: {
         text: "lux"
       }
     },
     series: [{
         name:"照度",
         data: week_shoudo,
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
var week_housachiChart = function(week_housachi){
  Highcharts.setOptions({
    colors: ['#ff9900'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('week_housachiChart', {
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
       //categories: week_hitsuke,
       tickInterval: week_tickInterval, // 1hour
        //tickAmount: 24,
       labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
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
         data: week_housachi,
         marker: {
            enabled: false
        }
     }]

  });
}

//Create the sitsudoChart
  var week_mistChart = function(week_mist){
    Highcharts.setOptions({
      colors: ['#0066cc'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('week_mistChart', {
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
         //categories: week_hitsuke,
         tickInterval: week_tickInterval, // 1hour
         labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
          
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
           data: week_mist,
           marker: {
            enabled: false
        }
       }]

    });
  }


  ////Create the sitsudoChart
  var week_fan1Chart = function(week_fan1){
    Highcharts.setOptions({
      colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('week_fan1Chart', {
       chart: {
           type: 'line',
           },
       legend:{
        // layout: 'vertical',
         //align: 'center',
        //enabled: true,
        //verticalAlign: "top"
       },
       title: {
           text: "【ファン制御】"
       },
       xAxis: {
         //categories: week_hitsuke,
         lineWidth: 0,
         tickInterval: week_tickInterval, // 1hour
         visible: false,   // make x axis invisible
         labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
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
           data: week_fan1,
           showInLegend: false, // hide series text
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var week_fan2Chart = function(week_fan2){
    Highcharts.setOptions({
      colors: ['#ff3300'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('week_fan2Chart', {
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
         //categories: week_hitsuke,
         lineWidth: 0,
         tickInterval: week_tickInterval, // 1hour
         visible: false,
         labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
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
           data: week_fan2,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var week_fan3Chart = function(week_fan3){
    Highcharts.setOptions({
      colors: ['#669999'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('week_fan3Chart', {
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
         //categories: week_hitsuke,
         lineWidth: 0,
         tickInterval: week_tickInterval, // 1hour
         minTickInterval: 5000,
         visible: false,
         labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
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
           data: week_fan3,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var week_fan4Chart = function(week_fan4){
    Highcharts.setOptions({
      colors: ['#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('week_fan4Chart', {
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
         categories: week_hitsuke,
         tickInterval: week_tickInterval, // 1hour
          //tickAmount: 24,
          labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
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
           data: week_fan4,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }



// Create the Ame chart
var week_ameChart = function(week_ame){
  Highcharts.setOptions({
      colors: ['#009999'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('week_ameChart', {
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
       //categories: week_hitsuke,
       tickInterval: week_tickInterval, // 1hour
          //tickAmount: 24,
        labels: {
            // New added
            formatter: function(){
              return week_hitsuke[this.value]
            },
            align: "center",
          }
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
         data: week_ame,
         marker: {
            enabled: false
        }
     }]

  });
}


// initialize graph
var week_initGraphs = function(){
    week_shoudoChart(week_shoudo)
    week_ondoChart(week_inOndo, week_outOndo, week_outSitsudo)
    // sitsudoChart(week_inSitsudo, outSitsudo)
    week_ameChart(week_ame)
    week_mistChart(week_mist)
    week_housachiChart(week_housachi)
    week_fan1Chart(week_fan1)
    week_fan2Chart(week_fan2)
    week_fan3Chart(week_fan3)
    week_fan4Chart(week_fan4)
}

week_initGraphs()
