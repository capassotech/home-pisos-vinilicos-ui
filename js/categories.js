$(document).ready(function () {
  "use strict";

  var header = $(".header");
  var menuActive = false;
  var menu = $(".menu");
  var burger = $(".burger_container");

  setHeader();
  loadFeaturedCategories();
  loadProductsByCategory();

  $(window).on("resize", function () {
    setHeader();
  });

  $(document).on("scroll", function () {
    setHeader();
  });

  initMenu();
  initIsotope();
  initPriceSlider();
  initProductsHeight();

  function setHeader() {
    if ($(window).scrollTop() > 100) {
      header.addClass("scrolled");
    } else {
      header.removeClass("scrolled");
    }
  }

  function loadFeaturedCategories() {
    const database = firebase.database();
    const header = document.querySelector(".header");
    const mainNav = document.querySelector(".main_nav");
    const navbarDropdown = document.querySelector(".nav-item.dropdown");
    const moreProductsMenu = document.getElementById("more-products");
    const moreProductsMenuResponsive =
      document.getElementById("more-products-menu");
    const loader = document.getElementById("loader");

    loader.style.display = "flex";

    header.style.visibility = "hidden";

    database
      .ref("Category")
      .once("value")
      .then((snapshot) => {
        const categories = snapshot.val();

        if (categories) {
          const categoryList = Object.values(categories);
          const featuredCategories = categoryList.filter(
            (category) => category.IsFeatured
          );
          const nonFeaturedCategories = categoryList.filter(
            (category) => !category.IsFeatured
          );

          if (featuredCategories.length > 0) {
            if (featuredCategories[0]) {
              document.getElementById(
                "category-1"
              ).firstElementChild.textContent = featuredCategories[0].Name;
              document.getElementById(
                "category-1"
              ).firstElementChild.href = `/productsByCategory.html?category=${featuredCategories[0].IdCategory}`;
              

              
              console.log()
              if(document.getElementById("category-1-menu") != null){
                document.getElementById(
                  "category-1-menu"
                ).firstElementChild.textContent = featuredCategories[0].Name;
                document.getElementById(
                  "category-1-menu"
                ).firstElementChild.href = `/productsByCategory.html?category=${featuredCategories[0].IdCategory}`;
  
              }
            }
            if (featuredCategories[1]) {
              document.getElementById(
                "category-2"
              ).firstElementChild.textContent = featuredCategories[1].Name;
              document.getElementById(
                "category-2"
              ).firstElementChild.href = `/productsByCategory.html?category=${featuredCategories[1].IdCategory}`;

              if(document.getElementById("category-2-menu") != null){
                document.getElementById(
                  "category-2-menu"
                ).firstElementChild.textContent = featuredCategories[1].Name;
                document.getElementById(
                  "category-2-menu"
                ).firstElementChild.href = `/productsByCategory.html?category=${featuredCategories[1].IdCategory}`;
              }
            }
          }

          if (nonFeaturedCategories.length > 0) {
            navbarDropdown.style.display = "block";
            moreProductsMenu.innerHTML = "";
            moreProductsMenuResponsive.innerHTML = "";

            nonFeaturedCategories.forEach((category) => {
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.href = `/productsByCategory.html?category=${category.IdCategory}`;
              a.textContent = category.Name;
              a.classList.add("dropdown-item");
              li.appendChild(a);
              moreProductsMenu.appendChild(li);

              const liResponsive = li.cloneNode(true);
              liResponsive.classList.add("menu_mm");
              moreProductsMenuResponsive.appendChild(liResponsive);
            });
          } else {
            navbarDropdown.style.display = "none";
          }
        } else {
          console.error("No se encontraron categorías.");
        }
      })
      .catch((error) => {
        console.error("Error al obtener las categorías:", error);
      })
      .finally(() => {
        header.style.visibility = "visible";
        loader.style.display = "none";
      });
  }

  document.addEventListener("DOMContentLoaded", loadFeaturedCategories);

  function loadProductsByCategory() {
    const database = firebase.database();

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category");

    if (categoryId) {
      database
        .ref("Product")
        .orderByChild("IdCategory")
        .equalTo(categoryId)
        .once("value")
        .then((snapshot) => {
          const products = snapshot.val();

          database
            .ref("Category/" + categoryId)
            .once("value")
            .then((categorySnapshot) => {
              const category = categorySnapshot.val();
              document.getElementById("category-title").textContent = category
                ? category.Name
                : "";
            });

          const productList = document.getElementById("product-list");
          productList.innerHTML = "";

          if (products) {
            const productArray = Object.values(products);
            productArray.forEach((product) => {
              const currentUrl = window.location.href;
              const mensajeWhatsapp = `Hola, me interesa este producto: ${product.Name}.\n${currentUrl}`;
              const urlWhatsapp = `https://wa.me/5493435062138/?text=${encodeURIComponent(
                mensajeWhatsapp
              )}`;

              // Obtener la primera imagen de la lista de imágenes
              let imageUrl = "images/producto-sin-imagen.png";
              if (product.ImageUrls && product.ImageUrls.length > 0) {
                imageUrl = product.ImageUrls[0];
              } else if (product.ImageUrl) {
                imageUrl = product.ImageUrl;
              }

              const productHTML = `
								<div class="product">
									<div class="product_image">
										<a href="product.html?productId=${product.IdProduct}">
                      <img src="${imageUrl}" alt="${product.Name}">
                    </a>
									</div>
									<div class="product_content clearfix mt-3">
										<div class="product_info">
											<div class="product_name"><a href="product.html?productId=${
                        product.IdProduct
                      }">${product.Name}</a></div>
											 <div class="product_price">$${Math.round(product.Price)
                           .toString()
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
										</div>
										<div class="product_options">
											<div class="product_buy product_option">
												<a href="${urlWhatsapp}" target="_blank" style="color: white; font-size: x-large;">
												<i class="bi bi-whatsapp"></i>
												</a>
											</div>
										</div>
									</div>
								</div>`;
              productList.innerHTML += productHTML;
            });
          } else {
            productList.textContent =
              "No se encontraron productos para esta categoría.";
          }
        })
        .catch((error) => {
          console.error("Error al cargar los productos:", error);
        });
    }
  }

  document.addEventListener("DOMContentLoaded", loadProductsByCategory);

  function initMenu() {
    if ($(".menu").length) {
      var menu = $(".menu");
      if ($(".burger_container").length) {
        burger.on("click", function () {
          if (menuActive) {
            closeMenu();
          } else {
            openMenu();

            $(document).one("click", function cls(e) {
              if ($(e.target).hasClass("menu_mm")) {
                $(document).one("click", cls);
              } else {
                closeMenu();
              }
            });
          }
        });
      }
    }
  }

  function openMenu() {
    menu.addClass("active");
    menuActive = true;
  }

  function closeMenu() {
    menu.removeClass("active");
    menuActive = false;
  }

  function initIsotope() {
    var sortingButtons = $(".product_sorting_btn");
    var sortNums = $(".num_sorting_btn");

    if ($(".product_grid").length) {
      var grid = $(".product_grid").isotope({
        itemSelector: ".product",
        layoutMode: "fitRows",
        getSortData: {
          price: function (itemElement) {
            var priceEle = $(itemElement)
              .find(".product_price")
              .text()
              .replace("$", "");
            return parseFloat(priceEle);
          },
          name: ".product_name",
          stars: function (itemElement) {
            var starsEle = $(itemElement).find(".rating");
            var stars = starsEle.attr("data-rating");
            return stars;
          },
        },
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });

      sortingButtons.each(function () {
        $(this).on("click", function () {
          var parent = $(this).parent().parent().find(".sorting_text");
          parent.text($(this).text());
          var option = $(this).attr("data-isotope-option");
          option = JSON.parse(option);
          grid.isotope(option);
        });
      });

      if ($(".box_view").length) {
        var box = $(".box_view");
        box.on("click", function () {
          if (window.innerWidth > 767) {
            $(".item").addClass("box");
            var option = '{ "sortBy": "original-order" }';
            option = JSON.parse(option);
            grid.isotope(option);
          }
        });
      }

      if ($(".detail_view").length) {
        var detail = $(".detail_view");
        detail.on("click", function () {
          if (window.innerWidth > 767) {
            $(".item").removeClass("box");
            var option = '{ "sortBy": "original-order" }';
            option = JSON.parse(option);
            grid.isotope(option);
            setTimeout(function () {
              grid.isotope(option);
            }, 500);
          }
        });
      }

      sortNums.each(function () {
        $(this).on("click", function () {
          var numSortingText = $(this).text();
          var numFilter = ":nth-child(-n+" + numSortingText + ")";
          $(".num_sorting_text").text($(this).text());
          $(".product_grid").isotope({ filter: numFilter });
        });
      });
    }
  }

  function initPriceSlider() {
    if ($("#slider-range").length) {
      $("#slider-range").slider({
        range: true,
        min: 20,
        max: 199,
        values: [20, 199],
        slide: function (event, ui) {
          $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        },
      });

      $("#amount").val(
        "$" +
          $("#slider-range").slider("values", 0) +
          " - $" +
          $("#slider-range").slider("values", 1)
      );
      $(".filter_price").on("mouseup", function () {
        $(".product_grid").isotope({
          filter: function () {
            var priceRange = $("#amount").val();
            var priceMin = parseFloat(
              priceRange.split("-")[0].replace("$", "")
            );
            var priceMax = parseFloat(
              priceRange.split("-")[1].replace("$", "")
            );
            var itemPrice = $(this)
              .find(".product_price")
              .clone()
              .children()
              .remove()
              .end()
              .text()
              .replace("$", "");

            return itemPrice > priceMin && itemPrice < priceMax;
          },
          animationOptions: {
            duration: 750,
            easing: "linear",
            queue: false,
          },
        });
      });
    }
  }

  function initProductsHeight() {
    if ($(".sidebar_left").length) {
      var sidebarH = $(".sidebar_left").outerHeight(true) + 309;
      $(".products").css("min-height", sidebarH);
    }
  }
});


//menu responsive

let menuActive = false;
const burger = $('.burger_container');
const menu = $('.menu');

function initMenu() {
  if ($('.menu').length) {
    var menu = $('.menu');
    if ($('.burger_container').length) {
      burger.on('click', function () {
        if (menuActive) {
          closeMenu();
        } else {
          openMenu();

          $(document).one('click', function cls(e) {
            if ($(e.target).hasClass('menu_mm')) {
              $(document).one('click', cls);
            } else if (!$(e.target).closest('[data-prevent-close="true"]').length) {
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

$(document).on('click', '[data-prevent-close="true"]', function(e) {
  e.stopPropagation();
});

initMenu();