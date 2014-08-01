/****************************************************************
 * 		 Pagination Components
 * 		 @by   Wooleners
 *       @time 2014-08-01 18:09:39
 *
 *****************************************************************/

(function(comp) {
    this.palading.pagination = comp;
})(function(){
    var config = {
        params: [

        ],
        toolbar: {
            show: false,
            pageSize: 30
        }
    };
    function setting(){
        return {
            init: function(){
                //mix config
                $.extend(config, arguments[0], true);
            },
            params: function(){
                return config.params.map(function(param){
                    return Object.defineProperty({}, param.key, {
                        value: param.value,
                        enumerable: true
                    });
                }).reduce(function(prev, curr , index , array){
                    return $.extend(curr, prev);
                });
            },
            paramsUpdate: function(key, value){
                config.params.map(function(param){
                    param.key == key ? param.value = value : false;
                });
            }
        }
    }
    function ajax(){
        return {
            init: function(){
                var self = this;
                $.ajax({
                    url:config.url,
                    data: setting().params()
                }).done(function(data){
                    //create start
                    creator().setup(JSON.parse(data));
                });
            },
            update: function(){
                $.ajax({
                    url:config.url,
                    data: setting().params()
                }).done(function(data){
                    creator().update(JSON.parse(data));
                });
            }
        }
    }
    function creator(){
        return {
            setup: function(data){
                //call customize template func
                config.target.html(config.template(data));
                //extend data totalCount
                $.extend(config, {
                    "toolbarTotal": data.total_count
                });
                //configable listener
                config.toolbar.show ? toolbar().init() : false;
            },
            update: function(data){
                config.target.html(config.template(data));
            }
        }
    }
    function toolbar(){
        function createToolbar(){
            var toolbarHtml = "", innerTaget = config.target;
            toolbarHtml += '<div class="toolbar"><ul id="light-pagination"><ul></div>';
            innerTaget.after(toolbarHtml);
        }
        function jump(){
            var toolbarTotal = config.toolbarTotal, jumpHtml = '';
            jumpHtml += '<div class="jumpPage">';
            jumpHtml += '跳转到';
            jumpHtml += '<input style="width:80px;" id="jumpPage" />';
            jumpHtml += ' 页';
            jumpHtml += '</div>';
            $("#light-pagination").before(jumpHtml);
            jumpListener();
        }
        function jumpListener(){
            $("#jumpPage").keyup(function(e){
                var pageNum = $(this).val(), currPage = $('#light-pagination').pagination('getCurrentPage');
                if(e.which == 13){
                     ($.isNumeric(pageNum) && pageNum > 0 && pageNum <= Math.ceil(config.toolbarTotal / config.toolbar.pageSize) && currPage != pageNum) ? (function(){
                        var pageSize = config.toolbar.pageSize,
                            offset = (pageNum - 1) * pageSize;
                        $('#light-pagination').pagination('selectPage', pageNum)
                    }()) : $(this).val("");
                }
            });
        }
        return {
            init: function(){
                //$.extend(config, this.data, this.config);
                createToolbar();
                var pageClick = function(pageNum){
                    var pageSize = config.toolbar.pageSize,
                        offset = (pageNum - 1) * pageSize;
                    setting().paramsUpdate("offset", offset);
                    ajax().update();
                }
                $('#light-pagination').pagination({
                	pages: Math.ceil(config.toolbarTotal / config.toolbar.pageSize),
                    onPageClick: pageClick
                });
                jump();

            }

        }
    }
    return {
        init: function(){
            this.destory();
            setting().init.apply(null, arguments);
            ajax().init.call(this);
        },
        filter: function(link){
            this.destory();
            config.url = link;
            setting().paramsUpdate('offset', 0);
            ajax().init.call(this);
        },
        //open config API
        getConfig: function(key){
            return !!config[key] ? config[key] : -1;
        },
        destory: function(){
            $(".table-vipcar").empty();
            $(".toolbar").remove();
        }
    }
}());
