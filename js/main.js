// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCjcyPOQ_29zyZGtxk13iJdbDsP1AG8bM",
  authDomain: "home-pisos-vinilicos.firebaseapp.com",
  databaseURL: "https://home-pisos-vinilicos-default-rtdb.firebaseio.com",
  projectId: "home-pisos-vinilicos",
  storageBucket: "home-pisos-vinilicos.appspot.com",
  messagingSenderId: "392689672279",
  appId: "1:392689672279:web:81245db39bf2e1dab7c312",
  measurementId: "G-4HC6MV32X4",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentPage = 1;
const itemsPerPage = 6; // Cambia esto según tus necesidades
let products = [];

// Función para obtener productos
function getProductos() {
  const productsContainer = document.querySelector(".producto_grid");

  database
    .ref("Product")
    .once("value")
    .then((snapshot) => {
      products = snapshot.val() ? Object.values(snapshot.val()) : [];
      updateProductDisplay(products, currentPage);
      updatePagination();
    })
    .catch((error) => {
      console.error("Error obteniendo los productos");
    });
}

// Función para mostrar los productos de la página actual
function updateProductDisplay(products, page) {
  const productsContainer = document.querySelector(".producto_grid");
  productsContainer.innerHTML = ""; // Limpia el contenedor

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  paginatedProducts.forEach((product) => {
    const productHTML = `
            <div class="product">
                <div class="product_image"><img src="images/${
                  product.IdProduct
                }.jpg" alt=""></div>
                <div class="product_content clearfix mt-3">
                    <div class="product_info">
                        <div class="product_name"><a href="product.html">${
                          product.Name
                        }</a></div>
                        <div class="product_price">$${product.Price.toFixed(
                          2
                        )}</div>
                    </div>
                    <div class="product_options">
                        <div class="product_buy product_option"><img src="images/shopping-bag-white.svg" alt=""></div>
                        <div class="product_fav product_option">+</div>
                    </div>
                </div>
            </div>`;
    productsContainer.innerHTML += productHTML;
  });
}

// Funciones para manejar el paginado
function updatePagination() {
  const pageInfo = document.getElementById("page-info");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  const totalPages = Math.ceil(products.length / itemsPerPage);
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

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

// Función de búsqueda
function searchProducts(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  filteredProducts = products.filter((product) => {
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

document.getElementById("search-input").addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  searchProducts(searchTerm);
});

// Llama a la función
getProductos();
