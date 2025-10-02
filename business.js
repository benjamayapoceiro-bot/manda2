// Business Panel JavaScript
let currentBusiness = null;
let orders = [];
let products = [];
let settlements = [];
let businessHours = [];
let isStoreOpen = true;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadBusinessData();
    loadOrders();
    loadProducts();
    loadSettlements();
    loadBusinessHours();
    updateDashboard();
    initializeCharts();
});

// Load business data
function loadBusinessData() {
    const userData = localStorage.getItem('manda2_user');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    currentBusiness = JSON.parse(userData);
    
    // Load business info
    const savedBusiness = localStorage.getItem('manda2_business_info');
    if (savedBusiness) {
        const businessInfo = JSON.parse(savedBusiness);
        document.getElementById('business-name').textContent = businessInfo.name || 'Comercio';
        document.getElementById('business-name-input').value = businessInfo.name || '';
        document.getElementById('business-address-input').value = businessInfo.address || '';
        document.getElementById('business-phone-input').value = businessInfo.phone || '';
        document.getElementById('business-category-input').value = businessInfo.category || 'food';
        document.getElementById('business-cbu').value = businessInfo.cbu || '';
        document.getElementById('business-bank').value = businessInfo.bank || '';
        document.getElementById('business-account-holder').value = businessInfo.accountHolder || '';
    } else {
        // Demo business info
        document.getElementById('business-name').textContent = 'Pizzería Don Mario';
        document.getElementById('business-name-input').value = 'Pizzería Don Mario';
        document.getElementById('business-address-input').value = 'Av. San Martín 1234, 9 de Julio';
        document.getElementById('business-phone-input').value = '+54 9 2314-567890';
        document.getElementById('business-category-input').value = 'food';
    }
}

// Demo orders data
function loadOrders() {
    const savedOrders = localStorage.getItem('manda2_business_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        // Demo orders
        orders = [
            {
                id: 'ORD-12345',
                customerName: 'Juan Pérez',
                items: [
                    { name: 'Pizza Margherita', quantity: 1, price: 2500 },
                    { name: 'Coca Cola 1.5L', quantity: 2, price: 280 }
                ],
                total: 3060,
                status: 'pending',
                timestamp: new Date().toISOString(),
                estimatedTime: '30 min'
            },
            {
                id: 'ORD-12346',
                customerName: 'María García',
                items: [
                    { name: 'Pizza Pepperoni', quantity: 1, price: 2800 }
                ],
                total: 2800,
                status: 'preparing',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                estimatedTime: '25 min'
            },
            {
                id: 'ORD-12347',
                customerName: 'Carlos López',
                items: [
                    { name: 'Pizza Hawaiana', quantity: 1, price: 2900 },
                    { name: 'Empanadas Docena', quantity: 1, price: 1200 }
                ],
                total: 4100,
                status: 'ready',
                timestamp: new Date(Date.now() - 600000).toISOString(),
                estimatedTime: '20 min'
            }
        ];
    }
    renderOrders();
}

// Demo products data
function loadProducts() {
    const savedProducts = localStorage.getItem('manda2_business_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Demo products
        products = [
            {
                id: 'prod1',
                name: 'Pizza Margherita',
                price: 2500,
                description: 'Mozzarella, tomate, albahaca',
                category: 'food',
                stock: 50,
                available: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
            },
            {
                id: 'prod2',
                name: 'Pizza Pepperoni',
                price: 2800,
                description: 'Mozzarella, pepperoni',
                category: 'food',
                stock: 30,
                available: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
            },
            {
                id: 'prod3',
                name: 'Pizza Hawaiana',
                price: 2900,
                description: 'Mozzarella, jamón, piña',
                category: 'food',
                stock: 25,
                available: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
            },
            {
                id: 'prod4',
                name: 'Empanadas Docena',
                price: 1200,
                description: 'Mix de empanadas',
                category: 'food',
                stock: 100,
                available: true,
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop'
            },
            {
                id: 'prod5',
                name: 'Coca Cola 1.5L',
                price: 280,
                description: 'Gaseosa cola',
                category: 'drinks',
                stock: 200,
                available: true,
                image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=300&h=300&fit=crop'
            },
            {
                id: 'prod6',
                name: 'Tarta de Pollo',
                price: 1400,
                description: 'Tarta de pollo y verduras',
                category: 'food',
                stock: 15,
                available: false,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
            }
        ];
    }
    renderProducts();
}

