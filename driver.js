// Driver Panel JavaScript
let currentDriver = null;
let isAvailable = true;
let currentOrder = null;
let orders = [];
let earnings = [];
let map = null;
let selectedOrder = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDriverData();
    loadOrders();
    loadEarnings();
    updateDashboard();
    initializeEarningsChart();
    initializeMap();
});

// Load driver data
function loadDriverData() {
    const userData = localStorage.getItem('manda2_user');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    currentDriver = JSON.parse(userData);
    
    // Load driver profile
    const savedProfile = localStorage.getItem('manda2_driver_profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        document.getElementById('driver-name').textContent = profile.name || 'Repartidor';
        document.getElementById('driver-name-input').value = profile.name || '';
        document.getElementById('driver-phone-input').value = profile.phone || '';
        document.getElementById('driver-cuit-input').value = profile.cuit || '';
    } else {
        document.getElementById('driver-name').textContent = 'Carlos Repartidor';
        document.getElementById('driver-name-input').value = 'Carlos Repartidor';
    }
    
    document.getElementById('driver-email-input').value = currentDriver.email || '';
}

// Demo orders data
function loadOrders() {
    const savedOrders = localStorage.getItem('manda2_driver_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        // Demo orders
        orders = [
            {
                id: 'ORD-12345',
                businessName: 'Pizzería Don Mario',
                businessAddress: 'Av. San Martín 1234',
                customerName: 'Juan Pérez',
                customerAddress: 'Calle Principal 567',
                items: ['Pizza Margherita', 'Coca Cola 1.5L'],
                total: 2780,
                deliveryFee: 2000,
                status: 'completed',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                estimatedTime: '25 min',
                distance: '3.2 km'
            },
            {
                id: 'ORD-12346',
                businessName: 'Supermercado La Villa',
                businessAddress: 'Calle Mitre 567',
                customerName: 'María García',
                customerAddress: 'Av. Belgrano 890',
                items: ['Leche Entera 1L', 'Pan de Mesa', 'Yogurt Natural'],
                total: 1150,
                deliveryFee: 2000,
                status: 'completed',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                estimatedTime: '20 min',
                distance: '2.8 km'
            }
        ];
    }
    renderAvailableOrders();
}

// Demo available orders
function renderAvailableOrders() {
    const availableOrders = [
        {
            id: 'ORD-12347',
            businessName: 'Farmacia Central',
            businessAddress: 'Calle Belgrano 890',
            customerName: 'Ana López',
            customerAddress: 'Calle San Juan 234',
            items: ['Paracetamol 500mg', 'Vitamina C'],
            total: 460,
            deliveryFee: 2000,
            estimatedTime: '15 min',
            distance: '1.5 km',
            priority: 'high'
        },
        {
            id: 'ORD-12348',
            businessName: 'Kiosco El Tío',
            businessAddress: 'Calle San Juan 234',
            customerName: 'Pedro Rodríguez',
            customerAddress: 'Av. Rivadavia 456',
            items: ['Coca Cola 1.5L', 'Papas Fritas'],
            total: 430,
            deliveryFee: 2000,
            estimatedTime: '18 min',
            distance: '2.1 km',
            priority: 'normal'
        },
        {
            id: 'ORD-12349',
            businessName: 'Panadería San Cayetano',
            businessAddress: 'Calle Rivadavia 456',
            customerName: 'Laura Martínez',
            customerAddress: 'Calle Sarmiento 789',
            items: ['Medialunas Docena', 'Pan Francés'],
            total: 720,
            deliveryFee: 2000,
            estimatedTime: '22 min',
            distance: '2.9 km',
            priority: 'normal'
        }
    ];
    
    const container = document.getElementById('available-orders-list');
    container.innerHTML = '';
    
    availableOrders.forEach(order => {
        const orderEl = createAvailableOrderCard(order);
        container.appendChild(orderEl);
    });
}

