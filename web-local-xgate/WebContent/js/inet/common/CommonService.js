$(function() {
  if (iNet.isIE) {
    if (!iNet.isSupport) {
      window.location.href = iNet.getUrl('support.html');
    }
    $('.layout-west').css({
      'width': '230px',
      'position': 'fixed',
      'float': 'left',
      'z-index': '900'
    });
    $('.navbar-fixed').css({
      'position': 'fixed',
      'z-index': '900'
    });
    $('.visible-toolbar').css({
      'margin-top': '50px'
    });
    $('.form-content').css({
      'padding-left': '0px'
    });
  }
  /** Loading */
  setTimeout(function() {
    $('#loading').remove();
    $('#loading-mask').fadeIn(2000, function() {
      $('#loading-mask').remove();
    });
  }, 250);
  $('#menu-logout').click(function() {
    //window.location.href = iNet.getUrl('logout.iws');
  });
  CommonService = {
    status: {
      SUCCESS: "SUCCESS",
      FAILURE: 'FAILURE'
    },
    activeMenu: function(id) {
      if (!!id) {
        $(id).addClass('active');
        $(id + '>a>i').addClass('icon-white');
      }
    },
    activeModule: function(id) {
      $('#main-module').find('li').removeClass('active');
      var $link = $(id);
      if ($link) {
        $link.addClass('active');
      }
    }
  };
  var initComponent = function() {
    // fix sub nav on scroll
    var $win = $(window), $nav = $('.subnav'), isFixed = false;
    var navTop = $('.subnav').length && $('.subnav').offset().top - 40;
    function processScroll() {
      var scrollTop = $win.scrollTop();
      if (scrollTop > navTop && !isFixed) {
        isFixed = true;
        $nav.addClass('subnav-fixed');
      }
      else 
        if (scrollTop <= navTop && isFixed) {
          isFixed = false;
          $nav.removeClass('subnav-fixed');
        }
    }
    processScroll();
    $win.on('scroll', processScroll);
    //window resize
    var onResize = function() {
      var $menu = $('#menu');
      $menu.height($(window).height() - $('#header').height() - 20).css('overflow', 'auto');
      var $center = $('div.layout-center');
      var $left = $('div.layout-west');
      var isHideMenu = $left.is(':hidden');
      if (isHideMenu) {
        $center.width($(window).width() - 20);
      }
      else {
        $center.width($(window).width() - $left.width() - 10);
      }
      $('div.action-toolbar').width($center.width());
    };
    $win.resize(onResize);
    onResize();
  };
  /**
   * ====================Instance Component===============
   */
  initComponent();
});
