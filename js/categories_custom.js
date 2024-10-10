/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Isotope
5. Init Price Slider
6. Init Products Height


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var header = $('.header');
	var menuActive = false;
	var menu = $('.menu');
	var burger = $('.burger_container');

	setHeader();
	loadFeaturedCategories();

	$(window).on('resize', function()
	{
		setHeader();
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initMenu();
	initIsotope();
	initPriceSlider();
	initProductsHeight();

	/* 

	2. Set Header

	*/

	function setHeader()
	{
		if($(window).scrollTop() > 100)
		{
			header.addClass('scrolled');
		}
		else
		{
			header.removeClass('scrolled');
		}
	}

	function loadFeaturedCategories() {
		const firebaseConfig = {
			apiKey: "AIzaSyDCjcyPOQ_29zyZGtxk13iJdbDsP1AG8bM",
			authDomain: "home-pisos-vinilicos.firebaseapp.com",
			databaseURL: "https://home-pisos-vinilicos-default-rtdb.firebaseio.com",
			projectId: "home-pisos-vinilicos",
			storageBucket: "home-pisos-vinilicos.appspot.com",
			messagingSenderId: "392689672279",
			appId: "1:392689672279:web:81245db39bf2e1dab7c312",
			measurementId: "G-4HC6MV32X4"
		};
	
		firebase.initializeApp(firebaseConfig);
		const database = firebase.database();
	
		// Obtener las categorías desde Firebase
		database.ref("Category").once("value")
			.then((snapshot) => {
				const categories = snapshot.val();
				
				if (categories) {
					const categoryList = Object.values(categories);
	
					const featuredCategories = categoryList.filter(category => category.IsFeatured);
					
					if (featuredCategories.length > 0) {
						if (featuredCategories[0]) {
							document.getElementById("pvc-category").firstElementChild.textContent = featuredCategories[0].Name || "Pisos de PVC";
							document.getElementById("pvc-category").firstElementChild.href = `/category/${featuredCategories[0].IdCategory}`; 
						}
						if (featuredCategories[1]) {
							document.getElementById("revestimientos-category").firstElementChild.textContent = featuredCategories[1].Name || "Revestimientos";
							document.getElementById("revestimientos-category").firstElementChild.href = `/category/${featuredCategories[1].IdCategory}`; 
						}
					} else {
						console.error("No se encontraron categorías destacadas.");
					}
	
					const nonFeaturedCategories = categoryList.filter(category => !category.IsFeatured);
					const moreProductsMenu = document.getElementById("more-products");
	
					nonFeaturedCategories.forEach(category => {
						const li = document.createElement("li");
						const a = document.createElement("a");
						a.href = `/category/${category.IdCategory}`;  
						a.textContent = category.Name;
						a.classList.add("dropdown-item");
						li.appendChild(a);
						moreProductsMenu.appendChild(li);
					});
					
				} else {
					console.error("No se encontraron categorías.");
				}
			})
			.catch((error) => {
				console.error("Error al obtener las categorías:", error);
			});
	}
	
	document.addEventListener("DOMContentLoaded", loadFeaturedCategories);
	
	
	/* 

	3. Init Menu

	*/

	function initMenu()
	{
		if($('.menu').length)
		{
			var menu = $('.menu');
			if($('.burger_container').length)
			{
				burger.on('click', function()
				{
					if(menuActive)
					{
						closeMenu();
					}
					else
					{
						openMenu();

						$(document).one('click', function cls(e)
						{
							if($(e.target).hasClass('menu_mm'))
							{
								$(document).one('click', cls);
							}
							else
							{
								closeMenu();
							}
						});
					}
				});
			}
		}
	}

	function openMenu()
	{
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu()
	{
		menu.removeClass('active');
		menuActive = false;
	}

	/* 

	4. Init Isotope

	*/

	function initIsotope()
	{
		var sortingButtons = $('.product_sorting_btn');
		var sortNums = $('.num_sorting_btn');

		if($('.producto_grid').length)
		{
			var grid = $('.producto_grid').isotope({
				itemSelector: '.product',
				layoutMode: 'fitRows',
	            getSortData:
	            {
	            	price: function(itemElement)
	            	{
	            		var priceEle = $(itemElement).find('.product_price').text().replace( '$', '' );
	            		return parseFloat(priceEle);
	            	},
	            	name: '.product_name',
	            	stars: function(itemElement)
	            	{
	            		var starsEle = $(itemElement).find('.rating');
	            		var stars = starsEle.attr("data-rating");
	            		return stars;
	            	}
	            },
	            animationOptions:
	            {
	                duration: 750,
	                easing: 'linear',
	                queue: false
	            }
	        });
	        
	        // Sort based on the value from the sorting_type dropdown
	        sortingButtons.each(function()
	        {
	        	$(this).on('click', function()
	        	{
	        		var parent = $(this).parent().parent().find('.sorting_text');
		        		parent.text($(this).text());
		        		var option = $(this).attr('data-isotope-option');
		        		option = JSON.parse( option );
	    				grid.isotope( option );
	        	});
	        });

	        // Change view to Box
	        if($('.box_view').length)
	        {
	        	var box = $('.box_view');
	        	box.on('click', function()
	        	{
	        		if(window.innerWidth > 767)
	        		{
	        			$('.item').addClass('box');
		        		var option = '{ "sortBy": "original-order" }';
		        		option = JSON.parse(option);
						grid.isotope(option);
	        		}	
	        	});
	        }

	        // Change view to List
	        if($('.detail_view').length)
	        {
	        	var detail = $('.detail_view');
	        	detail.on('click', function()
	        	{
	        		if(window.innerWidth > 767)
	        		{
	        			$('.item').removeClass('box');
		        		var option = '{ "sortBy": "original-order" }';
		        		option = JSON.parse(option);
		        		grid.isotope(option);
		        		setTimeout(function()
		        		{
		        			grid.isotope(option);
		        		},500);
	        		}
	        	});
	        }

	         // Show only a selected number of items
	        sortNums.each(function()
	        {
	        	$(this).on('click', function()
	        	{
	        		var numSortingText = $(this).text();
					var numFilter = ':nth-child(-n+' + numSortingText + ')';
	        		$('.num_sorting_text').text($(this).text());
    				$('.producto_grid').isotope({filter: numFilter });
	        	});
	        });	
		}
	}

	/* 

	5. Init Price Slider

	*/

    function initPriceSlider()
    {
    	if($("#slider-range").length)
    	{
    		$("#slider-range").slider(
			{
				range: true,
				min: 20,
				max: 199,
				values: [ 20, 199 ],
				slide: function( event, ui )
				{
					$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
				}
			});
				
			$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );
			$('.filter_price').on('mouseup', function()
			{
				$('.producto_grid').isotope({
		            filter: function()
		            {
		            	var priceRange = $('#amount').val();
			        	var priceMin = parseFloat(priceRange.split('-')[0].replace('$', ''));
			        	var priceMax = parseFloat(priceRange.split('-')[1].replace('$', ''));
			        	var itemPrice = $(this).find('.product_price').clone().children().remove().end().text().replace( '$', '' );

			        	return (itemPrice > priceMin) && (itemPrice < priceMax);
		            },
		            animationOptions: {
		                duration: 750,
		                easing: 'linear',
		                queue: false
		            }
		        });
			});
    	}	
    }

    /* 

	6. Init Products Height

	*/

	function initProductsHeight()
	{
		if($('.sidebar_left').length)
		{
			var sidebarH = $('.sidebar_left').outerHeight(true) + 309;
			$('.products').css('min-height', sidebarH);
		}
	}
});