// Load settlements
function loadSettlements() {
    const savedSettlements = localStorage.getItem('manda2_business_settlements');
    if (savedSettlements) {
        settlements = JSON.parse(savedSettlements);
    } else {
        // Demo settlements
        settlements = [
            {
                id: 'SET-001',
                period: '1-15 Octubre 2024',
                totalSales: 45000,
                commission: 6750,
                amountToReceive: 38250,
                status: 'completed',
                transferDate: '2024-10-16'
            },
            {
                id: 'SET-002',
                period: '16-31 Octubre 2024',
                totalSales: 52000,
                commission: 7800,
                amountToReceive: 44200,
                status: 'pending',
                transferDate: null
            }
        ];
    }
    renderSettlements();
}

// Load business hours
function loadBusinessHours() {
    businessHours = [
        { day: 'Lunes', open: '09:00', close: '22:00', active: true },
        { day: 'Martes', open: '09:00', close: '22:00', active: true },
        { day: 'Miércoles', open: '09:00', close: '22:00', active: true },
        { day: 'Jueves', open: '09:00', close: '22:00', active: true },
        { day: 'Viernes', open: '09:00', close: '23:00', active: true },
        { day: 'Sábado', open: '10:00', close: '23:00', active: true },
        { day: 'Domingo', open: '10:00', close: '21:00', active: true }
    ];
    renderBusinessHours();
}

// Update dashboard
function updateDashboard() {
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.timestamp);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
    });
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const activeProducts = products.filter(p => p.available).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalCommissions = totalRevenue * 0.15; // 15% commission
    const amountToReceive = totalRevenue - totalCommissions;
    const transfersReceived = settlements.filter(s => s.status === 'completed')
        .reduce((sum, settlement) => sum + settlement.amountToReceive, 0);
    
    document.getElementById('today-orders').textContent = todayOrders.length;
    document.getElementById('today-revenue').textContent = `$${todayRevenue.toLocaleString()}`;
    document.getElementById('active-products').textContent = activeProducts;
    document.getElementById('avg-rating').textContent = '4.5';
    
    // Finance section
    document.getElementById('monthly-sales').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('total-commissions').textContent = `$${totalCommissions.toLocaleString()}`;
    document.getElementById('amount-to-receive').textContent = `$${amountToReceive.toLocaleString()}`;
    document.getElementById('transfers-received').textContent = `$${transfersReceived.toLocaleString()}`;
    
    // Profile stats
    document.getElementById('total-orders-stat').textContent = totalOrders;
    document.getElementById('total-revenue-stat').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('satisfied-customers').textContent = Math.floor(totalOrders * 0.92); // 92% satisfaction rate
    
    renderRecentOrders();
}

// Render recent orders
function renderRecentOrders() {
    const container = document.getElementById('recent-orders');
    const recentOrders = orders.slice(0, 5);
    
    container.innerHTML = '';
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay pedidos recientes</p>';
        return;
    }
    
    recentOrders.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.className = 'flex justify-between items-center p-4 bg-gray-50 rounded-lg';
        
        const statusClass = `order-${order.status}`;
        const statusText = {
            'pending': 'Pendiente',
            'preparing': 'En Preparación',
            'ready': 'Listo',
            'delivered': 'Entregado'
        };
        
        orderEl.innerHTML = `
            <div>
                <h4 class="font-semibold text-gray-900">${order.id}</h4>
                <p class="text-sm text-gray-600">${order.customerName}</p>
                <p class="text-sm text-gray-500">${new Date(order.timestamp).toLocaleTimeString()}</p>
            </div>
            <div class="text-right">
                <p class="font-semibold text-gray-900">$${order.total}</p>
                <span class="${statusClass} text-sm font-medium px-2 py-1 rounded-full">
                    ${statusText[order.status]}
                </span>
            </div>
        `;
        
        container.appendChild(orderEl);
    });
}

// Render orders
function renderOrders() {
    const container = document.getElementById('orders-list');
    container.innerHTML = '';
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pedidos</p>';
        return;
    }
    
    orders.forEach(order => {
        const orderEl = createOrderCard(order);
        container.appendChild(orderEl);
    });
}

