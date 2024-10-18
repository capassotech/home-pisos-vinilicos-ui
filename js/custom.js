$(document).ready(function () {
	"use strict";

	var header = $('.header');
	var menuActive = false;
	var menu = $('.menu');
	var burger = $('.burger_container');

	setHeader();

	$(window).on('resize', function () {
		setHeader();
	});

	$(document).on('scroll', function () {
		setHeader();
	});

	initHomeSlider();
	initMenu();
	initGallery();
	initTestSlider();
	initLightbox();

	function setHeader() {
		if ($(window).scrollTop() > 100) {
			header.addClass('scrolled');
		}
		else {
			header.removeClass('scrolled');
		}
	}

	function initMenu() {
		if ($('.menu').length) {
			var menu = $('.menu');
			if ($('.burger_container').length) {
				burger.on('click', function () {
					if (menuActive) {
						closeMenu();
					}
					else {
						openMenu();

						$(document).one('click', function cls(e) {
							if ($(e.target).hasClass('menu_mm')) {
								$(document).one('click', cls);
							}
							else {
								closeMenu();
							}
						});
					}
				});
			}
		}
	}

	function openMenu() {
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu() {
		menu.removeClass('active');
		menuActive = false;
	}

	function initHomeSlider() {
		if ($('.home_slider').length) {
			var homeSlider = $('.home_slider');

			homeSlider.owlCarousel(
				{
					items: 1,
					autoplay: true,
					loop: true,
					nav: false,
					smartSpeed: 1200
				});

			// Custom Navigation
			if ($('.home_slider_next').length) {
				var next = $('.home_slider_next');
				next.on('click', function () {
					homeSlider.trigger('next.owl.carousel');
				});
			}

			/* Custom dots events */
			if ($('.home_slider_custom_dot').length) {
				$('.home_slider_custom_dot').on('click', function (ev) {
					var dot = $(ev.target);
					$('.home_slider_custom_dot').removeClass('active');
					dot.addClass('active');
					homeSlider.trigger('to.owl.carousel', [$(this).index(), 300]);
				});
			}

			/* Change active class for dots when slide changes by nav or touch */
			homeSlider.on('changed.owl.carousel', function (event) {
				$('.home_slider_custom_dot').removeClass('active');
				$('.home_slider_custom_dots li').eq(event.page.index).addClass('active');
			});
		}
	}

	function initGallery() {
		if ($('.gallery_slider').length) {
			var gallerySlider = $('.gallery_slider');
			gallerySlider.owlCarousel(
				{
					items: 6,
					loop: true,
					margin: 22,
					autoplay: true,
					nav: false,
					dots: false,
					responsive:
					{
						0:
						{
							margin: 7,
							items: 3
						},
						575:
						{
							margin: 7,
							items: 6
						},
						991:
						{
							margin: 22,
							items: 6
						}
					}
				});
		}
	}

	function initTestSlider() {
		if ($('.test_slider').length) {
			var testSlider = $('.test_slider');
			testSlider.owlCarousel(
				{
					items: 1,
					loop: true,
					autoplay: true,
					smartSpeed: 1200,
					nav: false,
					dots: false
				});
		}
	}

	function initLightbox() {
		if ($('.gallery_item').length) {
			$('.colorbox').colorbox(
				{
					rel: 'colorbox',
					photo: true,
					maxWidth: '95%',
					maxHeight: '95%'
				});
		}
	}
});