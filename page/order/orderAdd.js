var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
var identity = sessionStorage.getItem("identity");

layui.use(['form', 'laydate','layer'], function () {
    var form = layui.form,
      laydate = layui.laydate,
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
         //添加验证规则
         form.verify({
            quantity: function (value) {
                if(value==null || value==0 || !/^\d{1,}$/.test(value) || value>100){
                    return "数量只能在0-100之间";
                }
             },
             tel: function (value) {
                if(value!=null && value!=''){
                    if(!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)){
                        return "手机号码格式不正确";
                    }
                }
             }
         })

    form.on("submit(addUser)", function (data) {
        console.log(data)
        var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
        var commodity = $(".commodity").val()
        var quantity = $(".quantity").val()
        var price = $(".price").val()
        var shop = accountInfo.shop.shopId
        var name = $(".name").val();
        var address = $(".address").val();
        var tel = $(".tel").val();
        var remarks = $(".remarks").val();
        var totalPrice = price*quantity;
        //弹出loading
        layer.confirm('订单总价为'+totalPrice+'元',{icon:3, title:'提示信息'},function(index){
            $.ajax({
                type:"GET",
               url:"http://localhost:9000/web/order/insert",
                data:{
                    "shop.shopId": shop,
                    "employee.empId":accountInfo.empId,
                    "commodity": commodity,
                    "quantity": quantity,
                    "price":price,
                    "totalPrice":totalPrice,
                    "name":name,
                    "address":address,
                    "tel":tel,
                    "remarks":remarks
                },
                dataType:"JSON",
                success:function(data) {
                    if(data.result==1){
                        layer.msg("下单成功",{time:1000});
                        layer.close(index);
                            //刷新父页面
                            parent.location.reload();
                            layer.closeAll("iframe");
                    }else{
                        layer.msg("下单失败",{time:1000});
                        layer.close(index);
                            //刷新父页面
                            parent.location.reload();
                            layer.closeAll("iframe");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrow) {
                    layer.msg("系统繁忙，请稍后再试",{time:1000});
                    layer.close(index);
                    debugger;
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        });
        return false;

    })
})



