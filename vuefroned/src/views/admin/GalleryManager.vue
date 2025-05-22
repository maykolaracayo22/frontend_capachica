<template>
  <div class="gallery-management">
    <!-- Header con título y botón de volver -->
    <div class="section-header">
      <div>
        <h1 class="section-title">
          <i class="bi bi-images"></i> Gestión de Galería
        </h1>
        <p class="section-subtitle">Administra las imágenes de tu galería</p>
      </div>
      <router-link
        to="/admin/home-dashboard"
        class="action-button"
      >
        <i class="bi bi-arrow-left"></i> Volver al Panel
      </router-link>
    </div>

    <!-- Formulario de subida -->
    <div class="upload-section">
      <h2 class="section-subtitle">
        <i class="bi bi-cloud-arrow-up"></i> Subir Nuevas Imágenes
      </h2>
      
      <form @submit.prevent="uploadImage" class="upload-form">
        <div class="form-group">
          <label class="form-label">Seleccionar imágenes</label>
          <div class="file-input-container">
            <label class="file-input-label">
              <i class="bi bi-folder2-open"></i>
              <span>{{ newItem.images.length ? `${newItem.images.length} archivos seleccionados` : 'Selecciona imágenes' }}</span>
              <input
                type="file"
                @change="onFileSelect"
                accept="image/*"
                class="file-input"
                multiple
              />
            </label>
          </div>
        </div>

        <!-- Captions por imagen -->
        <div v-if="newItem.captions.length" class="captions-container">
          <label class="form-label">Títulos (opcional)</label>
          <div
            v-for="(caption, index) in newItem.captions"
            :key="index"
            class="caption-input-group"
          >
            <input
              v-model="newItem.captions[index]"
              type="text"
              class="form-input"
              :placeholder="`Título para imagen ${index + 1}`"
            />
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="action-button success-button"
            :disabled="newItem.images.length === 0"
          >
            <i class="bi bi-upload"></i> Subir Imágenes
          </button>
        </div>
      </form>
    </div>

    <!-- Galería de imágenes -->
    <div class="gallery-section">
      <h2 class="section-subtitle">
        <i class="bi bi-collection"></i> Imágenes en Galería
      </h2>
      
      <div class="gallery-grid">
        <div
          v-for="item in gallery"
          :key="item.id"
          class="gallery-card"
        >
          <div class="image-container">
            <img
              :src="item.image_url"
              class="gallery-image"
              alt="Imagen de galería"
            />
          </div>
          
          <div class="card-body">
            <input
              v-model="item.caption"
              class="form-input caption-input"
              placeholder="Agregar título..."
            />
            
            <div class="file-input-container">
              <label class="file-input-label small">
                <i class="bi bi-arrow-repeat"></i>
                <span>{{ item.newImage ? 'Imagen seleccionada' : 'Cambiar imagen' }}</span>
                <input
                  type="file"
                  @change="e => onUpdateImageSelect(e, item)"
                  accept="image/*"
                  class="file-input"
                />
              </label>
            </div>
            
            <div class="card-actions">
              <button
                @click="updateItem(item)"
                class="icon-button edit-button"
                :disabled="!item.newImage && item.caption === (gallery.find(i => i.id === item.id)?.caption || '')"
                title="Actualizar"
              >
                <i class="bi bi-check-circle"></i>
              </button>
              
              <button
                @click="deleteItem(item.id)"
                class="icon-button delete-button"
                title="Eliminar"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="gallery.length === 0" class="empty-state">
        <i class="bi bi-images"></i>
        <h3>No hay imágenes en la galería</h3>
        <p>Comienza subiendo tus primeras imágenes</p>
      </div>
    </div>

    <!-- Modal de confirmación -->
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
            <p>¿Estás seguro de eliminar esta imagen de la galería?</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="action-button">
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
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

const gallery = ref([])
const newItem = ref({ images: [], captions: [] })
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

// Cargar galería
const fetchGallery = async () => {
  try {
    const { data } = await api.get('/gallery')
    gallery.value = data.map(item => ({
      ...item,
      newImage: null // para actualización de imagen individual
    }))
  } catch (e) {
    console.error('Error al obtener galería:', e)
    alert('No se pudo cargar la galería.')
  }
}

// Seleccionar múltiples imágenes nuevas
const onFileSelect = e => {
  newItem.value.images = Array.from(e.target.files)
  newItem.value.captions = newItem.value.images.map(() => '')
}

// Seleccionar nueva imagen para actualizar una existente
const onUpdateImageSelect = (e, item) => {
  const file = e.target.files[0]
  if (file) {
    item.newImage = file
  }
}

// Subir imágenes nuevas
const uploadImage = async () => {
  if (newItem.value.images.length === 0) return alert('Selecciona al menos una imagen')

  const fd = new FormData()
  newItem.value.images.forEach((image, index) => {
    fd.append(`images[${index}]`, image)
    fd.append(`captions[${index}]`, newItem.value.captions[index] || '')
  })

  try {
    await api.post('/gallery', fd)
    alert('Imágenes subidas correctamente')
    newItem.value = { images: [], captions: [] }
    await fetchGallery()
  } catch (e) {
    console.error('Error al subir imágenes:', e.response?.data || e.message)
    alert('No se pudo subir las imágenes.')
  }
}

// Actualizar imagen o caption
const updateItem = async item => {
  const fd = new FormData()
  fd.append('caption', item.caption)
  if (item.newImage) {
    fd.append('image', item.newImage)
  }

  try {
    const response = await api.post(`/gallery/${item.id}?_method=PUT`, fd)
    alert('Imagen actualizada')
    item.image_url = response.data.image_url
    item.newImage = null
  } catch (e) {
    console.error('Error al actualizar:', e.response?.data || e.message)
    alert('No se pudo actualizar la imagen.')
  }
}

// Mostrar modal de confirmación para eliminar
const showDeleteConfirmation = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

// Confirmar eliminación
const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await api.delete(`/gallery/${itemToDelete.value}`)
    alert('Imagen eliminada')
    await fetchGallery()
  } catch (e) {
    console.error('Error al eliminar imagen:', e.response?.data || e.message)
    alert('No se pudo eliminar la imagen.')
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

// Eliminar imagen (ahora solo muestra el modal)
const deleteItem = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

onMounted(fetchGallery)
</script>

<style scoped>
/* Estructura principal */
.gallery-management {
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

/* Sección de subida */
.upload-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.upload-form {
  display: grid;
  gap: 1.5rem;
}

/* Input de archivo personalizado */
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

.file-input-label.small {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.file-input-label i {
  color: #64748b;
}

.file-input {
  display: none;
}

/* Contenedor de captions */
.captions-container {
  display: grid;
  gap: 0.75rem;
}

.caption-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Galería de imágenes */
.gallery-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.gallery-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.gallery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.image-container {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-card:hover .gallery-image {
  transform: scale(1.05);
}

.card-body {
  padding: 1rem;
  display: grid;
  gap: 1rem;
}

.caption-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.caption-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
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

.success-button {
  background-color: #10b981;
  color: white;
}

.success-button:hover:not(:disabled) {
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

.delete-button:hover {
  color: #ef4444;
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: transparent !important;
}

/* Estado vacío */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  margin-top: 1.5rem;
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
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .gallery-management {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>