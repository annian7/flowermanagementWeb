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
             }
         })

    form.on("submit(addUser)", function (data) {
        console.log(data)
        var commodity = $("#name").val()
        var quantity = $("#quantity").val()
        var price = $("#price").val()
        var shop = data.field.shop
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        axios.get('http://localhost:9000/web/repertory/insert', {
            params: {
                "shop.shopId": shop,
                "commodity": commodity,
                "quantity": quantity,
                "surplus":quantity,
                "price":price
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                debugger;
                console.log(error);
            })
            .then(function () {
                // always executed
            });
            top.layer.close(index);
            setTimeout(function () {
                top.layer.msg("库存商品添加成功！");
                //刷新父页面
                parent.location.reload();
                layer.closeAll("iframe");
                
            }, 2000);
        return false;

    })
})



