/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 80.57184750733138, "KoPercent": 19.428152492668623};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8073916133617626, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "-103 ping"], "isController": false}, {"data": [1.0, 500, 1500, "-119 manufactures"], "isController": false}, {"data": [1.0, 500, 1500, "-148 ping"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_08_OpenCart_withTable&Chair"], "isController": false}, {"data": [1.0, 500, 1500, "-87 p50_price_1"], "isController": false}, {"data": [1.0, 500, 1500, "-176 products"], "isController": false}, {"data": [0.0, 500, 1500, "-195 header_message"], "isController": false}, {"data": [0.0, 500, 1500, "OPEN_CHECKOUT"], "isController": false}, {"data": [0.0, 500, 1500, "-149 header_message"], "isController": false}, {"data": [1.0, 500, 1500, "-139 category_2"], "isController": false}, {"data": [1.0, 500, 1500, "-131 reviews"], "isController": false}, {"data": [1.0, 500, 1500, "-181 category"], "isController": false}, {"data": [1.0, 500, 1500, "-223 zones2"], "isController": false}, {"data": [1.0, 500, 1500, "-153 category"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_03_SelectProductTable"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_05_OpenChairsTab"], "isController": false}, {"data": [1.0, 500, 1500, "-113 content"], "isController": false}, {"data": [1.0, 500, 1500, "-161 p52_price"], "isController": false}, {"data": [1.0, 500, 1500, "-136 store"], "isController": false}, {"data": [1.0, 500, 1500, "-72 ping"], "isController": false}, {"data": [0.0, 500, 1500, "-129 header message"], "isController": false}, {"data": [1.0, 500, 1500, "-155 content"], "isController": false}, {"data": [1.0, 500, 1500, "-229 category"], "isController": false}, {"data": [1.0, 500, 1500, "-73 featured_item"], "isController": false}, {"data": [1.0, 500, 1500, "-230 content"], "isController": false}, {"data": [1.0, 500, 1500, "-194 ping"], "isController": false}, {"data": [1.0, 500, 1500, "-202 content"], "isController": false}, {"data": [1.0, 500, 1500, "-188 cart_get"], "isController": false}, {"data": [1.0, 500, 1500, "-86 p1_price_1"], "isController": false}, {"data": [1.0, 500, 1500, "-186 cart_put"], "isController": false}, {"data": [1.0, 500, 1500, "-203 store"], "isController": false}, {"data": [0.0, 500, 1500, "-69 header message"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_11_OpenCheckout_withTable"], "isController": true}, {"data": [1.0, 500, 1500, "-130 products"], "isController": false}, {"data": [1.0, 500, 1500, "-221 config"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_06_SelectProductChair"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_01_Launch"], "isController": false}, {"data": [1.0, 500, 1500, "-79 content"], "isController": false}, {"data": [1.0, 500, 1500, "-92p51_price_2"], "isController": false}, {"data": [1.0, 500, 1500, "-182 content"], "isController": false}, {"data": [0.0, 500, 1500, "-218 header_message"], "isController": false}, {"data": [1.0, 500, 1500, "-88 p51_price_1"], "isController": false}, {"data": [1.0, 500, 1500, "-112 category_1"], "isController": false}, {"data": [1.0, 500, 1500, "-201 category"], "isController": false}, {"data": [1.0, 500, 1500, "S01_ACC_07_AddChairtoCart"], "isController": true}, {"data": [1.0, 500, 1500, "-112 category_2"], "isController": false}, {"data": [1.0, 500, 1500, "S01_ACC_04_AddTabletoCart"], "isController": true}, {"data": [1.0, 500, 1500, "-156 products"], "isController": false}, {"data": [1.0, 500, 1500, "-216 zones"], "isController": false}, {"data": [1.0, 500, 1500, "-89p52_price_1"], "isController": false}, {"data": [1.0, 500, 1500, "-138 price"], "isController": false}, {"data": [1.0, 500, 1500, "-77 store"], "isController": false}, {"data": [1.0, 500, 1500, "-217 cart"], "isController": false}, {"data": [1.0, 500, 1500, "-90 p1_price_2"], "isController": false}, {"data": [0.0, 500, 1500, "-173 header_message"], "isController": false}, {"data": [1.0, 500, 1500, "-222 country"], "isController": false}, {"data": [1.0, 500, 1500, "-154 store"], "isController": false}, {"data": [1.0, 500, 1500, "-184 p50_price"], "isController": false}, {"data": [0.0, 500, 1500, "-109 header message"], "isController": false}, {"data": [1.0, 500, 1500, "-215 ping"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_10_OpenCart_withTable"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_09_OpenCheckout_withTable&Chair"], "isController": true}, {"data": [1.0, 500, 1500, "-111 store"], "isController": false}, {"data": [1.0, 500, 1500, "-164 category_51"], "isController": false}, {"data": [1.0, 500, 1500, "-93 p52_price_2"], "isController": false}, {"data": [1.0, 500, 1500, "-166 manufectures"], "isController": false}, {"data": [0.0, 500, 1500, "-168 variants"], "isController": false}, {"data": [1.0, 500, 1500, "-197 cart2"], "isController": false}, {"data": [1.0, 500, 1500, "-196 cart"], "isController": false}, {"data": [1.0, 500, 1500, "-219 cart_total"], "isController": false}, {"data": [1.0, 500, 1500, "-183 store"], "isController": false}, {"data": [1.0, 500, 1500, "-162 p51_price"], "isController": false}, {"data": [1.0, 500, 1500, "-228 store"], "isController": false}, {"data": [1.0, 500, 1500, "-141 cart_post"], "isController": false}, {"data": [1.0, 500, 1500, "-163 p50_price"], "isController": false}, {"data": [1.0, 500, 1500, "-108 products"], "isController": false}, {"data": [1.0, 500, 1500, "-78 category"], "isController": false}, {"data": [1.0, 500, 1500, "-144 cart_get"], "isController": false}, {"data": [0.0, 500, 1500, "S01_ACC_02_OpenTablesTab"], "isController": false}, {"data": [1.0, 500, 1500, "-137 category_1"], "isController": false}, {"data": [1.0, 500, 1500, "-175 store"], "isController": false}, {"data": [1.0, 500, 1500, "-91 p50_price_2"], "isController": false}, {"data": [1.0, 500, 1500, "-128 ping"], "isController": false}, {"data": [0.0, 500, 1500, "-220 shipping"], "isController": false}, {"data": [1.0, 500, 1500, "-174 ping"], "isController": false}, {"data": [1.0, 500, 1500, "-116 pricep_post"], "isController": false}, {"data": [1.0, 500, 1500, "-53 localhost"], "isController": false}, {"data": [0.0, 500, 1500, "-121 variants"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1364, 265, 19.428152492668623, 33.612903225806434, 8, 179, 29.0, 57.0, 71.0, 99.34999999999991, 36.564443491314606, 84.26061045732361, 24.262279598032382], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-103 ping", 25, 0, 0.0, 22.680000000000003, 9, 80, 19.0, 49.8000000000001, 79.4, 80.0, 0.8064516129032258, 0.3764490927419355, 0.30950730846774194], "isController": false}, {"data": ["-119 manufactures", 25, 0, 0.0, 32.16, 15, 82, 29.0, 53.80000000000001, 74.79999999999998, 82.0, 0.8065036453964772, 0.5056399808052132, 0.29535045607781146], "isController": false}, {"data": ["-148 ping", 12, 0, 0.0, 22.833333333333332, 8, 51, 21.5, 45.30000000000002, 51.0, 51.0, 0.39382999671808333, 0.1730698227765015, 0.1307638660978011], "isController": false}, {"data": ["S01_ACC_08_OpenCart_withTable&Chair", 2, 2, 100.0, 38.5, 37, 40, 38.5, 40.0, 40.0, 40.0, 0.10257462303826033, 1.1502581995589292, 0.2556351933531644], "isController": false}, {"data": ["-87 p50_price_1", 25, 0, 0.0, 39.92, 15, 75, 36.0, 65.60000000000002, 74.7, 75.0, 0.8052307791413019, 0.41598347867748897, 0.323193213112378], "isController": false}, {"data": ["-176 products", 12, 0, 0.0, 22.916666666666668, 14, 37, 22.0, 36.1, 37.0, 37.0, 0.3947887879984208, 1.0232123470193446, 0.13879293328069484], "isController": false}, {"data": ["-195 header_message", 6, 6, 100.0, 27.166666666666668, 18, 54, 24.0, 54.0, 54.0, 54.0, 0.21629416005767843, 0.1102593276856525, 0.07667458994232156], "isController": false}, {"data": ["OPEN_CHECKOUT", 6, 6, 100.0, 72.5, 46, 107, 71.0, 107.0, 107.0, 107.0, 0.21546306603942975, 9.570010907817718, 0.915086791216289], "isController": false}, {"data": ["-149 header_message", 12, 12, 100.0, 33.0, 23, 43, 34.0, 42.7, 43.0, 43.0, 0.39416633819471814, 0.20093244974379187, 0.13972888746551046], "isController": false}, {"data": ["-139 category_2", 25, 0, 0.0, 18.560000000000002, 12, 37, 16.0, 29.60000000000002, 36.4, 37.0, 0.8103465041651811, 0.4043818980746167, 0.29992316902207383], "isController": false}, {"data": ["-131 reviews", 25, 0, 0.0, 20.439999999999998, 12, 34, 19.0, 28.400000000000002, 32.5, 34.0, 0.8103727714748784, 0.34583291126418153, 0.2841052978119935], "isController": false}, {"data": ["-181 category", 12, 0, 0.0, 23.166666666666668, 14, 34, 21.0, 34.0, 34.0, 34.0, 0.3945940613593765, 0.5899643632238335, 0.14411931537930353], "isController": false}, {"data": ["-223 zones2", 6, 0, 0.0, 33.5, 16, 72, 28.0, 72.0, 72.0, 72.0, 0.21567217828900073, 0.09203978702372394, 0.07139928558590941], "isController": false}, {"data": ["-153 category", 12, 0, 0.0, 27.500000000000004, 16, 39, 27.0, 38.400000000000006, 39.0, 39.0, 0.39419223441298207, 0.5893635848498785, 0.143972554365679], "isController": false}, {"data": ["S01_ACC_03_SelectProductTable", 25, 25, 100.0, 30.32, 19, 50, 28.0, 44.2, 48.8, 50.0, 0.8102151931553021, 6.129626075560669, 2.3135441648301787], "isController": false}, {"data": ["S01_ACC_05_OpenChairsTab", 12, 12, 100.0, 60.083333333333336, 39, 154, 50.0, 127.6000000000001, 154.0, 154.0, 0.39370078740157477, 5.749415600393701, 1.7378198818897637], "isController": false}, {"data": ["-113 content", 25, 0, 0.0, 27.120000000000005, 12, 97, 21.0, 53.40000000000001, 84.99999999999997, 97.0, 0.8064516129032258, 0.4024382560483871, 0.2984816028225806], "isController": false}, {"data": ["-161 p52_price", 12, 0, 0.0, 35.83333333333333, 25, 60, 35.0, 54.60000000000002, 60.0, 60.0, 0.39373954129343436, 0.20417548479181022, 0.15803413229648589], "isController": false}, {"data": ["-136 store", 25, 0, 0.0, 16.360000000000007, 11, 28, 15.0, 24.0, 26.799999999999997, 28.0, 0.8103727714748784, 0.920374544165316, 0.26906908427876824], "isController": false}, {"data": ["-72 ping", 25, 0, 0.0, 32.08, 11, 85, 29.0, 61.200000000000045, 82.0, 85.0, 0.8050492690152636, 0.37579448299735946, 0.3089691042216784], "isController": false}, {"data": ["-129 header message", 25, 25, 100.0, 25.8, 16, 39, 26.0, 36.400000000000006, 38.4, 39.0, 0.8102939746540044, 0.4130600144232327, 0.2872428835931676], "isController": false}, {"data": ["-155 content", 12, 0, 0.0, 25.416666666666668, 11, 47, 24.0, 43.100000000000016, 47.0, 47.0, 0.39388170419484014, 0.19655620199566728, 0.14578238856430117], "isController": false}, {"data": ["-229 category", 6, 0, 0.0, 43.16666666666667, 16, 84, 33.5, 84.0, 84.0, 84.0, 0.21585063136309673, 0.32272198888369247, 0.07883607043925603], "isController": false}, {"data": ["-73 featured_item", 25, 0, 0.0, 51.96, 34, 96, 49.0, 73.80000000000004, 92.39999999999999, 96.0, 0.8053864244064302, 7.32319628676589, 0.3381993774362939], "isController": false}, {"data": ["-230 content", 6, 0, 0.0, 39.66666666666667, 16, 72, 31.5, 72.0, 72.0, 72.0, 0.21580404992267022, 0.1076912788188325, 0.0798727880084883], "isController": false}, {"data": ["-194 ping", 6, 0, 0.0, 13.333333333333332, 10, 15, 14.0, 15.0, 15.0, 15.0, 0.21638776687824582, 0.0950922803664166, 0.07184750072129255], "isController": false}, {"data": ["-202 content", 6, 0, 0.0, 21.5, 13, 54, 15.5, 54.0, 54.0, 54.0, 0.21638776687824582, 0.10798256726053086, 0.08008883168638199], "isController": false}, {"data": ["-188 cart_get", 12, 0, 0.0, 23.0, 18, 39, 21.5, 36.900000000000006, 39.0, 39.0, 0.39499670836076367, 1.4091044684002634, 0.1434948979591837], "isController": false}, {"data": ["-86 p1_price_1", 25, 0, 0.0, 43.20000000000001, 17, 100, 40.0, 65.2, 90.09999999999998, 100.0, 0.8053864244064302, 0.4176369056248188, 0.3224691738346058], "isController": false}, {"data": ["-186 cart_put", 12, 0, 0.0, 36.33333333333333, 24, 61, 34.5, 55.90000000000002, 61.0, 61.0, 0.3948017766079947, 1.408409072215825, 0.18467778417502878], "isController": false}, {"data": ["-203 store", 6, 0, 0.0, 19.5, 11, 44, 13.0, 44.0, 44.0, 44.0, 0.21638776687824582, 0.24576071570253893, 0.07184750072129255], "isController": false}, {"data": ["-69 header message", 25, 25, 100.0, 43.0, 20, 87, 41.0, 67.80000000000003, 83.39999999999999, 87.0, 0.8052048441123422, 0.4104657506119557, 0.2854388265749807], "isController": false}, {"data": ["S01_ACC_11_OpenCheckout_withTable", 4, 4, 100.0, 68.75, 46, 87, 71.0, 87.0, 87.0, 87.0, 0.14363688595231255, 6.315253788422868, 0.6100359541080149], "isController": true}, {"data": ["-130 products", 25, 0, 0.0, 23.680000000000007, 12, 43, 23.0, 37.800000000000004, 41.8, 43.0, 0.8102939746540044, 2.0589696504391792, 0.2840776727546754], "isController": false}, {"data": ["-221 config", 6, 0, 0.0, 39.5, 19, 57, 39.0, 57.0, 57.0, 57.0, 0.21578076674099114, 0.1525637452348414, 0.07038161727684672], "isController": false}, {"data": ["S01_ACC_06_SelectProductChair", 12, 12, 100.0, 37.66666666666667, 26, 57, 34.5, 54.60000000000001, 57.0, 57.0, 0.3945551390806865, 3.004244550207141, 1.1277957930558296], "isController": false}, {"data": ["S01_ACC_01_Launch", 25, 25, 100.0, 61.88, 39, 106, 56.0, 95.60000000000001, 103.6, 106.0, 0.8047642040882022, 14.319144334460002, 4.730347406647352], "isController": false}, {"data": ["-79 content", 25, 0, 0.0, 37.20000000000001, 14, 85, 33.0, 73.4, 81.69999999999999, 85.0, 0.8049974240082431, 0.4017125817072385, 0.2979433825186759], "isController": false}, {"data": ["-92p51_price_2", 25, 0, 0.0, 42.36, 16, 98, 39.0, 64.00000000000003, 89.59999999999998, 98.0, 0.8052826542116283, 0.4175830951038814, 0.3232140340634563], "isController": false}, {"data": ["-182 content", 12, 0, 0.0, 25.833333333333336, 13, 38, 27.5, 37.1, 38.0, 38.0, 0.39460703715882933, 0.19691816014468924, 0.1460508467609339], "isController": false}, {"data": ["-218 header_message", 6, 6, 100.0, 42.333333333333336, 25, 75, 33.0, 75.0, 75.0, 75.0, 0.21577300679684971, 0.10999366166792535, 0.07648984518286762], "isController": false}, {"data": ["-88 p51_price_1", 25, 0, 0.0, 39.32000000000001, 12, 74, 37.0, 66.20000000000002, 73.1, 74.0, 0.8057238623179064, 0.417811885635555, 0.3233911205201753], "isController": false}, {"data": ["-112 category_1", 25, 0, 0.0, 26.159999999999997, 14, 51, 24.0, 42.2, 48.89999999999999, 51.0, 0.8060875733539692, 1.2051953855516864, 0.2944108910492036], "isController": false}, {"data": ["-201 category", 6, 0, 0.0, 14.166666666666668, 13, 18, 13.5, 18.0, 18.0, 18.0, 0.2163565556036348, 0.3234784049112938, 0.0790208513630463], "isController": false}, {"data": ["S01_ACC_07_AddChairtoCart", 12, 0, 0.0, 59.33333333333333, 43, 85, 55.0, 84.4, 85.0, 85.0, 0.3945551390806865, 2.8150584434799764, 0.32789689781021897], "isController": true}, {"data": ["-112 category_2", 25, 0, 0.0, 25.6, 12, 59, 21.0, 53.60000000000001, 58.099999999999994, 59.0, 0.8063215610385421, 1.2055452245605547, 0.2818975770037091], "isController": false}, {"data": ["S01_ACC_04_AddTabletoCart", 25, 0, 0.0, 46.36, 31, 77, 46.0, 55.800000000000004, 70.99999999999999, 77.0, 0.8122685034765091, 3.6060279460978624, 0.6504493875495484], "isController": true}, {"data": ["-156 products", 12, 0, 0.0, 40.33333333333333, 27, 49, 43.5, 48.7, 49.0, 49.0, 0.3941016125324313, 2.747165342047358, 0.14855783441163914], "isController": false}, {"data": ["-216 zones", 6, 0, 0.0, 32.666666666666664, 11, 58, 34.0, 58.0, 58.0, 58.0, 0.21567217828900073, 0.09203978702372394, 0.07139928558590941], "isController": false}, {"data": ["-89p52_price_1", 25, 0, 0.0, 38.199999999999996, 14, 71, 34.0, 62.2, 68.89999999999999, 71.0, 0.8052826542116283, 0.4175830951038814, 0.3232140340634563], "isController": false}, {"data": ["-138 price", 25, 0, 0.0, 21.880000000000003, 12, 48, 20.0, 33.60000000000001, 44.39999999999999, 48.0, 0.8103727714748784, 0.42022259927066447, 0.32446566045380876], "isController": false}, {"data": ["-77 store", 25, 0, 0.0, 35.68000000000001, 15, 67, 34.0, 58.800000000000004, 64.89999999999999, 67.0, 0.8050233456770246, 0.9142989756077926, 0.3089591551279987], "isController": false}, {"data": ["-217 cart", 6, 0, 0.0, 60.66666666666667, 37, 104, 54.5, 104.0, 104.0, 104.0, 0.21565667457407808, 0.5755758707138237, 0.07960763963769679], "isController": false}, {"data": ["-90 p1_price_2", 25, 0, 0.0, 43.28, 13, 87, 39.0, 79.00000000000003, 86.4, 87.0, 0.8052048441123422, 0.4175427463121618, 0.32239647078716827], "isController": false}, {"data": ["-173 header_message", 12, 12, 100.0, 29.5, 16, 47, 26.5, 46.1, 47.0, 47.0, 0.3945940613593765, 0.20115048831015092, 0.1398805119857946], "isController": false}, {"data": ["-222 country", 6, 0, 0.0, 44.16666666666667, 27, 73, 39.0, 73.0, 73.0, 73.0, 0.21580404992267022, 7.504459388375355, 0.07692234201345179], "isController": false}, {"data": ["-154 store", 12, 0, 0.0, 24.166666666666664, 11, 40, 23.5, 38.800000000000004, 40.0, 40.0, 0.3939851598923107, 0.44746556733863024, 0.1308153851204938], "isController": false}, {"data": ["-184 p50_price", 12, 0, 0.0, 32.66666666666667, 23, 53, 32.5, 48.80000000000001, 53.0, 53.0, 0.39460703715882933, 0.2038546119697468, 0.15838231667214733], "isController": false}, {"data": ["-109 header message", 25, 25, 100.0, 36.480000000000004, 20, 99, 32.0, 66.80000000000005, 94.19999999999999, 99.0, 0.806295555698897, 0.41102175788557055, 0.2858254753112301], "isController": false}, {"data": ["-215 ping", 6, 0, 0.0, 31.833333333333332, 12, 57, 30.0, 57.0, 57.0, 57.0, 0.21582733812949642, 0.09484599820143885, 0.07166142086330934], "isController": false}, {"data": ["S01_ACC_10_OpenCart_withTable", 4, 4, 100.0, 42.25, 24, 90, 27.5, 90.0, 90.0, 90.0, 0.14418571119602047, 1.2282538659793814, 0.3593378271213323], "isController": false}, {"data": ["S01_ACC_09_OpenCheckout_withTable&Chair", 2, 2, 100.0, 80.0, 53, 107, 80.0, 107.0, 107.0, 107.0, 0.10250627850955872, 4.645015952539593, 0.4353513723028036], "isController": true}, {"data": ["-111 store", 25, 0, 0.0, 27.6, 13, 72, 23.0, 51.400000000000006, 65.99999999999999, 72.0, 0.8064516129032258, 0.9159211189516129, 0.2677671370967742], "isController": false}, {"data": ["-164 category_51", 12, 0, 0.0, 34.75, 23, 59, 33.0, 56.000000000000014, 59.0, 59.0, 0.39372662248179013, 0.29414147089704046, 0.13841951571625433], "isController": false}, {"data": ["-93 p52_price_2", 25, 0, 0.0, 39.919999999999995, 13, 74, 35.0, 60.800000000000004, 70.39999999999999, 74.0, 0.8059316569954867, 0.41791963853965186, 0.32347452248549324], "isController": false}, {"data": ["-166 manufectures", 12, 0, 0.0, 29.833333333333336, 15, 41, 30.5, 41.0, 41.0, 41.0, 0.394205183798167, 0.24714817187346014, 0.14436224992608654], "isController": false}, {"data": ["-168 variants", 12, 12, 100.0, 51.75, 23, 152, 45.5, 123.5000000000001, 152.0, 152.0, 0.39401103230890466, 0.24664167159180458, 0.14236726753349094], "isController": false}, {"data": ["-197 cart2", 6, 0, 0.0, 36.5, 20, 87, 27.0, 87.0, 87.0, 87.0, 0.21630975556997623, 0.5773189081765088, 0.07984871836469824], "isController": false}, {"data": ["-196 cart", 6, 0, 0.0, 37.833333333333336, 22, 89, 28.0, 89.0, 89.0, 89.0, 0.21632535333141045, 0.5773605377487742, 0.07985447613210268], "isController": false}, {"data": ["-219 cart_total", 6, 0, 0.0, 51.833333333333336, 30, 75, 53.0, 75.0, 75.0, 75.0, 0.2156876842332303, 0.16998043083614925, 0.07814465903371917], "isController": false}, {"data": ["-183 store", 12, 0, 0.0, 21.749999999999996, 14, 36, 21.0, 33.60000000000001, 36.0, 36.0, 0.3947887879984208, 0.4483782816818002, 0.13108221476510068], "isController": false}, {"data": ["-162 p51_price", 12, 0, 0.0, 35.916666666666664, 15, 58, 34.5, 56.2, 58.0, 58.0, 0.3937524609528809, 0.20418218434177715, 0.1580393178238614], "isController": false}, {"data": ["-228 store", 6, 0, 0.0, 42.333333333333336, 16, 73, 38.5, 73.0, 73.0, 73.0, 0.21562567383023074, 0.24489517447710774, 0.07159446201394379], "isController": false}, {"data": ["-141 cart_post", 25, 0, 0.0, 28.040000000000003, 18, 49, 27.0, 36.400000000000006, 45.39999999999999, 49.0, 0.8126117341134406, 1.8037758512107915, 0.35551763367463024], "isController": false}, {"data": ["-163 p50_price", 12, 0, 0.0, 31.16666666666667, 16, 43, 32.5, 42.400000000000006, 43.0, 43.0, 0.39408866995073893, 0.20358682266009853, 0.15817426108374386], "isController": false}, {"data": ["-108 products", 25, 0, 0.0, 39.4, 20, 64, 40.0, 59.2, 63.099999999999994, 64.0, 0.8060615831049492, 2.1096142995324842, 0.3038474326938578], "isController": false}, {"data": ["-78 category", 25, 0, 0.0, 35.879999999999995, 13, 87, 35.0, 62.20000000000003, 81.89999999999999, 87.0, 0.8057238623179064, 1.2046515949303855, 0.33598055586889264], "isController": false}, {"data": ["-144 cart_get", 25, 0, 0.0, 18.32, 12, 28, 18.0, 25.200000000000006, 27.7, 28.0, 0.8130610120983478, 1.8047731254878365, 0.29536982080135293], "isController": false}, {"data": ["S01_ACC_02_OpenTablesTab", 25, 25, 100.0, 63.16000000000002, 33, 179, 45.0, 160.4, 174.5, 179.0, 0.8058017727639001, 8.050148569701854, 2.9493603948428686], "isController": false}, {"data": ["-137 category_1", 25, 0, 0.0, 19.119999999999997, 12, 31, 16.0, 27.800000000000004, 30.4, 31.0, 0.810399040487536, 1.2116415341664235, 0.29598558705306494], "isController": false}, {"data": ["-175 store", 12, 0, 0.0, 24.25, 14, 37, 24.0, 36.1, 37.0, 37.0, 0.3945810864132579, 0.16839056129159544, 0.13871991319216098], "isController": false}, {"data": ["-91 p50_price_2", 25, 0, 0.0, 40.32, 20, 74, 38.0, 64.60000000000002, 72.8, 74.0, 0.8053345359662404, 0.41603707961537223, 0.3232348576973875], "isController": false}, {"data": ["-128 ping", 25, 0, 0.0, 17.08, 10, 30, 15.0, 26.800000000000004, 29.4, 30.0, 0.8103727714748784, 0.3561208468395462, 0.26906908427876824], "isController": false}, {"data": ["-220 shipping", 6, 6, 100.0, 66.83333333333334, 42, 91, 69.0, 91.0, 91.0, 91.0, 0.21549402004094387, 0.1174274054519987, 0.08985932281004202], "isController": false}, {"data": ["-174 ping", 12, 0, 0.0, 19.25, 12, 30, 16.5, 29.700000000000003, 30.0, 30.0, 0.3947887879984208, 0.17349116660086852, 0.13108221476510068], "isController": false}, {"data": ["-116 pricep_post", 25, 0, 0.0, 32.32000000000001, 13, 96, 26.0, 56.800000000000004, 84.59999999999997, 96.0, 0.8065036453964772, 0.41821624580618105, 0.3229164986450739], "isController": false}, {"data": ["-53 localhost", 25, 0, 0.0, 26.800000000000004, 11, 75, 23.0, 42.0, 65.09999999999998, 75.0, 0.805594045048819, 0.36188794992427414, 0.2737761012470596], "isController": false}, {"data": ["-121 variants", 25, 25, 100.0, 56.28, 23, 178, 40.0, 157.20000000000002, 173.2, 178.0, 0.8059056767995874, 0.5044780652622417, 0.2911963871248509], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404", 148, 55.84905660377358, 10.850439882697946], "isController": false}, {"data": ["503", 6, 2.2641509433962264, 0.4398826979472141], "isController": false}, {"data": ["Assertion failed", 111, 41.886792452830186, 8.137829912023461], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1364, 265, "404", 148, "Assertion failed", 111, "503", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["S01_ACC_08_OpenCart_withTable&Chair", 2, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-195 header_message", 6, 6, "404", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["OPEN_CHECKOUT", 6, 6, "Assertion failed", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["-149 header_message", 12, 12, "404", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["S01_ACC_03_SelectProductTable", 25, 25, "Assertion failed", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_ACC_05_OpenChairsTab", 12, 12, "Assertion failed", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-129 header message", 25, 25, "404", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-69 header message", 25, 25, "404", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["S01_ACC_06_SelectProductChair", 12, 12, "Assertion failed", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_ACC_01_Launch", 25, 25, "Assertion failed", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-218 header_message", 6, 6, "404", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-173 header_message", 12, 12, "404", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-109 header message", 25, 25, "404", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["S01_ACC_10_OpenCart_withTable", 4, 4, "Assertion failed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-168 variants", 12, 12, "404", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["S01_ACC_02_OpenTablesTab", 25, 25, "Assertion failed", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-220 shipping", 6, 6, "503", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-121 variants", 25, 25, "404", 25, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
