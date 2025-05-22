<template>
  <div class="destination-management-container">
    <!-- Header Section -->
    <div class="management-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="bi bi-geo-alt-fill"></i> Gestión de Destinos Turísticos
        </h1>
        <router-link to="/admin/home-dashboard" class="back-button">
          <i class="bi bi-arrow-left"></i> Volver al Panel Principal
        </router-link>
      </div>
    </div>

    <!-- Form Section -->
    <div class="form-section" :class="{ 'form-visible': showForm }">
      <div class="form-header">
        <h2>
          <i class="bi" :class="form.id ? 'bi-pencil' : 'bi-plus-circle'"></i>
          {{ form.id ? 'Editar Destino' : 'Agregar Nuevo Destino' }}
        </h2>
        <button @click="toggleForm" class="close-button">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form @submit.prevent="savePlace" class="destination-form">
        <div class="form-grid">
          <!-- Name -->
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              class="form-input"
              placeholder="Nombre del destino"
            />
          </div>

          <!-- Excerpt -->
          <div class="form-group">
            <label class="form-label">Resumen *</label>
            <textarea 
              v-model="form.excerpt" 
              required 
              rows="2" 
              class="form-input"
              placeholder="Breve descripción"
            ></textarea>
          </div>

          <!-- Activities -->
          <div class="form-group">
            <label class="form-label">Actividades</label>
            <input
              v-model="form.activitiesText"
              type="text"
              class="form-input"
              placeholder="Separadas por comas"
            />
            <small class="form-hint">Ejemplo: Trekking, Observación de aves, Fotografía</small>
          </div>

          <!-- Stats -->
          <div class="form-group">
            <label class="form-label">Estadísticas</label>
            <input
              v-model="form.statsText"
              type="text"
              class="form-input"
              placeholder="clave:valor, separadas por comas"
            />
            <small class="form-hint">Ejemplo: Altitud:3800, Temperatura:15</small>
          </div>

          <!-- Image -->
          <div class="form-group">
            <label class="form-label">Imagen</label>
            <div class="image-options">
              <input
                v-model="form.image_url"
                type="url"
                class="form-input mb-2"
                placeholder="URL de la imagen (https://...)"
              />
              <div class="divider">o</div>
              <label class="file-upload-label">
                <i class="bi bi-cloud-arrow-up"></i>
                <span>{{ form.image_file ? form.image_file.name : 'Seleccionar archivo' }}</span>
                <input 
                  type="file" 
                  @change="onFileSelect" 
                  accept="image/*" 
                  class="file-input"
                />
              </label>
            </div>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label">Categoría *</label>
            <select v-model="form.category" required class="form-input">
              <option disabled value="">Selecciona categoría</option>
              <option value="pueblo">Pueblo</option>
              <option value="playa">Playa</option>
              <option value="mirador">Mirador</option>
              <option value="arqueologico">Arqueológico</option>
            </select>
          </div>

          <!-- Map -->
          <div class="form-group full-width">
            <label class="form-label">Ubicación</label>
            <div id="map" class="map-container"></div>
            <div class="coordinates-grid">
              <div class="coordinate-input">
                <label>Latitud</label>
                <input 
                  v-model="form.latitude" 
                  type="text" 
                  class="form-input" 
                  placeholder="Ej: -15.6300"
                />
              </div>
              <div class="coordinate-input">
                <label>Longitud</label>
                <input 
                  v-model="form.longitude" 
                  type="text" 
                  class="form-input" 
                  placeholder="Ej: -69.9750"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="submit-button">
            {{ form.id ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" @click="resetForm" class="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Destinations List -->
    <div class="destinations-section">
      <div class="section-header">
        <h2>
          <i class="bi bi-list-ul"></i> Listado de Destinos
        </h2>
        <button @click="toggleForm" class="add-button">
          <i class="bi bi-plus-lg"></i> Agregar Destino
        </button>
      </div>

      <div v-if="places.length === 0" class="empty-state">
        <i class="bi bi-geo-alt"></i>
        <h3>No hay destinos registrados</h3>
        <p>Comienza agregando tu primer destino turístico</p>
      </div>

      <div class="destinations-grid">
        <div 
          v-for="place in places" 
          :key="place.id" 
          class="destination-card"
          :class="place.category"
        >
          <div class="card-image" v-if="place.image_url">
            <img :src="place.image_url" :alt="`Imagen de ${place.name}`" />
          </div>
          <div class="card-content">
            <div class="card-header">
              <h3>{{ place.name }}</h3>
              <span class="category-badge">{{ getCategoryName(place.category) }}</span>
            </div>
            <p class="card-excerpt">{{ place.excerpt }}</p>
            <div class="card-details">
              <div class="detail-item" v-if="place.latitude && place.longitude">
                <i class="bi bi-geo-alt"></i>
                <span>{{ place.latitude }}, {{ place.longitude }}</span>
              </div>
              <div class="detail-item" v-if="place.activities?.length">
                <i class="bi bi-activity"></i>
                <span>{{ place.activities.join(', ') }}</span>
              </div>
            </div>
            <div class="card-actions">
              <button @click="editPlace(place)" class="edit-button">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button @click="confirmDelete(place.id)" class="delete-button">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="showDeleteModal = false" class="modal-close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de eliminar este destino permanentemente?</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="cancel-button">
            Cancelar
          </button>
          <button @click="deletePlace" class="delete-button">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import * as turf from '@turf/turf'

// Estado
const places = ref([])
const form = ref(createDefaultForm())
const showForm = ref(false)
const showDeleteModal = ref(false)
const placeToDelete = ref(null)

// Configuración del mapa
let map, markerCluster, markerIndicator
const capachicaBounds = L.latLngBounds(
  L.latLng(-15.7400, -69.9750),
  L.latLng(-15.6300, -69.6950)
)
const capachicaPolygon = turf.polygon([[
  [-69.9750, -15.6300],
  [-69.6950, -15.6300],
  [-69.6950, -15.7400],
  [-69.9750, -15.7400],
  [-69.9750, -15.6300]
]])

// Métodos
const fetchPlaces = async () => {
  const { data } = await api.get('/places')
  places.value = data
  renderMarkers()
}

const renderMarkers = () => {
  if (markerCluster) markerCluster.clearLayers()
  markerCluster = L.markerClusterGroup()
  
  places.value.forEach(place => {
    if (place.latitude && place.longitude) {
      const icon = L.divIcon({
        html: `<div class="custom-marker ${place.category}">
                <i class="bi ${getCategoryIcon(place.category)}"></i>
              </div>`,
        className: '',
        iconSize: [32, 32]
      })
      
      const marker = L.marker([place.latitude, place.longitude], { icon })
        .bindPopup(`
          <div class="map-popup">
            <h4>${place.name}</h4>
            <p>${place.excerpt.substring(0, 100)}...</p>
            <div class="popup-category ${place.category}">
              ${getCategoryName(place.category)}
            </div>
          </div>
        `)
      
      markerCluster.addLayer(marker)
    }
  })
  
  map.addLayer(markerCluster)
}

const getCategoryName = (category) => {
  const names = {
    pueblo: 'Pueblo',
    playa: 'Playa',
    mirador: 'Mirador',
    arqueologico: 'Arqueológico'
  }
  return names[category] || category
}

const getCategoryIcon = (category) => {
  const icons = {
    pueblo: 'bi-house',
    playa: 'bi-water',
    mirador: 'bi-binoculars',
    arqueologico: 'bi-archive'
  }
  return icons[category] || 'bi-geo'
}

const onFileSelect = (e) => {
  form.value.image_file = e.target.files[0]
  form.value.image_url = ''
}

const savePlace = async () => {
  if (!isInsideCapachica(form.value.latitude, form.value.longitude)) {
    alert('La ubicación debe estar dentro de Capachica')
    return
  }

  const payload = new FormData()
  payload.append('name', form.value.name)
  payload.append('excerpt', form.value.excerpt)
  payload.append('latitude', form.value.latitude)
  payload.append('longitude', form.value.longitude)
  payload.append('category', form.value.category)
  
  if (form.value.activitiesText) {
    form.value.activitiesText.split(',').forEach(act => {
      payload.append('activities[]', act.trim())
    })
  }
  
  if (form.value.statsText) {
    form.value.statsText.split(',').forEach(pair => {
      const [key, value] = pair.split(':').map(x => x.trim())
      if (key && value) payload.append(`stats[${key}]`, value)
    })
  }
  
  if (form.value.image_file) {
    payload.append('image_file', form.value.image_file)
  } else if (form.value.image_url) {
    payload.append('image_url', form.value.image_url)
  }

  try {
    if (form.value.id) {
      payload.append('_method', 'PUT')
      await api.post(`/places/${form.value.id}`, payload)
    } else {
      await api.post('/places', payload)
    }
    
    await fetchPlaces()
    resetForm()
  } catch (error) {
    console.error('Error saving place:', error)
  }
}

const isInsideCapachica = (lat, lng) => {
  const pt = turf.point([parseFloat(lng), parseFloat(lat)])
  return turf.booleanPointInPolygon(pt, capachicaPolygon)
}

const editPlace = (place) => {
  form.value = {
    id: place.id,
    name: place.name,
    excerpt: place.excerpt,
    activitiesText: place.activities?.join(', ') || '',
    statsText: place.stats ? Object.entries(place.stats).map(([k, v]) => `${k}:${v}`).join(', ') : '',
    image_url: place.image_url || '',
    image_file: null,
    latitude: place.latitude || '',
    longitude: place.longitude || '',
    category: place.category || ''
  }
  
  if (place.latitude && place.longitude) {
    markerIndicator.setLatLng([place.latitude, place.longitude])
    map.panTo([place.latitude, place.longitude])
  }
  
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDelete = (id) => {
  placeToDelete.value = id
  showDeleteModal.value = true
}

const deletePlace = async () => {
  if (!placeToDelete.value) return
  
  await api.delete(`/places/${placeToDelete.value}`)
  await fetchPlaces()
  showDeleteModal.value = false
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  form.value = createDefaultForm()
  if (markerIndicator) {
    markerIndicator.setLatLng(capachicaBounds.getCenter())
  }
}

function createDefaultForm() {
  return {
    id: null,
    name: '',
    excerpt: '',
    activitiesText: '',
    statsText: '',
    image_url: '',
    image_file: null,
    latitude: '',
    longitude: '',
    category: ''
  }
}

// Inicialización del mapa
onMounted(() => {
  map = L.map('map', {
    maxBounds: capachicaBounds,
    maxBoundsViscosity: 0.8,
    minZoom: 12,
    maxZoom: 16
  }).fitBounds(capachicaBounds)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Dibujar polígono de Capachica
  L.geoJSON(capachicaPolygon, {
    style: {
      color: '#3b82f6',
      weight: 2,
      fillOpacity: 0.1
    }
  }).addTo(map)

  // Marcador arrastrable
  markerIndicator = L.marker(capachicaBounds.getCenter(), {
    draggable: true,
    icon: L.divIcon({
      html: '<div class="custom-marker selected"><i class="bi bi-geo-fill"></i></div>',
      className: '',
      iconSize: [40, 40]
    })
  }).addTo(map)

  markerIndicator.on('dragend', (e) => {
    const newLatLng = e.target.getLatLng()
    if (isInsideCapachica(newLatLng.lat, newLatLng.lng)) {
      form.value.latitude = newLatLng.lat.toFixed(6)
      form.value.longitude = newLatLng.lng.toFixed(6)
    } else {
      alert('La ubicación debe estar dentro de Capachica')
      e.target.setLatLng([form.value.latitude || -15.6300, form.value.longitude || -69.9750])
    }
  })

  // Click en el mapa
  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    if (isInsideCapachica(lat, lng)) {
      form.value.latitude = lat.toFixed(6)
      form.value.longitude = lng.toFixed(6)
      markerIndicator.setLatLng(e.latlng)
    } else {
      alert('La ubicación debe estar dentro de Capachica')
    }
  })

  fetchPlaces()
})
</script>

<style scoped>
/* Estilos base */
.destination-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.management-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f766e;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #f0f7ff;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.form-section.form-visible {
  max-height: 2000px;
  opacity: 1;
  padding: 1.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: #1e293b;
}

