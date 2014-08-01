/****************************************************************
 * 		 Dropdown Menu Components
 * 		 @by   Wooleners
 *       @time 2014-08-01 18:07:55
 *
 *****************************************************************/

(function(comp) {
    this.palading = {};
    this.palading.dropMenu = comp;
})(function() {
        var config = {
                el: "",
                toggleStatus: true,
                breadQueue: [
                    {
                        type: "cityView",
                        mark: ""
                    }, {
                        type: "stationView",
                        mark: ""
                    }, {
                        type: "courierView",
                        mark: ""
                    }
                ]
            },
            data = function() {
                var url = {
                    city: "/data/city_list",
                    station: "/data/station_list",
                    courier: "/data/courier_list"
                };

                var callfunc = function(link, func, type, mark){
                    $.ajax(link).done(function(res) {
                        func(res, type, mark);
                    });
                }
                var callFilterfunc = function(link, func, key){
                    $.ajax(link).done(function(res) {
                        func(res, key);
                    });
                }

                return {
                    getCityList: function(func) {
                        callfunc(url.city, func, "cityView", "");
                    },
                    getStationList: function(func, city_id) {
                        callfunc(url.station + "?city_id=" + city_id, func, "stationView", city_id);
                    },
                    getCourierList: function(func, station_id) {
                        callfunc(url.courier + "?station_id=" +  station_id, func, "courierView", station_id);
                    },
                    getCourierFilterList: function(func, key){
                        callFilterfunc(url.courier + "?keyword=" + key, func, key);
                    }
                }
            };

        function template() {
            function createTemps(el) {
                var left = el.offset().left,
                    top = el.offset().top + el.parent().height(),
                    container = "";
                container = "<div class='dropMenu' style='left:" + left +
                            "px;top:" + top + "px;width:350px'>" +
                            "<div class='dropMenu_header' id='dropMenu_header'>" +
                            "<ol class='breadcrumb'>" +
                            "</ol>" +
                            "</div>" +
                            "<div class='dropMenu_inner' id='dropMenu_inner'></div>" +
                            "</div>";
                $("body").append(container);
            }
            function view(){
                function cityView() {
                    //bussiness
                    data().getCityList(createView);
                }
                function stationView(city_id){
                    data().getStationList(createView, city_id);
                }

                function courierView(station_id){
                    data().getCourierList(createView, station_id);
                }

                function createView(res, type, mark){
                    var breadMenu = $(".breadcrumb"),
                        innerContent = $(".dropMenu_inner"),
                        dataList = JSON.parse(res),
                        innerHtml = "<table class='table'>",
                        typeContains = {
                            "cityView": {
                                "breadMenuInner": ["选择城市"],
                                "queueIndex": 0,
                                "noResult": "没有查找到城市"
                            },
                            "stationView": {
                                "breadMenuInner": ["选择城市", "选择配送站"],
                                "queueIndex": 1,
                                "noResult": "没有找到配送站"
                            },
                            "courierView": {
                                "breadMenuInner": ["选择城市", "选择配送站", "选择配送员"],
                                "queueIndex": 2,
                                "noResult": "没有找到配送员"
                            }
                        }, breadQueue = config.breadQueue;
                    //push breadMenu
                    breadQueue.forEach(function(item, index){
                        item["type"] == type ? breadQueue[index]["mark"] = mark : false;
                    });
                    config.breadQueue = breadQueue;
                    var createBreadMenu = function(type){
                        var currentInner = typeContains[type]["breadMenuInner"],
                            html = "";
                        currentInner.forEach(function(item){
                            html += "<li class='bread_single'><a href='#'>" + item + "</a></li>";
                        });
                        document.get


                        return html;
                    }

                    breadMenu.html(createBreadMenu(type));
                    innerHtml += "<tbody>";
                    $.isEmptyObject(dataList) ? (innerHtml += processNoResult(typeContains[type]["noResult"])) : (innerHtml += processSingle(dataList, typeContains[type]["queueIndex"]));

                    innerHtml += "</tbody></table>";
                    innerContent.html(innerHtml);

                }

                function processNoResult(text){
                    return "<tr><td class='noResult'>" + text + "</td></tr>";
                }

                function processSingle(list, current){
                    var singleQueue = [
                        {
                            className: 'city_single',
                            id: 'city_id',
                            fieldName: 'id'
                        },{
                            className: 'station_single',
                            id: 'station_id',
                            fieldName: 'id'
                        },{
                            className: 'courier_single',
                            id: 'courier_id',
                            fieldName: 'user_id'
                        }
                    ], html = "<tr>";

                    list.forEach(function(item, index){
                        if(index % 4 == 0 && index != 0){
                            html += "</tr><tr>"
                        }
                        html += "<td class='" + singleQueue[current]["className"] + "' " + singleQueue[current]["id"] + "='" + item[singleQueue[current]["fieldName"]] + "'>" + item.name + "</td>";
                    });
                    return html;
                }

                return {
                    initCity: cityView,
                    initStation: stationView,
                    initCourier: courierView
                }
            }

            function initEventHander(){
                var innerCtrl = function(){
                    var singleColl = ["city_single", "station_single", "courier_single"];
                    $("#dropMenu_inner").delegate(".city_single", 'click', function(){
                        var city_id = $(this).attr("city_id");
                        view().initStation(city_id);
                    });
                    $("#dropMenu_inner").delegate(".station_single", 'click', function(){
                        var station_id = $(this).attr("station_id");
                        view().initCourier(station_id);

                    });
                    $("#dropMenu_inner").delegate(".courier_single", 'click', function(){
                        var courier_id = $(this).attr("courier_id");
                        $("#diliveryman").val($(this).text());
                        $("#courier_val").val(courier_id);
                        $(".dropMenu").remove();
                    });
                }
                var breadCtrl = function(){
                    var handler = {
                        "cityView": view().initCity,
                        "stationView": view().initStation,
                        "courierView": view().initCourier
                    };
                    $("#dropMenu_header").delegate(".bread_single", 'click', function(){
                        var breadQueue = config.breadQueue,
                            current = $(this),
                            type = breadQueue[current.index()]["type"],
                            id = breadQueue[current.index()]["mark"];
                        handler[type](id);
                    });
                }
                var initCtrl = function(){
                    breadCtrl();
                    innerCtrl();
                }
                return {
                    init : initCtrl
                }
            }

            function init(el) {
                config.toggleStatus = false;
                createTemps(el);
                view().initCity();
                initEventHander().init();
            }

            function destory() {
                $(".dropMenu").remove();
                return this;
            }
            return {
                init: init,
                destory: destory
            }
        }

        function config() {

        }

        function typeaheadCtrl(){
            function template(el){
                function createTemps(el){
                    var left = el.offset().left,
                        top = el.offset().top + el.parent().height(),
                        container = "";
                    container = "<div class='dropFilterList' style='left:" + left +
                                "px;top:" + top + "px;'>" +
                                "<div class='dropFilterList_inner'>" +
                                "<ul class='dropFilterList_result'>" +
                                "</ul>" +
                                "</div>" +
                                "</div>";
                    $("body").append(container);
                }
                return {
                    init: function(el, value){
                        createTemps(el);
                        filter(value);
                    },
                    destory: function(){
                        $(".dropFilterList").remove();
                        return this;
                    },
                    clear: function(){
                        $(".dropFilterList .dropFilterList_result").empty();
                    }
                }
            }
            function initKeyDown(){
                $(document).unbind("keydown");
                $(document).bind("keydown", function(e){
                    var which = e.which, sts = [38, 40, 13].some(function(item){
                        return item == which;
                    }),
                    flags,
                    currentEl = $(".dropFilterList .dropFilterList_result").children(".hover"),
                    len = $(".dropFilterList .dropFilterList_result").children().length,
                    current = currentEl.index();
                    if(!sts && len){
                        return;
                    }
                    if(which == 13){
                        $("#diliveryman").val(currentEl.attr("courier_name"));
                        $("#courier_val").val(currentEl.attr("courier_id"));
                        template().destory();
                        event.preventDefault();
                        return false;
                    }
                    flags = (which == 38) ? -1 : 1;
                    $(".dropFilterList .dropFilterList_result_item").removeClass("hover").eq((current + flags + len) % len).addClass("hover");
                });
            }
            function filter(key){
                data().getCourierFilterList(function(res, key){
                    var dataList = JSON.parse(res),
                        filterList = "";
                    if($.isEmptyObject(dataList)){
                        var tips_html = "<li class='dropFilterList_result_tips'>无法找到<span class='tips'>" + key + "</span></li>";
                        $(".dropFilterList .dropFilterList_result").html(tips_html);
                        return;
                    };
                    dataList.forEach(function(item){
                        filterList += "<li class='dropFilterList_result_item' courier_name='" + item.name + "' courier_id='" + item.user_id + "'>" + item.name + "(" + item.description + ")</li>";
                    });
                    $(".dropFilterList .dropFilterList_result").html(filterList);
                    $(".dropFilterList .dropFilterList_result").children("li").eq(0).addClass("hover");
                    initKeyDown();
                }, key);
            }
            function init(el, value){
                template().destory().init(el, value);
            }
            return {
                init: init
            }
        }

        function handler(el) {
            el.unbind("click").click(function() {
                if (!$(".dropMenu").length) {
                    //template init
                    $(".dropFilterList").remove();
                    template().destory().init(el);
                    //setting comp toggle
                    $(document).click(function(e) {
                        //fixed input click twice
                        if (e.target == el[0]) {
                            return;
                        }
                        var parents = $(e.target).parents();
                        //add current element to select array
                        parents.push(parents["context"]);
                        if ($.inArray($(".dropMenu")[0], parents) == -1) {
                            //remove click handler
                            $(".dropMenu").remove();
                            $(document).unbind("click");
                        }
                    });
                } else {
                    $(".dropMenu").remove();
                }
            });
            el.keyup(function(e){
                if([13,38,40].some(function(item){
                    return item == e.which;
                })){
                    return;
                }
                var value = $(this).val();
                ($.trim(value) == "") ? (function(){
                    $(".dropFilterList").remove();
                    template().destory().init(el);
                }()) : (function(){
                    $(".dropMenu").remove();
                    typeaheadCtrl().init(el, value);
                    $(document).click(function(e) {
                        //fixed input click twice
                        if (e.target == el[0]) {
                            return;
                        }
                        var parents = $(e.target).parents();
                        //add current element to select array
                        parents.push(parents["context"]);
                        if ($.inArray($(".dropFilterList")[0], parents) == -1) {
                            //remove click handler
                            $(".dropFilterList").remove();
                            $(document).unbind("click");
                        }
                    });
                }());
            });
        }

        function init(target) {
            handler(target);
        }
    return {
        init: init
    }
}());
