/* ==========================================
   CONFIGURACIÓN PRINCIPAL DE GOMIX
========================================== */

const DEFAULTS = {

    name: "Vaso Gomix Original",

    price: 5000,

    desc:
        "Mango fresco + gomitas variadas + chamoy + Tajín + pimienta.",

    slogan:
        "El toque ácido y picante que te alegra el día."

};


/*
    🔐 CONTRASEÑA DEL ADMINISTRADOR

    Puedes cambiarla por la que quieras.
*/

const ADMIN_PASSWORD = "Gomix2026!";


/* ==========================================
   DATOS
========================================== */

let settings =
    JSON.parse(
        localStorage.getItem("gomixSettings")
    ) ||
    { ...DEFAULTS };


let cart =
    JSON.parse(
        localStorage.getItem("gomixCart")
    ) ||
    [];


/* ==========================================
   FUNCIONES BÁSICAS
========================================== */

const $ = id =>
    document.getElementById(id);


function money(number) {

    return "$" +
        Number(number).toLocaleString("es-CO") +
        " COP";

}


function escapeHTML(text) {

    return String(text).replace(
        /[&<>"']/g,

        character => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        }[character])

    );

}


/* ==========================================
   ACTUALIZAR INFORMACIÓN
========================================== */

function applySettings() {

    $("productName").textContent =
        settings.name;


    $("productDesc").textContent =
        settings.desc;


    $("productPrice").textContent =
        money(settings.price)
            .replace(" COP", "");


    $("heroPrice").textContent =
        money(settings.price);


    $("total").textContent =
        money(
            (+$("qty").value || 1) *
            settings.price
        );


    $("eName").value =
        settings.name;


    $("ePrice").value =
        settings.price;


    $("eDesc").value =
        settings.desc;


    $("eSlogan").value =
        settings.slogan;

}


/* ==========================================
   GUARDAR CONFIGURACIÓN
========================================== */

function saveSettings() {

    localStorage.setItem(
        "gomixSettings",
        JSON.stringify(settings)
    );

    applySettings();

}


/* ==========================================
   ABRIR / CERRAR VENTANAS
========================================== */

function overlay(id, open = true) {

    $(id).classList.toggle(
        "open",
        open
    );

}


/* ==========================================
   NOTIFICACIONES
========================================== */

function toast(message) {

    const element =
        $("toast");


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(
        () => {

            element.classList.remove(
                "show"
            );

        },

        2000
    );

}


/* ==========================================
   MENÚ
========================================== */

$("menu").onclick = () => {

    $("nav").classList.toggle(
        "open"
    );

};


/* ==========================================
   CARRITO
========================================== */

$("add").onclick = () => {

    let product =
        cart.find(
            item =>
                item.name === settings.name
        );


    if (product) {

        product.qty++;

    } else {

        cart.push({

            name: settings.name,

            price: settings.price,

            qty: 1

        });

    }


    localStorage.setItem(
        "gomixCart",
        JSON.stringify(cart)
    );


    renderCart();


    toast(
        "Agregado al carrito 🥭"
    );

};


/* ==========================================
   MOSTRAR CARRITO
========================================== */

function renderCart() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.qty,
            0
        );


    $("cartCount").textContent =
        count;


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.qty *
                item.price,

            0
        );


    $("cartTotal").textContent =
        money(total);


    if (!cart.length) {

        $("items").innerHTML =
            `
            <p class="empty">
                Tu carrito está vacío.
            </p>
            `;

        return;

    }


    $("items").innerHTML =

        cart.map(
            (item, index) =>

                `
                <div class="cart-row">

                    <div>

                        <b>
                            ${escapeHTML(item.name)}
                        </b>

                        <br>

                        <button
                            onclick="changeQuantity(${index}, -1)"
                        >
                            −
                        </button>

                        ${item.qty}

                        <button
                            onclick="changeQuantity(${index}, 1)"
                        >
                            +
                        </button>

                        <button
                            onclick="removeItem(${index})"
                        >
                            Eliminar
                        </button>

                    </div>


                    <b>
                        ${money(
                            item.qty *
                            item.price
                        )}
                    </b>

                </div>
                `

        ).join("");

}


/* ==========================================
   CAMBIAR CANTIDAD
========================================== */

