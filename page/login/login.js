layui.use(['form','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    //登录按钮
    form.on("submit(login)",function(data){
        var articleFrom = data.field;
        var identity="";
        if(articleFrom.code.toUpperCase()!=articleFrom.codeText.toUpperCase()){
            layer.msg("验证码错误，请重新输入",{time:1000});
            return false;
        }
        if(articleFrom.identity==1){
            identity = "EmployeeController";
        }else if(articleFrom.identity==2){
            identity = "manager";
        }

        $.ajax({
            type:"GET",
           url:"http://localhost:9000/web/"+identity+"/login",
            
            data:{
                "id":articleFrom.id,
                "password":articleFrom.password
            },
            dataType:"JSON",
            success:function(data) {
                if(data.success=="false"){
                    layer.msg("用户名或密码错误",{time:1000});
                }else if(data.success=="ok"){
                    sessionStorage.setItem("accountInfo",JSON.stringify(data));
                    sessionStorage.setItem("identity",articleFrom.identity);
                    setTimeout(function(){
                        window.location.href = "/index.html";
                    },1000);
                }else{
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrow) {
                layer.msg("系统繁忙，请稍后再试",{time:1000});
                debugger;
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
        return false;
    })

    //表单输入效果
    $(".loginBody .input-item").click(function(e){
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    })
    $(".loginBody .layui-form-item .layui-input").focus(function(){
        $(this).parent().addClass("layui-input-focus");
    })
    $(".loginBody .layui-form-item .layui-input").blur(function(){
        $(this).parent().removeClass("layui-input-focus");
        if($(this).val() != ''){
            $(this).parent().addClass("layui-input-active");
        }else{
            $(this).parent().removeClass("layui-input-active");
        }
    })
})
