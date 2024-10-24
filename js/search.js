function searchProducts(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const encodedSearchTerm = encodeURIComponent(searchTerm); 
    window.location.href = `products.html?search=${encodedSearchTerm}`;
  }
  document.getElementById("search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    if (searchTerm.trim() !== "") {
      searchProducts(searchTerm);
    }
  });
  