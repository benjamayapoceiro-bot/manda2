// Admin Panel JavaScript
let currentAdmin = null;
let orders = [];
let users = [];
let tickets = [];
let liveMap = null;
let selectedUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    loadOrders();
    loadUsers();
    loadTickets();
    updateDashboard();
    initializeCharts();
    initializeLiveMap();
});

// Load admin data
function loadAdminData() {
    const userData = localStorage.getItem('manda2_user');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    currentAdmin = JSON.parse(userData);
}

// Demo data
function loadOrders() {
    orders = [
        {
            id: 'ORD-12345',
            customerName: 'Juan Pérez',
            businessName: 'Pizzería Don Mario',
            driverName: 'Carlos Rodríguez',
            items: ['Pizza Margherita', 'Coca Cola 1.5L'],
            total: 2780,
            status: 'delivered',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            estimatedTime: '25 min'
        },
        {
            id: 'ORD-12346',
            customerName: 'María García',
            businessName: 'Supermercado La Villa',
            driverName: 'Ana López',
            items: ['Leche Entera 1L', 'Pan de Mesa'],
            total: 830,
            status: 'delivering',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            estimatedTime: '20 min'
        },
        {
            id: 'ORD-12347',
            customerName: 'Pedro Rodríguez',
            businessName: 'Farmacia Central',
            driverName: 'Luis Martínez',
            items: ['Paracetamol 500mg', 'Vitamina C'],
            total: 460,
            status: 'preparing',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            estimatedTime: '15 min'
        },
        {
            id: 'ORD-12348',
            customerName: 'Laura Sánchez',
            businessName: 'Kiosco El Tío',
            driverName: 'No asignado',
            items: ['Coca Cola 1.5L', 'Papas Fritas'],
            total: 430,
            status: 'pending',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            estimatedTime: '18 min'
        }
    ];
    renderOrders();
}

function loadUsers() {
    users = [
        {
            id: 'USR-001',
            name: 'Juan Pérez',
            email: 'juan@email.com',
            role: 'customer',
            status: 'active',
            phone: '+54 9 2314-567890',
            createdAt: new Date(Date.now() - 2592000000).toISOString(),
            totalOrders: 23,
            totalSpent: 45670
        },
        {
            id: 'USR-002',
            name: 'Pizzería Don Mario',
            email: 'mario@pizzeria.com',
            role: 'business',
            status: 'active',
            phone: '+54 9 2314-123456',
            createdAt: new Date(Date.now() - 1814400000).toISOString(),
            totalOrders: 156,
            totalEarned: 234500,
            address: 'Av. San Martín 1234'
        },
        {
            id: 'USR-003',
            name: 'Carlos Rodríguez',
            email: 'carlos@driver.com',
            role: 'driver',
            status: 'active',
            phone: '+54 9 2314-987654',
            createdAt: new Date(Date.now() - 1209600000).toISOString(),
            totalDeliveries: 89,
            totalEarned: 178000,
            vehicle: 'Moto Honda 125cc',
            rating: 4.8
        },
        {
            id: 'USR-004',
            name: 'María García',
            email: 'maria@email.com',
            role: 'customer',
            status: 'pending',
            phone: '+54 9 2314-555555',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            totalOrders: 0,
            totalSpent: 0
        },
        {
            id: 'USR-005',
            name: 'Farmacia Central',
            email: 'info@farmaciacentral.com',
            role: 'business',
            status: 'pending',
            phone: '+54 9 2314-777777',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            totalOrders: 0,
            totalEarned: 0,
            address: 'Calle Belgrano 890'
        }
    ];
    renderUsers();
    renderPendingValidations();
}

function loadTickets() {
    tickets = [
        {
            id: 'TKT-001',
            userName: 'Juan Pérez',
            userEmail: 'juan@email.com',
            subject: 'Problema con mi pedido',
            message: 'Mi pedido no llegó en el tiempo estimado y no puedo contactar al repartidor.',
            status: 'open',
            priority: 'high',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            category: 'Pedido'
        },
        {
            id: 'TKT-002',
            userName: 'Pizzería Don Mario',
            userEmail: 'mario@pizzeria.com',
            subject: 'Error en liquidación',
            message: 'La liquidación del período anterior no coincide con mis registros.',
            status: 'pending',
            priority: 'medium',
            createdAt: new Date(Date.now() - 14400000).toISOString(),
            category: 'Finanzas'
        },
        {
            id: 'TKT-003',
            userName: 'Carlos Rodríguez',
            userEmail: 'carlos@driver.com',
            subject: 'Problema con la app',
            message: 'La aplicación se cierra automáticamente cuando intento aceptar un pedido.',
            status: 'resolved',
            priority: 'medium',
            createdAt: new Date(Date.now() - 21600000).toISOString(),
            category: 'Técnico'
        }
    ];
    renderTickets();
}

