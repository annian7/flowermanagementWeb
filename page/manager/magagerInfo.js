var form, $,areaData;
layui.config({
    base : "../../js/"
}).extend({
    "address" : "address"
})
var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
// alert(JSON.stringify(accountInfo))
var vue = new Vue({
	el:"#managerInfo",
	data:{
        account:accountInfo
	}
});
layui.use(['form','layer','upload','laydate',"address"],function(){
    form = layui.form;
    $ = layui.jquery;
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        upload = layui.upload,
        laydate = layui.laydate,
        address = layui.address;

    
    //提交个人资料
    form.on("submit(changeUser)",function(data){
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
        var hidden = $(".hidden").val();
            $.ajax({
                type:"get",
                url:"http://localhost:9000/web/manager/update",
                data:{
                    'managerId' : $(".id").val(),
                    'name' : $(".name").val(),
                    'tel' : $(".tel").val(),
                    'email' : $(".email").val()
                },
                dataType:"JSON",
                success:function(data) {
                    if(data!=null){
                        layer.close(index);
                        layer.msg("修改成功！");
                        sessionStorage.setItem("accountInfo",JSON.stringify(data));
                    }else{
                        layer.close(index);
                        layer.msg("修改失败！");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrow) {
                    layer.close(index);
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                    debugger;
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })

    //修改密码
    form.on("submit(changePwd)",function(data){
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            layer.msg("密码修改成功！");
            $(".pwd").val('');
        },2000);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })
})