$(function() {
    getUserInfo()
})
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers就是请求头配置
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res) {
            
            if(res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        },
        // 不论成功还是失败最终都会调用complete函数
        // complete:function(res) {
        //     console.log('执行了回调函数');
        //     console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录界面
        //         location.href = '/login.html'
        //     }

        // }
    })
    function renderAvatar(user) {
        // 1.获取用户名称
        var name = user.nickname || user.username
        // 2.设置欢迎文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3.按需渲染用户的头像
        if(user.user_pic !== null) {
            $('.layui-nav-img')
            .attr('src',user.user_pic)
            .show()
            $('.text-avatar').hide()
        }else {
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }
    $('#btnLogout').on('click',function() {
        layer.confirm('确定退出?', {icon: 3, title:'提示'},
        function(index){
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录界面
            location.href = '/login.html'
            // 关闭
            layer.close(index);
        });
    })
    
}