// Update dashboard
function updateDashboard() {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalBusinesses = users.filter(u => u.role === 'business').length;
    const totalDrivers = users.filter(u => u.role === 'driver').length;
    
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-businesses').textContent = totalBusinesses;
    document.getElementById('total-drivers').textContent = totalDrivers;
    
    // Finance section
    const totalIncome = totalRevenue;
    const totalCommissions = totalIncome * 0.15; // 15% commission
    const netProfit = totalIncome - totalCommissions;
    const totalTransactions = orders.length;
    
    document.getElementById('total-income').textContent = `$${totalIncome.toLocaleString()}`;
    document.getElementById('total-commissions').textContent = `$${totalCommissions.toLocaleString()}`;
    document.getElementById('net-profit').textContent = `$${netProfit.toLocaleString()}`;
    document.getElementById('total-transactions').textContent = totalTransactions;
    
    renderRecentActivity();
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
    card.className = `bg-white rounded-2xl p-6 shadow-lg status-${order.status}`;
    
    const statusText = {
        'pending': 'Pendiente',
        'preparing': 'En Preparación',
        'ready': 'Listo',
        'delivering': 'En Camino',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
    };
    
    const statusColor = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'preparing': 'bg-blue-100 text-blue-800',
        'ready': 'bg-purple-100 text-purple-800',
        'delivering': 'bg-orange-100 text-orange-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${order.id}</h3>
                <p class="text-sm text-gray-600">${order.customerName} → ${order.businessName}</p>
                <p class="text-sm text-gray-500">${order.driverName === 'No asignado' ? 'Sin asignar' : order.driverName}</p>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold text-gray-900 mb-2">$${order.total}</p>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}">
                    ${statusText[order.status]}
                </span>
            </div>
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Items:</span>
                <span class="font-medium">${order.items.length} artículo(s)</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tiempo Estimado:</span>
                <span class="font-medium">${order.estimatedTime}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Fecha:</span>
                <span class="font-medium">${new Date(order.timestamp).toLocaleString()}</span>
            </div>
        </div>
        
        <div class="border-t pt-4 flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-600">Estado: ${statusText[order.status]}</p>
            </div>
            <div class="flex space-x-2">
                <button onclick="viewOrderDetails('${order.id}')" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Ver Detalles
                </button>
                ${order.status === 'pending' ? `
                    <button onclick="assignDriver('${order.id}')" class="text-orange-600 hover:text-orange-700 font-medium text-sm">
                        Asignar Repartidor
                    </button>
                ` : ''}
                ${order.status === 'delivering' ? `
                    <button onclick="trackOrder('${order.id}')" class="text-green-600 hover:text-green-700 font-medium text-sm">
                        Seguir Pedido
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Render users
function renderUsers() {
    const container = document.getElementById('users-list');
    container.innerHTML = '';
    
    if (users.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay usuarios</p>';
        return;
    }
    
    users.forEach(user => {
        const userEl = createUserCard(user);
        container.appendChild(userEl);
    });
}

// Create user card
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card bg-white rounded-2xl p-6 shadow-lg cursor-pointer';
    card.onclick = () => showUserDetails(user);
    
    const roleColors = {
        'customer': 'bg-blue-100 text-blue-800',
        'business': 'bg-green-100 text-green-800',
        'driver': 'bg-purple-100 text-purple-800',
        'admin': 'bg-red-100 text-red-800'
    };
    
    const statusColors = {
        'active': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'suspended': 'bg-red-100 text-red-800'
    };
    
    const roleNames = {
        'customer': 'Cliente',
        'business': 'Comercio',
        'driver': 'Repartidor',
        'admin': 'Admin'
    };
    
    card.innerHTML = `
        <div class="flex items-center space-x-4 mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold text-orange-600">${user.name.charAt(0)}</span>
            </div>
            <div class="flex-1">
                <h3 class="font-semibold text-gray-900">${user.name}</h3>
                <p class="text-sm text-gray-600">${user.email}</p>
            </div>
            <div class="text-right">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}">
                    ${roleNames[user.role]}
                </span>
            </div>
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Teléfono:</span>
                <span class="font-medium">${user.phone}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Estado:</span>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Registro:</span>
                <span class="font-medium">${new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
        
        ${user.role === 'customer' ? `
            <div class="border-t pt-3">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Pedidos:</span>
                    <span class="font-medium">${user.totalOrders}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Gastado:</span>
                    <span class="font-medium text-orange-600">$${user.totalSpent?.toLocaleString() || 0}</span>
                </div>
            </div>
        ` : user.role === 'business' ? `
            <div class="border-t pt-3">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Pedidos:</span>
                    <span class="font-medium">${user.totalOrders}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Ingresos:</span>
                    <span class="font-medium text-green-600">$${user.totalEarned?.toLocaleString() || 0}</span>
                </div>
            </div>
        ` : user.role === 'driver' ? `
            <div class="border-t pt-3">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Entregas:</span>
                    <span class="font-medium">${user.totalDeliveries}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Ganancias:</span>
                    <span class="font-medium text-blue-600">$${user.totalEarned?.toLocaleString() || 0}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Calificación:</span>
                    <span class="font-medium text-yellow-600">${user.rating || 'N/A'}</span>
                </div>
            </div>
        ` : ''}
    `;
    
    return card;
}

// Render pending validations
function renderPendingValidations() {
    const container = document.getElementById('pending-validations');
    const pendingUsers = users.filter(u => u.status === 'pending');
    
    if (pendingUsers.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay validaciones pendientes</p>';
        return;
    }
    
    container.innerHTML = '';
    
    pendingUsers.forEach(user => {
        const validationEl = document.createElement('div');
        validationEl.className = 'flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200';
        
        validationEl.innerHTML = `
            <div>
                <h4 class="font-semibold text-gray-900">${user.name}</h4>
                <p class="text-sm text-gray-600">${user.email} • ${user.role.toUpperCase()}</p>
                <p class="text-sm text-gray-500">Registrado: ${new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="flex space-x-2">
                <button onclick="approveUser('${user.id}')" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Aprobar
                </button>
                <button onclick="rejectUser('${user.id}')" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    Rechazar
                </button>
                <button onclick="showUserDetails(${JSON.stringify(user).replace(/"/g, '&quot;')})" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Ver
                </button>
            </div>
        `;
        
        container.appendChild(validationEl);
    });
}

// Render tickets
function renderTickets() {
    const container = document.getElementById('tickets-list');
    container.innerHTML = '';
    
    if (tickets.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay tickets de soporte</p>';
        return;
    }
    
    tickets.forEach(ticket => {
        const ticketEl = createTicketCard(ticket);
        container.appendChild(ticketEl);
    });
}

// Create ticket card
function createTicketCard(ticket) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl p-6 shadow-lg border-l-4';
    
    const priorityColors = {
        'high': 'border-red-500 bg-red-50',
        'medium': 'border-yellow-500 bg-yellow-50',
        'low': 'border-blue-500 bg-blue-50'
    };
    
    const statusColors = {
        'open': 'bg-red-100 text-red-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'resolved': 'bg-green-100 text-green-800',
        'closed': 'bg-gray-100 text-gray-800'
    };
    
    card.className += ` ${priorityColors[ticket.priority]}`;
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${ticket.subject}</h3>
                <p class="text-sm text-gray-600">${ticket.userName} (${ticket.userEmail})</p>
                <p class="text-sm text-gray-500">${ticket.category} • ${new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div class="text-right">
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status]}">
                    ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
                <span class="block mt-2 text-xs font-medium ${ticket.priority === 'high' ? 'text-red-600' : ticket.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'}">
                    ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
            </div>
        </div>
        
        <p class="text-gray-700 mb-4">${ticket.message}</p>
        
        <div class="border-t pt-4 flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-600">ID: ${ticket.id}</p>
            </div>
            <div class="flex space-x-2">
                <button onclick="viewTicketDetails('${ticket.id}')" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Ver Detalles
                </button>
                ${ticket.status === 'open' ? `
                    <button onclick="assignTicket('${ticket.id}')" class="text-orange-600 hover:text-orange-700 font-medium text-sm">
                        Asignar
                    </button>
                ` : ''}
                ${ticket.status === 'pending' ? `
                    <button onclick="resolveTicket('${ticket.id}')" class="text-green-600 hover:text-green-700 font-medium text-sm">
                        Resolver
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Render recent activity
function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    const activities = [
        {
            type: 'order',
            message: 'Nuevo pedido #ORD-12349 de Marta González',
            time: 'Hace 5 minutos',
            icon: '📦'
        },
        {
            type: 'user',
            message: 'Nuevo repartidor registrado: Pedro López',
            time: 'Hace 12 minutos',
            icon: '👤'
        },
        {
            type: 'business',
            message: 'Pizzería San Pablo actualizó su menú',
            time: 'Hace 23 minutos',
            icon: '🏪'
        },
        {
            type: 'ticket',
            message: 'Nuevo ticket de soporte #TKT-004',
            time: 'Hace 35 minutos',
            icon: '🎫'
        },
        {
            type: 'payment',
            message: 'Liquidación generada para 15 comercios',
            time: 'Hace 1 hora',
            icon: '💰'
        }
    ];
    
    container.innerHTML = '';
    
    activities.forEach(activity => {
        const activityEl = document.createElement('div');
        activityEl.className = 'flex items-center space-x-4 p-4 bg-gray-50 rounded-lg';
        
        activityEl.innerHTML = `
            <div class="text-2xl">${activity.icon}</div>
            <div class="flex-1">
                <p class="text-gray-900">${activity.message}</p>
                <p class="text-sm text-gray-500">${activity.time}</p>
            </div>
        `;
        
        container.appendChild(activityEl);
    });
}

