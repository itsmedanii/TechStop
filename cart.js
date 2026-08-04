/* =========================================
   MOTOR CENTRAL DEL CARRITO - TECHSTOP
   ========================================= */

// 1. Cargar el carrito guardado en la memoria del navegador
let cart = JSON.parse(localStorage.getItem('techStopCart')) || [];

// Guardar en memoria local y actualizar la interfaz visual
function saveAndRender() {
    localStorage.setItem('techStopCart', JSON.stringify(cart));
    updateCartUI();
}

// Cambiar la selección visual del paquete (borde naranja)
function selectBundle(element) {
    document.querySelectorAll('.bundle-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

// Función auxiliar para obtener la opción seleccionada (con respaldo automático)
function getSelectedBundleData() {
    let selectedOption = document.querySelector('.bundle-option.selected');
    
    // Respaldo: Si por alguna razón no hay ninguna con .selected, toma la primera opción visible
    if (!selectedOption) {
        selectedOption = document.querySelector('.bundle-option');
    }
    
    if (!selectedOption) return null;

    const name = selectedOption.getAttribute('data-name');
    const price = parseFloat(selectedOption.getAttribute('data-price'));

    if (!name || isNaN(price)) return null;
    return { name: name, price: price };
}

// -----------------------------------------
// FUNCIONES PARA PAQUETES (Y20 y Panel LED)
// -----------------------------------------

// Botón "Añadir al Carrito"
function addSelectedBundle() {
    const bundle = getSelectedBundleData();
    if (!bundle) {
        alert("Por favor selecciona una opción.");
        return;
    }
    cart.push({ name: bundle.name, price: bundle.price });
    saveAndRender();
    alert("¡" + bundle.name + " agregado al carrito!");
}

// Botón "Comprar Ahora" (Incondicional: Agrega y manda DIRECTO al Checkout)
function buyNowBundle() {
    const bundle = getSelectedBundleData();
    if (bundle) {
        cart.push({ name: bundle.name, price: bundle.price });
        localStorage.setItem('techStopCart', JSON.stringify(cart));
    }
    // Redirección forzada sin alertas intermedias
    window.location.href = 'checkout.html';
}

// -----------------------------------------
// FUNCIONES PARA PRODUCTOS INDIVIDUALES (Dashcam)
// -----------------------------------------

// Botón "Añadir al Carrito" (Dashcam)
function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: Number(productPrice) });
    saveAndRender();
    alert("¡" + productName + " se ha añadido a tu carrito!");
}

// Botón "Comprar Ahora" (Dashcam)
function buyNowIndividual(productName, productPrice) {
    cart.push({ name: productName, price: Number(productPrice) });
    localStorage.setItem('techStopCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// -----------------------------------------
// GESTIÓN Y MENÚ DESPLEGABLE DEL CARRITO
// -----------------------------------------

// Eliminar un producto específico (Botón X)
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRender();
}

// Abrir / cerrar la ventanita del carrito
function toggleCartDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

/// Actualizar el contador global, la lista visual y la BARRA DE ENVÍO
function updateCartUI() {
    let cartTotal = cart.reduce((total, item) => total + item.price, 0);
    
    const cartCount = document.getElementById('cart-count');
    const cartDropdownItems = document.getElementById('cart-dropdown-items');
    const cartTotalPrice = document.getElementById('cart-dropdown-total-price');
    const shippingProgress = document.getElementById('shipping-progress-container'); // NUEVO CONTENEDOR

    // 1. Actualizar numerito del carrito
    if(cartCount) {
        cartCount.innerText = cart.length;
        cartCount.style.display = cart.length > 0 ? 'inline-block' : 'none';
    }

    // 2. Actualizar precio total
    if(cartTotalPrice) {
        cartTotalPrice.innerText = "$" + cartTotal.toLocaleString('es-CO');
    }

    // 3. Lógica de la Barra de Envío Gratis ($250.000 COP)
    if(shippingProgress) {
        const freeShippingThreshold = 250000;
        
        if (cartTotal === 0) {
            shippingProgress.innerHTML = ''; // Ocultar si está vacío
        } else if (cartTotal >= freeShippingThreshold) {
            // ¡Meta alcanzada!
            shippingProgress.innerHTML = `
                <div style="background-color: #28628B; color: white; padding: 8px; border-radius: 5px; text-align: center; font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: bold; margin-bottom: 15px;">
                    ¡Felicidades! 🎉 Tienes ENVÍO GRATIS a Colombia
                </div>
            `;
        } else {
            // Faltan pesitos...
            let missingAmount = freeShippingThreshold - cartTotal;
            let percentage = (cartTotal / freeShippingThreshold) * 100;
            
            shippingProgress.innerHTML = `
                <div style="font-family: 'Poppins', sans-serif; font-size: 0.85rem; text-align: center; color: #2E4365; margin-bottom: 5px;">
                    Te faltan <strong>$${missingAmount.toLocaleString('es-CO')}</strong> para envío GRATIS
                </div>
                <div style="width: 100%; background-color: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden; margin-bottom: 15px;">
                    <div style="width: ${percentage}%; background-color: #E27C31; height: 100%; transition: width 0.4s ease;"></div>
                </div>
            `;
        }
    }

    // 4. Renderizar los productos (Igual que antes)
    if(cartDropdownItems) {
        cartDropdownItems.innerHTML = ''; 
        if (cart.length === 0) {
            cartDropdownItems.innerHTML = '<div style="text-align:center; padding:15px; color:#666; font-family: \'Glacial Indifference\', sans-serif;">Tu carrito está vacío</div>';
        } else {
            cart.forEach((item, index) => {
                cartDropdownItems.innerHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
                        <div style="display: flex; flex-direction: column;">
                            <span style="color:#2E4365; font-weight:bold; font-size: 0.85rem; font-family: 'Poppins', sans-serif;">${item.name}</span>
                            <span style="color:#E27C31; font-weight:bold; font-size: 0.85rem; font-family: 'Poppins', sans-serif;">$${item.price.toLocaleString('es-CO')}</span>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #d9534f; font-size: 1.2rem; cursor: pointer; font-weight: bold; padding: 0 5px;" title="Eliminar">&times;</button>
                    </div>
                `;
            });
        }
    }
}


// Ejecutar automáticamente al cargar cualquier página
document.addEventListener('DOMContentLoaded', updateCartUI);