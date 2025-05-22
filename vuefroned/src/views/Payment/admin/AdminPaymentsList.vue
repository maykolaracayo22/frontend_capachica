<template>
  <div class="container mt-4">
    <h2 class="mb-4">🧾 Todos los Pagos</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else>
      <PaymentCreate @refresh="reload" />

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cliente</th>
              <th>Emprendedor</th>
              <th>Método</th>
              <th>Código Op.</th>
              <th>Estado</th>
              <th>Imagen</th>
              <th>PDF</th>
              <th>Nota</th>
              <th>Confirmado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in payments" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.reservation?.product?.name || '—' }}</td>
              <td>{{ p.reservation?.user?.name || '—' }}</td>
              <td>{{ p.reservation?.product?.entrepreneur?.business_name || '—' }}</td>
              <td>{{ formatMethod(p.payment_method) }}</td>
              <td>{{ p.operation_code || '—' }}</td>
              <td>
                <span :class="statusClass(p.status)">
                  {{ p.status }}
                </span>
              </td>
              <td>
                <a v-if="p.image_url" :href="p.image_url" target="_blank">Ver</a>
              </td>
              <td>
                <a v-if="p.receipt_url" :href="p.receipt_url" target="_blank">PDF</a>
              </td>
              <td>{{ p.note || '—' }}</td>
              <td>
                <span v-if="p.is_confirmed" class="text-success">
                  ✅ {{ formatDate(p.confirmation_time) }}
                  <br />
                  <small v-if="p.confirmer">por {{ p.confirmer.name }}</small>
                </span>
                <span v-else class="text-danger">❌</span>
              </td>
              <td>
                <button
                  v-if="p.status === 'enviado'"
                  class="btn btn-sm btn-success me-1"
                  @click="confirm(p.id)"
                >
                  Confirmar
                </button>
                <button
                  v-if="p.status === 'enviado'"
                  class="btn btn-sm btn-outline-danger"
                  @click="reject(p.id)"
                >
                  Rechazar
                </button>
              </td>
            </tr>
            <tr v-if="payments.length === 0">
              <td colspan="12" class="text-center text-muted">No hay pagos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import paymentService from '@/services/payment';
import PaymentCreate from './PaymentCreate.vue';


export default {
  name: 'AdminPaymentsList',
  data() {
    return {
      payments: [],
      loading: true
    };
  },
  async created() {
    try {
      const res = await paymentService.getAll();
      this.payments = res.data;
    } catch (e) {
      console.error('Error al cargar pagos:', e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async confirm(id) {
      if (!confirm('¿Confirmar este pago?')) return;
      await paymentService.confirm(id);
      await this.reload();
    },
    async reject(id) {
      if (!confirm('¿Rechazar este pago?')) return;
      await paymentService.reject(id);
      await this.reload();
    },
    async reload() {
      this.loading = true;
      const res = await paymentService.getAll();
      this.payments = res.data;
      this.loading = false;
    },
    formatDate(dt) {
      return dt ? new Date(dt).toLocaleString('es-PE') : '—';
    },
    formatMethod(method) {
      const map = {
        efectivo: 'Efectivo',
        yape: 'Yape',
        plin: 'Plin',
        transferencia: 'Transferencia',
        tarjeta: 'Tarjeta',
      };
      return map[method] || (method ? method : '—');
    },
    statusClass(status) {
      return {
        'badge bg-warning': status === 'pendiente',
        'badge bg-info': status === 'enviado',
        'badge bg-success': status === 'confirmado',
        'badge bg-danger': status === 'rechazado'
      };
    }
  }
};
</script>

<style scoped>
.badge {
  padding: 0.4em 0.75em;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  text-transform: capitalize;
}
</style>
