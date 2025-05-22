<template>
  <div class="tours-container">
    <!-- Header con estilo moderno -->
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">
          <i class="bi bi-compass"></i> Gestión de Tours
        </h1>
        <p class="page-subtitle">Administra los paquetes turísticos de tu organización</p>
      </div>
      <div v-if="canManage" class="actions-section">
        <button 
          @click="toggleForm"
          class="toggle-form-btn"
          :class="{ active: showForm }"
        >
          {{ showForm ? 'Cancelar' : 'Nuevo Tour' }}
        </button>
      </div>
    </div>

    <!-- Formulario con diseño moderno -->
    <transition name="fade-slide">
      <div v-if="showForm && canManage" class="form-container">
        <h2 class="form-title">
          <i class="bi bi-plus-circle"></i> {{ editingTour ? 'Editar Tour' : 'Crear Nuevo Tour' }}
        </h2>
        <form @submit.prevent="submitTour" class="tour-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="input-label">Nombre del Tour</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="modern-input"
                placeholder="Ej: Tour a las Islas Flotantes"
              >
            </div>

            <div class="form-group">
              <label class="input-label">Precio (S/)</label>
              <div class="price-input-container">
                <span class="currency">S/</span>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="modern-input price-input"
                  placeholder="0.00"
                >
              </div>
            </div>

            <div class="form-group full-width">
              <label class="input-label">Descripción</label>
              <textarea
                v-model="form.description"
                required
                class="modern-textarea"
                rows="4"
                placeholder="Describe las actividades y experiencias incluidas..."
              ></textarea>
            </div>

            <div class="form-group full-width">
              <label class="input-label">Imagen del Tour (URL)</label>
              <input
                v-model="form.image"
                type="text"
                class="modern-input"
                placeholder="https://ejemplo.com/imagen-tour.jpg"
              >
              <div v-if="form.image" class="image-preview">
                <img :src="form.image" alt="Vista previa" class="preview-image">
                <span class="preview-text">Vista previa</span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">
                <i class="bi bi-check-circle"></i> {{ editingTour ? 'Actualizar' : 'Guardar' }}
              </span>
              <span v-else class="loading-text">
                <i class="bi bi-arrow-repeat"></i> Procesando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Listado de tours con diseño moderno -->
    <div class="tours-list-container">
      <div class="list-header">
        <h2 class="list-title">
          <i class="bi bi-list-ul"></i> Tours Disponibles
        </h2>
        <div class="search-container">
          <i class="bi bi-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar tours..."
          >
          <button @click="fetchTours" class="refresh-btn" title="Actualizar lista">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="modern-table">
          <thead>
            <tr>
              <th class="table-header" @click="sortTours('name')">
                <span>Nombre</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th class="table-header">Descripción</th>
              <th class="table-header" @click="sortTours('price')">
                <span>Precio</span>
                <i class="bi bi-arrow-down-up sort-icon"></i>
              </th>
              <th v-if="canManage" class="table-header actions-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="tour in filteredTours" 
              :key="tour.id" 
              class="table-row"
            >
              <td class="table-data name-cell">
                <div class="tour-info">
                  <div v-if="tour.image" class="tour-image-container">
                    <img :src="tour.image" alt="Tour" class="tour-image">
                  </div>
                  <div class="tour-name">{{ tour.name }}</div>
                </div>
              </td>
              <td class="table-data description-cell">
                {{ truncateDescription(tour.description) }}
              </td>
              <td class="table-data price-cell">
                S/ {{ formatPrice(tour.price) }}
              </td>
              <td v-if="canManage" class="table-data actions-cell">
                <div class="action-buttons">
                  <button 
                    @click="editTour(tour)" 
                    class="action-btn edit-btn"
                    title="Editar tour"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    @click="confirmDelete(tour.id)" 
                    class="action-btn delete-btn"
                    title="Eliminar tour"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredTours.length === 0">
              <td :colspan="canManage ? 4 : 3" class="empty-message">
                <i class="bi bi-exclamation-circle"></i> No se encontraron tours
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import api from '@/services/axios'

const store = useStore()

// Estado
const tours = ref([])
const form = ref({
  name: '',
  description: '',
  price: 0,
  image: ''
})
const showForm = ref(false)
const searchQuery = ref('')
const isSubmitting = ref(false)
const editingTour = ref(null)
const sortField = ref('name')
const sortDirection = ref('asc')

// Computed
const userRole = computed(() => store.getters.userRole)
const canManage = computed(() => ['emprendedor', 'super-admin'].includes(userRole.value))

