<template>
  <div class="page-editor">
    <!-- Encabezado -->
    <div class="section-header">
      <div>
        <h1 class="section-title">
          <i class="bi bi-tools"></i> Editar Página Principal
        </h1>
        <p class="section-subtitle">Configura el contenido y diseño de tu página de inicio</p>
      </div>
      <router-link
        to="/admin/home-dashboard"
        class="action-button"
      >
        <i class="bi bi-arrow-left"></i> Volver al Panel
      </router-link>
    </div>


    <!-- Controles principales -->
    <div class="editor-controls">
      <button
        type="button"
        @click="resetForm"
        class="action-button primary-button"
      >
        <i class="bi bi-plus-circle"></i> Nueva Configuración
      </button>
    </div>


    <!-- Lista de configuraciones -->
    <div class="configurations-section">
      <h2 class="section-subtitle">
        <i class="bi bi-list-task"></i> Configuraciones Guardadas
      </h2>
     
      <div v-if="configs.length" class="configurations-list">
        <div
          v-for="cfg in configs"
          :key="cfg.id"
          class="configuration-card"
          :class="{ 'active-config': cfg.active }"
        >
          <div class="config-info">
            <h3 class="config-title">{{ cfg.title_text }}</h3>
            <p class="config-meta">Creado: {{ formatDate(cfg.created_at) }}</p>
            <span class="status-badge" v-if="cfg.active">ACTIVA</span>
          </div>
          <div class="config-actions">
            <button @click="edit(cfg)" class="icon-button edit-button" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button
              v-if="!cfg.active"
              @click="setActive(cfg.id)"
              class="icon-button activate-button"
              title="Activar"
            >
              <i class="bi bi-check-circle"></i>
            </button>
            <button @click="showDeleteConfirmation(cfg.id)" class="icon-button delete-button" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>


      <div v-else class="empty-state">
        <i class="bi bi-list-task"></i>
        <h3>No hay configuraciones guardadas</h3>
        <p>Crea tu primera configuración</p>
      </div>
    </div>


    <!-- Formulario de edición -->
    <div class="editor-form">
      <h2 class="section-subtitle">
        <i class="bi bi-pencil-square"></i>
        {{ isEditMode ? 'Editar Configuración' : 'Crear Nueva Configuración' }}
      </h2>
     
      <form @submit.prevent="isEditMode ? updateHome() : createHome()">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Título Principal</label>
            <input
              v-model="form.title_text"
              type="text"
              class="form-input"
              placeholder="Título de la página"
            />
          </div>
         
          <div class="form-group">
            <label class="form-label">Color del Título</label>
            <div class="color-input-container">
              <input
                v-model="form.title_color"
                type="color"
                class="color-input"
              />
              <span class="color-value">{{ form.title_color }}</span>
            </div>
          </div>
         
          <div class="form-group">
            <label class="form-label">Tamaño del Título</label>
            <input
              v-model="form.title_size"
              type="text"
              class="form-input"
              placeholder="ej: 3rem"
            />
          </div>
         
          <div class="form-group full-width">
            <label class="form-label">Descripción</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-textarea"
              placeholder="Descripción del contenido principal"
            ></textarea>
          </div>
         
          <div class="form-group">
            <label class="form-label">Color de Fondo</label>
            <div class="color-input-container">
              <input
                v-model="form.background_color"
                type="color"
                class="color-input"
              />
              <span class="color-value">{{ form.background_color }}</span>
            </div>
          </div>
         
          <div class="form-group full-width">
            <label class="form-label">Imágenes Destacadas</label>
            <div class="file-input-container">
              <label class="file-input-label">
                <i class="bi bi-images"></i>
                <span>{{ form.image.length ? `${form.image.length} archivos seleccionados` : 'Seleccionar imágenes' }}</span>
                <input
                  type="file"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="file-input"
                  multiple
                />
              </label>
            </div>
          </div>
        </div>


        <!-- Vista previa de imágenes -->
        <div v-if="allImages.length" class="image-preview-section">
          <div class="image-preview-container">
            <img :src="currentImage" class="preview-image" />
            <div class="image-controls">
              <button
                type="button"
                @click="prevImage"
                class="icon-button nav-button"
                :disabled="allImages.length <= 1"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
              <span class="image-counter">{{ currentIndex + 1 }} / {{ allImages.length }}</span>
              <button
                type="button"
                @click="nextImage"
                class="icon-button nav-button"
                :disabled="allImages.length <= 1"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
         
          <button
            type="button"
            @click="removeAllImages"
            class="action-button danger-button"
          >
            <i class="bi bi-trash"></i> Eliminar Todas
          </button>
        </div>


        <div class="form-actions">
          <button
            type="submit"
            class="action-button success-button"
          >
            <i class="bi bi-save"></i> {{ isEditMode ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>


    <!-- Modal de confirmación -->
    <transition name="modal">
      <div v-if="deleteModalVisible" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirmar eliminación</h3>
            <button @click="deleteModalVisible = false" class="modal-close">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de eliminar esta configuración?</p>
          </div>
          <div class="modal-footer">
            <button @click="deleteModalVisible = false" class="action-button">
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              class="action-button danger-button"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/services/axios'


const form = ref({
  id: null,
  title_text: '',
  title_color: '#1f2937',
  title_size: '3rem',
  description: '',
  background_color: '#ffffff',
  image: [],
  image_urls: []
})


const isEditMode = ref(false)
const configs = ref([])
const deleteModalVisible = ref(false)
const configToDelete = ref(null)
const currentIndex = ref(0)


const allImages = computed(() => [
  ...(form.value.image_urls || []),
  ...form.value.image.map(file => URL.createObjectURL(file))
])


const currentImage = computed(() => allImages.value[currentIndex.value] || '')


let interval = null
const startCarousel = () => {
  clearInterval(interval)
  if (allImages.value.length <= 1) return
  interval = setInterval(() => {
    nextImage()
  }, 5000)
}


watch(allImages, () => {
  currentIndex.value = 0
  startCarousel()
})


onMounted(() => {
  fetchHomeData()
  fetchAllConfigs()
})


const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}


const fetchHomeData = async () => {
  try {
    const { data } = await api.get('/home')
    form.value = {
      ...form.value,
      ...data,
      id: data.id,
      image_urls: data.image_urls || [],
      image: []
    }
    isEditMode.value = true
    currentIndex.value = 0
  } catch (error) {
    isEditMode.value = false
    console.warn('No hay configuración activa o error al cargar:', error)
  }
}


const fetchAllConfigs = async () => {
  try {
    const { data } = await api.get('/home/all')
    configs.value = data
  } catch (e) {
    console.error('Error al cargar configuraciones:', e)
  }
}


const setActive = async (id) => {
  try {
    await api.post(`/home/${id}/activate`)
    await fetchAllConfigs()
    await fetchHomeData()
    alert('Configuración activada.')
  } catch (e) {
    alert('No se pudo activar.')
  }
}


const edit = (cfg) => {
  form.value = {
    id: cfg.id,
    title_text: cfg.title_text,
    title_color: cfg.title_color,
    title_size: cfg.title_size,
    description: cfg.description,
    background_color: cfg.background_color,
    image_urls: cfg.image_urls || [],
    image: []
  }
  isEditMode.value = true
  currentIndex.value = 0
}


const resetForm = () => {
  form.value = {
    id: null,
    title_text: '',
    title_color: '#1f2937',
    title_size: '3rem',
    description: '',
    background_color: '#ffffff',
    image: [],
    image_urls: []
  }
  isEditMode.value = false
  currentIndex.value = 0
}


const handleFileUpload = (e) => {
  form.value.image = Array.from(e.target.files)
  form.value.image_urls = []
  currentIndex.value = 0
}


const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + allImages.value.length) % allImages.value.length
}


