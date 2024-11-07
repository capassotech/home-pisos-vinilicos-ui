$(document).ready(function () {
  "use strict";

  var header = $(".header");
  var menuActive = false;
  var menu = $(".menu");
  var burger = $(".burger_container");
  var productId = getUrlParameter("productId");

  setHeader();

  $(window).on("resize", function () {
    setHeader();
  });

  $(document).on("scroll", function () {
    setHeader();
  });

  initMenu();
  initQuantity();
  displayProductDetails(productId);

  function setHeader() {
    if ($(window).scrollTop() > 100) {
      header.addClass("scrolled");
    } else {
      header.removeClass("scrolled");
    }
  }

  function initMenu() {
    if ($(".menu").length) {
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

  function initQuantity() {
    if ($(".product_quantity").length) {
      var input = $("#quantity_input");
      var incButton = $("#quantity_inc_button");
      var decButton = $("#quantity_dec_button");

      var originalVal;
      var endVal;

      incButton.on("click", function () {
        originalVal = input.val();
        endVal = parseFloat(originalVal) + 1;
        input.val(endVal);
      });

      decButton.on("click", function () {
        originalVal = input.val();
        if (originalVal > 0) {
          endVal = parseFloat(originalVal) - 1;
          input.val(endVal);
        }
      });
    }
  }

  function displayProductDetails(productId) {
    const database = firebase.database();

    database
      .ref("Product")
      .child(productId)
      .once("value")
      .then((snapshot) => {
        const product = snapshot.val();
        if (product) {
          document.getElementById("whatsappLink").addEventListener("click", function () {
            const currentUrl = window.location.href;
            const mensajeWhatsapp = `Hola, me interesa este producto: ${product.Name}.\n${currentUrl}`;
            const urlWhatsapp = `https://wa.me/5493435062138/?text=${encodeURIComponent(mensajeWhatsapp)}`;
            window.open(urlWhatsapp, '_blank');
          });

          document.getElementById("productName").textContent = product.Name;
          document.getElementById("productDimensions").textContent = product.Dimensions || "";
          document.getElementById("productTechnicalSheet").textContent = product.TechnicalSheet || "";
          document.getElementById("productDescription").textContent = product.Description || "";

          var textPrice = "";
          if (product.PricePerSquareMeter != null && product.PricePerSquareMeter != 0) {
            textPrice = `$${product.PricePerSquareMeter.toFixed(2)} x m2`;
          } else {
            textPrice = `$${product.Price.toFixed(2)}`;
          }

          document.getElementById("productPrice").textContent = textPrice;

          // Verificar si ImageUrls está presente y no vacío
          if (product.ImageUrls && product.ImageUrls.length > 0) {
            // Establecer la primera imagen como la imagen principal
            document.getElementById("productImage").src = product.ImageUrls[0];

            // Crear miniaturas de imágenes
            const thumbnailContainer = document.getElementById("imageThumbnails");
            thumbnailContainer.innerHTML = ""; // Limpiar miniaturas previas
            product.ImageUrls.forEach((url) => {
              const img = document.createElement("img");
              img.src = url;
              img.className = "product_image_thumbnail";
              img.onclick = function () {
                document.getElementById("productImage").src = url;
              };
              thumbnailContainer.appendChild(img);
            });
          } else {
            document.getElementById("productImage").src = 'images/producto-sin-imagen.png';
          }

          const categoriesContainer = document.getElementById("productCategories");
          categoriesContainer.innerHTML = ""; // Limpiar contenido anterior

          database
            .ref("Category")
            .child(product.IdCategory)
            .once("value")
            .then((catSnapshot) => {
              const category = catSnapshot.val();
              if (category) {
                categoriesContainer.innerHTML += `
                  <li>
                    <a style="font-family: 'Open Sans', sans-serif;" href="/productsByCategory.html?category=${category.IdCategory}">${category.Name}</a>
                  </li>
                  <li>
                    <a style="font-family: 'Open Sans', sans-serif;">${product.Name}</a>
                  </li>`;
              } else {
                console.error("Categoría no encontrada");
              }
            });
        } else {
          console.error("Producto no encontrado");
        }
      })
      .catch((error) => {
        console.error("Error obteniendo el producto:", error);
      });
  }

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
});
