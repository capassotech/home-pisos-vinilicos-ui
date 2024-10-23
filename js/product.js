$(document).ready(function () {
  "use strict";

  var header = $(".header");
  var menuActive = false;
  var menu = $(".menu");
  var burger = $(".burger_container");
  var productId = getUrlParameter("productId"); // Obtener productId de la URL

  setHeader();

  $(window).on("resize", function () {
    setHeader();
  });

  $(document).on("scroll", function () {
    setHeader();
  });

  initMenu();
  initImage();
  initQuantity();
  displayProductDetails(productId); // Llamar a la función para mostrar detalles del producto

  function setHeader() {
    if ($(window).scrollTop() > 100) {
      header.addClass("scrolled");
    } else {
      header.removeClass("scrolled");
    }
  }

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

  function initImage() {
    var images = $(".product_image_thumbnail");
    var selected = $(".product_image_large img");

    images.each(function () {
      var image = $(this);
      image.on("click", function () {
        var imagePath = new String(image.data("image"));
        selected.attr("src", imagePath);
      });
    });
  }

  function initQuantity() {
    // Handle product quantity input
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
        console.log(product)
        if (product) {
          document.getElementById("productName").textContent = product.Name;
          document.getElementById("productDescription").textContent =
            product.Description || "Descripción no disponible.";
          document.getElementById(
            "productPrice"
          ).textContent = `Precio: $${product.Price.toFixed(2)}`;
          document.getElementById(
            "productPriceM2"
          ).textContent = `Precio por metro cuadrado $${product.PricePerSquareMeter.toFixed(
            2
          )}`;
          document.getElementById(
            "productImage"
          ).src = product.ImageUrl;

          // Mostrar categoría
          const categoriesContainer =
            document.getElementById("productCategories");
          categoriesContainer.innerHTML = ""; // Limpiar contenido anterior

          // Obtener el nombre de la categoría
          // database
          //   .ref("Category")
          //   .child(product.IdCategory)
          //   .once("value")
          //   .then((catSnapshot) => {
          //     const category = catSnapshot.val();
          //     if (category) {
          //       categoriesContainer.innerHTML += `<li><a href="/productos">${category.Name}</a></li>`;
          //     } else {
          //       console.error("Categoría no encontrada");
          //     }
          //   });
          // loadColors(Colors);
        } else {
          console.error("Producto no encontrado");
        }
      })
      .catch((error) => {
        console.error("Error obteniendo el producto:", error);
      });
  }

  let Colors = ["Rojo", "Verde", "Azul"];

  function loadColors(colors) {
    const colorSelect = document.getElementById("color_input");
    colorSelect.innerHTML = "";

    colors.forEach(color => {
      const option = document.createElement("option");
      option.value = color; // Nombre del color
      option.textContent = color; // Mostrar el nombre del color
      colorSelect.appendChild(option);
    });
  }

  // Función para obtener el parámetro de la URL
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
});