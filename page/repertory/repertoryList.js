layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
    var identity = sessionStorage.getItem("identity");
    var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
    var manager = "";
    if(identity==2){
        manager=true;
    }else{
        manager=false;
    }
    var vue = new Vue({
        el:"#repertory",
        data:{
            manager:manager
        }
    });
    //用户列表
    if(identity==2){
        var tableIns = table.render({
            elem: '#repertoryList',
            url : 'http://localhost:9000/web/repertory/selectAll',
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
            id : "repertoryListTable",
            cols : [[
                {field: 'repId', title: '库存号', minWidth:100, align:"center"},
                {field: 'commodity', title: '商品名称', minWidth:100, align:"center"},
                {field: 'shop', title: '所属店铺', minWidth:100, align:"center",
                    templet: function(d){
                        console.log(d);
                        return d.shop.name;
                    }
                },
                {field: 'quantity', title: '总数量', align:'center'},
                {field: 'surplus', title: '剩余', align:'center'},
                {field: 'price', title: '单价', align:'center'},
                {field: 'saveDate', title: '添加时间',minWidth:200, align:'center'},
                {title: '操作', minWidth:200, templet:'#repertoryListBar',fixed:"right",align:"center"}
            ]],
        });
    }else{
        var tableIns = table.render({
            elem: '#repertoryList',
            url : 'http://localhost:9000/web/repertory/selectByShopId',
            where:{
                "id":accountInfo.shop.shopId
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
            id : "repertoryListTable",
            cols : [[
                {field: 'repId', title: '库存号', minWidth:100, align:"center"},
                {field: 'commodity', title: '商品名称', minWidth:100, align:"center"},
                {field: 'shop', title: '所属店铺', minWidth:100, align:"center",
                    templet: function(d){
                        console.log(d);
                        return d.shop.name;
                    }
                },
                {field: 'quantity', title: '总数量', align:'center'},
                {field: 'surplus', title: '剩余', align:'center'},
                {field: 'price', title: '单价', align:'center'},
                {field: 'saveDate', title: '添加时间',minWidth:200, align:'center'},
                {title: '操作', minWidth:200, templet:'#repertoryListBar2',fixed:"right",align:"center"}
            ]],
        });
    }
    

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("repertoryListTable",{
                url:"http://localhost:9000/web/repertory/selectByShopName",
                where: {
                    shopName: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            table.reload("empListTable",{
                where: {
                    id: 0  //搜索的关键字
                }
            })
            // layer.msg("请输入搜索的内容");
        }
    });

    //添加库存
    function addUser(edit){
        var index = layui.layer.open({
            title : "添加库存商品",
            type : 2,
            content : "repertoryAdd.html",
            success : function(layero, index){
                setTimeout(function(){
                    layui.layer.tips('点击此处返回库存列表', '.layui-layer-setwin .layui-layer-close', {
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
//编辑 进入编辑页面根据id获取原值
    function edit(edit){
        var index = layui.layer.open({
            title : "修改库存商品信息",
            type : 2,
            content : "modifyRepertoryInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    $.ajax({
                        type:"GET",
                       url:"http://localhost:9000/web/repertory/selectOne",
                        data:{
                            "id":edit.repId
                        },
                        async: false,
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(data))
                            body.find(".id").val(data.repId);  //登录名
                            body.find(".name").val(data.commodity);
                            body.find(".shop").val(data.shop.name);
                            body.find(".quantity").val(data.quantity);
                            body.find(".surplus").val(data.surplus);
                            body.find(".price").val(data.price);
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
    //添加
    function add(edit){
        var index = layui.layer.open({
            title : "添加订单",
            type : 2,
            content : "../order/orderAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    $.ajax({
                        type:"GET",
                       url:"http://localhost:9000/web/repertory/selectOne",
                        data:{
                            "id":edit.repId
                        },
                        async: false,
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(accountInfo))
                            body.find(".emp").val(accountInfo.name);  //登录名
                            body.find(".commodity").val(data.commodity);
                            body.find(".name").val(data.name);
                            body.find(".shop").val(data.shop.name);
                            body.find(".surplus").val(data.surplus);
                            body.find(".price").val(data.price);
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
    table.on('tool(repertoryList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            edit(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定下架此商品？',{icon:3, title:'提示信息'},function(index){
                $.get("http://localhost:9000/web/repertory/delete", {
                    "id": data.repId  //将需要删除的newsId作为参数传入
                },function(data){
                    console.log(data);
                    if(data.result==1){
                        tableIns.reload();
                        layer.msg("已下架",{time:1000});
                        layer.close(index);
                    }else{
                        tableIns.reload();
                        layer.msg("下架失败",{time:1000});
                        layer.close(index);
                    }  
                })
            });
        }else if(layEvent === 'add'){
            add(data);
        }
    });

})
