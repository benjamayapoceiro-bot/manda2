// Customer Panel JavaScript
let currentUser = null;
let cart = [];
let businesses = [];
let orders = [];
let addresses = [];
let paymentMethods = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadBusinesses();
    loadOrders();
    loadAddresses();
    loadPaymentMethods();
    updateStats();
});

// Load user data
function loadUserData() {
    const userData = localStorage.getItem('manda2_user');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userData);
    document.getElementById('customer-name').textContent = currentUser.name || 'Cliente';
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
}

// Demo businesses data
const demoBusinesses = [
    {
        id: '1',
        name: 'Pizzería Don Mario',
        category: 'food',
        address: 'Av. San Martín 1234',
        deliveryTime: '25-35 min',
        rating: 4.5,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        products: [
            { id: '1', name: 'Pizza Margherita', price: 2500, description: 'Mozzarella, tomate, albahaca' },
            { id: '2', name: 'Pizza Pepperoni', price: 2800, description: 'Mozzarella, pepperoni' },
            { id: '3', name: 'Pizza Hawaiana', price: 2900, description: 'Mozzarella, jamón, piña' }
        ]
    },
    {
        id: '2',
        name: 'Supermercado La Villa',
        category: 'groceries',
        address: 'Calle Mitre 567',
        deliveryTime: '15-25 min',
        rating: 4.2,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
        products: [
            { id: '4', name: 'Leche Entera 1L', price: 450, description: 'Leche fresca entera' },
            { id: '5', name: 'Pan de Mesa', price: 380, description: 'Pan fresco de cada día' },
            { id: '6', name: 'Yogurt Natural', price: 320, description: 'Yogurt natural sin azúcar' }
        ]
    },
    {
        id: '3',
        name: 'Farmacia Central',
        category: 'pharmacy',
        address: 'Calle Belgrano 890',
        deliveryTime: '20-30 min',
        rating: 4.7,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop',
        products: [
            { id: '7', name: 'Paracetamol 500mg', price: 280, description: 'Analgésico y antipirético' },
            { id: '8', name: 'Ibuprofeno 400mg', price: 320, description: 'Antiinflamatorio' },
            { id: '9', name: 'Vitamina C', price: 180, description: 'Suplemento vitamínico' }
        ]
    },
    {
        id: '4',
        name: 'Kiosco El Tío',
        category: 'kiosk',
        address: 'Calle San Juan 234',
        deliveryTime: '10-20 min',
        rating: 4.0,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        products: [
            { id: '10', name: 'Coca Cola 1.5L', price: 280, description: 'Gaseosa cola' },
            { id: '11', name: 'Papas Fritas', price: 150, description: 'Papas fritas clásicas' },
            { id: '12', name: 'Chocolate', price: 200, description: 'Chocolate con leche' }
        ]
    },
    {
        id: '5',
        name: 'Panadería San Cayetano',
        category: 'bakery',
        address: 'Calle Rivadavia 456',
        deliveryTime: '15-25 min',
        rating: 4.6,
        reviews: 203,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
        products: [
            { id: '13', name: 'Medialunas Docena', price: 600, description: 'Medialunas caseras' },
            { id: '14', name: 'Pan Francés', price: 120, description: 'Pan francés fresco' },
            { id: '15', name: 'Facturas Mix', price: 450, description: 'Mix de facturas' }
        ]
    },
    {
        id: '6',
        name: 'Rotisería La Abuela',
        category: 'food',
        address: 'Calle Sarmiento 789',
        deliveryTime: '30-40 min',
        rating: 4.4,
        reviews: 94,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
        products: [
            { id: '16', name: 'Milanesa con Papas', price: 1800, description: 'Milanesa de ternera con papas fritas' },
            { id: '17', name: 'Empanadas Docena', price: 1200, description: 'Empanadas mixtas' },
            { id: '18', name: 'Tarta de Pollo', price: 1400, description: 'Tarta de pollo y verduras' }
        ]
    }
];

// Load businesses
function loadBusinesses() {
    businesses = [...demoBusinesses];
    renderBusinesses(businesses);
}

// Render businesses
function renderBusinesses(businessesToRender) {
    const grid = document.getElementById('businesses-grid');
    grid.innerHTML = '';
    
    businessesToRender.forEach(business => {
        const businessCard = createBusinessCard(business);
        grid.appendChild(businessCard);
    });
}

