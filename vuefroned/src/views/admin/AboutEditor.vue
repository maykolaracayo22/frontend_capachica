<template>
  <div class="about-management">
    <!-- Header Section -->
    <div class="section-header">
      <div>
        <h1 class="section-title">
          <i class="bi bi-people-fill"></i> Administrar "Sobre Nosotros"
        </h1>
        <p class="section-subtitle">Gestiona las secciones de tu página "Sobre Nosotros"</p>
      </div>
      <router-link
        to="/admin/home-dashboard"
        class="action-button"
      >
        <i class="bi bi-arrow-left"></i> Volver al Panel
      </router-link>
    </div>

    <!-- Active Section Toggle -->
    <div class="admin-section">
      <h2 class="section-subtitle">
        <i class="bi bi-eye-fill"></i> Sección Activa Actual
      </h2>
      <ul class="selection-list">
        <li
          v-for="item in aboutSections"
          :key="`active-${item.id}`"
          class="selection-item"
        >
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              :id="`section-${item.id}`"
              name="activeAbout"
              :value="item.id"
              :checked="item.active"
              @change="setActiveSection(item.id)"
              :disabled="isToggling"
            />
            <label 
              class="form-check-label"
              :for="`section-${item.id}`"
            >
              {{ item.title || '(sin título)' }}
            </label>
          </div>
        </li>
      </ul>
    </div>

    <!-- Sections List -->
    <div class="admin-section">
      <h2 class="section-subtitle">
        <i class="bi bi-collection"></i> Todas las Secciones
      </h2>
      
      <div class="sections-grid">
        <div
          v-for="item in aboutSections"
          :key="`list-${item.id}`"
          class="section-card"
        >
          <div class="card-header">
            <h3>{{ item.title || '(sin título)' }}</h3>
            <small>Última actualización: {{ formatDate(item.updated_at) }}</small>
          </div>
          
          <div class="card-content">
            <p class="content-preview">{{ truncateContent(item.content) }}</p>
          </div>
          
          <div class="card-actions">
            <button
              @click="editSection(item)"
              class="icon-button edit-button"
              title="Editar"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              @click="showDeleteModal(item.id)"
              class="icon-button delete-button"
              title="Eliminar"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="aboutSections.length === 0" class="empty-state">
        <i class="bi bi-info-circle"></i>
        <h3>No hay secciones creadas</h3>
        <p>Comienza creando tu primera sección</p>
      </div>
    </div>

    <!-- Form Section -->
    <div class="form-section" :class="{ 'form-visible': showForm }">
      <div class="form-header">
        <h2 class="section-subtitle">
          <i class="bi" :class="isEditing ? 'bi-pencil' : 'bi-plus-circle'"></i>
          {{ isEditing ? 'Editar Sección' : 'Nueva Sección' }}
        </h2>
        <button 
          @click="toggleForm"
          class="icon-button close-button"
          title="Cerrar"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="about-form">
        <div class="form-group">
          <label class="form-label">Título *</label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input"
            required
            placeholder="Título de la sección"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contenido *</label>
          <textarea
            v-model="formData.content"
            rows="6"
            class="form-input"
            required
            placeholder="Contenido descriptivo..."
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Imagen (opcional)</label>
          <div class="file-input-container">
            <label class="file-input-label">
              <i class="bi bi-upload"></i>
              <span>{{ formData.image ? formData.image.name : 'Seleccionar imagen' }}</span>
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="file-input"
              />
            </label>
          </div>
        </div>

        <div v-if="imagePreview" class="image-preview-container">
          <img :src="imagePreview" class="image-preview" alt="Vista previa de imagen" />
          <button
            type="button"
            @click="removeImage"
            class="btn-remove-image"
            title="Eliminar imagen"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="action-button primary-button"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="spinner"></span>
            {{ isSaving ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar' : 'Guardar') }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="action-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Floating Action Button -->
    <button 
      @click="toggleForm"
      class="fab"
      :class="{ 'fab-hidden': showForm }"
      title="Agregar nueva sección"
    >
      <i class="bi bi-plus"></i>
    </button>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirmar eliminación</h3>
          <button @click="showDeleteConfirmation = false" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de eliminar esta sección permanentemente?</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteConfirmation = false" class="action-button">
            Cancelar
          </button>
          <button 
            @click="confirmDelete"
            class="action-button danger-button"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="spinner"></span>
            {{ isSaving ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/axios'

// State
const aboutSections = ref([])
const showForm = ref(false)
const showDeleteConfirmation = ref(false)
const sectionToDelete = ref(null)
const isSaving = ref(false)
const isToggling = ref(false)

const formData = ref({
  id: null,
  title: '',
  content: '',
  image: null,
  remove_image: false
})

// Computed
const imagePreview = computed(() => {
  if (formData.value.image) return URL.createObjectURL(formData.value.image)
  return null
})

const isEditing = computed(() => !!formData.value.id)

// Methods
const fetchSections = async () => {
  try {
    const { data } = await api.get('/abouts')
    aboutSections.value = data
  } catch (error) {
    console.error('Error fetching sections:', error)
    alert('Error al cargar las secciones')
  }
}

const setActiveSection = async (id) => {
  isToggling.value = true
  try {
    await api.post(`/abouts/${id}/activate`)
    await fetchSections()
    alert('Sección activada correctamente')
  } catch (error) {
    console.error('Error activating section:', error)
    alert('Error al activar la sección')
  } finally {
    isToggling.value = false
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const editSection = (section) => {
  formData.value = {
    id: section.id,
    title: section.title,
    content: section.content,
    image: null,
    remove_image: false
  }
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showDeleteModal = (id) => {
  sectionToDelete.value = id
  showDeleteConfirmation.value = true
}

const confirmDelete = async () => {
  if (!sectionToDelete.value) return

  isSaving.value = true
  try {
    await api.delete(`/abouts/${sectionToDelete.value}`)
    await fetchSections()
    alert('Sección eliminada correctamente')
  } catch (error) {
    console.error('Error deleting section:', error)
    alert('Error al eliminar la sección')
  } finally {
    isSaving.value = false
    showDeleteConfirmation.value = false
    sectionToDelete.value = null
  }
}

const handleFileChange = (e) => {
  formData.value.image = e.target.files[0]
  formData.value.remove_image = false
}

const removeImage = () => {
  formData.value.image = null
  formData.value.remove_image = true
}

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    content: '',
    image: null,
    remove_image: false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const truncateContent = (content) => {
  if (!content) return ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

const handleSubmit = async () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    alert('Título y contenido son requeridos')
    return
  }

  isSaving.value = true

  const formPayload = new FormData()
  formPayload.append('title', formData.value.title)
  formPayload.append('content', formData.value.content)

  if (formData.value.image) {
    formPayload.append('image', formData.value.image)
  } else if (formData.value.remove_image) {
    formPayload.append('remove_image', '1')
  }

  try {
    if (isEditing.value) {
      formPayload.append('_method', 'PUT')
      await api.post(`/abouts/${formData.value.id}`, formPayload)
      alert('Sección actualizada correctamente')
    } else {
      await api.post('/abouts', formPayload)
      alert('Sección creada correctamente')
    }
    
    resetForm()
    await fetchSections()
    showForm.value = false
  } catch (error) {
    console.error('Error saving section:', error)
    alert('Error al guardar la sección')
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchSections)
</script>

<style scoped>
/* Estilos principales */
.about-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
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
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Secciones */
.admin-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Lista de selección */
.selection-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.selection-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.selection-item:hover {
  background-color: #f8fafc;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-check-input {
  width: 1.25rem;
  height: 1.25rem;
}

.form-check-label {
  font-weight: 500;
  cursor: pointer;
}

/* Grid de secciones */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.section-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.section-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1e293b;
}

.card-header small {
  font-size: 0.75rem;
  color: #64748b;
}

.card-content {
  padding: 1rem;
}

.content-preview {
  margin: 0;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.5;
}

.card-actions {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #f1f5f9;
}

/* Formulario */
.form-section {
  position: fixed;
  top: 0;
  right: -450px;
  width: 450px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-y: auto;
  transition: right 0.3s ease;
  z-index: 100;
}

.form-section.form-visible {
  right: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.about-form {
  display: grid;
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

textarea.form-input {
  min-height: 150px;
  resize: vertical;
}

/* File input */
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

/* Image preview */
.image-preview-container {
  position: relative;
  margin-top: 1rem;
}

.image-preview {
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-remove-image:hover {
  background-color: #dc2626;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
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

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.primary-button {
  background-color: #4f46e5;
  color: white;
}

.primary-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.danger-button {
  background-color: #ef4444;
  color: white;
}

.danger-button:hover:not(:disabled) {
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

.delete-button:hover {
  color: #ef4444;
}

.close-button:hover {
  color: #1e293b;
  background-color: #f1f5f9;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 90;
}

.fab:hover {
  background-color: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.fab.fab-hidden {
  transform: scale(0);
  opacity: 0;
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

/* Empty state */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
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

.empty-state p {
  font-size: 0.875rem;
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

/* Responsive */
@media (max-width: 768px) {
  .form-section {
    width: 100%;
    right: -100%;
  }
  
  .form-section.form-visible {
    right: 0;
  }
  
  .sections-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .about-management {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
  
  .fab {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>