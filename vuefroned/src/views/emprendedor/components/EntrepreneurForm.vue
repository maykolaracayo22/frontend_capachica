<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-gradient-tourism text-white">
            <h2 class="h4 mb-0">
              <i :class="entrepreneurId ? 'bi-pencil-square' : 'bi-person-plus'" class="bi me-2"></i>
              {{ entrepreneurId ? 'Editar' : 'Crear' }} Emprendedor Turístico
            </h2>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="submitForm" enctype="multipart/form-data" novalidate>
              <!-- Sección Usuario (solo creación) -->
              <div v-if="!entrepreneurId" class="mb-4">
                <h5 class="border-bottom pb-2 mb-3">Datos de Acceso</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="name" class="form-label">Nombre de Usuario *</label>
                    <input
                      id="name"
                      v-model.trim="form.name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.name }"
                      required
                    />
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email *</label>
                    <input
                      id="email"
                      v-model.trim="form.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      required
                    />
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
                  </div>
                </div>
              </div>

              <!-- Información del Negocio -->
              <div class="mb-4">
                <h5 class="border-bottom pb-2 mb-3">Información del Negocio</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="business_name" class="form-label">Nombre del Negocio *</label>
                    <input
                      id="business_name"
                      v-model.trim="form.business_name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.business_name }"
                      required
                    />
                    <div v-if="errors.business_name" class="invalid-feedback">{{ errors.business_name[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="ruc" class="form-label">RUC</label>
                    <input
                      id="ruc"
                      v-model.trim="form.ruc"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.ruc }"
                      placeholder="11 dígitos"
                    />
                    <div v-if="errors.ruc" class="invalid-feedback">{{ errors.ruc[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Teléfono *</label>
                    <input
                      id="phone"
                      v-model.trim="form.phone"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.phone }"
                      required
                    />
                    <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="district" class="form-label">Distrito *</label>
                    <input
                      id="district"
                      v-model.trim="form.district"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.district }"
                      required
                    />
                    <div v-if="errors.district" class="invalid-feedback">{{ errors.district[0] }}</div>
                  </div>
                  <div class="col-12">
                    <label for="description" class="form-label">Descripción</label>
                    <textarea
                      id="description"
                      v-model.trim="form.description"
                      class="form-control"
                      :class="{ 'is-invalid': errors.description }"
                      rows="3"
                    ></textarea>
                    <div v-if="errors.description" class="invalid-feedback">{{ errors.description[0] }}</div>
                  </div>
                </div>
              </div>

              <!-- Ubicación y Asociación -->
              <div class="mb-4">
                <h5 class="border-bottom pb-2 mb-3">Ubicación y Asociación</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="association_id" class="form-label">Asociación</label>
                    <select
                      id="association_id"
                      v-model="form.association_id"
                      class="form-select"
                      :class="{ 'is-invalid': errors.association_id }"
                    >
                      <option value="">Seleccione una asociación</option>
                      <option v-for="assoc in associations" :key="assoc.id" :value="assoc.id">
                        {{ assoc.name }}
                      </option>
                    </select>
                    <div v-if="errors.association_id" class="invalid-feedback">{{ errors.association_id[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="place_id" class="form-label">Lugar Turístico</label>
                    <select
                      id="place_id"
                      v-model="form.place_id"
                      class="form-select"
                      :class="{ 'is-invalid': errors.place_id }"
                    >
                      <option value="">Seleccione un lugar</option>
                      <option v-for="place in places" :key="place.id" :value="place.id">
                        {{ place.name }}
                      </option>
                    </select>
                    <div v-if="errors.place_id" class="invalid-feedback">{{ errors.place_id[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="latitude" class="form-label">Latitud</label>
                    <input
                      id="latitude"
                      v-model.trim="form.latitude"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.latitude }"
                      placeholder="Ej: -12.046374"
                    />
                    <div v-if="errors.latitude" class="invalid-feedback">{{ errors.latitude[0] }}</div>
                  </div>
                  <div class="col-md-6">
                    <label for="longitude" class="form-label">Longitud</label>
                    <input
                      id="longitude"
                      v-model.trim="form.longitude"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.longitude }"
                      placeholder="Ej: -77.042793"
                    />
                    <div v-if="errors.longitude" class="invalid-feedback">{{ errors.longitude[0] }}</div>
                  </div>
                </div>
              </div>

              <!-- Imagen y Categorías -->
              <div class="mb-4">
                <h5 class="border-bottom pb-2 mb-3">Imagen y Categorías</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="profile_image" class="form-label">Imagen de Perfil</label>
                    <input
                      type="file"
                      id="profile_image"
                      @change="onFileChange"
                      class="form-control"
                      :class="{ 'is-invalid': errors.profile_image }"
                      accept="image/*"
                    />
                    <div v-if="errors.profile_image" class="invalid-feedback">{{ errors.profile_image[0] }}</div>
                    <div v-if="form.profile_image_url" class="mt-2">
                      <img 
                        :src="form.profile_image_url" 
                        class="img-thumbnail" 
                        style="max-width: 150px; max-height: 150px" 
                        alt="Preview"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="categories" class="form-label">Categorías Turísticas</label>
                    <select
                      id="categories"
                      multiple
                      v-model="form.categories"
                      class="form-select"
                      :class="{ 'is-invalid': errors.categories }"
                      size="4"
                    >
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                      </option>
                    </select>
                    <div v-if="errors.categories" class="invalid-feedback">{{ errors.categories[0] }}</div>
                    <small class="text-muted">Mantén presionado Ctrl para seleccionar múltiples</small>
                  </div>
                </div>
              </div>

              <!-- Botones y estados -->
              <div class="d-flex justify-content-between border-top pt-4">
                <button
                  v-if="entrepreneurId"
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="$emit('cancel')"
                  :disabled="loading"
                >
                  <i class="bi bi-arrow-left me-1"></i> Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else :class="entrepreneurId ? 'bi-check-circle' : 'bi-save'" class="bi me-1"></i>
                  {{ entrepreneurId ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>

              <!-- Error general -->
              <div v-if="generalError" class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ generalError }}
              </div>
            </form>

            <!-- Contraseña temporal -->
            <div v-if="generatedPassword" class="alert alert-success mt-4">
              <h5 class="alert-heading">
                <i class="bi bi-key me-2"></i>Credenciales Generadas
              </h5>
              <hr>
              <p class="mb-2"><strong>Usuario:</strong> {{ form.email }}</p>
              <p class="mb-2"><strong>Contraseña temporal:</strong></p>
              <pre class="bg-white p-2 rounded">{{ generatedPassword }}</pre>
              <p class="mb-0 small">
                <i class="bi bi-info-circle me-1"></i>
                Indica al emprendedor que cambie esta contraseña al iniciar sesión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  name: 'EntrepreneurForm',
  props: { entrepreneurId: { type: Number, default: null } },
  data() {
    return {
      form: {
        name: '',
        email: '',
        business_name: '',
        ruc: '',
        phone: '',
        description: '',
        association_id: '',
        place_id: '',
        latitude: '',
        longitude: '',
        district: '',
        profile_image: null,
        profile_image_url: '',
        categories: []
      },
      categories: [],
      associations: [],
      places: [],
      errors: {},
      generalError: '',
      generatedPassword: '',
      loading: false
    }
  },
  mounted() {
    this.loadOptions()
    if (this.entrepreneurId) this.fetchEntrepreneur()
  },
  methods: {
    loadOptions() {
      api.get('/categories').then(r => (this.categories = r.data))
      api.get('/associations').then(r => (this.associations = r.data))
      api.get('/places').then(r => (this.places = r.data))
    },
    async fetchEntrepreneur() {
      try {
        const res = await api.get(`/entrepreneurs/${this.entrepreneurId}`)
        const data = res.data.entrepreneur || res.data
        this.form = {
          ...this.form,
          name: data.user.name,
          email: data.user.email,
          business_name: data.business_name,
          ruc: data.ruc || '',
          phone: data.phone,
          description: data.description,
          association_id: data.association_id,
          place_id: data.place_id,
          latitude: data.latitude,
          longitude: data.longitude,
          district: data.district,
          profile_image_url: data.profile_image_url,
          categories: data.categories.map(c => c.id)
        }
      } catch {
        this.generalError = 'No se pudo cargar los datos del emprendedor.'
      }
    },
    onFileChange(e) {
      const file = e.target.files[0]
      this.form.profile_image = file
      this.form.profile_image_url = URL.createObjectURL(file)
    },
    async submitForm() {
      this.loading = true
      this.errors = {}
      this.generalError = ''

      const formData = new FormData()
      if (this.entrepreneurId) {
        formData.append('_method', 'PUT')
      }

      Object.entries(this.form).forEach(([k, v]) => {
        if (k === 'categories') {
          v.forEach(id => formData.append('categories[]', id))
        } else if (k === 'profile_image' && v) {
          formData.append('profile_image', v)
        } else if (k !== 'profile_image_url' && v !== null && v !== '') {
          formData.append(k, v)
        }
      })

      try {
        const url = this.entrepreneurId
          ? `/entrepreneurs/${this.entrepreneurId}`
          : '/entrepreneurs'
        const res = await api.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.data.password) this.generatedPassword = res.data.password
        this.$emit('saved')
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors || {}
        } else {
          this.generalError =
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Error al procesar la solicitud.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.bg-gradient-tourism {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
  border: none;
}

.card-header {
  padding: 1rem 1.5rem;
}

.form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  border-color: #86b7fe;
}

.img-thumbnail {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

@media (max-width: 768px) {
  .card-header {
    padding: 0.75rem;
  }
  
  .form-control, .form-select {
    font-size: 0.9rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
  }
}
</style>