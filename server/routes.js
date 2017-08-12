const express = require('express')
const router = express.Router()
const controllers = require("./controllers")
module.exports = router

router.post("/dayDataEveryMin", controllers.getOneMinDataByDate)
router.post("/dayDataEveryTenMin", controllers.getTenMinData)
router.post("/1hourData", controllers.get1hourData)
router.post("/get1monthData", controllers.get1hourAndCal6hourAvgForMonthData)
router.post("/get3monthsData", controllers.get1hourAndCal12hourAvgFor3MonthData)
router.post("/getSekisanOndo", controllers.getSekisanOndo)
router.post("/getNisshoudojikan", controllers.getNisshoudojikan)