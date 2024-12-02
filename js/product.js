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
          const productButtonsContainer =
            document.querySelector(".product_buttons");
          const currentUrl = window.location.href;
          const mensajeWhatsapp = `Hola, me interesa este producto: ${product.Name}.\n${currentUrl}`;
          const urlWhatsapp = `https://wa.me/5493435062138/?text=${encodeURIComponent(
            mensajeWhatsapp
          )}`;

          const productButtonstHTML = `
                <div class="button cart_button" style="width: 100%;">
                    <a id="whatsappLink" href="${urlWhatsapp}" target="_blank"><i class="bi bi-whatsapp" style="color: white"></i>
                    Consultar</a>
                </div>`;

          productButtonsContainer.innerHTML += productButtonstHTML;

          //Ruta de categorias
          if (product.IdCategory != undefined) {
            const categoriesContainer =
              document.getElementById("productCategories");
            categoriesContainer.innerHTML = "";

            database
              .ref("Category")
              .child(product.IdCategory)
              .once("value")
              .then((catSnapshot) => {
                const category = catSnapshot.val();
                if (category) {
                  categoriesContainer.innerHTML += `
                                    <li>
                                    <a href="/productsByCategory.html?category=${category.IdCategory}">${category.Name}</a>
                                    </li>
                                    <li>
                                    <a>${product.Name}</a>
                                    </li>`;
                } else {
                  console.error("Categoría no encontrada");
                }
              });
          }

          document.getElementById("productName").textContent = product.Name;
          document.getElementById("productPrice").textContent = product.Price
            ? `$${product.Price.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`
            : "Precio no disponible";
          document.getElementById("productDescription").textContent =
            product.Description || "";

          const mainImage = document.getElementById("productImage");
          if (product.ImageUrls && product.ImageUrls.length > 0) {
            mainImage.src = product.ImageUrls[0];

            const thumbnailContainer =
              document.getElementById("imageThumbnails");
            let currentImageIndex = 0;

            const productImageLarge = document.querySelector(
              ".product_image_large"
            );
            const zoomButton = document.createElement("button");
            zoomButton.className = "zoom-button";
            zoomButton.innerHTML = '<i class="bi bi-arrows-angle-expand"></i>';
            productImageLarge.appendChild(zoomButton);

            const modal = document.createElement("div");
            modal.className = "modal";
            modal.innerHTML = `
                        <span class="modal-close">&times;</span>
                        <span class="modal-nav modal-prev"><i class="bi bi-chevron-left"></i></span>
                        <span class="modal-nav modal-next"><i class="bi bi-chevron-right"></i></span>
                        <img src="${product.ImageUrls[0]}" alt="${product.Name}">
                    `;
            document.body.appendChild(modal);

            zoomButton.addEventListener("click", () => {
              modal.style.display = "flex";
              updateModalImage(currentImageIndex);
            });

            modal
              .querySelector(".modal-close")
              .addEventListener("click", () => {
                modal.style.display = "none";
              });

            modal.querySelector(".modal-prev").addEventListener("click", () => {
              currentImageIndex =
                (currentImageIndex - 1 + product.ImageUrls.length) %
                product.ImageUrls.length;
              updateModalImage(currentImageIndex);
            });

            modal.querySelector(".modal-next").addEventListener("click", () => {
              currentImageIndex =
                (currentImageIndex + 1) % product.ImageUrls.length;
              updateModalImage(currentImageIndex);
            });

            function updateModalImage(index) {
              modal.querySelector("img").src = product.ImageUrls[index];
              mainImage.src = product.ImageUrls[index];
            }

            document.addEventListener("keydown", (e) => {
              if (e.key === "Escape") {
                modal.style.display = "none";
              }
            });

            thumbnailContainer.innerHTML = "";
            product.ImageUrls.forEach((url, index) => {
              const img = document.createElement("img");
              img.src = url;
              img.className = "product_image_thumbnail";
              img.onclick = function () {
                mainImage.src = url;
                currentImageIndex = index;
              };
              thumbnailContainer.appendChild(img);
            });
          } else {
            mainImage.src = "images/producto-sin-imagen.png";
          }
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
