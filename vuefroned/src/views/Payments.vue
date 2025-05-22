<template>
  <div class="payments-management">
    <div class="section-header">
      <div>
        <h1 class="section-title">
          <i class="bi bi-bar-chart-line"></i> Panel de Pagos
        </h1>
        <p class="section-subtitle">Filtra, analiza y gestiona transacciones</p>
      </div>
      <router-link to="/admin/home-dashboard" class="action-button">
        <i class="bi bi-arrow-left"></i> Volver al Panel
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="filters row mb-4">
      <div class="col-md-3">
        <label>Desde</label>
        <input type="date" v-model="filters.start" class="form-control" />
      </div>
      <div class="col-md-3">
        <label>Hasta</label>
        <input type="date" v-model="filters.end" class="form-control" />
      </div>
      <div class="col-md-3">
        <label>Estado</label>
        <select v-model="filters.status" class="form-select">
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="enviado">Enviado</option>
          <option value="confirmado">Confirmado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <button @click="applyFilters" class="btn btn-primary w-100">
          <i class="bi bi-filter-circle"></i> Aplicar Filtros
        </button>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="chart-container mb-4">
      <BarChart :chart-data="chartData" />
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Estado</th>
            <th>Pagado el</th>
            <th>Confirmado el</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredPayments" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.reservation?.user?.name || '—' }}</td>
<td>{{ p.reservation?.product?.name || '—' }}</td>

            <td><span :class="statusClass(p.status)">{{ p.status }}</span></td>
            <td>{{ formatDate(p.confirmed_at) }}</td>
            <td>{{ formatDate(p.confirmation_time) }}</td>
            <td>
              <button v-if="p.status === 'enviado'" class="btn btn-success btn-sm me-1" @click="confirm(p.id)">
                Confirmar
              </button>
              <button v-if="p.status === 'enviado'" class="btn btn-outline-danger btn-sm" @click="reject(p.id)">
                Rechazar
              </button>
            </td>
          </tr>
          <tr v-if="filteredPayments.length === 0">
            <td colspan="7" class="text-center text-muted">Sin resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import paymentService from '@/services/payment';
import BarChart from '@/components/BarChart.vue'; // gráfico separado

const payments = ref([]);
const filters = ref({ start: '', end: '', status: '' });

const fetchPayments = async () => {
  const res = await paymentService.getAll();
  payments.value = res.data;
};

const applyFilters = () => {
  // Triggers computed update
};

const filteredPayments = computed(() => {
  return payments.value.filter(p => {
    const date = new Date(p.created_at);
    const afterStart = !filters.value.start || date >= new Date(filters.value.start);
    const beforeEnd = !filters.value.end || date <= new Date(filters.value.end + 'T23:59:59');
    const matchesStatus = !filters.value.status || p.status === filters.value.status;
    const hasReservation = !!p.reservation;
    return afterStart && beforeEnd && matchesStatus && hasReservation;
  });
});


const chartData = computed(() => {
  const counts = { pendiente: 0, enviado: 0, confirmado: 0, rechazado: 0 };
  filteredPayments.value.forEach(p => {
    counts[p.status]++;
  });
  return {
    labels: ['Pendiente', 'Enviado', 'Confirmado', 'Rechazado'],
    datasets: [{
      label: 'Cantidad de pagos',
      data: [counts.pendiente, counts.enviado, counts.confirmado, counts.rechazado]
    }]
  };
});

const confirm = async (id) => {
  if (confirm('¿Confirmar pago?')) {
    await paymentService.confirm(id);
    fetchPayments();
  }
};

const reject = async (id) => {
  if (confirm('¿Rechazar pago?')) {
    await paymentService.reject(id);
    fetchPayments();
  }
};

const formatDate = dt => dt ? new Date(dt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const statusClass = status => ({
  'badge bg-warning': status === 'pendiente',
  'badge bg-info': status === 'enviado',
  'badge bg-success': status === 'confirmado',
  'badge bg-danger': status === 'rechazado'
}[status] || 'badge bg-secondary');

onMounted(fetchPayments);
</script>
  

<style scoped>
/* Estructura principal */
.payments-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 100px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Formulario */
.payment-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.price-input-container {
  position: relative;
}

.price-input {
  padding-left: 2.5rem;
}

.currency {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
}

/* Lista de pagos */
.payments-list {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  background-color: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: rgba(79, 70, 229, 0.03);
}

/* Celdas personalizadas */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  line-height: 1.4;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
}

.tour-name {
  font-weight: 500;
  color: #1e293b;
}

.tour-date {
  font-size: 0.75rem;
  color: #64748b;
}

.payment-method {
  font-weight: 500;
  color: #1e293b;
}

.payment-amount {
  font-weight: 600;
  color: #10b981;
}

.payment-date {
  font-size: 0.875rem;
  color: #64748b;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.completed-badge {
  background-color: #ecfdf5;
  color: #065f46;
}

.pending-badge {
  background-color: #fef3c7;
  color: #92400e;
}

.canceled-badge {
  background-color: #fee2e2;
  color: #991b1b;
}

.empty-message {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.empty-message i {
  font-size: 1.25rem;
  color: #94a3b8;
}

/* Botones */
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  gap: 0.5rem;
}

.success-button {
  background-color: #10b981;
  color: white;
}

.success-button:hover {
  background-color: #0a936a;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    display: block;
    overflow-x: auto;
  }
  
  .user-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .payments-management {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>