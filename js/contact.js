$(document).ready(function () {
	"use strict";

	var header = $('.header');
	var menuActive = false;
	var menu = $('.menu');
	var burger = $('.burger_container');
	var FAQs = [];
	var contactInfo;
	
	setHeader();

	$(window).on('resize', function () {
		setHeader();
	});

	$(document).on('scroll', function () {
		setHeader();
	});

	initMenu();
	initAccordions();
	loadFAQ();
	loadContactInfo();

	function loadContactInfo() {
		database
			.ref("Contact")
			.once("value")
			.then((snapshot) => {
				contactInfo = snapshot.val() ? Object.values(snapshot.val())[0] : null;
				updateContactInfoDisplay(contactInfo);
			})
			.catch((error) => {
				console.error("Error obteniendo la información de contacto", error);
			});
	}

	function updateContactInfoDisplay(contactInfo) {
		const contactInfoContainer = document.getElementById('contact-items');
		contactInfoContainer.innerHTML = "";

		//Address
		var contactInfoHTML = `
		<li>
            <div class="contact_info_icon">
                <img src="images/contact_info_1.png" alt="direccion" />
            </div>
        	<div class="contact_info_text">
                &nbsp;${contactInfo.Address}
            </div>
        </li>`;
		contactInfoContainer.innerHTML += contactInfoHTML;

		//Email
		contactInfoHTML = `
		<li>
            <div class="contact_info_icon">
                <img src="images/contact_info_2.png" alt="correo" />
            </div>
        	<div class="contact_info_text">
                &nbsp;${contactInfo.Email}
            </div>
        </li>`;
		contactInfoContainer.innerHTML += contactInfoHTML;

		//Phone
		contactInfoHTML = `
		<li>
            <div class="contact_info_icon">
                <img src="images/contact_info_3.png" alt="telefono" />
            </div>
        	<div class="contact_info_text">
                &nbsp;${contactInfo.Phone}
            </div>
        </li>`;
		contactInfoContainer.innerHTML += contactInfoHTML;
	}

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
		const faqContainer = document.querySelector(".accordions");
		faqContainer.innerHTML = "";

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