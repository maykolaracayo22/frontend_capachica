<template>
  <div class="reservation-detail-container">
    <!-- Header -->
    <div class="reservation-header">
      <h1 class="reservation-title">
        <i class="bi bi-calendar-check"></i>
        Detalles de la Reserva
      </h1>
      <router-link to="/reservations" class="back-link">
        <i class="bi bi-arrow-left"></i> Volver a mis reservas
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando detalles de la reserva...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-triangle"></i>
      <h3>Error al cargar la reserva</h3>
      <p>{{ error }}</p>
      <button @click="fetchReservation" class="retry-btn">
        <i class="bi bi-arrow-clockwise"></i> Intentar nuevamente
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="reservation-content">
      <!-- Card -->
      <div class="reservation-card">
        <div class="card-header">
          <h2>
            {{ reservation.product?.name || reservation.custom_package?.name || 'Reserva' }}
          </h2>
          <div :class="statusBadgeClass" class="status-badge">
            {{ reservation.status }}
          </div>
        </div>

        <div class="card-body">
          <div class="reservation-details">
            <div class="detail-item">
              <div class="detail-icon"><i class="bi bi-box-seam"></i></div>
              <div class="detail-content">
                <span class="detail-label">Cantidad</span>
                <span class="detail-value">{{ reservation.quantity }}</span>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon"><i class="bi bi-calendar-date"></i></div>
              <div class="detail-content">
                <span class="detail-label">Fecha de Reserva</span>
                <span class="detail-value">{{ formatDate(reservation.reservation_date) }}</span>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon"><i class="bi bi-cash-stack"></i></div>
              <div class="detail-content">
                <span class="detail-label">Total</span>
                <span class="detail-value">${{ reservation.total_amount.toLocaleString() }}</span>
              </div>
            </div>

            <div v-if="reservation.product?.place" class="detail-item">
              <div class="detail-icon"><i class="bi bi-geo-alt"></i></div>
              <div class="detail-content">
                <span class="detail-label">Ubicación</span>
                <span class="detail-value">{{ reservation.product.place.name }}</span>
              </div>
            </div>
          </div>

          <!-- Producto o Paquete -->
          <div class="product-info">
            <h3>Información del {{ reservation.product ? 'Producto' : 'Paquete Personalizado' }}</h3>
            <div class="product-content">
              <img 
                :src="reservation.product?.main_image || '/images/default-product.png'" 
                :alt="reservation.product?.name || 'Imagen'" 
                class="product-image"
              >
              <div class="product-details">
                <p>
                  {{ reservation.product?.description || 'No hay descripción disponible.' }}
                </p>
                <router-link
                  v-if="reservation.product"
                  :to="`/products/${reservation.product.id}`"
                  class="view-product-btn"
                >
                  <i class="bi bi-box-arrow-up-right"></i> Ver detalles del producto
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="card-footer">
          <div v-if="reservation.status === 'pendiente'" class="action-buttons">
            <button @click="showCancelModal" class="cancel-btn">
              <i class="bi bi-x-circle"></i> Cancelar Reserva
            </button>
            <button v-if="!reservation.payment" class="payment-btn">
              <i class="bi bi-credit-card"></i> Realizar Pago
            </button>
          </div>
          <div v-else class="status-message">
            <i class="bi bi-info-circle"></i>
            Esta reserva ya ha sido {{ reservation.status === 'cancelada' ? 'cancelada' : 'confirmada' }}
          </div>
        </div>
      </div>

      <!-- Pago -->
      <div v-if="reservation.payment" class="payment-section">
        <h3><i class="bi bi-credit-card"></i> Información de Pago</h3>
        <div class="payment-details">
          <div class="detail-item">
            <div class="detail-icon"><i class="bi bi-calendar-check"></i></div>
            <div class="detail-content">
              <span class="detail-label">Fecha de Pago</span>
              <span class="detail-value">{{ formatDate(reservation.payment.created_at) }}</span>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-icon"><i class="bi bi-check-circle"></i></div>
            <div class="detail-content">
              <span class="detail-label">Estado</span>
              <span :class="paymentStatusClass" class="status-badge">
                {{ reservation.payment.status }}
              </span>
            </div>
          </div>
          <div v-if="reservation.payment.note" class="detail-item">
            <div class="detail-icon"><i class="bi bi-chat-left-text"></i></div>
            <div class="detail-content">
              <span class="detail-label">Nota</span>
              <span class="detail-value">{{ reservation.payment.note }}</span>
            </div>
          </div>
          <div v-if="reservation.payment.image_url" class="detail-item">
            <div class="detail-icon"><i class="bi bi-receipt"></i></div>
            <div class="detail-content">
              <span class="detail-label">Comprobante</span>
              <a :href="reservation.payment.image_url" target="_blank" class="view-receipt-btn">
                <i class="bi bi-eye"></i> Ver comprobante
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirmar Cancelación</h3>
          <button @click="showModal = false" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon"><i class="bi bi-exclamation-triangle"></i></div>
          <p>¿Estás seguro que deseas cancelar esta reserva?</p>
          <p class="modal-note">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="showModal = false" class="modal-btn cancel">No, conservar reserva</button>
          <button @click="cancelReservation" class="modal-btn confirm">
            <i class="bi bi-check-circle"></i> Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import api from '@/services/axios';

