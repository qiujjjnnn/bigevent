$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' +m +'-' +d + ''+ hh +':' +mm +':' +ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum:1, //页码值，默认请求第一页的数据
        pagesize:2,//每页显示几条数据，默认每页显示2条
        cate_id:'', //文章分类的Id
        state:'' // 文章的发布状态
    }
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // console.log('11');
                // console.log(res);

                // 使用模板引擎渲染页面数据
               var htmlStr = template('tpl-table',res)
            //    console.log(htmlStr);
               $('tbody').html(htmlStr)
               
            }

        })
    }
    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                // 渲染分类选项
                var htmlStr = template('tpl-cate',res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                // 因为layui.js渲染到select时没有数据
                form.render()
                renderPage(res.total)
            }
        })
    }
    // 为表单绑定submit事件
    $('#form-seach').on('sumbit',function(e) {
        e.preventDefault()
        // 获取表单的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit:q.pagesize,
            curr:q.pagenum,
            // 分页发生切换的时候触发jump回调
            jump:function(obj,first) {
                // 可以通过first的值，来判断是通过哪种方式触发的jump回调
                // 如果first的值为TRUE，证明只要调用了laypage.render()方法就会触发
                // 否则就是点击页码就会触发jump回调
                // console.log(obj.curr);
                q.pagenum = obj.curr
                if(!first) {
                    initTable()
                }
            }
          });
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click','btn-delete',function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 询问是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            var id = $(this).attr('data-id')
            $.ajax({
                method:'GET',
                url:'/my/article/delete' + id,
                success:function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据
                    // 如果没有剩余数据了就让页码-1
                    // 再来调用initTable()
                    if(len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1
                    }
                    initTable()
                    
                }

            })
            layer.close(index);
            
          });
    })
})