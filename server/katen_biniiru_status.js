/*　データをパーセントへ変更するオブジェクト */
const toPercent = {
    "1": 0,
    "2": 20,
    "3": 70,
    "4": 100
}

/* katen status 展開
* @param: 
*   data: 受信されたカーテンの部分
* @return: 展開した左右カーテンの%としてのステータス
*   leftKaten: 左カーテンのステータス
*   rightKaten: 右カーテンのステータス    
*/
exports.katenStatus = (data) => {
    var leftKaten = toPercent(data[0])
    var rightKaten = toPercent(data[1])

    return {"leftKaten": leftKaten, "rightKaten": rightKaten}
}

/* ビニール status 展開
* @param: 
*   data: 受信されたビニールの部分
* @return: 展開した左右ビニールの%としてのステータス
*   leftBiniiru: 左ビニールのステータス
*   rightBiniiru: 右ビニールのステータス    
*/
exports.biniiruStatus = (data) => {
    var leftBiniiru = toPercent(data[0])
    var rightBiniiru = toPercent(data[1])

    return {"leftBiniiru": leftBiniiru, "rightBiniiru": rightBiniiru}
}

/* katen status 展開
* @param: 
*   data: 受信された天井カーテンの部分
* @return: 展開した左右天井カーテンの%としてのステータス
*   leftTenjouKaten: 左天井カーテンのステータス
*   rightTenjouKaten: 右天井カーテンのステータス    
*/
exports.tenjouKatenStatus = (data) => {
    var leftTenjouKaten = toPercent(data[0])
    var rightTenjouKaten = toPercent(data[1])

    return {"leftTenjouKaten": leftTenjouKaten, "rightTenjouKaten": rightTenjouKaten}
}