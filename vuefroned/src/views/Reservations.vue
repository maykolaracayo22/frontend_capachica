<template>
  <div class="reservations-container">
    <!-- Header con título y acciones -->
    <div class="section-header">
      <h1 class="section-title">Gestión de Reservas</h1>
      <button 
        v-if="canManage"
        @click="showForm = !showForm"
        class="action-button primary-button"
      >
        <i class="bi bi-plus-circle"></i>
        {{ showForm ? 'Cancelar' : 'Nueva Reserva' }}
      </button>
    </div>

    <!-- Formulario desplegable -->
    <transition name="slide-fade">
      <div v-if="showForm && canManage" class="form-container">
        <h2 class="form-title">Registrar nueva Reserva</h2>
        <form @submit.prevent="createReservation" class="reservation-form">
          <div class="form-group">
            <label class="form-label">Producto</label>
            <select 
              v-model="form.product_id" 
              required 
              class="form-input"
            >
              <option disabled value="">Selecciona un producto</option>
              <option 
                v-for="p in products" 
                :key="p.id" 
                :value="p.id"
              >
                {{ p.name || 'Producto sin nombre' }} - S/ {{ p.price || '0.00' }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cantidad</label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="1"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Fecha</label>
              <input
                v-model="form.reservation_date"
                type="date"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="action-button success-button"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Procesando...' : 'Guardar Reserva' }}
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Listado de reservas -->
    <div class="reservations-list">
      <div class="table-responsive">
        <table class="reservations-table">
          <thead>
  <tr>
    <th>Producto</th>
    <th>Cantidad</th>
    <th>Fecha</th>
    <th>Estado</th>
    <th>Acciones</th>
  </tr>
</thead>
<tbody>
  <tr v-for="res in reservations" :key="res.id">
    <td data-label="Producto">
  <div class="tour-info">
    <p class="tour-name">
      {{ res.product?.name || res.custom_package?.name || 'No disponible' }}
    </p>
    <p class="tour-price">
  S/ {{
    res.product?.price
      ? Number(res.product.price).toFixed(2)
      : res.custom_package?.total_amount
        ? Number(res.custom_package.total_amount).toFixed(2)
        : '0.00'
  }} c/u
</p>

  </div>
</td>

    <td data-label="Cantidad">{{ res.quantity }}</td>
    <td data-label="Fecha">{{ formatDate(res.reservation_date) }}</td>
    <td data-label="Estado">
      <span :class="['status-badge', getStatusClass(res.status)]">
        {{ res.status || 'Pendiente' }}
      </span>
    </td>
    <td data-label="Acciones">
      <div class="action-buttons">
        <button 
          @click="editReservation(res)"
          class="icon-button edit-button"
          title="Editar"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button 
          @click="confirmDelete(res)"
          class="icon-button delete-button"
          title="Eliminar"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </td>
  </tr>
</tbody>

        </table>
      </div>

      <div v-if="!loading && reservations.length === 0" class="empty-state">
        <i class="bi bi-calendar-x"></i>
        <h3>No hay reservas registradas</h3>
        <p v-if="canManage">Comienza creando tu primera reserva</p>
      </div>
    </div>

    <transition name="modal">
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirmar eliminación</h3>
            <button @click="showDeleteModal = false" class="modal-close">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de eliminar la reserva de 
              <strong>{{ reservationToDelete?.user?.name || 'Usuario desconocido' }}</strong>
              para el producto <strong>{{ reservationToDelete?.product?.name || 'Producto desconocido' }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="action-button">
              Cancelar
            </button>
            <button 
              @click="deleteReservation"
              class="action-button danger-button"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

// Estados
const products = ref([])
const reservations = ref([])
const loading = ref(false)
const showForm = ref(false)
const showDeleteModal = ref(false)
const reservationToDelete = ref(null)
const editingId = ref(null)

const form = ref({
  product_id: '',
  quantity: 1,
  reservation_date: ''
})

// Obtener productos
const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products')
    products.value = data
  } catch (error) {
    console.error('Error al obtener productos:', error)
  }
}