const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % allImages.value.length
}


const removeAllImages = async () => {
  try {
    await api.post('/home/remove-image')
    form.value.image = []
    form.value.image_urls = []
    alert('Imágenes eliminadas.')
  } catch (e) {
    alert('No se pudieron eliminar las imágenes.')
  }
}


const updateHome = async () => {
  const fd = new FormData()
  fd.append('title_text', form.value.title_text)
  fd.append('title_color', form.value.title_color)
  fd.append('title_size', form.value.title_size)
  fd.append('description', form.value.description)
  fd.append('background_color', form.value.background_color)
  form.value.image.forEach(file => fd.append('image[]', file))


  try {
    await api.post(`/home/${form.value.id}?_method=PUT`, fd)
    alert('Configuración actualizada.')
    await fetchAllConfigs()
    await fetchHomeData()
  } catch (e) {
    alert('Error al actualizar.')
  }
}


const createHome = async () => {
  const fd = new FormData()
  fd.append('title_text', form.value.title_text)
  fd.append('title_color', form.value.title_color)
  fd.append('title_size', form.value.title_size)
  fd.append('description', form.value.description)
  fd.append('background_color', form.value.background_color)
  form.value.image.forEach(file => fd.append('image[]', file))


  try {
    await api.post('/home', fd)
    alert('Configuración creada.')
    await fetchAllConfigs()
    resetForm()
  } catch (e) {
    alert('Error al crear.')
  }
}


