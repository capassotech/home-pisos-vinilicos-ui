$(document).ready(function () {
	"use strict";

	var header = $('.header');
	var menuActive = false;
	var menu = $('.menu');
	var burger = $('.burger_container');
	var map;
	let FAQs = [];
	const faqContainer = document.querySelector(".accordions");

	setHeader();

	$(window).on('resize', function () {
		setHeader();
	});

	$(document).on('scroll', function () {
		setHeader();
	});

	initMenu();
	initGoogleMap();
	initAccordions();
	loadFAQ();

	function loadFAQ() {
		database
			.ref("FAQ")
			.once("value")
			.then((snapshot) => {
				FAQs = snapshot.val() ? Object.values(snapshot.val()) : [];
				updateFAQDisplay(FAQs);
			})
			.catch((error) => {
				console.error("Error obteniendo las preguntas frecuentes", error);
			});
	}

	function updateFAQDisplay(FAQs) {
		const faqContainer = document.getElementById('accordions'); // Get the container for the accordions
		faqContainer.innerHTML = ""; // Clear previous content

		FAQs.forEach((faq) => {
			const faqHTML = `
			<div class="accordion_container">
				<div class="accordion d-flex flex-row align-items-center" onclick="toggleAccordion(this)">
					<div>
						${faq.Question}
					</div>
				</div>
				<div class="accordion_panel">
					<p>
						${faq.Answer}
					</p>
				</div>
			</div>`;
			faqContainer.innerHTML += faqHTML;
		});
	}

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

	function initGoogleMap() {
		var myLatlng = new google.maps.LatLng(36.131475, -5.350348);
		var mapOptions =
		{
			center: myLatlng,
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			draggable: true,
			scrollwheel: false,
			zoomControl: true,
			zoomControlOptions:
			{
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: false,
			fullscreenControl: true,
			styles: []
		}

		map = new google.maps.Map(document.getElementById('map'), mapOptions);

		google.maps.event.addDomListener(window, 'resize', function () {
			setTimeout(function () {
				google.maps.event.trigger(map, "resize");
				map.setCenter(myLatlng);
			}, 1400);
		});
	}

	function initAccordions() {
		if ($('.accordion').length) {
			var accs = $('.accordion');

			accs.each(function () {
				var acc = $(this);

				if (acc.hasClass('active')) {
					var panel = $(acc.next());
					var panelH = panel.prop('scrollHeight') + "px";

					if (panel.css('max-height') == "0px") {
						panel.css('max-height', panel.prop('scrollHeight') + "px");
					}
					else {
						panel.css('max-height', "0px");
					}
				}

				acc.on('click', function () {
					if (acc.hasClass('active')) {
						acc.removeClass('active');
						var panel = $(acc.next());
						var panelH = panel.prop('scrollHeight') + "px";

						if (panel.css('max-height') == "0px") {
							panel.css('max-height', panel.prop('scrollHeight') + "px");
						}
						else {
							panel.css('max-height', "0px");
						}
					}
					else {
						acc.addClass('active');
						var panel = $(acc.next());
						var panelH = panel.prop('scrollHeight') + "px";

						if (panel.css('max-height') == "0px") {
							panel.css('max-height', panel.prop('scrollHeight') + "px");
						}
						else {
							panel.css('max-height', "0px");
						}
					}
				});
			});
		}
	}
});

function toggleAccordion(accordion) {
	const panel = accordion.nextElementSibling;

	if (panel.style.maxHeight) {
		panel.style.maxHeight = null;
	} else {
		panel.style.maxHeight = panel.scrollHeight + "px"; 
	}
}