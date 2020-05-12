layui.use(['form','layer','table','laytpl'],function(){ 
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#empList',
        url : 'http://localhost:9000/web/EmployeeController/selectAll',
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
        id : "empListTable",
        cols : [[
            {field: 'empId', title: '职工号', minWidth:100, align:"center"},
            {field: 'name', title: '姓名', minWidth:100, align:"center"},
            {field: 'shop', title: '所属店铺', minWidth:100, align:"center",
                templet: function(d){
                    return d.shop.name
                }
            },
            {field: 'email', title: '邮箱', align:'center',templet:function(d){
                if(d.email!=null&&d.email!=""){
                    return '<a class="layui-blue" href="mailto:'+d.email+'">'+d.email+'</a>';
                }else{
                    return "无";
                }
            }},
            {field: 'tel', title: '手机号', align:'center',templet:function(d){
                if(d.tel!=null&&d.tel!=""){
                    return d.tel;
                }else{
                    return "无";
                }
            }},
            {title: '操作', minWidth:200, templet:'#empListBar',fixed:"right",align:"center"}
        ]],
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("empListTable",{
                where: {
                    empId: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            table.reload("empListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id: 0  //搜索的关键字
                }
            })
            // layer.msg("请输入搜索的内容");
        }
    });

    //添加用户
    function addUser(edit){
        var index = layui.layer.open({
            title : "添加用户",
            type : 2,
            content : "empAdd.html",
            success : function(layero, index){
                setTimeout(function(){
                    layui.layer.tips('点击此处返回员工列表', '.layui-layer-setwin .layui-layer-close', {
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
//编辑
    function edit(edit){
        var index = layui.layer.open({
            title : "修改员工信息",
            type : 2,
            content : "modifyEmpInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body',index);
                if(edit){
                    $.ajax({
                        type:"GET",
                       url:"http://localhost:9000/web/EmployeeController/selectById",
                        data:{
                            "empId":edit.empId
                        },
                        async: false,
                        dataType:"JSON",
                        success:function(data) {
                            console.log(JSON.stringify(data))
                            body.find(".id").val(data.empId);  //登录名
                            body.find(".name").val(data.name);
                            body.find(".shop").val(data.shop.name);
                            if(data.tel!=null||data.tel!=""){
                                body.find(".tel").val(data.tel);
                            }
                            if(data.birthday!=null||data.birthday!=""){
                                body.find(".birthday").val(data.birthday);
                            }
                            if(data.email!=null||data.email!=""){
                                body.find(".email").val(data.email);
                            }
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
    table.on('tool(empList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            edit(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
                $.get("http://localhost:9000/web/EmployeeController/deleteEmployee", {
                    "empId": data.empId  //将需要删除的newsId作为参数传入
                },function(data){
                    console.log(data);
                    if(data.result==1){
                        tableIns.reload();
                        layer.msg("删除成功",{time:1000});
                        layer.close(index);
                    }else{
                        tableIns.reload();
                        layer.msg("删除失败",{time:1000});
                        layer.close(index);
                    }  
                })
            });
        } else if (layEvent === 'reset') { //重置
            layer.confirm('密码重置后为123456!', { icon: 3, title: '提示信息' }, function (index) {
                $.get("http://localhost:9000/web/EmployeeController/resetPassword", {
                    empId: data.empId  //将需要重置的newsId作为参数传入
                }, function (data) {
                    if(data.result==1){
                        tableIns.reload();
                        layer.msg("重置成功",{time:1000});
                        layer.close(index);
                    }else{
                        tableIns.reload();
                        layer.msg("重置失败",{time:1000});
                        layer.close(index);
                    }
                })
            });
        }
    });

})
