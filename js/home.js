function obtenerProductosDestacados() {
    const productosRef = firebase.database().ref('Product');

    productosRef.orderByChild('IsFeatured').equalTo(true).limitToFirst(6).once('value', (snapshot) => {
        console.log(snapshot)
        const productosContainer = document.querySelector('.products_container');
        productosContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const producto = childSnapshot.val();
            const mensajeWhatsapp = `Hola, me interesa este producto: $${producto.Price} ${producto.Name}`;
            const urlWhatsapp = `https://wa.me/5493435062138/?text=${encodeURIComponent(mensajeWhatsapp)}`;

            productosContainer.innerHTML += `
          <div class="col-lg-4 product_col">
            <div class="product">
              <div class="product_image">
                <img src="images/product_1.jpg" alt="${producto.Name}">
              </div>
              <div class="product_content clearfix">
                <div class="product_info">
                  <div class="product_name"><a href="product.html">${producto.Name}</a></div>
                  <div class="product_price">$${producto.Price}</div>
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