const showDeleteConfirmation = (id) => {
  configToDelete.value = id
  deleteModalVisible.value = true
}


const confirmDelete = async () => {
  if (!configToDelete.value) return


  try {
    await api.delete(`/home/${configToDelete.value}`)
    alert('Configuración eliminada.')
    await fetchAllConfigs()
    await fetchHomeData()
  } catch (e) {
    alert('Error al eliminar.')
  } finally {
    deleteModalVisible.value = false
    configToDelete.value = null
  }
}
</script>


<style scoped>
/* Estructura principal */
.page-editor {
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
  flex-wrap: wrap;
  gap: 1rem;
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


.editor-controls {
  margin-bottom: 2rem;
}


/* Lista de configuraciones */
.configurations-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}


.configurations-list {
  display: grid;
  gap: 1rem;
}


.configuration-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}


.configuration-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}


.active-config {
  border-left: 4px solid #10b981;
}


.config-info {
  flex: 1;
}


.config-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}


.config-meta {
  font-size: 0.75rem;
  color: #64748b;
}


.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: #10b981;
  color: white;
  margin-top: 0.5rem;
}


.config-actions {
  display: flex;
  gap: 0.5rem;
}


/* Formulario de edición */
.editor-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
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


.form-group.full-width {
  grid-column: span 2;
}


.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}


.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}


.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}


.form-textarea {
  min-height: 120px;
  resize: vertical;
}


.color-input-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}


.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}


.color-value {
  font-size: 0.875rem;
  color: #64748b;
}


.file-input-container {
  margin-bottom: 1rem;
}


.file-input-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}


.file-input-label:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}


.file-input {
  display: none;
}


/* Vista previa de imágenes */
.image-preview-section {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
}


.image-preview-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}


.preview-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
}


.image-controls {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
}


.image-counter {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}


.nav-button {
  color: white;
  background: transparent;
  border: none;
  padding: 0;
}


.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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


.activate-button:hover {
  color: #10b981;
}


.delete-button:hover {
  color: #ef4444;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}


/* Estado vacío */
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
}


.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #94a3b8;
}


.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}


.empty-state p {
  font-size: 0.875rem;
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
  }
 
  .form-grid {
    grid-template-columns: 1fr;
  }
 
  .form-group.full-width {
    grid-column: span 1;
  }
 
  .configuration-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
 
  .config-actions {
    align-self: flex-end;
  }
}


@media (max-width: 576px) {
  .page-editor {
    padding: 1rem;
  }
 
  .modal-footer {
    flex-direction: column;
  }
 
  .action-button {
    width: 100%;
  }
}
</style>

