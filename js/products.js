let currentPage = 1;
const itemsPerPage = 6;
let products = [];

// Función para obtener los productos desde Firebase
function getProductos() {
  const productsContainer = document.querySelector(".product_grid");

  database
    .ref("Product")
    .once("value")
    .then((snapshot) => {
      products = snapshot.val() ? Object.values(snapshot.val()) : [];
      updateProductDisplay(products, currentPage);
      updatePagination();
      const urlParams = new URLSearchParams(window.location.search);
      const searchTerm = urlParams.get("search");

      if (searchTerm) {
        document.getElementById("search-input").value = searchTerm;
        searchProducts(searchTerm);
      }
    })
    .catch((error) => {
      console.error("Error obteniendo los productos", error);
    });
}

// Función para mostrar los productos de la página actual
function updateProductDisplay(products, page) {
  const productsContainer = document.querySelector(".product_grid");
  productsContainer.innerHTML = "";
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  if (paginatedProducts.length === 0) {
    productsContainer.innerHTML = `<p>No se encontraron productos.</p>`;
    return;
  }
  paginatedProducts.forEach((product) => {
    const mensajeWhatsapp = `Hola, me interesa este producto: $${product.Price.toLocaleString(
      "es-AR",
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    )} ${product.Name}`;
    const urlWhatsapp = `https://wa.me/5493435062138/?text=${encodeURIComponent(
      mensajeWhatsapp
    )}`;

    const imageUrl =
      product.ImageUrls && product.ImageUrls.length > 0
        ? product.ImageUrls[0] // Usa la primera imagen en ImageUrls
        : "images/producto-sin-imagen.png";

    const productHTML = `
      <div class="product">
        <div class="product_image">
          <img src="${imageUrl}" alt="${product.Name}">
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
    productsContainer.innerHTML += productHTML;
  });
}

// Función de búsqueda
function searchProducts(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  const filteredProducts = products.filter((product) => {
    return Object.values(product).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm);
      }
      return false;
    });
  });

  currentPage = 1;
  updateProductDisplay(filteredProducts, currentPage);
  updatePagination();
}

// Manejar la búsqueda cuando el usuario escribe en el campo de búsqueda
document.getElementById("search-input").addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  searchProducts(searchTerm);
});

// Función de paginación
function updatePagination() {
  const pageInfo = document.getElementById("page-info");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  const totalPages = Math.ceil(products.length / itemsPerPage);
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

// Eventos para la paginación
document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateProductDisplay(products, currentPage);
    updatePagination();
  }
});

document.getElementById("next").addEventListener("click", () => {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateProductDisplay(products, currentPage);
    updatePagination();
  }
});

// Llamada inicial para obtener los productos
getProductos();