// Create available order card
function createAvailableOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-item bg-white rounded-xl p-6 shadow-lg card-hover cursor-pointer';
    card.onclick = () => showOrderDetails(order);
    
    const priorityColor = order.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${order.id}</h3>
                <p class="text-sm text-gray-600">${order.businessName}</p>
                <p class="text-sm text-gray-500">${order.estimatedTime} • ${order.distance}</p>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold text-orange-600 mb-2">$${order.deliveryFee}</p>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${priorityColor}">
                    ${order.priority === 'high' ? 'Urgente' : 'Normal'}
                </span>
            </div>
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Cliente:</span>
                <span class="font-medium">${order.customerName}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Destino:</span>
                <span class="font-medium">${order.customerAddress}</span>
            </div>
        </div>
        
        <div class="border-t pt-4">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-600">${order.items.length} artículo(s)</p>
                    <p class="text-sm font-medium">Total pedido: $${order.total}</p>
                </div>
                <button onclick="event.stopPropagation(); acceptOrderDirect('${order.id}')" 
                        class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Aceptar
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show order details
function showOrderDetails(order) {
    selectedOrder = order;
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    content.innerHTML = `
        <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">Información del Pedido</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>ID del Pedido:</span>
                        <span class="font-medium">${order.id}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Tiempo Estimado:</span>
                        <span class="font-medium">${order.estimatedTime}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Distancia:</span>
                        <span class="font-medium">${order.distance}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Ganancia:</span>
                        <span class="font-medium text-orange-600">$${order.deliveryFee}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">Comercio</h3>
                <p class="font-medium">${order.businessName}</p>
                <p class="text-sm text-gray-600">${order.businessAddress}</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">Cliente</h3>
                <p class="font-medium">${order.customerName}</p>
                <p class="text-sm text-gray-600">${order.customerAddress}</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-900 mb-2">Artículos</h3>
                <ul class="text-sm space-y-1">
                    ${order.items.map(item => `<li>• ${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close order details modal
function closeOrderDetailsModal() {
    document.getElementById('order-details-modal').classList.add('hidden');
    selectedOrder = null;
}

// Accept order
function acceptOrder() {
    if (selectedOrder) {
        currentOrder = {
            ...selectedOrder,
            status: 'active',
            startTime: new Date().toISOString()
        };
        
        // Remove from available orders
        const availableOrdersContainer = document.getElementById('available-orders-list');
        const orderElement = Array.from(availableOrdersContainer.children)
            .find(el => el.textContent.includes(selectedOrder.id));
        if (orderElement) {
            orderElement.remove();
        }
        
        closeOrderDetailsModal();
        showCurrentOrder();
        showNotification(`Pedido ${selectedOrder.id} aceptado. ¡Buena suerte!`);
        
        // Show map for navigation
        setTimeout(() => {
            showMapModal();
        }, 2000);
    }
}

// Accept order directly
function acceptOrderDirect(orderId) {
    const order = {
        id: orderId,
        businessName: 'Comercio Demo',
        businessAddress: 'Dirección Demo',
        customerName: 'Cliente Demo',
        customerAddress: 'Dirección Demo',
        items: ['Producto Demo'],
        total: 1000,
        deliveryFee: 2000,
        estimatedTime: '20 min',
        distance: '2.0 km'
    };
    
    selectedOrder = order;
    acceptOrder();
}

// Show current order
function showCurrentOrder() {
    const section = document.getElementById('current-order-section');
    const content = document.getElementById('current-order-content');
    
    if (currentOrder) {
        content.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-900 mb-2">Comercio</h3>
                        <p class="font-medium">${currentOrder.businessName}</p>
                        <p class="text-sm text-gray-600">${currentOrder.businessAddress}</p>
                        <button onclick="showMapModal()" class="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm">
                            Ver en el mapa
                        </button>
                    </div>
                    
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-900 mb-2">Cliente</h3>
                        <p class="font-medium">${currentOrder.customerName}</p>
                        <p class="text-sm text-gray-600">${currentOrder.customerAddress}</p>
                        <button onclick="showMapModal()" class="mt-2 text-green-600 hover:text-green-700 font-medium text-sm">
                            Ver en el mapa
                        </button>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-900 mb-2">Detalles del Pedido</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span>ID:</span>
                                <span class="font-medium">${currentOrder.id}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Inicio:</span>
                                <span class="font-medium">${new Date(currentOrder.startTime).toLocaleTimeString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Ganancia:</span>
                                <span class="font-medium text-orange-600">$${currentOrder.deliveryFee}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="font-semibold text-gray-900 mb-2">Siguiente Paso</h3>
                        <p class="text-sm text-gray-600 mb-3">Dirígete al comercio para recoger el pedido</p>
                        <div class="flex space-x-2">
                            <button onclick="confirmPickup()" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Confirmar Retiro
                            </button>
                            <button onclick="showMapModal()" class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                                Navegar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

// Initialize map
function initializeMap() {
    // Initialize Leaflet map
    map = L.map('map').setView([-34.6118, -58.3960], 13); // Buenos Aires coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers for demo
    const businessMarker = L.marker([-34.6118, -58.3960]).addTo(map)
        .bindPopup('Comercio: Farmacia Central');
    
    const customerMarker = L.marker([-34.6138, -58.3980]).addTo(map)
        .bindPopup('Cliente: Ana López');
}

// Show map modal
function showMapModal() {
    document.getElementById('map-modal').classList.remove('hidden');
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Close map modal
function closeMapModal() {
    document.getElementById('map-modal').classList.add('hidden');
}

// Confirm pickup
function confirmPickup() {
    if (currentOrder) {
        currentOrder.status = 'picked_up';
        showNotification('Pedido recogido. Dirígete al cliente');
        showCurrentOrder();
        closeMapModal();
        
        // Update map to show route to customer
        setTimeout(() => {
            showMapModal();
        }, 1000);
    }
}

// Confirm delivery
function confirmDelivery() {
    if (currentOrder) {
        currentOrder.status = 'delivered';
        currentOrder.endTime = new Date().toISOString();
        
        // Add to completed orders
        orders.unshift(currentOrder);
        localStorage.setItem('manda2_driver_orders', JSON.stringify(orders));
        
        // Add earnings
        const today = new Date().toDateString();
        const existingEarning = earnings.find(e => e.date === today);
        if (existingEarning) {
            existingEarning.amount += currentOrder.deliveryFee;
            existingEarning.deliveries += 1;
        } else {
            earnings.unshift({
                date: today,
                amount: currentOrder.deliveryFee,
                deliveries: 1
            });
        }
        localStorage.setItem('manda2_driver_earnings', JSON.stringify(earnings));
        
        showNotification(`¡Entrega completada! Ganaste $${currentOrder.deliveryFee}`);
        
        currentOrder = null;
        showCurrentOrder();
        closeMapModal();
        updateDashboard();
        
        // Ask for rating
        setTimeout(() => {
            const rating = prompt('¿Cómo estuvo la experiencia? (1-5 estrellas)');
            if (rating) {
                showNotification('Gracias por tu feedback');
            }
        }, 2000);
    }
}

// Load earnings
function loadEarnings() {
    const savedEarnings = localStorage.getItem('manda2_driver_earnings');
    if (savedEarnings) {
        earnings = JSON.parse(savedEarnings);
    } else {
        // Demo earnings
        earnings = [
            {
                date: new Date().toDateString(),
                amount: 6000,
                deliveries: 3
            },
            {
                date: new Date(Date.now() - 86400000).toDateString(),
                amount: 8000,
                deliveries: 4
            },
            {
                date: new Date(Date.now() - 172800000).toDateString(),
                amount: 4000,
                deliveries: 2
            }
        ];
    }
    renderEarnings();
}

// Render earnings
function renderEarnings() {
    const todayEarnings = earnings.find(e => e.date === new Date().toDateString())?.amount || 0;
    const weeklyEarnings = earnings.slice(0, 7).reduce((sum, e) => sum + e.amount, 0);
    const monthlyEarnings = earnings.slice(0, 30).reduce((sum, e) => sum + e.amount, 0);
    const transfersReceived = earnings.reduce((sum, e) => sum + e.amount, 0);
    
    document.getElementById('today-earnings').textContent = `$${todayEarnings.toLocaleString()}`;
    document.getElementById('daily-earnings').textContent = `$${todayEarnings.toLocaleString()}`;
    document.getElementById('weekly-earnings').textContent = `$${weeklyEarnings.toLocaleString()}`;
    document.getElementById('monthly-earnings').textContent = `$${monthlyEarnings.toLocaleString()}`;
    document.getElementById('transfers-received').textContent = `$${transfersReceived.toLocaleString()}`;
    
    // Update dashboard stats
    const todayDeliveries = earnings.find(e => e.date === new Date().toDateString())?.deliveries || 0;
    document.getElementById('today-deliveries').textContent = todayDeliveries;
    
    // Profile stats
    const totalDeliveries = earnings.reduce((sum, e) => sum + e.deliveries, 0);
    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
    const totalKm = Math.floor(totalDeliveries * 2.5); // Average 2.5km per delivery
    
    document.getElementById('total-deliveries-stat').textContent = totalDeliveries;
    document.getElementById('total-earnings-stat').textContent = `$${totalEarnings.toLocaleString()}`;
    document.getElementById('total-km').textContent = `${totalKm} km`;
    
    renderPaymentHistory();
}

// Render payment history
function renderPaymentHistory() {
    const container = document.getElementById('payment-history-list');
    container.innerHTML = '';
    
    if (earnings.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pagos registrados</p>';
        return;
    }
    
    earnings.forEach(payment => {
        const paymentEl = document.createElement('div');
        paymentEl.className = 'flex justify-between items-center p-4 bg-gray-50 rounded-lg';
        paymentEl.innerHTML = `
            <div>
                <h4 class="font-semibold text-gray-900">${new Date(payment.date).toLocaleDateString()}</h4>
                <p class="text-sm text-gray-600">${payment.deliveries} entrega(s) completada(s)</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-green-600">$${payment.amount.toLocaleString()}</p>
                <p class="text-sm text-gray-500">Pagado</p>
            </div>
        `;
        container.appendChild(paymentEl);
    });
}

// Initialize earnings chart
function initializeEarningsChart() {
    const chartData = [{
        x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        y: [4000, 6000, 8000, 5000, 10000, 12000, 7000],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ganancias',
        line: { color: '#f97316', width: 4 },
        marker: { color: '#f97316', size: 8 },
        fill: 'tonexty',
        fillcolor: 'rgba(249, 115, 22, 0.1)'
    }];
    
    const chartLayout = {
        title: '',
        xaxis: { title: 'Día de la semana' },
        yaxis: { title: 'Ganancias ($)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('earnings-chart', chartData, chartLayout, {responsive: true, displayModeBar: false});
}

// Toggle status
function toggleStatus() {
    isAvailable = !isAvailable;
    const toggle = document.getElementById('status-toggle');
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (isAvailable) {
        indicator.className = 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ring-0 status-available translate-x-6';
        statusText.textContent = 'Disponible';
        statusText.className = 'text-sm font-medium text-green-600';
        toggle.className = 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-green-600';
        showNotification('Ahora estás disponible para recibir pedidos');
    } else {
        indicator.className = 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ring-0 status-offline translate-x-1';
        statusText.textContent = 'No Disponible';
        statusText.className = 'text-sm font-medium text-gray-600';
        toggle.className = 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-gray-400';
        showNotification('Ahora no estás disponible para pedidos');
    }
}

// Show available orders
function showAvailableOrders() {
    const section = document.getElementById('available-orders-section');
    section.scrollIntoView({ behavior: 'smooth' });
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
    
    const container = document.getElementById('orders-history-list');
    container.innerHTML = '';
    
    let filteredOrders = orders;
    
    if (status === 'active') {
        filteredOrders = orders.filter(order => order.status === 'active');
    } else if (status === 'completed') {
        filteredOrders = orders.filter(order => order.status === 'delivered');
    }
    
    if (filteredOrders.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pedidos en esta categoría</p>';
        return;
    }
    
    filteredOrders.forEach(order => {
        const orderEl = createOrderHistoryCard(order);
        container.appendChild(orderEl);
    });
}

// Create order history card
function createOrderHistoryCard(order) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl p-6 shadow-lg';
    
    const statusText = {
        'active': 'En Curso',
        'delivered': 'Completado'
    };
    
    const statusColor = {
        'active': 'bg-blue-100 text-blue-800',
        'delivered': 'bg-green-100 text-green-800'
    };
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${order.id}</h3>
                <p class="text-sm text-gray-600">${order.businessName} → ${order.customerName}</p>
                <p class="text-sm text-gray-500">${new Date(order.timestamp).toLocaleString()}</p>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold text-orange-600 mb-2">$${order.deliveryFee}</p>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}">
                    ${statusText[order.status]}
                </span>
            </div>
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Distancia:</span>
                <span class="font-medium">${order.distance}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tiempo:</span>
                <span class="font-medium">${order.estimatedTime}</span>
            </div>
        </div>
        
        ${order.status === 'delivered' ? `
            <div class="border-t pt-4">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Completado a las ${new Date(order.endTime || order.timestamp).toLocaleTimeString()}</span>
                    <button onclick="showOrderDetails(${JSON.stringify(order).replace(/"/g, '&quot;')})" 
                            class="text-orange-600 hover:text-orange-700 font-medium text-sm">
                        Ver Detalles
                    </button>
                </div>
            </div>
        ` : ''}
    `;
    
    return card;
}

// Update dashboard
function updateDashboard() {
    const todayEarnings = earnings.find(e => e.date === new Date().toDateString())?.amount || 0;
    const todayDeliveries = earnings.find(e => e.date === new Date().toDateString())?.deliveries || 0;
    
    document.getElementById('today-earnings').textContent = `$${todayEarnings.toLocaleString()}`;
    document.getElementById('today-deliveries').textContent = todayDeliveries;
    
    renderAvailableOrders();
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

// Driver profile form submission
document.getElementById('driver-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profile = {
        name: document.getElementById('driver-name-input').value,
        phone: document.getElementById('driver-phone-input').value,
        cuit: document.getElementById('driver-cuit-input').value
    };
    
    localStorage.setItem('manda2_driver_profile', JSON.stringify(profile));
    document.getElementById('driver-name').textContent = profile.name;
    
    showNotification('Perfil actualizado correctamente');
});

// Vehicle info form submission
document.getElementById('vehicle-info-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const vehicleInfo = {
        type: document.getElementById('vehicle-type').value,
        model: document.getElementById('vehicle-model').value,
        plate: document.getElementById('vehicle-plate').value,
        color: document.getElementById('vehicle-color').value
    };
    
    localStorage.setItem('manda2_driver_vehicle', JSON.stringify(vehicleInfo));
    
    showNotification('Información del vehículo actualizada correctamente');
});

// Driver bank form submission
document.getElementById('driver-bank-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const bankInfo = {
        cbu: document.getElementById('driver-cbu').value,
        bank: document.getElementById('driver-bank').value,
        accountHolder: document.getElementById('driver-account-holder').value
    };
    
    localStorage.setItem('manda2_driver_bank', JSON.stringify(bankInfo));
    
    showNotification('Datos bancarios actualizados correctamente');
});

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
    localStorage.setItem('manda2_driver_orders', JSON.stringify(orders));
    localStorage.setItem('manda2_driver_earnings', JSON.stringify(earnings));
});