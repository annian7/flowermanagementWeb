layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#shopList',
        url : 'http://localhost:9000/web/ShopController/findByIdAndName',
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
        id : "shopTable",
        cols : [[
            {field: 'shopId', title: '店铺ID', minWidth:100, align:"center"},
            {field: 'name', title: '店铺名称', minWidth:100, align:"center"},
            {field: 'address', title: '店铺地址', minWidth:100, align:"center"},
            {title: '操作', minWidth:200, templet:'#shopListBar',fixed:"right",align:"center"}
        ]],
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("shopTable",{
                url : 'http://localhost:9000/web/ShopController/findByIdAndName',
                where: {
                    name: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            table.reload("shopTable",{
                url : 'http://localhost:9000/web/ShopController/findByIdAndName',
                where:{
                    name:""
                }
            })
            // layer.msg("请输入搜索的内容");
        }
    });

    //添加店铺
    function addUser(edit){
        var index = layui.layer.open({
            title : "添加店铺",
            type : 2,
            content : "shopAdd.html",
            success : function(layero, index){
                setTimeout(function(){
                    layui.layer.tips('点击此处返回店铺列表', '.layui-layer-setwin .layui-layer-close', {
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
            title : "修改店铺信息",
            type : 2,
            content : "modifyshopInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    $.ajax({
                        type:"GET",
                       url:"http://localhost:9000/web/ShopController/selectOne",
                        data:{
                            "id":edit.shopId
                        },
                        async: false,
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(data))
                            body.find(".id").val(data.shopId);
                            body.find(".name").val(data.name);
                            body.find(".address").val(data.address);
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
    table.on('tool(shopList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            edit(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定关闭此店铺？',{icon:3, title:'提示信息'},function(index){
                $.get("http://localhost:9000/web/ShopController/delete", {
                    "shopId": data.repId  //将需要删除的newsId作为参数传入
                },function(data){
                    console.log(data);
                    if(data.result==1){
                        tableIns.reload();
                        layer.msg("已关闭",{time:1000});
                        layer.close(index);
                    }else{
                        tableIns.reload();
                        layer.msg("关闭失败",{time:1000});
                        layer.close(index);
                    }  
                })
            });
        }
    });

})
