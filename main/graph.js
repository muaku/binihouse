var Highcharts = require('highcharts')
window.$ = require("jquery")

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
const url = "http://localhost"
const day_tickinterval = 6
const tick_amount = 25  // 24 tick ( 1 tick per hour )
//
var socket = require('socket.io-client')(url + ":30000")

var shoudo = [],
    inOndo = [],
    outOndo = [],
    inSitsudo = [],
    outSitsudo = [],
    houshasen = [],
    ame = [],
    jikoku = [],
    housachi = [],
    mist = [],
    fan1 = [],
    fan2 = [],
    fan3 = [],
    fan4 = []
// at first hide stopBtn
$("#stopBtn").hide()

 socket.on('msg', function(data) {
    console.log("data: ", data);


  });
// 
socket.on("onStart", function(data){
  if(data){
    $("#dataStatus").css("color", "green")
    $("#dataStatus").html(data)
    // Disable start button & enable stopBtn stopBtn
     $("#startBtn").hide()
     $("#stopBtn").show()
  }
})
//
socket.on("onStop", function(data){
  if(data){
     $("#dataStatus").css("color", "red")
     $("#dataStatus").html(data)
     // disable stopBtn & enable startBtn
      $("#startBtn").show()
      $("#stopBtn").hide()
  }
})

 //
 socket.emit("portNumber", "ports")
 socket.on("portNumber", function(ports){
  console.log(ports)
  var select = document.getElementById("portList")
  for(var i=0; i< ports.length; i++){
    var opt = document.createElement("option")
    opt.value = ports[i]
    opt.innerHTML = ports[i]
    select.appendChild(opt)
  }
 })

 // SET default select year/month/day
 function setDefaultSelection() {
  // SET default year to this year
  var thisYear = moment().format("YYYY")

  // SET default month to this month
  var thisMonth = moment().format("MM")

  // SET default day to today
  var thisDay = moment().format("DD")
  console.log("thisYear: ", thisYear)
  console.log("thisMonth: ", thisMonth)
  console.log("thisDay: ", thisDay)

  $("#yearSelect").val(thisYear)
  $("#monthSelect").val(thisMonth)
  $("#daySelect").val(thisDay)
 }
 setDefaultSelection()



 // SHOW graph button
 $("#showGraphBtn").click(function() {
    // var year = document.getElementById("yearSelect").value
    // var month = document.getElementById("monthSelect").value
    // var day = document.getElementById("daySelect").value
    // var date = year + "/" + month + "/" + day

    var daydate = moment($("#daydate").val()).format("YYYY/MM/DD")

    var dateObject = { "date": daydate}
    console.log(daydate)

    requestDataAndShowGraph(dateObject)

 })

 // Listen to connection status
 socket.on("dataOK", function(data){
   $("#status").html(data)
 })

 // start button pressed
 $("#startBtn").click(function(){
    console.log("start button pressed")

    // Use socket to send serial port to user
    var selectedPort = document.getElementById("portList").value
    console.log("selectedPort: ", selectedPort)
    socket.emit("onStart", selectedPort)
    

 })


 // stop button pressed
 $("#stopBtn").click(function(){
    console.log("stop button pressed")
    socket.emit("onStop","Close")
 })

 $("#dayNav").click(function(){
     // HIDE other pane
    $("#sekisanPane").hide()
    $("#nisshoujikanPane").hide()
    $('#monthPane').hide()
    $('#weekPane').hide()
    $("#threemonthsPane").hide()
    $("#dayPane").show()

    console.log("button clicked")
    // GET today date using moment.js
    var date = moment().format("YYYY/MM/DD")

    var dateObject = { "date": date}

    $("#daydate").val(moment(date).format("YYYY-MM-DD"))

    //
    requestDataAndShowGraph(dateObject)


 })


 //
 var requestDataAndShowGraph = function(dateObject) {
  // Reset all data before showing new graph
  resetData()

  // Post: get tenMin data by date from user
  $.post(url+":30000/dayDataEveryTenMin", dateObject, function(data){
    if(data != "NODATA"){
      console.log("tenMinData: ", data[0])
      for(var i=0; i<data.length; i++){
        // push data to Array
        shoudo.push(data[i].shoudo)
        inOndo.push(data[i].inOndo)
        outOndo.push(data[i].outOndo)
        inSitsudo.push(data[i].inSitsudo)
        outSitsudo.push(data[i].outSitsudo)
        houshasen.push(data[i].houshasen)
        ame.push(data[i].ame)
        jikoku.push(data[i].jikoku)
        housachi.push(data[i].housachi)
        mist.push(data[i].mist)
        fan1.push(data[i].fan1)
        fan2.push(data[i].fan2)
        fan3.push(data[i].fan3)
        fan4.push(data[i].fan4)

      }
      // call graph
      initGraphs()
    }
    else{
      console.log("No data yet")
      alert("指定した日付にはデータがないです。")
    }

  })

 }


 // Reset data
 var resetData = function(){
   // reset Array data
    shoudo = []
    inOndo = []
    outOndo = []
    inSitsudo = []
    outSitsudo = []
    houshasen = []
    ame = []
    jikoku = []
    housachi = []
    mist = []
    fan1 = []
    fan2 = []
    fan3 = []
    fan4 = []
 }