// Create order card
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = `bg-white rounded-2xl p-6 shadow-lg order-${order.status}`;
    
    const statusText = {
        'pending': 'Pendiente',
        'preparing': 'En Preparación',
        'ready': 'Listo para Entregar',
        'delivered': 'Entregado'
    };
    
    const statusColor = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'preparing': 'bg-blue-100 text-blue-800',
        'ready': 'bg-green-100 text-green-800',
        'delivered': 'bg-gray-100 text-gray-800'
    };
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${order.id}</h3>
                <p class="text-sm text-gray-600">${order.customerName}</p>
                <p class="text-sm text-gray-500">${new Date(order.timestamp).toLocaleString()}</p>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold text-gray-900 mb-2">$${order.total}</p>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}">
                    ${statusText[order.status]}
                </span>
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
        
        <div class="border-t pt-4 flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-600">Tiempo estimado: ${order.estimatedTime}</p>
            </div>
            <div class="flex space-x-2">
                ${order.status === 'pending' ? `
                    <button onclick="updateOrderStatus('${order.id}', 'preparing')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Aceptar y Preparar
                    </button>
                    <button onclick="rejectOrder('${order.id}')" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Rechazar
                    </button>
                ` : ''}
                ${order.status === 'preparing' ? `
                    <button onclick="updateOrderStatus('${order.id}', 'ready')" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        Marcar como Listo
                    </button>
                ` : ''}
                ${order.status === 'ready' ? `
                    <button onclick="updateOrderStatus('${order.id}', 'delivered')" class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                        Marcar como Entregado
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        renderOrders();
        updateDashboard();
        showNotification(`Pedido ${orderId} actualizado a ${newStatus}`);
        
        // Play sound for new orders
        if (newStatus === 'preparing') {
            playOrderSound();
        }
    }
}

// Reject order
function rejectOrder(orderId) {
    if (confirm('¿Estás seguro de rechazar este pedido?')) {
        orders = orders.filter(o => o.id !== orderId);
        renderOrders();
        updateDashboard();
        showNotification(`Pedido ${orderId} rechazado`);
    }
}

// Filter orders
function filterOrders(status) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('bg-orange-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    event.target.classList.remove('bg-gray-200', 'text-gray-700');
    event.target.classList.add('bg-orange-600', 'text-white');
    
    const container = document.getElementById('orders-list');
    container.innerHTML = '';
    
    let filteredOrders = status === 'all' ? orders : orders.filter(order => order.status === status);
    
    if (filteredOrders.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pedidos en esta categoría</p>';
        return;
    }
    
    filteredOrders.forEach(order => {
        const orderEl = createOrderCard(order);
        container.appendChild(orderEl);
    });
}

// Render products
function renderProducts() {
    const container = document.getElementById('products-list');
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No se encontraron productos</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productEl = createProductCard(product);
        container.appendChild(productEl);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
    
    const statusColor = product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const statusText = product.available ? 'Disponible' : 'No Disponible';
    
    card.innerHTML = `
        <div class="flex items-center space-x-4">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div>
                <h4 class="font-semibold text-gray-900">${product.name}</h4>
                <p class="text-sm text-gray-600">${product.description}</p>
                <div class="flex items-center space-x-4 mt-1">
                    <span class="text-lg font-bold text-orange-600">$${product.price}</span>
                    <span class="text-sm text-gray-500">Stock: ${product.stock}</span>
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">
                        ${statusText}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="flex items-center space-x-2">
            <button onclick="toggleProductAvailability('${product.id}')" 
                    class="text-sm font-medium ${product.available ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}">
                ${product.available ? 'Desactivar' : 'Activar'}
            </button>
            <button onclick="editProduct('${product.id}')" class="text-blue-600 hover:text-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    
    return card;
}

// Toggle product availability
function toggleProductAvailability(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.available = !product.available;
        renderProducts();
        updateDashboard();
        showNotification(`Producto ${product.available ? 'activado' : 'desactivado'}`);
    }
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Fill form with product data
        const form = document.getElementById('add-product-form');
        form.name.value = product.name;
        form.price.value = product.price;
        form.description.value = product.description;
        form.category.value = product.category;
        form.stock.value = product.stock;
        form.image.value = product.image;
        form.available.checked = product.available;
        
        // Store editing product ID
        form.dataset.editingId = productId;
        
        showAddProductModal();
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('manda2_business_products', JSON.stringify(products));
        renderProducts();
        updateDashboard();
        showNotification('Producto eliminado correctamente');
    }
}

