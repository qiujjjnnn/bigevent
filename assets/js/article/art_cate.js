$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                console.log(res);
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var index = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click',function() {
        index = layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          });   
    })
    // 因为无法直接绑定表单元素要点击按钮后元素才出现，用代理解决
    $('body').on('submit','#form-add',function(e) {
        e.preventDefault()
        console.log('ok');
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                // console.log(res);
                if(res.status !== 0) {
                    console.log(res.message);
                    return layer.msg('添加失败！')
                }
                initArtCateList()
                layer.msg('添加成功！')
                layer.close(index);
            }
        })
    })

    // 通过代理的形式，为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click','.btn-edit',function(e) {
        e.preventDefault()
        // $(this).attr('data-id')
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          })
          var id = $(this).attr('data-id')
        //   发起请求获取对应分类的数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function (res) {
                // console.log(res);
                form.val('form-edit',res.data)
                
            }
        })
    })
    // 通过代理的形式，为修改分类的表单绑定提交事件
    $('body').on('submit','#form-edit',function(e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    // console.log(res);
                    return layer.msg(res.message)
                }
                layer.msg('修改成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    // 通过代理的形式，为btn-delete按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(e) {
        e.preventDefault()
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res) {
                    if(res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    console.log(res);
                    layer.close(index);
                    initArtCateList()
                }
            })
            
            
          });

    })
})