// Obtener solo reservas del cliente autenticado
const fetchReservations = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/my-reservations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })
    reservations.value = data
  } catch (error) {
    console.error('Error al obtener reservas:', error)
  } finally {
    loading.value = false
  }
}

// Crear o actualizar reserva
const createReservation = async () => {
  try {
    loading.value = true
    const url = editingId.value ? `/reservations/${editingId.value}` : '/reservations'
    const method = editingId.value ? 'put' : 'post'
    
    await api[method](url, form.value, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })

    resetForm()
    fetchReservations()
  } catch (error) {
    console.error('Error al guardar reserva:', error.response?.data || error)
  } finally {
    loading.value = false
  }
}

// Editar reserva
const editReservation = (reservation) => {
  editingId.value = reservation.id
  form.value = {
    product_id: reservation.product.id,
    quantity: reservation.quantity,
    reservation_date: reservation.reservation_date.split('T')[0]
  }
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Confirmar eliminación
const confirmDelete = (reservation) => {
  reservationToDelete.value = reservation
  showDeleteModal.value = true
}

// Eliminar reserva
const deleteReservation = async () => {
  try {
    loading.value = true
    await api.delete(`/reservations/${reservationToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })

    showDeleteModal.value = false
    fetchReservations()
  } catch (error) {
    console.error('Error al eliminar reserva:', error)
  } finally {
    loading.value = false
  }
}

// Resetear formulario
const resetForm = () => {
  form.value = { product_id: '', quantity: 1, reservation_date: '' }
  editingId.value = null
  showForm.value = false
}

// Utilidades
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getUserInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(part => part[0]).join('').toUpperCase()
}

const getStatusClass = (status) => {
  switch(status?.toLowerCase()) {
    case 'confirmado':
      return 'confirmed-badge'
    case 'cancelado':
      return 'cancelled-badge'
    case 'pendiente':
    default:
      return 'pending-badge'
  }
}

// Ciclo de vida
onMounted(() => {
  fetchProducts()
  fetchReservations()
})
</script>


<style scoped>
/* Estructura principal */
.reservations-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  margin-top: 100px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

/* Formulario */
.form-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.reservation-form {
  display: grid;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Tabla de reservas */
.reservations-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-responsive {
  overflow-x: auto;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
}

.reservations-table th,
.reservations-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.reservations-table th {
  background-color: #e2e8f0;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.reservations-table tr:hover {
  background-color: rgba(79, 70, 229, 0.03);
}

/* Celdas especiales */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
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

.user-name {
  font-weight: 500;
  color: #1e293b;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
}

.tour-info {
  line-height: 1.4;
}

.tour-name {
  font-weight: 500;
  color: #1e293b;
}

.tour-price {
  font-size: 0.75rem;
  color: #64748b;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.confirmed-badge {
  background-color: #ecfdf5;
  color: #065f46;
}

.pending-badge {
  background-color: #fef3c7;
  color: #92400e;
}

.cancelled-badge {
  background-color: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
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

.primary-button {
  background-color: #4f46e5;
  color: white;
}

.primary-button:hover {
  background-color: #4338ca;
}

.success-button {
  background-color: #10b981;
  color: white;
}

.success-button:hover {
  background-color: #0a936a;
}

.danger-button {
  background-color: #ef4444;
  color: white;
}

.danger-button:hover {
  background-color: #dc2626;
}

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  color: #64748b;
  background: transparent;
}

.icon-button:hover {
  background-color: #e2e8f0;
}

.edit-button:hover {
  color: #3b82f6;
}

.delete-button:hover {
  color: #ef4444;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estado vacío */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  margin: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #1e293b;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Transiciones */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .reservations-table th,
  .reservations-table td {
    padding: 0.75rem;
  }
  
  .reservations-table td {
    display: block;
    text-align: right;
    padding-left: 50%;
    position: relative;
  }
  
  .reservations-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 1rem;
    width: calc(50% - 1rem);
    padding-right: 1rem;
    text-align: left;
    font-weight: 600;
    color: #1e293b;
  }
  
  .reservations-table tr {
    display: block;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .reservations-table thead {
    display: none;
  }
}

@media (max-width: 576px) {
  .reservations-container {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>