// Show add product modal
function showAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('hidden');
}

// Close add product modal
function closeAddProductModal() {
    document.getElementById('add-product-modal').classList.add('hidden');
    // Clear form
    const form = document.getElementById('add-product-form');
    form.reset();
    delete form.dataset.editingId;
}

// Save product
function saveProduct() {
    const form = document.getElementById('add-product-form');
    const formData = new FormData(form);
    
    const productData = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        image: formData.get('image') || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
        available: formData.get('available') === 'on'
    };
    
    if (form.dataset.editingId) {
        // Editing existing product
        const productIndex = products.findIndex(p => p.id === form.dataset.editingId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...productData };
        }
    } else {
        // Adding new product
        productData.id = 'prod' + Date.now();
        products.push(productData);
    }
    
    localStorage.setItem('manda2_business_products', JSON.stringify(products));
    renderProducts();
    updateDashboard();
    closeAddProductModal();
    showNotification('Producto guardado correctamente');
}

// Import products from CSV
function importProducts() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Por favor selecciona un archivo CSV');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const product = {
                    id: 'prod' + Date.now() + i,
                    name: values[0],
                    price: parseFloat(values[1]),
                    description: values[2] || '',
                    category: values[3] || 'food',
                    stock: parseInt(values[4]) || 0,
                    available: values[5] === 'true',
                    image: values[6] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
                };
                products.push(product);
            }
        }
        
        localStorage.setItem('manda2_business_products', JSON.stringify(products));
        renderProducts();
        updateDashboard();
        showNotification('Productos importados correctamente');
    };
    reader.readAsText(file);
}

// Render settlements
function renderSettlements() {
    const container = document.getElementById('settlements-list');
    container.innerHTML = '';
    
    if (settlements.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay liquidaciones registradas</p>';
        return;
    }
    
    settlements.forEach(settlement => {
        const settlementEl = document.createElement('div');
        settlementEl.className = 'flex justify-between items-center p-4 bg-gray-50 rounded-lg';
        
        const statusColor = settlement.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        const statusText = settlement.status === 'completed' ? 'Completada' : 'Pendiente';
        
        settlementEl.innerHTML = `
            <div>
                <h4 class="font-semibold text-gray-900">${settlement.id}</h4>
                <p class="text-sm text-gray-600">Período: ${settlement.period}</p>
                <p class="text-sm text-gray-500">Transferencia: ${settlement.transferDate || 'Pendiente'}</p>
            </div>
            <div class="text-right">
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span>Ventas:</span>
                        <span class="font-medium">$${settlement.totalSales.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Comisión:</span>
                        <span class="font-medium">$${settlement.commission.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between font-bold border-t pt-1">
                        <span>A recibir:</span>
                        <span class="text-green-600">$${settlement.amountToReceive.toLocaleString()}</span>
                    </div>
                </div>
                <span class="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${statusColor}">
                    ${statusText}
                </span>
            </div>
        `;
        
        container.appendChild(settlementEl);
    });
}

