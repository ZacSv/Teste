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
            <h3 class="product-name-cart">${product.name}</h3>
            <p class="cart-quantity"> <form>
            <label>Quantidade</label>
            <select name="quantidade" class="quantity-select" required="required">
                <option class="qtd" value="">${product.quantity}</option>
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
  enviaMensagens();
  alert("Compra finalizada com sucesso!");
  updateCart();
});

if (!Array.isArray(cart)) {
  cart = [];
}

async function informacoesGupy() {
  const url = "https://teste-neon-mu.vercel.app/";
  try {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const qtd = Array.from(document.querySelectorAll(".qtd")).map((el) =>
      el.textContent.trim()
    );
    const productNameCart = Array.from(
      doc.querySelectorAll(".product-name-cart")
    ).map((el) => el.textContent.trim());
    const totalPrice = document
      .querySelector("#total-price")
      .textContent.trim();

    let complemento = "*Pedido*\n";
    productNameCart.forEach((name, index) => {
      complemento += `Produto: ${name} - Quantidade: ${qtd[index]}\n`;
    });
    complemento += `Total: ${totalPrice}`;
    return complemento;
  } catch (error) {
    console.error("Erro ao buscar as informações:", error);
    return "Não foi possível obter as informações das vagas.";
  }
}

// Função para enviar mensagem usando a API Twilio
async function enviaMensagens() {
  const accountSid = "ACaee3dcc8add495b3acf8a58c42acd77b";
  const authToken = "c63344e26aea40a4d3a3f2c396fc3b8f";

  try {
    updateCart();
    const mensagem = await informacoesGupy();
    const response = await fetch(
      "https://api.twilio.com/2010-04-01/Accounts/" +
        accountSid +
        "/Messages.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(accountSid + ":" + authToken),
        },
        body: new URLSearchParams({
          From: "whatsapp:+14155238886",
          Body: mensagem,
          To: "whatsapp:+553484345667",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao enviar a mensagem");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Erro ao enviar a mensagem:", error);
  }
}
