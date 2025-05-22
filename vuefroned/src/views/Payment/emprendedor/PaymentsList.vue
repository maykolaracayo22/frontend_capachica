<template>
  <div class="payments-container">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h2 class="mb-1">
          <i class="bi bi-credit-card-2-back-fill me-2 text-primary"></i>
          Pagos Recibidos
        </h2>
        <p class="text-muted mb-0">Gestión de transacciones y comprobantes de pago</p>
      </div>
      <div class="d-flex">
        <button class="btn btn-outline-secondary me-2">
          <i class="bi bi-filter me-1"></i> Filtrar
        </button>
        <button class="btn btn-primary">
          <i class="bi bi-download me-1"></i> Exportar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando historial de pagos...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="payments.length === 0" class="empty-state text-center py-5">
      <i class="bi bi-credit-card text-muted" style="font-size: 3rem;"></i>
      <h4 class="mt-3">No hay pagos registrados</h4>
      <p class="text-muted">Todavía no has recibido ningún pago por tus servicios turísticos</p>
      <router-link to="/reservations" class="btn btn-primary mt-2">
        <i class="bi bi-eye me-1"></i> Ver reservas
      </router-link>
    </div>

    <!-- Payments List -->
    <div v-else class="payments-list">
      <div v-for="payment in payments" :key="payment.id" class="payment-card card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 class="card-title mb-1">
                <i class="bi bi-box-seam me-2 text-muted"></i>
                {{ payment.reservation.product.name }}
              </h5>
              <div class="d-flex flex-wrap align-items-center">
                <span class="badge me-2 mb-1" :class="statusBadgeClass(payment.status)">
                  {{ payment.status.toUpperCase() }}
                </span>
                <small class="text-muted me-2 mb-1">
                  <i class="bi bi-calendar me-1"></i>
                  {{ formatDate(payment.created_at) }}
                </small>
              </div>
            </div>
            <div class="text-end">
  <span class="h5 text-primary">
    S/ {{ formatCurrency(payment.reservation.total_amount) }}
  </span>
</div>

          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="payment-detail mb-3">
                <h6 class="text-muted mb-2">
                  <i class="bi bi-person me-2"></i> Información del Cliente
                </h6>
                <p class="mb-1"><strong>Nombre:</strong> {{ payment.reservation.user.name }}</p>
                <p class="mb-1"><strong>Email:</strong> {{ payment.reservation.user.email }}</p>
                <p class="mb-1"><strong>Teléfono:</strong> {{ payment.reservation.user.phone || '—' }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="payment-detail mb-3">
                <h6 class="text-muted mb-2">
                  <i class="bi bi-credit-card me-2"></i> Detalles del Pago
                </h6>
                <p class="mb-1"><strong>Código OP:</strong> {{ payment.operation_code || '—' }}</p>
                <p class="mb-1"><strong>Método:</strong> {{ payment.method || 'Transferencia' }}</p>
                <p class="mb-1"><strong>Notas:</strong> {{ payment.note || '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Evidence -->
          <div class="payment-evidence mt-3">
            <div v-if="payment.image_url" class="mb-3">
              <h6 class="text-muted mb-2">
                <i class="bi bi-image me-2"></i> Comprobante de Pago
              </h6>
              <div class="d-flex">
                <a :href="payment.image_url" target="_blank" class="me-3">
                  <img :src="payment.image_url" alt="Comprobante" class="img-thumbnail payment-image">
                </a>
                <div>
                  <a :href="payment.image_url" target="_blank" class="btn btn-sm btn-outline-primary me-2">
                    <i class="bi bi-zoom-in me-1"></i> Ampliar
                  </a>
                  <a :href="payment.image_url" download class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-download me-1"></i> Descargar
                  </a>
                </div>
              </div>
            </div>

            <div v-if="payment.receipt_url" class="mb-3">
              <h6 class="text-muted mb-2">
                <i class="bi bi-file-earmark-pdf me-2"></i> Recibo PDF
              </h6>
              <a :href="payment.receipt_url" target="_blank" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-file-earmark-pdf-fill me-1"></i> Ver documento
              </a>
            </div>
          </div>

          <!-- Confirmation Section -->
          <div v-if="payment.is_confirmed" class="confirmation-alert alert alert-success mt-3">
            <div class="d-flex align-items-center">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                <strong>Pago confirmado</strong> el {{ formatDate(payment.confirmation_time) }}
                <span v-if="payment.confirmer">por {{ payment.confirmer.name }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="payment.status === 'enviado'" class="payment-actions mt-4 pt-3 border-top">
            <button class="btn btn-success me-2" @click="confirm(payment.id)">
              <i class="bi bi-check-circle me-1"></i> Confirmar Pago
            </button>
            <button class="btn btn-outline-danger" @click="reject(payment.id)">
              <i class="bi bi-x-circle me-1"></i> Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paymentService from '@/services/payment';

export default {
  name: 'EmprendedorPagos',
  data() {
    return {
      payments: [],
      loading: true
    };
  },
  async created() {
    try {
      const res = await paymentService.getForEntrepreneur();
      this.payments = res.data;
      console.log('Pagos recibidos (detallado):');
      this.payments.forEach((p, i) => {
        console.log(`Pago #${i + 1}:`, p);
        console.log('→ Monto:', p.reservation?.total_amount || 'NO DEFINIDO');
      });
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatCurrency(value) {
      if (!value) return '0.00';
      return parseFloat(value).toFixed(2);
    },
    async confirm(id) {
      if (!confirm('¿Confirmar este pago?')) return;
      await paymentService.confirm(id);
      location.reload();
    },
    async reject(id) {
      if (!confirm('¿Rechazar este pago?')) return;
      await paymentService.reject(id);
      location.reload();
    },
    statusBadgeClass(status) {
      return {
        'bg-warning': status === 'pendiente',
        'bg-info': status === 'enviado',
        'bg-success': status === 'confirmado',
        'bg-danger': status === 'rechazado',
        'bg-secondary': !status
      };
    },
    formatDate(dt) {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dt).toLocaleDateString('es-ES', options);
    }
  }
};
</script>

<style scoped>
.payments-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.payment-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid var(--bs-primary);
}

.payment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.payment-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.payment-image:hover {
  transform: scale(1.05);
}

.empty-state {
  background-color: #f8f9fa;
  border-radius: 10px;
}

.confirmation-alert {
  border-left: 4px solid var(--bs-success);
}

.payment-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .payment-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .payment-actions .btn {
    width: 100%;
  }
}
</style>