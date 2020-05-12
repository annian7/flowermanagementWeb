var accountInfo = JSON.parse(sessionStorage.getItem("accountInfo"));
var identity = sessionStorage.getItem("identity");
var vue = new Vue({
    el: "#userAdd",
    data: {
        account: accountInfo,
        identity: identity,
    }
});
layui.use(['form', 'laydate','layer'], function () {
    var form = layui.form,
      laydate = layui.laydate,
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
         //添加验证规则
         form.verify({
             userBirthday: function (value) {
                 if (!/^(\d{4})[\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|1[0-2])([\u4e00-\u9fa5]|[-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/.test(value)) {
                     return "出生日期格式不正确！";
                 }
             },
             newpassword: function (value, item) {
                 if (value.length < 6) {
                     return "密码长度不能小于6位";
                 }
             },
             phone:function (value,item) {
                 var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                 if (!reg.test(value)) {
                  
                     return "手机格式不对";
                 }
             },
             username:function (value,item) {
                 var name = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
                 if (!name.test(value)) {

                     return "姓名只支持中文两个汉字以上";
                 }
             }
         })
//选择出生日期
laydate.render({
    elem: '#birthday',
    format: 'yyyy-MM-dd',
    trigger: 'click',
    max: 0
});
    form.on("submit(addUser)", function (data) {
        console.log(data)
        var empId = $("#empId").val()
        var empName = $("#empName").val()
        var empPassword = $("#empPassword").val()
        var birthday = $("#birthday").val()
        var tel = $("#tel").val()
        var email = $("#email").val()
        var shop = data.field.shop
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        axios.get('http://localhost:9000/web/EmployeeController/insertEmployee', {
            params: {
                "empId": empId,
                "password": empPassword,
                "shop.shopId": shop,
                "name": empName,
                "birthday": birthday,
                "tel": tel,
                "email": email
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
                top.layer.msg("员工添加成功！");
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


