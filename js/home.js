function obtenerProductosDestacados() {
  const productosRef = firebase.database().ref("Product");

  productosRef
    .orderByChild("IsFeatured")
    .equalTo(true)
    .limitToFirst(6)
    .once("value", (snapshot) => {
      const productosContainer = document.querySelector(".products_container");
      productosContainer.innerHTML = "";
      snapshot.forEach((childSnapshot) => {
        const producto = childSnapshot.val();
        const currentUrl = window.location.href;
        const mensajeWhatsapp = `Hola, me interesa este producto: ${producto.Name}.\n${currentUrl}`;
        const urlWhatsapp = `https://wa.me/5493435062138/?text=${encodeURIComponent(
          mensajeWhatsapp
        )}`;
        const imageUrl =
          producto.ImageUrls && producto.ImageUrls.length > 0
            ? producto.ImageUrls[0]
            : "images/producto-sin-imagen.png";
        productosContainer.innerHTML += `
          <div class="col-lg-4 product_col">
            <div class="product">
              <div class="product_image">
                <img src="${imageUrl}" alt="${producto.Name}">
              </div>
              <div class="product_content-home">
                <div class="product_info">
                  <div class="product_name"><a href="product.html?productId=${producto.IdProduct}">${producto.Name}</a></div>
                  <div class="product_price">$${Math.round(producto.Price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                </div>
                <div class="product_options">
                  <div class="product_buy product_option">
                    <a href="${urlWhatsapp}" target="_blank" style="color: white; font-size: x-large;">
                      <i class="bi bi-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      });
    });
}

obtenerProductosDestacados();