// Initialize charts
function initializeCharts() {
    // Sales chart
    const salesData = [{
        x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        y: [45000, 52000, 48000, 55000, 60000, 58000, 62000, 59000, 65000, 68000, 72000, 75000],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Ventas',
        line: { color: '#f97316', width: 4 },
        marker: { color: '#f97316', size: 8 },
        fill: 'tonexty',
        fillcolor: 'rgba(249, 115, 22, 0.1)'
    }];
    
    const salesLayout = {
        title: '',
        xaxis: { title: 'Mes' },
        yaxis: { title: 'Ventas ($)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('sales-chart', salesData, salesLayout, {responsive: true, displayModeBar: false});
    
    // Users chart
    const usersData = [{
        values: [450, 45, 67, 8],
        labels: ['Clientes', 'Comercios', 'Repartidores', 'Admins'],
        type: 'pie',
        marker: {
            colors: ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444']
        }
    }];
    
    const usersLayout = {
        title: '',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 20, l: 20, r: 20 }
    };
    
    Plotly.newPlot('users-chart', usersData, usersLayout, {responsive: true, displayModeBar: false});
    
    // Income vs Expenses chart
    const incomeExpensesData = [
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
    
    const incomeExpensesLayout = {
        title: '',
        xaxis: { title: 'Mes' },
        yaxis: { title: 'Monto ($)' },
        barmode: 'group',
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('income-expenses-chart', incomeExpensesData, incomeExpensesLayout, {responsive: true, displayModeBar: false});
    
    // Transactions chart
    const transactionsData = [{
        x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        y: [45, 52, 38, 67, 89, 76, 34],
        type: 'bar',
        marker: { color: '#8b5cf6' }
    }];
    
    const transactionsLayout = {
        title: '',
        xaxis: { title: 'Día de la semana' },
        yaxis: { title: 'Transacciones' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('transactions-chart', transactionsData, transactionsLayout, {responsive: true, displayModeBar: false});
}

// Initialize live map
function initializeLiveMap() {
    liveMap = L.map('live-map').setView([-34.6118, -58.3960], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(liveMap);
    
    // Add demo markers
    const drivers = [
        { lat: -34.6118, lng: -58.3960, name: 'Carlos R.' },
        { lat: -34.6138, lng: -58.3980, name: 'Ana L.' },
        { lat: -34.6098, lng: -58.3940, name: 'Pedro M.' },
        { lat: -34.6158, lng: -58.4000, name: 'Laura S.' }
    ];
    
    drivers.forEach(driver => {
        L.marker([driver.lat, driver.lng]).addTo(liveMap)
            .bindPopup(`Repartidor: ${driver.name}<br>Estado: Disponible`);
    });
    
    // Add business markers
    const businesses = [
        { lat: -34.6108, lng: -58.3950, name: 'Pizzería Don Mario' },
        { lat: -34.6128, lng: -58.3970, name: 'Supermercado La Villa' },
        { lat: -34.6088, lng: -58.3930, name: 'Farmacia Central' }
    ];
    
    businesses.forEach(business => {
        L.marker([business.lat, business.lng], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: '<div style="background-color:#10b981; color:white; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:12px;">🏪</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(liveMap)
            .bindPopup(`Comercio: ${business.name}<br>Estado: Abierto`);
    });
}

// Filter functions
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

function filterUsers(role) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('bg-orange-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    event.target.classList.remove('bg-gray-200', 'text-gray-700');
    event.target.classList.add('bg-orange-600', 'text-white');
    
    const container = document.getElementById('users-list');
    container.innerHTML = '';
    
    let filteredUsers = role === 'all' ? users : users.filter(user => user.role === role);
    
    if (filteredUsers.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay usuarios en esta categoría</p>';
        return;
    }
    
    filteredUsers.forEach(user => {
        const userEl = createUserCard(user);
        container.appendChild(userEl);
    });
}

// User management functions
function approveUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = 'active';
        renderUsers();
        renderPendingValidations();
        showNotification(`Usuario ${user.name} aprobado correctamente`);
    }
}

function rejectUser(userId) {
    if (confirm('¿Estás seguro de rechazar este usuario?')) {
        users = users.filter(u => u.id !== userId);
        renderUsers();
        renderPendingValidations();
        showNotification('Usuario rechazado');
    }
}

function suspendUser() {
    if (selectedUser) {
        selectedUser.status = 'suspended';
        showUserDetails(selectedUser);
        showNotification(`Usuario ${selectedUser.name} suspendido`);
    }
}

function showUserDetails(user) {
    selectedUser = user;
    const modal = document.getElementById('user-details-modal');
    const content = document.getElementById('user-details-content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <span class="text-2xl font-bold text-orange-600">${user.name.charAt(0)}</span>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">${user.name}</h3>
                    <p class="text-gray-600">${user.email}</p>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-900 mb-3">Información de Contacto</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Teléfono:</span>
                            <span class="font-medium">${user.phone}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Email:</span>
                            <span class="font-medium">${user.email}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Registro:</span>
                            <span class="font-medium">${new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-900 mb-3">Estadísticas</h4>
                    <div class="space-y-2 text-sm">
                        ${user.role === 'customer' ? `
                            <div class="flex justify-between">
                                <span class="text-gray-600">Total Pedidos:</span>
                                <span class="font-medium">${user.totalOrders}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Total Gastado:</span>
                                <span class="font-medium text-orange-600">$${user.totalSpent?.toLocaleString() || 0}</span>
                            </div>
                        ` : user.role === 'business' ? `
                            <div class="flex justify-between">
                                <span class="text-gray-600">Total Pedidos:</span>
                                <span class="font-medium">${user.totalOrders}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Ingresos:</span>
                                <span class="font-medium text-green-600">$${user.totalEarned?.toLocaleString() || 0}</span>
                            </div>
                            ${user.address ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Dirección:</span>
                                    <span class="font-medium">${user.address}</span>
                                </div>
                            ` : ''}
                        ` : user.role === 'driver' ? `
                            <div class="flex justify-between">
                                <span class="text-gray-600">Entregas:</span>
                                <span class="font-medium">${user.totalDeliveries}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Ganancias:</span>
                                <span class="font-medium text-blue-600">$${user.totalEarned?.toLocaleString() || 0}</span>
                            </div>
                            ${user.rating ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Calificación:</span>
                                    <span class="font-medium text-yellow-600">${user.rating}/5</span>
                                </div>
                            ` : ''}
                            ${user.vehicle ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Vehículo:</span>
                                    <span class="font-medium">${user.vehicle}</span>
                                </div>
                            ` : ''}
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeUserDetailsModal() {
    document.getElementById('user-details-modal').classList.add('hidden');
    selectedUser = null;
}

// Modal functions
function showSettlementModal() {
    document.getElementById('settlement-modal').classList.remove('hidden');
}

function closeSettlementModal() {
    document.getElementById('settlement-modal').classList.add('hidden');
}

function generateSettlement() {
    showNotification('Liquidación generada correctamente');
    closeSettlementModal();
}

function showRefundModal() {
    alert('Función de reembolso - Demo');
}

function showFinancialReport() {
    alert('Función de reporte financiero - Demo');
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

// Order functions
function viewOrderDetails(orderId) {
    alert(`Ver detalles del pedido ${orderId} - Demo`);
}

function assignDriver(orderId) {
    alert(`Asignar repartidor al pedido ${orderId} - Demo`);
}

function trackOrder(orderId) {
    alert(`Seguir pedido ${orderId} - Demo`);
}

// Ticket functions
function viewTicketDetails(ticketId) {
    alert(`Ver detalles del ticket ${ticketId} - Demo`);
}

function assignTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.status = 'pending';
        renderTickets();
        showNotification(`Ticket ${ticketId} asignado`);
    }
}

function resolveTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.status = 'resolved';
        renderTickets();
        showNotification(`Ticket ${ticketId} resuelto`);
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

// Search functionality
document.getElementById('order-search')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.businessName.toLowerCase().includes(searchTerm)
    );
    
    const container = document.getElementById('orders-list');
    container.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const orderEl = createOrderCard(order);
        container.appendChild(orderEl);
    });
});

document.getElementById('user-search')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    
    const container = document.getElementById('users-list');
    container.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const userEl = createUserCard(user);
        container.appendChild(userEl);
    });
});