// Render business hours
function renderBusinessHours() {
    const container = document.getElementById('business-hours');
    container.innerHTML = '';
    
    businessHours.forEach((hour, index) => {
        const hourEl = document.createElement('div');
        hourEl.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
        hourEl.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="font-medium text-gray-900 w-20">${hour.day}</span>
                ${hour.active ? 
                    `<span class="text-sm text-gray-600">${hour.open} - ${hour.close}</span>` :
                    '<span class="text-sm text-red-600">Cerrado</span>'
                }
            </div>
            <div class="flex items-center space-x-2">
                ${hour.active ? `
                    <input type="time" value="${hour.open}" onchange="updateBusinessHour(${index}, 'open', this.value)" class="text-sm border rounded px-2 py-1">
                    <input type="time" value="${hour.close}" onchange="updateBusinessHour(${index}, 'close', this.value)" class="text-sm border rounded px-2 py-1">
                ` : ''}
                <button onclick="toggleBusinessHour(${index})" class="text-sm font-medium ${hour.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}">
                    ${hour.active ? 'Cerrar' : 'Abrir'}
                </button>
            </div>
        `;
        container.appendChild(hourEl);
    });
}

// Toggle business hour
function toggleBusinessHour(index) {
    businessHours[index].active = !businessHours[index].active;
    renderBusinessHours();
}

// Update business hour
function updateBusinessHour(index, field, value) {
    businessHours[index][field] = value;
}

// Toggle store status
function toggleStoreStatus() {
    isStoreOpen = !isStoreOpen;
    const btn = document.getElementById('store-status-btn');
    
    if (isStoreOpen) {
        btn.textContent = 'Abierto';
        btn.className = 'px-4 py-2 rounded-lg font-medium bg-green-100 text-green-800';
    } else {
        btn.textContent = 'Cerrado';
        btn.className = 'px-4 py-2 rounded-lg font-medium bg-red-100 text-red-800';
    }
}

// Initialize charts
function initializeCharts() {
    // Sales chart
    const salesData = [{
        x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        y: [12000, 15000, 18000, 14000, 22000, 25000, 19000],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ventas',
        line: { color: '#f97316', width: 4 },
        marker: { color: '#f97316', size: 8 }
    }];
    
    const salesLayout = {
        title: '',
        xaxis: { title: 'Día de la semana' },
        yaxis: { title: 'Ventas ($)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('sales-chart', salesData, salesLayout, {responsive: true, displayModeBar: false});
    
    // Revenue vs Commissions chart
    const revenueCommissionsData = [
        {
            x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            y: [45000, 52000, 48000, 55000, 60000, 58000],
            name: 'Ingresos',
            type: 'bar',
            marker: { color: '#10b981' }
        },
        {
            x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            y: [6750, 7800, 7200, 8250, 9000, 8700],
            name: 'Comisiones',
            type: 'bar',
            marker: { color: '#ef4444' }
        }
    ];
    
    const revenueCommissionsLayout = {
        title: '',
        xaxis: { title: 'Mes' },
        yaxis: { title: 'Monto ($)' },
        barmode: 'group',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('revenue-commissions-chart', revenueCommissionsData, revenueCommissionsLayout, {responsive: true, displayModeBar: false});
    
    // Sales by category chart
    const categoryData = [{
        values: [45, 30, 15, 10],
        labels: ['Pizzas', 'Empanadas', 'Bebidas', 'Postres'],
        type: 'pie',
        marker: {
            colors: ['#f97316', '#3b82f6', '#10b981', '#8b5cf6']
        }
    }];
    
    const categoryLayout = {
        title: '',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 20, l: 20, r: 20 }
    };
    
    Plotly.newPlot('sales-by-category-chart', categoryData, categoryLayout, {responsive: true, displayModeBar: false});
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

// Business profile form submission
document.getElementById('business-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const businessInfo = {
        name: document.getElementById('business-name-input').value,
        address: document.getElementById('business-address-input').value,
        phone: document.getElementById('business-phone-input').value,
        category: document.getElementById('business-category-input').value
    };
    
    localStorage.setItem('manda2_business_info', JSON.stringify(businessInfo));
    document.getElementById('business-name').textContent = businessInfo.name;
    
    showNotification('Información del comercio actualizada correctamente');
});

// Bank info form submission
document.getElementById('bank-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bankInfo = {
        cbu: document.getElementById('business-cbu').value,
        bank: document.getElementById('business-bank').value,
        accountHolder: document.getElementById('business-account-holder').value
    };
    
    const currentInfo = JSON.parse(localStorage.getItem('manda2_business_info') || '{}');
    const updatedInfo = { ...currentInfo, ...bankInfo };
    localStorage.setItem('manda2_business_info', JSON.stringify(updatedInfo));
    
    showNotification('Datos bancarios actualizados correctamente');
});

// Product search and filter
document.getElementById('product-search').addEventListener('input', renderProducts);
document.getElementById('category-filter').addEventListener('change', renderProducts);

// Play order sound
function playOrderSound() {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
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
    localStorage.setItem('manda2_business_orders', JSON.stringify(orders));
    localStorage.setItem('manda2_business_products', JSON.stringify(products));
    localStorage.setItem('manda2_business_settlements', JSON.stringify(settlements));
});