.destination-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
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
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
}

.image-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.divider {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.file-input {
  display: none;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.coordinates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coordinate-input label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover {
  background-color: #2563eb;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #f8fafc;
}

/* Destinations Section */
.destinations-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  background-color: #2563eb;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed #e2e8f0;
  border-radius: 0.75rem;
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

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.destination-card {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e2e8f0;
}

.destination-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.destination-card.pueblo .category-badge {
  background-color: #3b82f6;
}

.destination-card.playa .category-badge {
  background-color: #06b6d4;
}

.destination-card.mirador .category-badge {
  background-color: #10b981;
}

.destination-card.arqueologico .category-badge {
  background-color: #f59e0b;
}

.card-excerpt {
  color: #475569;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-button {
  flex: 1;
  padding: 0.5rem;
  background-color: #e0f2fe;
  color: #0369a1;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.edit-button:hover {
  background-color: #bae6fd;
}

.delete-button {
  flex: 1;
  padding: 0.5rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.delete-button:hover {
  background-color: #fecaca;
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
  border-radius: 0.75rem;
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
  transition: color 0.2s;
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

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .coordinates-grid {
    grid-template-columns: 1fr;
  }
  
  .destinations-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>

<style>
/* Estilos para los marcadores del mapa */
.custom-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border: 2px solid;
}

.custom-marker i {
  font-size: 14px;
  color: white;
}

.custom-marker.pueblo {
  background: #3b82f6;
  border-color: #2563eb;
}

.custom-marker.playa {
  background: #06b6d4;
  border-color: #0891b2;
}

.custom-marker.mirador {
  background: #10b981;
  border-color: #059669;
}

.custom-marker.arqueologico {
  background: #f59e0b;
  border-color: #d97706;
}

.custom-marker.selected {
  width: 40px;
  height: 40px;
  background: #ef4444;
  border: 3px solid white;
}

.custom-marker.selected i {
  font-size: 18px;
}

.map-popup {
  min-width: 200px;
}

.map-popup h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.map-popup p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.popup-category {
  display: inline-block;
  margin-top: 5px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.popup-category.pueblo {
  background: #3b82f6;
}

.popup-category.playa {
  background: #06b6d4;
}

.popup-category.mirador {
  background: #10b981;
}

.popup-category.arqueologico {
  background: #f59e0b;
}

.leaflet-popup-content {
  margin: 12px;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}
</style>