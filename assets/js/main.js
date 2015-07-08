---
layout: null
---

$(function() {
  var toc     = $('.toc-link'),
      sidebar = $('#sidebar'),
      main    = $('#main'),
      menu    = $('#menu'),
      x1, y1;

  // run this function after pjax load.
  var afterPjax = function() {
    // open links in new tab.
    $('#main').find('a').filter(function() {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');

    // discus comment.
    {% if site.disqus_shortname %}
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//{{ site.disqus_shortname }}' + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
    {% endif %}

   var duoshuoQuery = {short_name:"saymagic"};
  var ds = document.createElement('script');
  ds.type = 'text/javascript';ds.async = true;
  ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
  ds.charset = 'UTF-8';
  (document.getElementsByTagName('head')[0] 
     || document.getElementsByTagName('body')[0]).appendChild(ds);
  pajx_loadDuodsuo();
  goto_fullscress();
  };
  afterPjax();

  /**
 * 切换到全屏
 * @return {[type]} [description]
 */
function goto_fullscress(){
    sidebar.addClass('fullscreen');
    button.addClass('fullscreen');
    content.delay(200).queue(function(){
      $(this).addClass('fullscreen').dequeue();
    });

    //小屏时不进行显示右侧章节列表
    if($(window).width() > 500){
      $("#post__toc-trigger").removeClass("trigger_unhover");
      $("#post__toc-trigger").addClass("trigger_hover")
    }
}

/**
 * 切换到三栏模式
 * @return {[type]} [description]
 */
function goback_normal(){
    sidebar.removeClass('fullscreen');
    button.removeClass('fullscreen');
    content.delay(300).queue(function(){
      $(this).removeClass('fullscreen').dequeue();
    });
       $("#post__toc-trigger").removeClass("trigger_hover");
    $("#post__toc-trigger").addClass("trigger_unhover")
}
/**
 * pjax后需要回调函数.加载多说
 */
function pajx_loadDuodsuo(){
    var dus=$(".ds-thread");
    if($(dus).length==1){
        var el = document.createElement('div');
        el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
        el.setAttribute('data-url',$(dus).attr("data-url"));
        DUOSHUO.EmbedThread(el);
        $(dus).html(el);
    }
}



  // NProgress
  NProgress.configure({ showSpinner: false });


  // Pjax
  $(document).pjax('#sidebar-avatar, .toc-link', '#main', {
    fragment: '#main',
    timeout: 3000
  });

  $(document).on({
    'pjax:click': function() {
      NProgress.start();
      main.removeClass('fadeIn');
    },
    'pjax:end': function() {
      afterPjax();
      NProgress.done();
      main.scrollTop(0).addClass('fadeIn');
      menu.add(sidebar).removeClass('open');
      {% if site.google_analytics %}
      ga('set', 'location', window.location.href);
      ga('send', 'pageview');
      {% endif %}
    }
  });


  // Tags Filter
  $('#sidebar-tags').on('click', '.sidebar-tag', function() {
    var filter = $(this).data('filter');
    if (filter === 'all') {
      toc.fadeIn(350);
    } else {
      toc.hide();
      $('.toc-link[data-tags~=' + filter + ']').fadeIn(350);
    }
    $(this).addClass('active').siblings().removeClass('active');
  });


  // Menu
  menu.on('click', function() {
    $(this).add(sidebar).toggleClass('open');
  });

});
