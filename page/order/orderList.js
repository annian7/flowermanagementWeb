layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
    var identity = sessionStorage.getItem("identity");
    var vue = new Vue({
        el:"#orderList",
        data:{
            identity:identity
        }
    });
    var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
    if(identity==1){
        //店铺订单列表
    var tableIns = table.render({
        elem: '#orderList',
        url : 'http://localhost:9000/web/order/selectById',
        where:{
            "shopId":accountInfo.shop.shopId
        },
        parseData: function(res){ //res 即为原始返回的数据
            return {
              "code": 0, //解析接口状态
              "msg": "", //解析提示文本
              "data": res //解析数据列表
            };
          },
        cellMinWidth : 95,
        page : false,
        height : "full-125",
        id : "orderListTable",
        cols : [[
            {field: 'ordId', title: '订单号', minWidth:100, align:"center"},
            {field: 'commodity', title: '商品名称', minWidth:100, align:"center"},
            {field: 'shop', title: '所属店铺', minWidth:150, align:"center",
                templet: function(d){
                    console.log(d);
                    return d.shop.name;
                }
            },
            {field: 'shop', title: '操作人', minWidth:100, align:"center",
                templet: function(d){
                    console.log(d);
                    return d.employee.name;
                }
            },
            {field: 'quantity', title: '数量', align:'center'},
            {field: 'price', title: '单价', align:'center'},
            {field: 'totalPrice', title: '总价', align:'center'},
            {field: 'saveDate', title: '下单时间',minWidth:170, align:'center'},
            {title: '操作', minWidth:200, templet:'#orderListBar',fixed:"right",align:"center"}
        ]],
    });
    }else{
        //订单列表
    var tableIns = table.render({
        elem: '#orderList',
        url : 'http://localhost:9000/web/order/selectAll',
        parseData: function(res){ //res 即为原始返回的数据
            return {
              "code": 0, //解析接口状态
              "msg": "", //解析提示文本
              "data": res //解析数据列表
            };
          },
        cellMinWidth : 95,
        page : false,
        height : "full-125",
        id : "orderListTable",
        cols : [[
            {field: 'ordId', title: '订单号', minWidth:100, align:"center"},
            {field: 'commodity', title: '商品名称', minWidth:100, align:"center"},
            {field: 'shop', title: '所属店铺', minWidth:150, align:"center",
                templet: function(d){
                    console.log(d);
                    return d.shop.name;
                }
            },
            {field: 'shop', title: '操作人', minWidth:100, align:"center",
                templet: function(d){
                    console.log(d);
                    return d.employee.name;
                }
            },
            {field: 'quantity', title: '数量', align:'center'},
            {field: 'price', title: '单价', align:'center'},
            {field: 'totalPrice', title: '总价', align:'center'},
            {field: 'saveDate', title: '下单时间',minWidth:170, align:'center'},
            {title: '操作', minWidth:200, templet:'#orderListBar',fixed:"right",align:"center"}
        ]],
    });
    }
    

    //搜索订单
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("orderListTable",{
                url:"http://localhost:9000/web/order/selectOne",
                where: {
                    id: $(".searchVal").val()  //搜索的关键字
                },
                parseData: function(res){ //res 即为原始返回的数据
                    return {
                      "code": 0, //解析接口状态
                      "msg": "", //解析提示文本
                      "data": [res] //解析数据列表
                    };
                  }
            })
        }else{
            table.reload("orderListTable",{
                url : 'http://localhost:9000/web/order/selectAll',
                parseData: function(res){ //res 即为原始返回的数据
                    return {
                      "code": 0, //解析接口状态
                      "msg": "", //解析提示文本
                      "data": res //解析数据列表
                    };
                  }
            })
            // layer.msg("请输入搜索的内容");
        }
    });

    //添加订单
    function addUser(edit){
        var index = layui.layer.open({
            title : "添加库存商品",
            type : 2,
            content : "repertoryAdd.html",
            success : function(layero, index){
                setTimeout(function(){
                    layui.layer.tips('点击此处返回订单列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    $(".addNews_btn").click(function(){
        addUser();
    })
//查看 根据id获取原值
    function query(edit){
        var index = layui.layer.open({
            title : "订单详情",
            type : 2,
            content : "orderInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    $.ajax({
                        type:"GET",
                       url:"http://localhost:9000/web/order/selectOne",
                        data:{
                            "id":edit.ordId
                        },
                        async: false,
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(data))
                            body.find(".id").val(data.repId);  //登录名
                            body.find(".commodity").val(data.commodity);
                            body.find(".shop").val(data.shop.name);
                            body.find(".quantity").val(data.quantity);
                            body.find(".emp").val(data.employee.name);
                            body.find(".surplus").val(data.surplus);
                            body.find(".price").val(data.price);
                            body.find(".totalPrice").val(data.totalPrice);
                            body.find(".name").val(data.name);
                            body.find(".tel").val(data.tel);
                            body.find(".address").val(data.address);
                            body.find(".remarks").val(data.remarks);
                            body.find(".saveDate").val(data.saveDate);
                            form.render();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrow) {
                            layer.msg("系统繁忙，请稍后再试",{time:1000});
                            debugger;
                            console.log(XMLHttpRequest.status);
                            console.log(XMLHttpRequest.readyState);
                            console.log(textStatus);
                        }
                    });
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }

    //列表操作
    table.on('tool(orderList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'query'){ //查看
            query(data);
        }
    });

})
