function searchProducts(searchTerm) {
    searchTerm = searchTerm.toLowerCase(); // Convertir a minúsculas
    const encodedSearchTerm = encodeURIComponent(searchTerm); // Codificar el término de búsqueda
    window.location.href = `products.html?search=${encodedSearchTerm}`; // Redirigir a la página de productos
}

// Manejar búsqueda desde el primer formulario
document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    const searchTerm = document.getElementById("search-input").value; // Obtener el valor del input
    if (searchTerm.trim() !== "") { // Comprobar si no está vacío
        searchProducts(searchTerm); // Ejecutar la búsqueda
    }
});

// Manejar búsqueda desde el segundo formulario
document.getElementById("search-form-menu").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    const searchTerm = document.getElementById("search-input-menu").value; // Obtener el valor del input
    if (searchTerm.trim() !== "") { // Comprobar si no está vacío
        searchProducts(searchTerm); // Ejecutar la búsqueda
    }
});
