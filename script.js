// Array of products
const products = [
    {
      id: 1,
      name: "Produto 1",
      description: "Descrição do produto 1",
      price: 10.99,
    },
    {
      id: 2,
      name: "Produto 2",
      description: "Descrição do produto 2",
      price: 20.99,
    },
    { 
      id: 3,
      name: "Produto 3",
      description: "Descrição do produto 3",
      price: 30.99,
    },
    {
      id: 4,
      name: "Notebook",
      description: "Notebook de última geração",
      price: 2500.0,
    },
    {
      id: 5,
      name: "Smartphone",
      description: "Smartphone de alta resolução",
      price: 1800.0,
    },
    {
      id: 6,
      name: "Headset Gamer",
      description: "Headset de alta qualidade para jogos",
      price: 200.0,
    },
  ];
  
  // Renderizar produtos
  const productList = document.getElementById("product-list");
  products.forEach((product) => {
    const li = document.createElement("li");
    li.dataset.productId = product.id;
    li.innerHTML = `
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">R$ ${product.price.toFixed(2)}</p>
          <button class="add-to-cart-btn">Adicionar ao carrinho</button>
      `;
    productList.appendChild(li);
  });
  
  // adicionar produto ao carrinho
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productId = e.target.parentNode.dataset.productId;
      const product = products.find((p) => p.id === parseInt(productId));
      if (product) {
        const existingProduct = cart.find((p) => p.id === product.id);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          });
        }
        updateCart();
      }
    }
  });
  
  // remover produto do carrinho
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-from-cart-btn")) {
      const productId = e.target.parentNode.dataset.productId;
      const index = cart.findIndex((p) => p.id === parseInt(productId));
      if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
      }
    }
  });
  
  // atualizar carrinho
  function updateCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";
    cart.forEach((product) => {
      const li = document.createElement("li");
      li.dataset.productId = product.id;
      li.innerHTML = `
              <h3 class="product-name">${product.name}</h3>
              <p class="cart-quantity"> <form>
              <label>Quantidade</label>
              <select name="quantidade" class="quantity-select" required="required">
                  <option value="">Selecionada até o momento ${
                    product.quantity
                  }</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
              </select>
          </form> </p>
              <p class="product-price">R$ ${(
                product.price * product.quantity
              ).toFixed(2)}</p>
              <button class="remove-from-cart-btn">Remover do carrinho</button>
          `;
      cartList.appendChild(li);
    });
    const totalPrice = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    document.getElementById(
      "total-price"
    ).innerText = `Total: R$ ${totalPrice.toFixed(2)}`;
  }
  
  const removeFromCartButtons = document.getElementsByClassName(
    "remove-from-cart-btn"
  );
  
  for (let i = 0; i < removeFromCartButtons.length; i++) {
    removeFromCartButtons[i].addEventListener("click", () => {
      const productId = removeFromCartButtons[i].parentNode.dataset.productId;
      const index = cart.findIndex((p) => p.id === parseInt(productId));
      if (index !== -1) {
        cart.splice(index, 1);
      }
    });
  }
  
  //Evento que captura mudança nas quantidades selecionadas
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("quantity-select")) {
      const productId = e.target.parentNode.parentNode.dataset.productId;
      const product = cart.find((p) => p.id === parseInt(productId));
      if (product) {
        const newQuantity = parseInt(e.target.value);
        product.quantity = newQuantity;
        updateCart();
      }
    }
  });
  
  // finalizar compra
  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Compra finalizada com sucesso!");
    cart = [];
    updateCart();
  });
  
  if (!Array.isArray(cart)) {
    cart = [];
  }
  