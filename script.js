const DEFAULTS = {

  name: "Vaso Gomix Original",

  price: 5000,

  desc:
    "Mango fresco + gomitas variadas + chamoy + Tajín + pimienta.",

  slogan:
    "El toque ácido y picante que te alegra el día."

};


/* CONTRASEÑA DEL ADMIN */

const ADMIN_PASSWORD = "Gomix2026!";


/* DATOS */

let settings =
  JSON.parse(
    localStorage.getItem("gomixSettings")
  ) || {...DEFAULTS};


let cart =
  JSON.parse(
    localStorage.getItem("gomixCart")
  ) || [];


/* ATAJO */

const $ = selector =>
  document.querySelector(selector);


/* MONEDA */

function money(number){

  return new Intl.NumberFormat(
    "es-CO",
    {
      style:"currency",
      currency:"COP",
      maximumFractionDigits:0
    }
  ).format(number);

}


/* SEGURIDAD PARA TEXTO */

function escapeHTML(text){

  return String(text).replace(
    /[&<>"']/g,
    character => {

      const entities = {

        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"

      };

      return entities[character];

    }
  );

}


/* GUARDAR CONFIGURACIÓN */

function saveSettings(){

  localStorage.setItem(
    "gomixSettings",
    JSON.stringify(settings)
  );

}


/* GUARDAR CARRITO */

function saveCart(){

  localStorage.setItem(
    "gomixCart",
    JSON.stringify(cart)
  );

}


/* ACTUALIZAR PRODUCTO */

function applySettings(){

  $("#productName").textContent =
    settings.name;

  $("#productDesc").textContent =
    settings.desc;

  $("#productPrice").textContent =
    money(settings.price) + " COP";


  $("#orderTotal").textContent =
    money(
      settings.price *
      Number($("#qty").value || 1)
    ) + " COP";

}


/* NOTIFICACIÓN */

function toast(message){

  const toastBox =
    $("#toast");

  toastBox.textContent =
    message;

  toastBox.classList.add("show");

  setTimeout(
    () =>
      toastBox.classList.remove("show"),
    2200
  );

}


/* MENU */

$("#menuBtn").addEventListener(
  "click",
  () =>
    $("#nav").classList.toggle("open")
);


document
  .querySelectorAll("nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () =>
        $("#nav").classList.remove("open")
    );

  });


/* AGREGAR AL CARRITO */

$("#addCart").addEventListener(
  "click",
  () => {

    const existing =
      cart.find(
        product =>
          product.name === settings.name
      );


    if(existing){

      existing.qty++;

    }else{

      cart.push({

        name:settings.name,

        price:settings.price,

        qty:1

      });

    }


    saveCart();

    renderCart();

    toast(
      "¡Vaso Gomix agregado! 🔥"
    );

  }
);


/* MOSTRAR CARRITO */

function renderCart(){

  const totalProducts =
    cart.reduce(
      (total, product) =>
        total + product.qty,
      0
    );


  $("#cartCount").textContent =
    totalProducts;


  const box =
    $("#cartItems");


  if(!cart.length){

    box.innerHTML =
      `
      <p style="
        color:#9ba69a;
        margin-top:25px;
      ">
        Tu carrito está vacío.
      </p>
      `;

    $("#cartTotal").textContent =
      "$0 COP";

    return;

  }


  box.innerHTML =
    cart.map(
      (product,index) => `

      <div class="drawer-item">

        <div>

          <h4>
            ${escapeHTML(product.name)}
          </h4>

          <small>
            ${money(product.price)} COP
          </small>

        </div>


        <div class="quantity">

          <button
            onclick="changeQty(${index},-1)"
          >
            −
          </button>

          <b>
            ${product.qty}
          </b>

          <button
            onclick="changeQty(${index},1)"
          >
            +
          </button>

          <button
            onclick="removeItem(${index})"
          >
            ✕
          </button>

        </div>

      </div>

      `
    ).join("");


  const total =
    cart.reduce(
      (sum,product) =>
        sum +
        product.price *
        product.qty,
      0
    );


  $("#cartTotal").textContent =
    money(total) + " COP";

}


/* CAMBIAR CANTIDAD */

window.changeQty =
  function(index,difference){

    cart[index].qty +=
      difference;


    if(cart[index].qty <= 0){

      cart.splice(index,1);

    }


    saveCart();

    renderCart();

  };


/* ELIMINAR */

window.removeItem =
  function(index){

    cart.splice(index,1);

    saveCart();

    renderCart();

    toast(
      "Producto eliminado"
    );

  };


/* ABRIR CARRITO */

function openCart(){

  $("#cartDrawer")
    .classList.add("open");

  $("#overlay")
    .classList.add("show");

}


/* CERRAR CARRITO */