export default {
  name: 'ReservationDetail',
  data() {
    return {
      reservation: {},
      loading: true,
      error: null,
      showModal: false
    };
  },
  computed: {
    statusBadgeClass() {
      switch (this.reservation.status) {
        case 'pendiente':
          return 'pending';
        case 'confirmada':
          return 'confirmed';
        case 'cancelada':
          return 'canceled';
        default:
          return '';
      }
    },
    paymentStatusClass() {
      if (!this.reservation.payment) return '';
      switch (this.reservation.payment.status) {
        case 'pendiente':
          return 'pending';
        case 'confirmado':
          return 'confirmed';
        case 'rechazado':
          return 'rejected';
        default:
          return '';
      }
    }
  },
  async mounted() {
    await this.fetchReservation();
  },
  methods: {
    async fetchReservation() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/reservations/${this.$route.params.id}`);
        this.reservation = res.data;
      } catch (error) {
        console.error("Error fetching reservation:", error);
        this.error = 'No se pudo cargar la información de la reserva. Por favor intenta nuevamente.';
      } finally {
        this.loading = false;
      }
    },
    showCancelModal() {
      this.showModal = true;
    },
    async cancelReservation() {
      try {
        await api.delete(`/reservations/${this.reservation.id}`);
        this.$notify({
          type: 'success',
          title: 'Reserva cancelada',
          text: 'La reserva ha sido cancelada exitosamente'
        });
        this.reservation.status = 'cancelada';
        this.showModal = false;
      } catch (error) {
        console.error("Error canceling reservation:", error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'No se pudo cancelar la reserva. Por favor, inténtelo más tarde.'
        });
      }
    },
    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    }
  }
};
</script>

<style scoped>
/* Variables */
:root {
  --primary: #4f46e5;
  --primary-light: #6366f1;
  --primary-dark: #4338ca;
  --secondary: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --dark: #1e293b;
  --gray-dark: #334155;
  --gray: #64748b;
  --gray-light: #e2e8f0;
  --light: #f8fafc;
}

/* Base Styles */
.reservation-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
  margin-top: 100px;
}

/* Header */
.reservation-header {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reservation-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 0.3rem solid rgba(79, 70, 229, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--gray);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.error-state i {
  font-size: 3rem;
  color: var(--danger);
  margin-bottom: 1rem;
}

.error-state h3 {
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.error-state p {
  color: var(--gray);
  margin-bottom: 1.5rem;
  max-width: 400px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: var(--primary-dark);
}

/* Reservation Card */
.reservation-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--light);
  border-bottom: 1px solid var(--gray-light);
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #b45309;
}

.status-badge.confirmed {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.status-badge.canceled {
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
}

.card-body {
  padding: 1.5rem;
}

/* Reservation Details */
.reservation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
}

.detail-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: rgba(79, 70, 229, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1rem;
  color: var(--dark);
  font-weight: 500;
}

/* Product Info */
.product-info {
  margin-top: 2rem;
}

.product-info h3 {
  font-size: 1.25rem;
  color: var(--dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-content {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 0.75rem;
  object-fit: cover;
  border: 1px solid var(--gray-light);
  flex-shrink: 0;
}

.product-details {
  flex: 1;
}

.product-details p {
  color: var(--gray-dark);
  margin-bottom: 1rem;
}

.view-product-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-product-btn:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Card Footer */
.card-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--gray-light);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.cancel-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.payment-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-btn:hover {
  background: var(--primary-dark);
}

.status-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray);
  font-weight: 500;
}

/* Payment Section */
.payment-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.payment-section h3 {
  font-size: 1.25rem;
  color: var(--dark);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.view-receipt-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary);
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.view-receipt-btn:hover {
  background: rgba(79, 70, 229, 0.2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--gray);
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--dark);
}

.modal-body {
  padding: 2rem 1.5rem;
  text-align: center;
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.8rem;
  color: var(--warning);
  background: rgba(245, 158, 11, 0.1);
}

.modal-body p {
  color: var(--dark);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.modal-note {
  font-size: 0.875rem;
  color: var(--gray);
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.modal-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: white;
  border: 1px solid var(--gray-light);
  color: var(--gray-dark);
}

.modal-btn.cancel:hover {
  background: var(--light);
}

.modal-btn.confirm {
  background: var(--danger);
  border: 1px solid var(--danger);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-btn.confirm:hover {
  background: #dc2626;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .cancel-btn,
  .payment-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .reservation-detail-container {
    padding: 1rem;
  }
  
  .reservation-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>