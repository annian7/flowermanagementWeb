var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
var identity = sessionStorage.getItem("identity");

layui.use(['form', 'laydate','layer'], function () {
    var form = layui.form,
      laydate = layui.laydate,
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
         //添加验证规则
         form.verify({
             
             name:function (value,item) {
                 var name = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
                 if (!name.test(value)) {

                     return "名称只支持中文两个汉字以上";
                 }
             }
         })

    form.on("submit(addUser)", function (data) {
        console.log(data)
        var name = $("#name").val()
        var address = $("#address").val()
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        axios.get('http://localhost:9000/web/ShopController/insert', {
            params: {
                "name": name,
                "address": address,
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
                top.layer.msg("店铺信息添加成功！");
                //刷新父页面
                parent.location.reload();
                layer.closeAll("iframe");
                
            }, 2000);
        return false;

    })
})


//查询所有店铺
$.ajax({
    type: "GET",
    url: "http://localhost:9000/web/ShopController/findByIdAndName",
    dataType: "JSON",
    async: false,
    success: function (data, item) {
        for (var item = 0; item < data.length; item++) {
            var newOption = document.createElement("option");
            newOption.text = data[item].name;
            newOption.value = data[item].shopId;
            document.getElementById("shop").add(newOption);
        }


    },
    error: function (XMLHttpRequest, textStatus, errorThrow) {
        layer.msg("系统繁忙，请稍后再试", {
            time: 1000
        });
        debugger;
        console.log(XMLHttpRequest.status);
        console.log(XMLHttpRequest.readyState);
        console.log(textStatus);
    }
});


