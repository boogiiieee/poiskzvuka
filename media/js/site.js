var deviceAgent = navigator.userAgent.toLowerCase();
var iOS = deviceAgent.match(/(iphone|ipod|ipad)/);


document.body.className = document.body.className.replace(/\bno\-js\b/gi, "");
var htmlScrollbar;
$(document).ready(function () {
	if (!iOS) {
		htmlScrollbar = $("html").niceScroll({
			cursoropacitymax   : 0.8,
			cursorcolor        : '#000',
			cursorwidth        : "8px",
			cursorborder       : 'none',
			cursorborderradius : '8px',
			cursorminheight    : 50,
			mousescrollstep    : 50,
			grabcursorenabled  : false,
			dblclickzoom       : false,
		});
	}

	$('#main audio').panzer({
		theme        : 'custom',
		layout       : 'big',
		showduration : true,
		expanded     : true
	});

	$('#audioplayer audio').panzerlist({
		theme      : 'custom',
		repeat_all : true,
		auto_start : false
	});

	$(".lightbox").fancybox({
		padding    : 0,
		loop       : true,
		fitToView  : true,
		mouseWheel : false,
		width      : '100%',
		height     : '90%',
		autoSize   : false,
		closeClick : false,
		overlay    : { showEarly  : true },
		helpers    : { media : { } },
		afterShow : function () {
			// pause panzer players while playing video
			if ($(this.element).parent('.item').hasClass("video")) {
				$('.panzer, .panzerlist').each(function () {
					var data = $(this).data('panzer');
					var data_list = $(this).find('a.active').data('panzerlist');
					if (data) {
						data.audio.pause();
					}
					if (data_list) {
						data_list.audio.pause();
					}
				});
			}
		}
	});

	var $isotope = $('.isotope');
	$isotope.imagesLoaded(function () {
		$isotope.isotope({
			itemSelector      : '.item',
			animationOptions  : { duration: 200, easing: 'linear', queue: false },
			animationEngine   : 'css',
			transformsEnabled : false,
			resizable         : false
		});
		var $isotopeContainer = $('#main .wrapper');
		var currentIsotopeWidth;
		var window_resize = function () {
			if ($('.wrapper.inner-page').length === 0) {
				currentIsotopeWidth = $('#isotope-filter', $isotope).outerWidth(true);
			} else {
				currentIsotopeWidth = $('.item', $isotope).outerWidth(true);
			}
			var currentColumns = Math.floor($isotopeContainer.width() / currentIsotopeWidth);
			if (currentColumns > 0) {
				$isotope.width((currentColumns * currentIsotopeWidth)).isotope('reLayout');
				if (!iOS) htmlScrollbar.resize();
			}
		}
		$(window).smartresize(window_resize).smartresize();

		$isotope.infinitescroll({
			navSelector : '.pagination',
			nextSelector : '.pagination a:contains(More)',
			itemSelector : '.isotope .item:not(#isotope-filter)',
			behavior: 'local',
			speed: 0,
			loading: {
				finishedMsg: 'No more items to load',
				msgText : "Loading more items...",
				img: 'data:;base64,R0lGODlhEAAQAPIAAOkcGP///+1RTvjDwv////WmpfOKiPF8eSH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=='
			}
		}, function(newElements) {
			var $newElems = $(newElements);
			$('audio',$newElems).panzer({
				theme        : 'light',
				layout       : 'big',
				showduration : true,
				expanded     : true
			});
			if ($('.wrapper.inner-page').length > 0) {
				if (!$('.isotope-filter a[data-value~=all]').hasClass('active')) {
					var initialSelector = $('.isotope-filter a.active').data('value');
					console.log(initialSelector);
					$newElems.each(function() {
						var selector = $(this).data('type');
						if (initialSelector != selector) $(this).addClass('isotope-hidden');
					});
				}
			} else {
				if (!$('#isotope-filter a.all').hasClass('on')) {
					$newElems.each(function() {
						var elClass = $(this).attr("class").split(" ")[1];
						if ((elClass == 'post') && !($('#isotope-filter a.post').hasClass('on'))) $(this).addClass('isotope-hidden');
						if ((elClass == 'tweet') && !$('#isotope-filter a.tweet').hasClass('on')) $(this).addClass('isotope-hidden');
						if ((elClass == 'photo') && !$('#isotope-filter a.photo').hasClass('on')) $(this).addClass('isotope-hidden');
						if ((elClass == 'video') && !$('#isotope-filter a.video').hasClass('on')) $(this).addClass('isotope-hidden');
						if ((elClass == 'audio') && !$('#isotope-filter a.audio').hasClass('on')) $(this).addClass('isotope-hidden');
					});
				}
			}
			$newElems.imagesLoaded(function() {
				$isotope.append($newElems).isotope('appended',$newElems);
				if ($('.wrapper.inner-page').length > 0) {
					if (!$('.isotope-filter a[data-value~=all]').hasClass('active')) {
						var initialSelector = $('.isotope-filter a.active').data('value');
						var filter_type = '.item[data-type~=' + initialSelector + ']';
						$('.isotope').isotope({ filter: filter_type });
					}
				} else {
					if (!$('#isotope-filter a.all').hasClass('on')) {
						var filter_classes = '#isotope-filter,';
						$('#isotope-filter a.on').each(function(){
							filter_classes += '.'+$(this).attr('class').replace(' on',',');
						});
						filter_classes = filter_classes.substring(0, filter_classes.length - 1);
						if (filter_classes=="#isotope-filter") {
							$('#isotope-filter a.all').addClass('on');
							var filter_classes = '';
						}
						$('.isotope').isotope({ filter: filter_classes });
					}
				}
				if (window.addthis) {
					$('.addthis_toolbox',$newElems).each(function () {
						$(this).attr("addthis:url",$(this).data("url"));
						$(this).attr("addthis:title",$(this).data("title"));
						$(this).attr("addthis:screenshot",$(this).data("screenshot"));
						$('.addthis_button_facebook_like',this).attr("fb:like:layout","button_count").attr("fb:like:locale","en_US");
					});
					addthis.toolbox('.addthis_toolbox');
				}
				if (!iOS) htmlScrollbar.resize();
			});
		});
		if (iOS) {
			// trigger infinite scroll manually
			$(window).unbind('.infscr');
			$('.pagination a:contains(More)').click(function(e){
				e.preventDefault();
				$(document).trigger('retrieve.infscr');
				// remove the paginator when we're done.
			   $(document).ajaxError(function(e,xhr,opt){
					if (xhr.status == 404) $('.pagination a:contains(More)').remove();
				});
			});
		}
	});

	// homepage filter
	
	$('#isotope-filter a').click(function(e){
		if ($(this).hasClass('all on')) return false;
		$(this).toggleClass('on');
		if ($(this).hasClass('all')) {
			$('#isotope-filter a:not(.all)').removeClass('on');
			var filter_classes = '';
		} else {
			$('#isotope-filter a.all').removeClass('on');
			var filter_classes = '#isotope-filter,';
			$('#isotope-filter a.on').each(function(){
				filter_classes += '.'+$(this).attr('class').replace(' on',',');
			});
			filter_classes = filter_classes.substring(0, filter_classes.length - 1);
			if (filter_classes=="#isotope-filter") {
				$('#isotope-filter a.all').addClass('on');
				var filter_classes = '';
			}
		}
		$('.isotope').isotope({ filter: filter_classes });
		if (!iOS) htmlScrollbar.resize();
		e.preventDefault();
	});

	// interior page filter
	$('.isotope-filter a').click(function(ev) {
		$this = $(this);
		if ($this.hasClass('active')) return;
		$this.parent().children('a').removeClass('active');
		$this.addClass('active');
		var selector = $this.data('value');
		if (selector == 'all') {
			selector = '.item';
		} else {
			selector = '.item[data-type~=' + selector + ']';
		}
		$('.isotope').isotope({ filter: selector });
		if (!iOS) htmlScrollbar.resize();
		return false;
	});

	$('.clickable').live('click',function(){
		window.location = $(this).find("a:first").attr("href");
	});

	// switch between global and local events
	$('#events-title a').click(function(e){
		if ($(this).hasClass('on')) return false;
		$('#events-title a').toggleClass('on');
		$('#events .event').toggle();
		e.preventDefault();
	});

	$('#header nav li').hover(
		function () {
			$(this).addClass("hover");
		},
		function () {
			$(this).removeClass("hover");
		}
	);

	$('#header nav li.arrow a').click(function(e) {
		$el = $(this).parent();
		if ($el.hasClass('arrow')) {
			$el.toggleClass("hover");
			if ($el.parents('nav').hasClass('mobile')) {
				$el.toggleClass('show-menu');
			}
			e.preventDefault();
		}
	});

	$('#contact_form').ajaxForm({ target: '#contact_alert' });

	$('#menu-switch').click(function(e) {
		$(this).toggleClass('on');
		$('#header nav').toggleClass('mobile');
		return false;
	});

	$(document).click(function(e) {
		if ($(e.target).parents('#header nav').length > 0) return;
		$('#menu-switch').removeClass('on');
		$('#header nav').removeClass('mobile');
	});



	$top_link = $('#top-link');
	$top_link.click(function(e) {
		$('html, body').animate({scrollTop:0}, 750, 'linear');
		e.preventDefault();
		return false;
	});
	
	
	
	$(window).scroll(function () {
		var nScrollY = $(window).scrollTop();
		$('#header').addClass('fix');
		var headerHeight = $('#header').outerHeight();
		if (nScrollY >= headerHeight) {
			if ($('#header').hasClass('normal-size')) {
				$('#header,.sep-header').addClass('small-size').removeClass('normal-size');
				if (!iOS) htmlScrollbar.resize();
			}
		} else {
			if ($('#header').hasClass('small-size')) {
				$('#header,.sep-header').addClass('normal-size').removeClass('small-size');
				if (!iOS) htmlScrollbar.resize();
			}
			$('#switch').removeClass('on');
			$('#menu ul').removeClass('mobile');
		}
		if (nScrollY > 300) {
			$top_link.fadeIn(500);
		} else {
			$top_link.fadeOut(250);
		}
	});

	$(window).smartresize(function() {
		$('#menu-switch').removeClass('on');
		$('#header nav').removeClass('mobile');
	});

	if ($('.addthis_toolbox').length > 0) {
		$('.addthis_toolbox').each(function () {
			$(this).attr("addthis:url",$(this).data("url"));
			$(this).attr("addthis:title",$(this).data("title"));
			$(this).attr("addthis:screenshot",$(this).data("screenshot"));
			$('.addthis_button_facebook_like',this).attr("fb:like:layout","button_count").attr("fb:like:locale","en_US");
		});
		$.ajaxSettings.cache = true;
		$.ajax({
			url: 'http://s7.addthis.com/js/300/addthis_widget.js',
			dataType: "script",
			success: function() {
				addthis.init();
			}
		});
	}
});

$(window).load(function() {

	$('.flexslider').flexslider({
		animation      : "slide",
		animationSpeed : 500,
		easing         : "easeInOutCirc",
		useCSS         : false,
		controlNav     : false,
		prevText       : '&#xf053;',
		nextText       : '&#xf054;',
		start          : function() {
			$('.flexslider').removeClass('loading');
		}
	});

	$(window).smartresize();

});