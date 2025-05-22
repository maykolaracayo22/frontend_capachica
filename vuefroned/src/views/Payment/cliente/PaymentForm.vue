<template>
  <div class="payment-container">
    <!-- Header -->
    <div class="payment-header text-center mb-5">
      <div class="payment-icon mb-3">
        <i class="bi bi-phone"></i>
      </div>
      <h2 class="mb-2">Realizar Pago con Yape/Plin</h2>
      <p class="text-muted">Completa los datos de tu transacción</p>
    </div>

    <!-- Loading -->
    <div v-if="!reservation" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Cargando información de la reserva...</p>
    </div>

    <!-- Form -->
    <div v-else class="payment-card card border-0 shadow-sm">
      <div class="card-body p-4 p-md-5">
        <!-- Info -->
        <div class="reservation-info mb-4 p-3 rounded-3 bg-light">
          <h5 class="mb-3 text-primary">
            <i class="bi bi-receipt me-2"></i> Detalles de tu reserva
          </h5>
          <div class="row">
            <div class="col-md-6">
              <p><strong><i class="bi bi-box-seam me-2"></i>Producto:</strong> {{ reservation.product.name }}</p>
              <p><strong><i class="bi bi-cash-coin me-2"></i>Total a pagar:</strong> 
                <span class="text-success fw-bold">S/ {{ reservation.total_amount }}</span></p>
            </div>
            <div class="col-md-6">
              <p v-if="reservation.product.entrepreneur?.user?.phone">
                <strong><i class="bi bi-phone me-2"></i>Yape/Plin:</strong> {{ reservation.product.entrepreneur.user.phone }}
              </p>
              <a
                v-if="reservation.product.entrepreneur?.user?.phone"
                :href="whatsappLink"
                target="_blank"
                class="btn btn-success btn-sm mt-2"
              >
                <i class="bi bi-whatsapp me-1"></i> Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <form @submit.prevent="submitPayment" enctype="multipart/form-data">
          <!-- Imagen -->
          <div class="mb-4">
            <label class="form-label fw-bold mb-3">
              <i class="bi bi-image me-2 text-primary"></i> Captura del comprobante de pago
            </label>
            <div class="file-upload-container">
              <input type="file" accept="image/*" @change="handleFileUpload" class="form-control" required />
              <label class="file-upload-label">
                <div v-if="!form.image" class="upload-placeholder">
                  <i class="bi bi-cloud-arrow-up fs-1 text-muted"></i>
                  <p class="mt-2 mb-1">Selecciona una imagen</p>
                  <small class="text-muted">Formatos: JPG, PNG (máx. 5MB)</small>
                </div>
                <div v-else class="upload-preview">
                  <img :src="previewImage" alt="Vista previa" class="img-thumbnail" />
                  <p class="mt-2 mb-0 text-success">
                    <i class="bi bi-check-circle-fill me-1"></i> Archivo seleccionado
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Código -->
          <div class="mb-4">
            <label class="form-label fw-bold mb-3">
              <i class="bi bi-123 me-2 text-primary"></i> Código de operación
            </label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-key"></i></span>
              <input
                type="text"
                v-model.trim="form.operation_code"
                class="form-control"
                placeholder="Ej: YAPE123456789"
                required
              />
            </div>
            <small class="text-muted">Este código aparece en tu app de pago</small>
          </div>

          <!-- Nota -->
          <div class="mb-4">
            <label class="form-label fw-bold mb-3">
              <i class="bi bi-pencil-square me-2 text-primary"></i> Mensaje adicional (opcional)
            </label>
            <textarea v-model.trim="form.note" class="form-control" rows="3"
              placeholder="Ej: Pagué a las 3:45pm..."></textarea>
          </div>

          <!-- Botón -->
          <div class="d-grid mt-4">
            <button class="btn btn-primary btn-lg" :disabled="loading || !form.image || !form.operation_code">
              <template v-if="loading">
                <span class="spinner-border spinner-border-sm me-2"></span> Enviando...
              </template>
              <template v-else>
                <i class="bi bi-send-check me-2"></i> Enviar comprobante
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  name: 'ClientePago',
  data() {
    return {
      reservation: null,
      form: { reservation_id: null, image: null, operation_code: '', note: '' },
      loading: false,
      previewImage: null
    };
  },
  computed: {
    whatsappLink() {
      const phone = this.reservation?.product?.entrepreneur?.user?.phone;
      const message = `Hola, realicé el pago para la reserva #${this.reservation?.id}`;
      return phone ? `https://wa.me/51${phone}?text=${encodeURIComponent(message)}` : '#';
    }
  },
  async mounted() {
    try {
      const id = this.$route.params.id;
      const res = await api.get(`/reservations/${id}`);
      this.reservation = res.data;
      this.form.reservation_id = res.data.id;
    } catch {
      alert('No se pudo cargar la reserva. Intenta nuevamente.');
      this.$router.push('/products');
    }
  },
  methods: {
    handleFileUpload(event) {
      this.form.image = event.target.files[0];
      if (this.form.image) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(this.form.image);
      }
    },
    async submitPayment() {
  if (!this.form.image || !this.form.operation_code) {
    alert('Por favor completa todos los campos requeridos.');
    return;
  }

  if (!confirm('¿Confirmas que deseas enviar este pago?')) return;

  this.loading = true;
  const formData = new FormData();
  formData.append('reservation_id', this.form.reservation_id);
  formData.append('image_file', this.form.image);
  formData.append('operation_code', this.form.operation_code);
  formData.append('payment_method', 'yape'); // 👈 NECESARIO para que funcione
  if (this.form.note) formData.append('note', this.form.note);

  try {
    await api.post('/payments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('✅ Comprobante enviado. Espera la confirmación del emprendedor.');
    this.$router.push('/reservations');
  } catch (error) {
    console.error('Error al enviar el pago:', error);
    alert('❌ Error al enviar el pago. Verifica los datos o contacta soporte.');
  } finally {
    this.loading = false;
  }
}

  }
};
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.payment-header {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.payment-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
}

.payment-card {
  border-radius: 12px;
  overflow: hidden;
}

.reservation-info {
  border-left: 4px solid #0d6efd;
}

.file-upload-label {
  display: block;
  padding: 2rem;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.upload-placeholder {
  color: #6c757d;
}

.upload-preview img {
  max-width: 200px;
  max-height: 150px;
}
</style>