window.changeQuantity =
function(index, change) {

    cart[index].qty +=
        change;


    if (
        cart[index].qty <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "gomixCart",
        JSON.stringify(cart)
    );


    renderCart();

};


/* ==========================================
   ELIMINAR PRODUCTO
========================================== */

window.removeItem =
function(index) {

    cart.splice(
        index,
        1
    );


    localStorage.setItem(
        "gomixCart",
        JSON.stringify(cart)
    );


    renderCart();

};


/* ==========================================
   BOTÓN CARRITO
========================================== */

$("cartBtn").onclick =
    () => {

        overlay("cart");

    };


/* ==========================================
   CERRAR MODALES
========================================== */

document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(button => {

        button.onclick = () => {

            overlay(
                button.dataset.close,
                false
            );

        };

    });


/* ==========================================
   CANTIDAD DEL PEDIDO
========================================== */

$("qty").oninput =
    () => {

        const quantity =
            +$("qty").value || 1;


        $("total").textContent =
            money(
                quantity *
                settings.price
            );

    };


/* ==========================================
   FORMULARIO DE PEDIDO
========================================== */

$("form").onsubmit =
    event => {

        event.preventDefault();


        const quantity =
            +$("qty").value || 1;


        const customer =
            $("name").value;


        const spice =
            $("spice").value;


        const notes =
            $("notes").value ||
            "Sin notas";


        $("summaryText").innerHTML =

            `
            <div>
                <span>Cliente</span>
                <b>
                    ${escapeHTML(customer)}
                </b>
            </div>

            <div>
                <span>Producto</span>
                <b>
                    ${escapeHTML(
                        settings.name
                    )}
                </b>
            </div>

            <div>
                <span>Cantidad</span>
                <b>
                    ${quantity}
                </b>
            </div>

            <div>
                <span>Picante</span>
                <b>
                    ${escapeHTML(spice)}
                </b>
            </div>

            <div>
                <span>Nota</span>
                <b>
                    ${escapeHTML(notes)}
                </b>
            </div>

            <div>
                <span>Total</span>
                <b>
                    ${money(
                        quantity *
                        settings.price
                    )}
                </b>
            </div>
            `;


        overlay(
            "summary"
        );

    };


/* ==========================================
   CONTINUAR DEL CARRITO
========================================== */

$("goOrder").onclick =
    () => {

        if (!cart.length) {

            toast(
                "Agrega un producto primero"
            );

            return;

        }


        const quantity =
            cart.reduce(
                (sum, item) =>
                    sum + item.qty,

                0
            );


        $("qty").value =
            quantity;


        $("qty").dispatchEvent(
            new Event("input")
        );


        overlay(
            "cart",
            false
        );


        document
            .querySelector("#pedido")
            .scrollIntoView({
                behavior: "smooth"
            });

    };


/* ==========================================
   ADMINISTRADOR
========================================== */

$("adminBtn").onclick =
    () => {

        overlay(
            "admin"
        );

    };


/* ==========================================
   LOGIN
========================================== */

$("loginBtn").onclick =
    () => {

        const password =
            $("pass").value;


        if (
            password ===
            ADMIN_PASSWORD
        ) {

            $("login").hidden =
                true;


            $("panel").hidden =
                false;


            $("pass").value =
                "";


            toast(
                "Acceso concedido 🔐"
            );

        } else {

            $("error").textContent =
                "Contraseña incorrecta.";

        }

    };


/* ==========================================
   GUARDAR CAMBIOS DEL ADMIN
========================================== */

$("save").onclick =
    () => {

        settings = {

            name:
                $("eName")
                    .value
                    .trim()
                ||
                DEFAULTS.name,


            price:
                +$("ePrice").value
                ||
                DEFAULTS.price,


            desc:
                $("eDesc")
                    .value
                    .trim()
                ||
                DEFAULTS.desc,


            slogan:
                $("eSlogan")
                    .value
                    .trim()
                ||
                DEFAULTS.slogan

        };


        saveSettings();


        $("saved").textContent =
            "Cambios guardados correctamente.";


        toast(
            "Gomix actualizado ✨"
        );

    };


/* ==========================================
   RESTABLECER
========================================== */

$("reset").onclick =
    () => {

        settings =
            { ...DEFAULTS };


        saveSettings();


        $("saved").textContent =
            "Valores restaurados.";

    };


/* ==========================================
   INICIAR
========================================== */

applySettings();

renderCart();
