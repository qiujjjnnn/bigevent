$(function() {
    $('#link_reg').on('click',function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从layui中获取form对象
    var form = layui.form
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫pwd校验规则
        pwd:[/^[\S]{6,12}$/,'密码必须是6到12位，且不能出现空格'],
        // 验证两次密码是否一致
        repwd:function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框的内容
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })
    // 监听注册表单的提交事件
    
    $('#form_reg').on('submit',function(e) {
        e.preventDefault()
        $.post('/api/reguser',
        {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},
        function(res) {
            if(res.status !== 0) {
                // return console.log(res.message)
                return layer.msg(res.message)

            }
            // console.log('注册成功');
            layer.msg('注册成功'); 
            $('#form_reg [name=username],[name=password],[name=repassword]').val('')
            $('#link_login').click()
        })
    })

    $('#form_login').on('submit',function(e) {
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功！')
                // console.log(res.token);
                // 存储到locationStorage
                localStorage.setItem('token',res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})