function closeCart(){

  $("#cartDrawer")
    .classList.remove("open");

  $("#overlay")
    .classList.remove("show");

}


$("#cartBtn")
  .addEventListener(
    "click",
    openCart
  );


$("#closeCart")
  .addEventListener(
    "click",
    closeCart
  );


$("#overlay")
  .addEventListener(
    "click",
    closeCart
  );


/* MODALES */

function showModal(id){

  $("#" + id)
    .classList.add("show");

}


function hideModal(id){

  $("#" + id)
    .classList.remove("show");

}


document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () =>
        hideModal(
          button.dataset.close
        )
    );

  });


/* TOTAL PEDIDO */

$("#qty").addEventListener(
  "change",
  () => {

    const quantity =
      Number(
        $("#qty").value
      );

    $("#orderTotal").textContent =
      money(
        settings.price *
        quantity
      ) + " COP";

  }
);


/* FORMULARIO */

$("#orderForm").addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      $("#customer")
        .value
        .trim();


    const quantity =
      Number(
        $("#qty").value
      );


    const spice =
      $("#spice").value;


    const notes =
      $("#notes")
        .value
        .trim();


    $("#summaryContent").innerHTML = `

      <div class="summary-box">

        <div>
          <b>Cliente:</b>
          ${escapeHTML(name)}
        </div>

        <div>
          <b>Producto:</b>
          ${escapeHTML(settings.name)}
        </div>

        <div>
          <b>Cantidad:</b>
          ${quantity}
        </div>

        <div>
          <b>Nivel de picante:</b>
          ${escapeHTML(spice)}
        </div>

        <div>
          <b>Nota:</b>
          ${escapeHTML(
            notes || "Sin nota"
          )}
        </div>

        <div>
          <b>Total:</b>
          ${money(
            settings.price *
            quantity
          )} COP
        </div>

      </div>

    `;


    showModal(
      "summaryModal"
    );

  }
);


/* IR AL PEDIDO */

$("#checkoutBtn")
  .addEventListener(
    "click",
    () => {

      if(!cart.length){

        toast(
          "Agrega un producto primero"
        );

        return;

      }


      closeCart();


      $("#qty").value =
        Math.min(
          cart.reduce(
            (sum,product) =>
              sum + product.qty,
            0
          ),
          5
        );


      $("#orderTotal")
        .textContent =
        money(
          settings.price *
          Number(
            $("#qty").value
          )
        ) + " COP";


      document
        .querySelector("#pedido")
        .scrollIntoView({
          behavior:"smooth"
        });

    }
  );


/* ADMIN */

$("#adminBtn")
  .addEventListener(
    "click",
    () => {

      $("#adminPassword")
        .value = "";

      $("#loginError")
        .textContent = "";

      $("#loginBox")
        .hidden = false;

      $("#adminPanel")
        .hidden = true;

      showModal(
        "adminModal"
      );

    }
  );


/* LOGIN ADMIN */

$("#loginBtn")
  .addEventListener(
    "click",
    () => {

      const password =
        $("#adminPassword")
          .value;


      if(password === ADMIN_PASSWORD){

        $("#loginBox")
          .hidden = true;

        $("#adminPanel")
          .hidden = false;


        $("#editName")
          .value =
          settings.name;


        $("#editPrice")
          .value =
          settings.price;


        $("#editDesc")
          .value =
          settings.desc;


        $("#editSlogan")
          .value =
          settings.slogan;


      }else{

        $("#loginError")
          .textContent =
          "Contraseña incorrecta.";

      }

    }
  );


/* GUARDAR CAMBIOS */

$("#saveSettings")
  .addEventListener(
    "click",
    () => {

      settings = {

        name:
          $("#editName")
            .value
            .trim()
          || DEFAULTS.name,

        price:
          Number(
            $("#editPrice").value
          )
          || DEFAULTS.price,

        desc:
          $("#editDesc")
            .value
            .trim()
          || DEFAULTS.desc,

        slogan:
          $("#editSlogan")
            .value
            .trim()
          || DEFAULTS.slogan

      };


      saveSettings();

      applySettings();

      toast(
        "¡Cambios guardados! 🔥"
      );

      hideModal(
        "adminModal"
      );

    }
  );


/* RESTABLECER */

$("#resetSettings")
  .addEventListener(
    "click",
    () => {

      settings =
        {...DEFAULTS};


      saveSettings();

      applySettings();


      $("#editName")
        .value =
        settings.name;

      $("#editPrice")
        .value =
        settings.price;

      $("#editDesc")
        .value =
        settings.desc;

      $("#editSlogan")
        .value =
        settings.slogan;


      toast(
        "Valores restablecidos"
      );

    }
  );


/* INICIAR */

applySettings();

renderCart();