// Create business card
function createBusinessCard(business) {
    const card = document.createElement('div');
    card.className = 'card-hover bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer';
    card.onclick = () => openBusinessModal(business);
    
    const stars = '★'.repeat(Math.floor(business.rating)) + '☆'.repeat(5 - Math.floor(business.rating));
    
    card.innerHTML = `
        <div class="relative">
            <img src="${business.image}" alt="${business.name}" class="w-full h-48 object-cover">
            <div class="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                ${business.deliveryTime}
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">${business.name}</h3>
            <p class="text-gray-600 mb-3">${business.address}</p>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="text-yellow-400 text-sm">${stars}</div>
                    <span class="ml-2 text-sm text-gray-600">(${business.reviews})</span>
                </div>
                <button onclick="event.stopPropagation(); openBusinessModal(${JSON.stringify(business).replace(/"/g, '&quot;')})" 
                        class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                    Ver Menú
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Filter by category
function filterByCategory(category) {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => btn.classList.remove('ring-2', 'ring-orange-500'));
    
    event.target.closest('.category-btn').classList.add('ring-2', 'ring-orange-500');
    
    if (category === 'all') {
        renderBusinesses(businesses);
    } else {
        const filtered = businesses.filter(b => b.category === category);
        renderBusinesses(filtered);
    }
}

// Search functionality
document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = businesses.filter(business => 
        business.name.toLowerCase().includes(searchTerm) ||
        business.products.some(p => p.name.toLowerCase().includes(searchTerm))
    );
    renderBusinesses(filtered);
});

// Open business modal
function openBusinessModal(business) {
    document.getElementById('modal-business-name').textContent = business.name;
    document.getElementById('modal-business-address').textContent = business.address;
    document.getElementById('modal-business-time').textContent = business.deliveryTime;
    
    const ratingEl = document.getElementById('modal-business-rating');
    const stars = '★'.repeat(Math.floor(business.rating)) + '☆'.repeat(5 - Math.floor(business.rating));
    ratingEl.innerHTML = stars;
    
    document.getElementById('modal-business-reviews').textContent = `(${business.reviews} reseñas)`;
    
    const productsContainer = document.getElementById('business-products');
    productsContainer.innerHTML = '';
    
    business.products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
        productEl.innerHTML = `
            <div class="flex-1">
                <h4 class="font-semibold text-gray-900">${product.name}</h4>
                <p class="text-sm text-gray-600">${product.description}</p>
                <p class="text-lg font-bold text-orange-600">$${product.price}</p>
            </div>
            <button onclick="addToCart('${business.id}', '${product.id}', '${product.name}', ${product.price}, '${business.name}')" 
                    class="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                Agregar
            </button>
        `;
        productsContainer.appendChild(productEl);
    });
    
    document.getElementById('business-modal').classList.remove('hidden');
}

// Close business modal
function closeBusinessModal() {
    document.getElementById('business-modal').classList.add('hidden');
}

// Add to cart
function addToCart(businessId, productId, productName, price, businessName) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            businessId,
            productId,
            name: productName,
            price,
            businessName,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${productName} agregado al carrito`);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 3500; // Service fee
    
    cartCount.textContent = totalItems;
    cartSubtotal.textContent = `$${subtotal}`;
    cartTotal.textContent = `$${total}`;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Tu carrito está vacío</p>';
        return;
    }
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item bg-gray-50 p-3 rounded-lg';
        itemEl.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-900">${item.name}</h4>
                <button onclick="removeFromCart('${item.productId}')" class="text-red-500 hover:text-red-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <p class="text-sm text-gray-600 mb-2">${item.businessName}</p>
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity('${item.productId}', -1)" class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm">-</button>
                    <span class="font-medium">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.productId}', 1)" class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm">+</button>
                </div>
                <span class="font-semibold">$${item.price * item.quantity}</span>
            </div>
        `;
        cartItems.appendChild(itemEl);
    });
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Toggle cart
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('translate-x-full');
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 3500;
    
    const checkoutContent = document.getElementById('checkout-content');
    checkoutContent.innerHTML = `
        <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold mb-2">Resumen del Pedido</h3>
                ${cart.map(item => `
                    <div class="flex justify-between text-sm">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${item.price * item.quantity}</span>
                    </div>
                `).join('')}
                <div class="border-t mt-2 pt-2">
                    <div class="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>$${subtotal}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span>Tarifa de Servicio</span>
                        <span>$3,500</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span class="text-orange-600">$${total}</span>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dirección de Entrega</label>
                    <select id="checkout-address" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        ${addresses.map(addr => `<option value="${addr.id}">${addr.name} - ${addr.address}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                    <select id="checkout-payment" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        ${paymentMethods.map(pm => `<option value="${pm.id}">${pm.name} - ${pm.type}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('checkout-modal').classList.remove('hidden');
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

// Confirm order
function confirmOrder() {
    const orderId = 'ORD-' + Date.now();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 3500;
    
    const newOrder = {
        id: orderId,
        items: [...cart],
        total: total,
        status: 'pending',
        timestamp: new Date().toISOString(),
        estimatedTime: '25-35 min'
    };
    
    orders.unshift(newOrder);
    cart = [];
    
    updateCartUI();
    closeCheckoutModal();
    showNotification(`Pedido ${orderId} confirmado`);
    
    // Simulate order progress
    setTimeout(() => {
        newOrder.status = 'preparing';
        showNotification('Tu pedido está en preparación');
    }, 3000);
    
    setTimeout(() => {
        newOrder.status = 'delivering';
        showNotification('Tu pedido está en camino');
    }, 8000);
    
    setTimeout(() => {
        newOrder.status = 'delivered';
        showNotification('¡Pedido entregado! ¿Cómo estuvo todo?');
    }, 15000);
}

// Load orders
function loadOrders() {
    const savedOrders = localStorage.getItem('manda2_customer_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        // Demo orders
        orders = [
            {
                id: 'ORD-12345',
                items: [{ name: 'Pizza Margherita', quantity: 1, price: 2500 }],
                total: 6000,
                status: 'delivered',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                estimatedTime: '30 min'
            },
            {
                id: 'ORD-12346',
                items: [{ name: 'Leche Entera 1L', quantity: 2, price: 450 }],
                total: 5400,
                status: 'delivered',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                estimatedTime: '20 min'
            }
        ];
    }
    renderOrders();
}

// Render orders
function renderOrders() {
    const activeOrdersContainer = document.getElementById('active-orders');
    const orderHistoryContainer = document.getElementById('order-history');
    
    activeOrdersContainer.innerHTML = '';
    orderHistoryContainer.innerHTML = '';
    
    const activeOrders = orders.filter(order => order.status !== 'delivered');
    const completedOrders = orders.filter(order => order.status === 'delivered');
    
    if (activeOrders.length === 0) {
        activeOrdersContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No tienes pedidos activos</p>';
    } else {
        activeOrders.forEach(order => {
            activeOrdersContainer.appendChild(createOrderCard(order, true));
        });
    }
    
    if (completedOrders.length === 0) {
        orderHistoryContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No tienes pedidos anteriores</p>';
    } else {
        completedOrders.forEach(order => {
            orderHistoryContainer.appendChild(createOrderCard(order, false));
        });
    }
}

// Create order card
function createOrderCard(order, isActive) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl p-6 shadow-lg';
    
    const statusClass = isActive ? 'order-status active' : 'order-status completed';
    const statusText = {
        'pending': 'Pendiente',
        'preparing': 'En Preparación',
        'delivering': 'En Camino',
        'delivered': 'Entregado'
    };
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${order.id}</h3>
                <p class="text-sm text-gray-600">${new Date(order.timestamp).toLocaleDateString()}</p>
            </div>
            <div class="${statusClass} text-sm font-medium px-3 py-1 rounded-full">
                ${statusText[order.status]}
            </div>
        </div>
        
        <div class="space-y-2 mb-4">
            ${order.items.map(item => `
                <div class="flex justify-between text-sm">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${item.price * item.quantity}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="border-t pt-4">
            <div class="flex justify-between items-center">
                <span class="font-semibold">Total: $${order.total}</span>
                ${isActive ? `<button onclick="trackOrder('${order.id}')" class="text-orange-600 hover:text-orange-700 font-medium">Seguir Pedido</button>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Track order
function trackOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'delivering') {
        showNotification('Abriendo mapa de seguimiento...');
        // Here you would integrate with a map service
    } else {
        showNotification('Tu pedido aún no está en camino');
    }
}

// Load addresses
function loadAddresses() {
    const savedAddresses = localStorage.getItem('manda2_customer_addresses');
    if (savedAddresses) {
        addresses = JSON.parse(savedAddresses);
    } else {
        // Demo addresses
        addresses = [
            {
                id: 'addr1',
                name: 'Casa',
                address: 'Calle Principal 123, 9 de Julio',
                phone: '+54 9 1234-5678'
            },
            {
                id: 'addr2',
                name: 'Trabajo',
                address: 'Av. San Martín 456, 9 de Julio',
                phone: '+54 9 8765-4321'
            }
        ];
    }
    renderAddresses();
}

// Render addresses
function renderAddresses() {
    const container = document.getElementById('addresses-list');
    container.innerHTML = '';
    
    addresses.forEach(address => {
        const addressEl = document.createElement('div');
        addressEl.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
        addressEl.innerHTML = `
            <div>
                <h4 class="font-medium text-gray-900">${address.name}</h4>
                <p class="text-sm text-gray-600">${address.address}</p>
                <p class="text-sm text-gray-600">${address.phone}</p>
            </div>
            <button onclick="removeAddress('${address.id}')" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        container.appendChild(addressEl);
    });
}

// Load payment methods
function loadPaymentMethods() {
    const savedMethods = localStorage.getItem('manda2_customer_payments');
    if (savedMethods) {
        paymentMethods = JSON.parse(savedMethods);
    } else {
        // Demo payment methods
        paymentMethods = [
            {
                id: 'pm1',
                name: 'Visa **** 1234',
                type: 'Tarjeta de Crédito'
            },
            {
                id: 'pm2',
                name: 'Efectivo',
                type: 'Efectivo'
            }
        ];
    }
    renderPaymentMethods();
}

// Render payment methods
function renderPaymentMethods() {
    const container = document.getElementById('payment-methods');
    container.innerHTML = '';
    
    paymentMethods.forEach(method => {
        const methodEl = document.createElement('div');
        methodEl.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
        methodEl.innerHTML = `
            <div>
                <h4 class="font-medium text-gray-900">${method.name}</h4>
                <p class="text-sm text-gray-600">${method.type}</p>
            </div>
            <button onclick="removePaymentMethod('${method.id}')" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        container.appendChild(methodEl);
    });
}

// Update stats
function updateStats() {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-spent').textContent = `$${totalSpent.toLocaleString()}`;
}

// Section navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.remove('hidden');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('border-orange-600', 'text-orange-600');
        btn.classList.add('border-transparent', 'text-gray-700');
    });
    
    event.target.classList.remove('border-transparent', 'text-gray-700');
    event.target.classList.add('border-orange-600', 'text-orange-600');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Profile form submission
