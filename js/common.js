
$(document).ready(function () {
	$('.question__variants li').on('click', function () {

		$(this).addClass('checked').siblings().removeClass('checked');
		$(this).parents('.question').find('.question__button').addClass('question__button--active');
	});

	$('body').on('click', '.question__button--active', function () {
		$(this).parents('.question').removeClass('active').next().addClass('active');

	});
	$('.button--next--last').on('click', function () {
		$('.test__title').hide();
	})
});


$.fn.isOnScreen = function (shift) {
	if (!shift) {
		shift = 0;
	}
	var viewport = {};
	viewport.top = $(window).scrollTop();
	viewport.bottom = viewport.top + $(window).height();
	var bounds = {};
	bounds.top = this.offset().top + shift;
	bounds.bottom = bounds.top + this.outerHeight() - shift;
	return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};


var _bxInnit = function (elem, opt) {
	var defaultOptions = {
		view: 'all'
	}
	var currentOpt = $.extend(defaultOptions, opt);
	var init = {
		breakPoint: 992,
		sliderActive: false,
		initBreakpoint: null,
		resizeBreakpointMore: null,
		resizeBreakpointLess: null,
		windowWidht: window.innerWidth
	}


	var flag = false;

	var slider;


	var sliderClone = $(elem).clone();


	var options = opt;

	function createSlider() {
		slider = $(elem).bxSlider(options);
		return true;
	}

	if (flag) {
		createSlider();
		init.sliderActive = true;
	}


	function createBreakpoints() {
		switch (currentOpt.view) {
			case 'mobile':
				init.initBreakpoint = init.windowWidht < init.breakPoint;
				init.resizeBreakpointMore = init.windowWidht >= init.breakPoint;
				init.resizeBreakpointLess = init.windowWidht < init.breakPoint;
				break;

			case 'desktop':
				init.initBreakpoint = init.windowWidht >= init.breakPoint;
				init.resizeBreakpointMore = init.windowWidht < init.breakPoint;
				init.resizeBreakpointLess = init.windowWidht >= init.breakPoint;
				init.resizeBreakpointLess;
				break;

			case 'all':
				init.initBreakpoint = true;
				init.resizeBreakpointMore = false;
				init.resizeBreakpointLess = false;
				break;
		}
	}

	createBreakpoints();


	if (init.initBreakpoint) {
		createSlider();
		init.sliderActive = true;
	}

	$(window).resize(function () {
		init.windowWidht = window.innerWidth;

		createBreakpoints();

		if (init.resizeBreakpointMore) {
			if (init.sliderActive) {
				slider.destroySlider();
				init.sliderActive = false;
				slider.replaceWith(sliderClone.clone());
			}
		}

		if (init.resizeBreakpointLess) {
			if (!init.sliderActive) {
				createSlider();
				init.sliderActive = true;
			}
		}
	});

	var a, b;
	a = 1;
	b = 0;

	$(window).on('scroll', function () {
		if (init.sliderActive == true) {
			if (slider.isOnScreen()) {
				b = 1;
			} else {
				b = 0;
			}

			if (a == b) {
				slider.startAuto();
			} else {
				slider.stopAuto();
			}
		}

	});
}





$(function () {
	_bxInnit('.sec6__list', {
		view: 'mobile',
		adaptiveHeight: false,
		swipeThreshold: 40,
		controls: false,
		auto: true,
		pause: 4000,
		autoHover: true,
		slideWidth: 300,
		slideMargin: 5
	});
	
}); 