$(function () {
  var layer = layui.layer
  var form = layui.form
  initCate()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败')
        }
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用
        form.render()
      }
    })
  }
  initEditor()
  
   // 1. 初始化图片裁剪器
   var $image = $('#image')
  
   // 2. 裁剪选项
   var options = {
     aspectRatio: 400 / 280,
     preview: '.img-preview'
   }
   
   // 3. 初始化裁剪区域
   $image.cropper(options)

   $('#btnChooseImage').on('click',function() {
    $('#coverFile').click()
   })
  //  监听coverFile 的change事件，获取用户选择的文件列表
  $('#coverFile').on('change',function(e) {
    // 获取到文件的列表数组
    var files = e.target.files
    if(files.length === 0) {
      return
    }
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
        .cropper('destroy')//摧毁旧的裁剪区域
        .attr('src',newImgURL)//重新设置图片路径
        .cropper(options)//重新初始化裁剪区域
  })

  //定义文章的发布状态
  var art_state = '已发布'
  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click',function() {
    art_state = '草稿'
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit',function(e) {
    e.preventDefault()
    // 基于表单快速创建一个formdata对象
    var fd = new FormData($(this)[0])
    fd.append('state',art_state)
    // fd.forEach(function(v,k) {
    //   console.log(k,v);
    // })

    // 将封面裁剪过的图片，输出为一个文件对象
    $image
        .cropper('getCroppedCanvas',{
          // 创建一个Canvas画布
          width:400,
          heigth:200
        })
        .toBlob(function(blob) {
          // 将Canvas画布上的内容转化为文件对象
          // 将文件对象存储到fd中
          fd.append('cover_img',blob)

          // 发起Ajax请求
          publishArticle(fd)
        })
  })

  function publishArticle(fd) {
    $.ajax({
      method:'POST',
      url:'/my/article/add',
      data:fd,
      // 注意：如果向服务器提交的是FormData格式的数据，
      // 必须是添加以下两个配置项
      contentType:false,
      processData:false,
      success:function(res) {
        if(res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布成功后，跳转到文章列表页面
        location.herf = '/article/art_list.html'
      }
    })
  }
})