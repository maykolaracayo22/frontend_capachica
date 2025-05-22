<template>
  <div class="container py-5">
    <div class="bg-white shadow rounded p-4 p-md-5 border">

      <!-- Encabezado -->
      <h2 class="text-primary fw-bold mb-4 d-flex align-items-center">
        <i class="bi bi-geo-alt-fill me-2"></i> Editar Sección de Contacto
      </h2>
      <router-link
  to="/admin/home-dashboard"
  class="btn btn-outline-primary mb-4 d-inline-flex align-items-center"
>
  <i class="bi bi-arrow-left me-2"></i>
  Volver al Panel Principal
</router-link>
      <!-- Formulario -->
      <form @submit.prevent="saveContact" class="row g-4">
        <!-- Dirección -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Dirección</label>
          <input
            v-model="form.address"
            type="text"
            class="form-control"
          />
        </div>

        <!-- Teléfono -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Teléfono</label>
          <input
            v-model="form.phone"
            type="text"
            class="form-control"
          />
        </div>

        <!-- Email -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
          />
        </div>

        <!-- Facebook -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Facebook (URL)</label>
          <input
            v-model="form.facebook"
            type="url"
            class="form-control"
          />
        </div>

        <!-- Instagram -->
        <div class="col-md-6">
          <label class="form-label fw-semibold">Instagram (URL)</label>
          <input
            v-model="form.instagram"
            type="url"
            class="form-control"
          />
        </div>

        <!-- Google Maps Embed -->
        <div class="col-12">
          <label class="form-label fw-semibold">Embed Mapa (iframe)</label>
          <textarea
            v-model="form.google_maps_embed"
            rows="4"
            class="form-control"
          ></textarea>
          <small class="text-muted">Pega aquí el código iframe de Google Maps.</small>
        </div>

        <!-- Botón -->
        <div class="col-12 text-end">
          <button
            type="submit"
            class="btn btn-primary px-4"
          >
            <i class="bi bi-save me-1"></i> Guardar Contacto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

const form = ref({
  id: null,
  address: '',
  phone: '',
  email: '',
  facebook: '',
  instagram: '',
  google_maps_embed: ''
})

const fetchContact = async () => {
  try {
    const { data } = await api.get('/contact')
    if (data && data.id) {
      form.value = { ...data }
    } else {
      form.value = {
        id: null,
        address: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        google_maps_embed: ''
      }
    }
  } catch (e) {
    console.error('Error al cargar Contacto:', e)
    alert('No se pudo cargar la sección de contacto.')
  }
}

const createContact = async () => {
  // Asegurarnos de que al menos un campo tenga contenido
  if (!form.value.address && !form.value.phone && !form.value.email && !form.value.facebook && !form.value.instagram && !form.value.google_maps_embed) {
    alert('Por favor, ingresa al menos un dato para el contacto.')
    return
  }

  try {
    const { data } = await api.post('/contact', {
      address: form.value.address,
      phone: form.value.phone,
      email: form.value.email,
      facebook: form.value.facebook,
      instagram: form.value.instagram,
      google_maps_embed: form.value.google_maps_embed
    })

    if (data.id) {
      form.value = { ...data }
    } else {
      alert('No se pudo crear el contacto correctamente.')
    }
  } catch (e) {
    console.error('Error al crear Contacto:', e)
    alert('No se pudo crear la sección de contacto.')
  }
}

const updateContact = async () => {
  try {
    await api.put(`/contact/${form.value.id}`, {
      address: form.value.address,
      phone: form.value.phone,
      email: form.value.email,
      facebook: form.value.facebook,
      instagram: form.value.instagram,
      google_maps_embed: form.value.google_maps_embed
    })
    alert('Contacto actualizado correctamente')
    await fetchContact()
  } catch (e) {
    console.error('Error al guardar Contacto:', e)
    alert('No se pudo actualizar la sección de contacto.')
  }
}

const saveContact = async () => {
  if (form.value.id) {
    await updateContact()
  } else {
    await createContact()
  }
}

onMounted(fetchContact)
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
  margin: auto;
}

/* Título */
h2 {
  font-size: 1.75rem;
  color: #0f766e;
}

/* Inputs y Textareas */
input,
textarea {
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
}

textarea {
  resize: none;
}

/* Botón */
button {
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}

/* Icono */
.bi {
  vertical-align: -0.125em;
  color: #0ea5e9;
}
</style>
