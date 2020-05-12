var form, $,areaData;
layui.config({
    base : "../../js/"
}).extend({
    "address" : "address"
})
var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
console.log(JSON.stringify(accountInfo))

layui.use(['form','layer','upload','laydate',"address"],function(){
    form = layui.form;
    $ = layui.jquery;
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        upload = layui.upload,
        laydate = layui.laydate,
        address = layui.address;

    //添加验证规则
    form.verify({
        userBirthday : function(value){
            if(!/^(\d{4})[\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|1[0-2])([\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/.test(value)){
                return "出生日期格式不正确！";
            }
        }
    })

    //提交商品信息
    form.on("submit(changeUser)",function(data){
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
            $.ajax({
                type:"get",
                url:"http://localhost:9000/web/repertory/update",
                data:{
                    'repId' : $(".id").val(),
                    'commodity' : $(".name").val(),
                    'quantity' : $(".quantity").val(),
                    'surplus' : $(".surplus").val(),
                    'price' : $(".price").val()
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
})