const filteredTours = computed(() => {
  let result = tours.value.filter(tour => 
    tour.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  // Ordenamiento
  result.sort((a, b) => {
    let modifier = 1
    if (sortDirection.value === 'desc') modifier = -1

    if (a[sortField.value] < b[sortField.value]) return -1 * modifier
    if (a[sortField.value] > b[sortField.value]) return 1 * modifier
    return 0
  })

  return result
})

// Métodos
const fetchTours = async () => {
  try {
    const { data } = await api.get('/tours')
    tours.value = data
  } catch (e) {
    console.error('Error al obtener tours', e)
  }
}

const submitTour = async () => {
  isSubmitting.value = true
  try {
    if (editingTour.value) {
      await api.put(`/tours/${editingTour.value}`, form.value, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
    } else {
      await api.post('/tours', form.value, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
    }
    
    resetForm()
    fetchTours()
  } catch (e) {
    console.error('Error al guardar tour', e)
  } finally {
    isSubmitting.value = false
  }
}

const editTour = (tour) => {
  editingTour.value = tour.id
  form.value = {
    name: tour.name,
    description: tour.description,
    price: tour.price,
    image: tour.image || ''
  }
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDelete = (id) => {
  if (confirm('¿Estás seguro de eliminar este tour? Esta acción no se puede deshacer.')) {
    deleteTour(id)
  }
}

const deleteTour = async (id) => {
  try {
    await api.delete(`/tours/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })
    fetchTours()
  } catch (e) {
    console.error('Error al eliminar tour', e)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    image: ''
  }
  editingTour.value = null
  showForm.value = false
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  }
}

const sortTours = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const truncateDescription = (text) => {
  return text.length > 100 ? text.substring(0, 100) + '...' : text
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// Ciclo de vida
onMounted(fetchTours)
</script>

<style scoped>
/* Variables de diseño moderno */


/* Estilos base */
.tours-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  margin-top: 100px;
}

/* Header moderno */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.page-title i {
  color: black;
}

.page-subtitle {
  color: var(--text-light);
  font-size: 1rem;
  font-weight: 400;
}

.actions-section {
  display: flex;
  gap: 1rem;
}

.toggle-form-btn {
  background-color: rgba(197, 190, 162, 0.407);
  color: rgb(60, 15, 15);
  font-weight: 600; /* Texto más grueso */
  border: none;
  border-radius: var(--radius);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow);
}

.toggle-form-btn:hover {
  background-color: rgba(43, 45, 11, 0.204);
  border-color: var(--primary-hover);
  transform: translateY(-2px); /* Efecto más pronunciado */
  box-shadow: var(--shadow-md);
}

.toggle-form-btn.active {
  background-color: rgba(197, 190, 162, 0.222);
}

/* Animaciones */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Formulario moderno */
.form-container {
  background-color: rgba(197, 190, 162, 0.222);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.form-title i {
  color: var(--primary);
}

.tour-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.input-label {
  display: block;
  font-weight: 500;
  color: var(--text-medium);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.modern-input,
.modern-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  transition: var(--transition);
  background-color: rgb(250, 250, 250);
}

.modern-input:focus,
.modern-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.modern-textarea {
  min-height: 120px;
  resize: vertical;
}

.price-input-container {
  position: relative;
}

.price-input {
  padding-left: 2.5rem;
}

.currency {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  font-weight: 500;
}

.image-preview {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-image {
  max-width: 200px;
  max-height: 120px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.preview-text {
  font-size: 0.85rem;
  color: var(--text-light);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-btn {
  background-color: #5dc7b9;
  color: rgb(175, 21, 21);
  font-weight: 500;
  border: none;
  border-radius: var(--radius);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow);
}

.submit-btn:hover:not(:disabled) {
  background-color: #0d9488;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-text i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Listado de tours moderno */
.tours-list-container {
  background-color: var(--bg-black);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.list-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.list-title i {
  color: var(--primary);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-light);
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  min-width: 250px;
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: var(--bg-light);
  color: var(--text-medium);
  cursor: pointer;
  transition: var(--transition);
}

.refresh-btn:hover {
  background-color: var(--border-color);
  color: var(--primary);
  transform: rotate(90deg);
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.table-header {
  background-color: rgba(160, 131, 95, 0.501);
  color: var(--text-medium);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
}

.table-header:hover {
  background-color: #35681b51;
}

.table-header span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  font-size: 0.8rem;
  opacity: 0.5;
  transition: var(--transition);
}

.table-header:hover .sort-icon {
  opacity: 1;
}

.actions-header {
  width: 120px;
}

.table-row {
  border-bottom: 1px solid var(black);
  transition: var(--transition);
  background-color: rgba(219, 219, 219, 0.562);


}

.table-row:hover {
  background-color: rgba(173, 184, 194, 0.562);
}

.table-data {
  padding: 1rem;
  vertical-align: middle;
}

.name-cell {
  font-weight: 500;
}

.tour-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tour-image-container {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tour-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.description-cell {
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.5;
}

.price-cell {
  font-weight: 600;
  color: var(--primary-dark);
}

.actions-cell {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  color: rgb(118, 114, 114);
}

.edit-btn {
  background-color: var(--info);
}

.edit-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.delete-btn {
  background-color: var(--danger);
}

.delete-btn:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.empty-message i {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .tours-container {
    padding: 1.5rem;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-container {
    width: 100%;
  }
  
  .search-input {
    flex: 1;
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .tours-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .form-container,
  .tours-list-container {
    padding: 1.5rem;
  }
  
  .table-data {
    padding: 0.75rem;
  }
}
</style>