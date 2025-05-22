<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <strong>Registrar Pago Presencial</strong>
    </div>
    <div class="card-body">
      <form @submit.prevent="submit">
        <!-- Selección de reserva -->
        <div class="mb-3">
          <label class="form-label">Reserva *</label>
          <select v-model="form.reservation_id" class="form-select" required>
            <option disabled value="">Selecciona una reserva</option>
            <option v-for="r in reservations" :key="r.id" :value="r.id">
              #{{ r.id }} - {{ r.user?.name }} - {{ r.product?.name }}
            </option>
          </select>
        </div>

        <!-- Datos del cliente -->
        <div v-if="selectedReservation" class="mb-3">
          <h5>Datos del Cliente</h5>
          <p><strong>Cliente:</strong> {{ selectedReservation.user?.name || '—' }}</p>
          <p><strong>Teléfono:</strong> {{ selectedReservation.user?.phone || '—' }}</p>
        </div>

        <!-- Información adicional del servicio -->
        <div v-if="selectedReservation" class="mb-4 border rounded p-3 bg-light">
          <h5 class="mb-3">Detalles del Servicio</h5>
          <p><strong>Producto:</strong> {{ selectedReservation.product?.name || '—' }}</p>
          <p><strong>Emprendedor:</strong> {{ selectedReservation.product?.entrepreneur?.business_name || '—' }}</p>
          <p><strong>Teléfono:</strong> {{ selectedReservation.product?.entrepreneur?.user?.phone || '—' }}</p>
          <p><strong>Monto Total:</strong>
            <span class="text-success fw-bold">
              S/ {{
                isNumber(selectedReservation.total_amount)
                  ? Number(selectedReservation.total_amount).toFixed(2)
                  : '—'
              }}
            </span>
          </p>
          <a
            v-if="selectedReservation.product?.entrepreneur?.user?.phone"
            :href="whatsappLink(selectedReservation.product.entrepreneur.user.phone)"
            class="btn btn-sm btn-outline-success mt-2"
            target="_blank"
          >
            <i class="bi bi-whatsapp me-1"></i> Contactar por WhatsApp
          </a>
        </div>

        <!-- Método de pago -->
        <div class="mb-3">
          <label class="form-label">Método de Pago *</label>
          <select v-model="form.payment_method" class="form-select" required>
            <option disabled value="">Selecciona método</option>
            <option value="efectivo">Efectivo</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="transferencia">Transferencia</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <!-- Código de operación -->
        <div class="mb-3">
          <label class="form-label">Código de Operación (si aplica)</label>
          <input type="text" v-model="form.operation_code" class="form-control" />
        </div>

        <!-- Nota opcional -->
        <div class="mb-3">
          <label class="form-label">Nota (opcional)</label>
          <textarea v-model="form.note" class="form-control" rows="2"></textarea>
        </div>

        <!-- Campo para cargar la imagen -->
        <div class="mb-3">
          <label class="form-label">Imagen del Pago (opcional)</label>
          <input type="file" @change="handleImageUpload" class="form-control" />
        </div>

        <!-- Botón -->
        <div class="d-grid">
          <button class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Registrar Pago
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  name: 'PaymentCreate',
  data() {
    return {
      loading: false,
      reservations: [],
      form: {
        reservation_id: '',
        payment_method: '',
        operation_code: '',
        note: '',
        image_file: null,
      }
    };
  },
  computed: {
    selectedReservation() {
      return this.reservations.find(r => r.id === this.form.reservation_id);
    }
  },
  async mounted() {
    try {
      const res = await api.get('/reservations');
      this.reservations = res.data || [];
    } catch (err) {
      console.error('Error cargando reservas:', err);
    }
  },
  methods: {
    handleImageUpload(event) {
      this.form.image_file = event.target.files[0];
    },
    async submit() {
      if (!this.form.reservation_id || !this.form.payment_method) {
        alert('Completa los campos obligatorios.');
        return;
      }

      if (!confirm('¿Registrar este pago presencial?')) return;

      this.loading = true;
      try {
        const formData = new FormData();
        for (const key in this.form) {
          formData.append(key, this.form[key]);
        }

        await api.post('/payments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('✅ Pago registrado correctamente.');
        this.$emit('refresh');
        this.resetForm();
      } catch (e) {
        alert('❌ Error al registrar el pago.');
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        reservation_id: '',
        payment_method: '',
        operation_code: '',
        note: '',
        image_file: null,
      };
    },
    whatsappLink(phone) {
      const message = `Hola, deseo consultar el pago de la reserva #${this.form.reservation_id}`;
      return `https://wa.me/51${phone}?text=${encodeURIComponent(message)}`;
    },
    isNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
  }
};
</script>