/*################################################
                  All CHART 
###################################################*/

  // Create the chart
  var ondoChart = function(inOndo, outOndo, outSitsudo){
    Highcharts.setOptions({
       colors: ["#ff0000",'#000066', "#ff751a", '#669999'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('ondoChart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
           data: inOndo,
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
           data: inSitsudo,
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
           data: outOndo,
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
           data: outSitsudo,
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
var shoudoChart = function(shoudo){
  Highcharts.setOptions({
    colors: ['#ff3300'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('shoudoChart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
          }
       },
     yAxis: {
       title: {
         text: "lux"
       }
     },
     series: [{
         name:"照度",
         data: shoudo,
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
var housachiChart = function(housachi){
  Highcharts.setOptions({
    colors: ['#ff9900'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('housachiChart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
          }
       },
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
         data: housachi,
         marker: {
            enabled: false
        }
     }]

  });
}

//Create the sitsudoChart
  var mistChart = function(mist){
    Highcharts.setOptions({
      colors: ['#0066cc'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('mistChart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
           data: mist,
           marker: {
            enabled: false
        }
       }]

    });
  }


  ////Create the sitsudoChart
  var fan1Chart = function(fan1){
    Highcharts.setOptions({
      colors: ['#000066', '#ff3300', '#669999', '#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('fan1Chart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
           data: fan1,
           showInLegend: false, // hide series text
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var fan2Chart = function(fan2){
    Highcharts.setOptions({
      colors: ['#ff3300'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('fan2Chart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
           data: fan2,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var fan3Chart = function(fan3){
    Highcharts.setOptions({
      colors: ['#669999'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('fan3Chart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
           data: fan3,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }

  ////Create the sitsudoChart
  var fan4Chart = function(fan4){
    Highcharts.setOptions({
      colors: ['#ca8621'],
         global: {
             useUTC: false
         }
     });
    Highcharts.chart('fan4Chart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
           data: fan4,
           showInLegend: false,
           marker: {
            enabled: false
        }
       }
       ]

    });
  }



// Create the Ame chart
var ameChart = function(ame){
  Highcharts.setOptions({
      colors: ['#009999'],
       global: {
           useUTC: false
       }
   });
  Highcharts.chart('ameChart', {
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
          //categories: jikoku,
          tickInterval: day_tickinterval, // 5 + 1(strat point) : when data has reach 6point then show Xaxis, 6point(10min per point => 1hour time stamp)
          tickAmount: tick_amount,
          labels: {
            // New added
            formatter: function(){
              return jikoku[this.value]
            },
            align: "right",
            rotation: -45
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
         data: ame,
         marker: {
            enabled: false
        }
     }]

  });
}


// initialize graph
var initGraphs = function(){
    shoudoChart(shoudo)
    ondoChart(inOndo, outOndo, outSitsudo)
    // sitsudoChart(inSitsudo, outSitsudo)
    ameChart(ame)
    mistChart(mist)
    housachiChart(housachi)
    fan1Chart(fan1)
    fan2Chart(fan2)
    fan3Chart(fan3)
    fan4Chart(fan4)
}

initGraphs()