document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const phone = document.getElementById('profile-phone').value;
    
    currentUser.name = name;
    localStorage.setItem('manda2_user', JSON.stringify(currentUser));
    
    showNotification('Perfil actualizado correctamente');
});

// Show add address modal
function showAddAddress() {
    const name = prompt('Nombre de la dirección (ej: Casa, Trabajo):');
    if (!name) return;
    
    const address = prompt('Dirección completa:');
    if (!address) return;
    
    const phone = prompt('Teléfono de contacto:');
    if (!phone) return;
    
    const newAddress = {
        id: 'addr' + Date.now(),
        name,
        address,
        phone
    };
    
    addresses.push(newAddress);
    localStorage.setItem('manda2_customer_addresses', JSON.stringify(addresses));
    renderAddresses();
    showNotification('Dirección agregada correctamente');
}

// Remove address
function removeAddress(addressId) {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
        addresses = addresses.filter(addr => addr.id !== addressId);
        localStorage.setItem('manda2_customer_addresses', JSON.stringify(addresses));
        renderAddresses();
        showNotification('Dirección eliminada');
    }
}

// Show add payment modal
function showAddPayment() {
    const type = confirm('¿Agregar tarjeta de crédito? (Cancelar para efectivo)') ? 'Tarjeta' : 'Efectivo';
    
    let name;
    if (type === 'Tarjeta') {
        name = prompt('Nombre en la tarjeta:');
        if (!name) return;
    } else {
        name = 'Efectivo';
    }
    
    const newMethod = {
        id: 'pm' + Date.now(),
        name,
        type
    };
    
    paymentMethods.push(newMethod);
    localStorage.setItem('manda2_customer_payments', JSON.stringify(paymentMethods));
    renderPaymentMethods();
    showNotification('Método de pago agregado correctamente');
}

// Remove payment method
function removePaymentMethod(methodId) {
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
        paymentMethods = paymentMethods.filter(pm => pm.id !== methodId);
        localStorage.setItem('manda2_customer_payments', JSON.stringify(paymentMethods));
        renderPaymentMethods();
        showNotification('Método de pago eliminado');
    }
}

// Logout
function logout() {
    localStorage.removeItem('manda2_user');
    window.location.href = 'index.html';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Save data before page unload
window.addEventListener('beforeunload', function() {
    localStorage.setItem('manda2_customer_orders', JSON.stringify(orders));
});