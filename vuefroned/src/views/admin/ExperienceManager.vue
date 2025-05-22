<template>
  <div class="container py-5">
    <!-- Encabezado -->
    <h2 class="mb-4 text-primary fw-bold d-flex align-items-center">
      <i class="bi bi-stars me-2"></i> Gestionar Experiencias
    </h2>
    <router-link
  to="/admin/home-dashboard"
  class="btn btn-outline-primary mb-4 d-inline-flex align-items-center"
>
  <i class="bi bi-arrow-left me-2"></i>
  Volver al Panel Principal
</router-link>
    <!-- FORMULARIO -->
    <form @submit.prevent="saveExp" class="row g-4 mb-5 bg-light p-4 rounded shadow-sm" enctype="multipart/form-data">
      <!-- Título -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">Título *</label>
        <input
          v-model="form.title"
          class="form-control"
          required
          placeholder="Ej: Caminata por los Andes"
        />
      </div>

      <!-- Slug -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">Slug único *</label>
        <input
          v-model="form.slug"
          class="form-control"
          required
          placeholder="Ej: caminata-andes"
        />
      </div>

      <!-- Categoría -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">Categoría *</label>
        <select v-model="form.category" class="form-select" required>
          <option disabled value="">Selecciona categoría</option>
          <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Icono actual -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">Icono seleccionado</label>
        <div class="input-group">
          <span class="input-group-text bg-white"><i :class="form.icon"></i></span>
          <input v-model="form.icon" class="form-control" readonly />
        </div>
      </div>

      <!-- Selector visual de íconos -->
      <div class="col-12">
        <label class="form-label fw-semibold">Seleccionar Icono (Bootstrap Icons)</label>
        <div class="icon-grid">
          <span
            v-for="icon in availableIcons"
            :key="icon"
            class="icon-choice"
            :class="{ selected: icon === form.icon }"
            @click="form.icon = icon"
          >
            <i :class="icon"></i>
          </span>
        </div>
      </div>

      <!-- Descripción -->
      <div class="col-12">
        <label class="form-label fw-semibold">Descripción *</label>
        <textarea
          v-model="form.content"
          class="form-control"
          rows="3"
          required
          placeholder="Describe esta experiencia para los visitantes..."
        ></textarea>
      </div>

      <!-- Imagen local -->
      <div class="col-md-6">
        <label class="form-label fw-semibold">Subir Imagen</label>
        <input type="file" accept="image/*" class="form-control" @change="handleImageUpload" />
      </div>

      <!-- Previsualización -->
      <div v-if="imagePreview" class="col-md-6 text-center">
        <label class="form-label d-block fw-semibold">Vista previa:</label>
        <img :src="imagePreview" class="img-fluid rounded shadow" style="max-height: 200px" />
      </div>

      <!-- Orden -->
      <div class="col-md-2">
        <label class="form-label fw-semibold">Orden</label>
        <input
          v-model.number="form.order"
          type="number"
          min="0"
          class="form-control"
          placeholder="0, 1, 2..."
        />
      </div>

      <!-- Botones -->
      <div class="col-12 d-flex gap-3">
        <button type="submit" class="btn btn-success">
          💾 Guardar
        </button>
        <button type="button" class="btn btn-secondary" @click="resetForm">
          ❌ Cancelar
        </button>
      </div>
    </form>

    <!-- LISTA DE EXPERIENCIAS -->
    <div class="card mb-3 shadow-sm border-0" v-for="exp in experiences" :key="exp.id">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <i :class="exp.icon" class="me-2 text-success fs-5"></i>
          <strong>{{ exp.title }}</strong>
          <span class="text-muted ms-2 small">({{ exp.category }})</span>
        </div>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-primary" @click="editExp(exp)">✏️</button>
          <button class="btn btn-sm btn-outline-danger" @click="deleteExp(exp.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

const experiences = ref([])
const imageFile = ref(null)
const imagePreview = ref(null)

const form = ref({
  id: null,
  title: '',
  slug: '',
  category: '',
  icon: '',
  content: '',
  image_url: '',
  order: 0
})

const categoryOptions = [
  { value: 'histórico', label: 'Histórico 🏛️' },
  { value: 'aventura', label: 'Aventura 🧗' },
  { value: 'naturaleza', label: 'Naturaleza 🌳' },
  { value: 'gastronomía', label: 'Gastronomía 🍲' },
  { value: 'vivencial', label: 'Vivencial 👨‍🌾' },
  { value: 'entretenimiento', label: 'Entretenimiento 🎭' },
  { value: 'exclusivo', label: 'Exclusivo 💎' }
]

const availableIcons = [
  'bi bi-tree', 'bi bi-hiking', 'bi bi-lightning-charge', 'bi bi-camera',
  'bi bi-people', 'bi bi-star-fill', 'bi bi-globe', 'bi bi-brightness-high',
  'bi bi-emoji-smile', 'bi bi-moon-stars', 'bi bi-book', 'bi bi-gear-fill'
]

async function fetchExperiences() {
  const { data } = await api.get('/experiences')
  experiences.value = data
}

async function saveExp() {
  const fd = new FormData()

  // Campos manuales excepto image_url
  const { id, image_url, ...rest } = form.value
  for (const [key, val] of Object.entries(rest)) {
    if (val !== null && val !== '') {
      fd.append(key, val)
    }
  }

  // Agrega la imagen si existe
  if (imageFile.value) {
    fd.append('image', imageFile.value)
  }

  try {
    if (form.value.id) {
      await api.post(`/experiences/${form.value.id}?_method=PUT`, fd)
    } else {
      await api.post('/experiences', fd)
    }

    await fetchExperiences()
    resetForm()
  } catch (err) {
    console.error('Error al guardar experiencia:', err.response?.data || err)
    alert('❌ Error al guardar. Verifica los campos requeridos.')
  }
}


function handleImageUpload(e) {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function editExp(exp) {
  form.value = { ...exp }
  imagePreview.value = exp.image_url || null
}

async function deleteExp(id) {
  if (confirm('¿Eliminar esta experiencia?')) {
    await api.delete(`/experiences/${id}`)
    await fetchExperiences()
  }
}

function resetForm() {
  form.value = {
    id: null,
    title: '',
    slug: '',
    category: '',
    icon: '',
    content: '',
    image_url: '',
    order: 0
  }
  imageFile.value = null
  imagePreview.value = null
}

onMounted(fetchExperiences)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

/* Encabezado */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f766e;
}

/* Etiquetas */
label {
  font-weight: 600;
  color: #1f2937;
}

/* Inputs y selects */
input,
select,
textarea {
  border-radius: 0.5rem;
  background-color: #f9fafb;
  font-size: 0.95rem;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease-in-out;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

/* Icon grid */
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 0.5rem;
}

.icon-choice {
  border: 1px solid #d1d5db;
  padding: 12px 14px;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
}

.icon-choice:hover {
  background-color: #e0f2fe;
  border-color: #38bdf8;
}

.icon-choice.selected {
  background-color: #16a34a;
  color: #ffffff;
  border-color: #16a34a;
}

.icon-choice i {
  font-size: 1.25rem;
}

/* Imagen de previsualización */
img.img-fluid {
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* Tarjetas de experiencia */
.card {
  border-radius: 0.75rem;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.card-body i {
  color: #0ea5e9;
}

.card-body strong {
  color: #1e3a8a;
}

.card-body span.text-muted {
  font-size: 0.85rem;
  color: #64748b;
}

/* Botones */
button {
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}

/* Responsive */
@media (max-width: 576px) {
  .icon-choice {
    flex: 1 1 48%;
  }
}
</style>

