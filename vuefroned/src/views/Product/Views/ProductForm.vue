<template> 
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0 fs-4">{{ editing ? 'Editar Producto' : 'Crear Nuevo Producto' }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Selección de emprendedor (solo en creación) -->
          <div v-if="!editing && entrepreneurs.length" class="mb-4">
            <label for="entrepreneur" class="form-label fw-bold">
              <i class="bi bi-person-badge me-1"></i> Emprendedor
            </label>
            <select id="entrepreneur" v-model.number="form.entrepreneur_id" class="form-select form-select-lg" required @change="fetchCategoriesForEntrepreneur">
              <option disabled value="">-- Seleccione un emprendedor --</option>
              <option v-for="e in entrepreneurs" :key="e.id" :value="e.id">
                {{ e.user.name }}
              </option>
            </select>
            <div v-if="errors.entrepreneur_id" class="text-danger small mt-1">
              <i class="bi bi-exclamation-circle me-1"></i>{{ errors.entrepreneur_id[0] }}
            </div>
          </div>

          <div class="row">
            <!-- Columna izquierda -->
            <div class="col-md-7">
              <!-- Información básica del producto -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Información Básica</h5>
                </div>
                <div class="card-body">
                  <!-- Nombre -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Nombre <span class="text-danger">*</span></label>
                    <input v-model.trim="form.name" type="text" class="form-control form-control-lg" placeholder="Nombre del producto" required>
                    <div v-if="errors.name" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.name[0] }}
                    </div>
                  </div>

                  <!-- Descripción -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Descripción</label>
                    <textarea v-model.trim="form.description" class="form-control" rows="4" placeholder="Descripción detallada del producto"></textarea>
                    <div v-if="errors.description" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.description[0] }}
                    </div>
                  </div>

                  <!-- Precio y Stock -->
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Precio <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input v-model.number="form.price" type="number" step="0.01" min="0" class="form-control" required>
                      </div>
                      <div v-if="errors.price" class="text-danger small mt-1">
                        <i class="bi bi-exclamation-circle me-1"></i>{{ errors.price[0] }}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Stock</label>
                      <input v-model.number="form.stock" type="number" min="0" class="form-control" placeholder="Cantidad disponible">
                      <div v-if="errors.stock" class="text-danger small mt-1">
                        <i class="bi bi-exclamation-circle me-1"></i>{{ errors.stock[0] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detalles adicionales -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-list-check me-2"></i>Detalles adicionales</h5>
                </div>
                <div class="card-body">
                  <!-- Duración -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Duración</label>
                    <input v-model.trim="form.duration" type="text" class="form-control" placeholder="Ej: 2 horas, 3 días, etc.">
                    <div v-if="errors.duration" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.duration[0] }}
                    </div>
                  </div>

                  <!-- Place (Ubicación) -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      <i class="bi bi-geo-alt me-1"></i>Ubicación
                    </label>
                    <select v-model="form.place_id" class="form-select">
                      <option value="" disabled>-- Seleccione ubicación --</option>
                      <option v-for="place in places" :key="place.id" :value="place.id">
                        {{ place.name }}
                      </option>
                    </select>
                    <div v-if="errors.place_id" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.place_id[0] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna derecha -->
            <div class="col-md-5">
              <!-- Categorías -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-tags me-2"></i>Categorías</h5>
                </div>
                <div class="card-body">
                  <div v-if="categories.length > 0">
                    <label class="form-label fw-bold">Categoría <span class="text-danger">*</span></label>
                    
                    <div class="border rounded p-3">
                      <div v-for="category in categories" :key="category.id" class="form-check mb-2">
                        <input 
                          :id="'cat-'+category.id" 
                          type="checkbox" 
                          class="form-check-input" 
                          :value="category.id" 
                          v-model="form.category_ids">
                        <label :for="'cat-'+category.id" class="form-check-label">{{ category.name }}</label>
                      </div>
                    </div>
                    
                    <div v-if="errors.category_ids" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.category_ids[0] }}
                    </div>
                  </div>
                  <div v-else class="alert alert-warning">
                    Seleccione un emprendedor para ver categorías disponibles
                  </div>
                </div>
              </div>

              <!-- Imágenes -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-images me-2"></i>Imágenes</h5>
                </div>
                <div class="card-body">
                  <!-- Imagen Principal -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Imagen Principal</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-image"></i></span>
                      <input v-model.trim="form.main_image" type="url" class="form-control" placeholder="URL de la imagen principal">
                    </div>
                    <div v-if="errors.main_image" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.main_image[0] }}
                    </div>
                    <div v-if="form.main_image" class="mt-2">
                      <div class="border rounded p-2">
                        <div class="text-center">Vista previa no disponible</div>
                      </div>
                    </div>
                  </div>

                  <!-- Imágenes adicionales -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Imágenes adicionales</label>
                    <div v-for="(img, idx) in form.images" :key="idx" class="input-group mb-2">
                      <span class="input-group-text"><i class="bi bi-image"></i></span>
                      <input v-model.trim="form.images[idx]" type="url" class="form-control" placeholder="URL de imagen adicional">
                      <button @click.prevent="removeImage(idx)" type="button" class="btn btn-outline-danger">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <button @click.prevent="addImage" type="button" class="btn btn-outline-secondary btn-sm mt-2">
                      <i class="bi bi-plus-circle me-1"></i>Agregar Imagen
                    </button>
                    <div v-if="errors.images" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>{{ errors.images[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estado -->
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-toggle-on me-2"></i>Estado</h5>
                </div>
                <div class="card-body">
                  <div class="form-check form-switch">
                    <input v-model="form.is_active" class="form-check-input" type="checkbox" id="active" role="switch">
                    <label for="active" class="form-check-label fw-bold">
                      {{ form.is_active ? 'Producto activo' : 'Producto inactivo' }}
                    </label>
                  </div>
                  <small class="text-muted">Los productos inactivos no se mostrarán en el catálogo.</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-outline-secondary" @click="$router.back()">
              <i class="bi bi-arrow-left me-1"></i>Cancelar
            </button>
            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="bi" :class="editing ? 'bi-save' : 'bi-plus-circle'"></i>
              {{ editing ? ' Actualizar Producto' : ' Crear Producto' }}
            </button>
          </div>

          <!-- Error General -->
          <div v-if="generalError" class="alert alert-danger mt-4">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ generalError }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  name: 'ProductForm',
  props: {
    productId: { type: [String, Number], default: null }
  },

  data() {
    return {
      form: {
        entrepreneur_id: null,
        name: '',
        description: '',
        price: 0,
        stock: 0, // Añadido stock
        place_id: null, // Añadido place_id
        duration: '', // Añadida duración
        main_image: '',
        images: [],
        category_ids: [],
        is_active: true
      },
      entrepreneurs: [],
      categories: [],  // Array para las categorías del emprendedor
      places: [],  // Array para los lugares del emprendedor
      loading: false,
      editing: false,
      errors: {},
      generalError: ''
    };
  },
  async created() {
    console.log('Product ID recibido:', this.productId)
    await this.fetchEntrepreneurs();
    await this.fetchPlaces(); // Cargar lugares
    if (this.productId) {
      this.editing = true;
      await this.fetchProduct();
    } else {
      const eid = localStorage.getItem('entrepreneur_id');
      if (eid) this.form.entrepreneur_id = Number(eid);
    }
  },
  methods: {
    async fetchEntrepreneurs() {
      try {
        const res = await api.get('/entrepreneurs');
        this.entrepreneurs = Array.isArray(res.data) ? res.data : res.data.data;
      } catch (e) {
        console.error('Error fetching entrepreneurs:', e);
      }
    },
    async fetchCategoriesForEntrepreneur() {
      const entrepreneur = this.entrepreneurs.find(e => e.id === this.form.entrepreneur_id);
      if (entrepreneur) {
        this.categories = entrepreneur.categories;  // Obtener las categorías asociadas al emprendedor
        this.places = entrepreneur.place ? [entrepreneur.place] : []; // Asignar lugar si está relacionado
      }
    },

    async fetchPlaces() {
      try {
        const res = await api.get('/places'); // Aquí debes tener una ruta que devuelva los lugares
        this.places = res.data;
      } catch (e) {
        console.error('Error fetching places:', e);
      }
    },
    async fetchProduct() {
      this.loading = true;
      try {
        const res = await api.get(`/products/${this.productId}`);
        const p = res.data;
        this.form = {
          entrepreneur_id: p.entrepreneur_id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          place_id: p.place_id,
          duration: p.duration,
          main_image: p.main_image,
          images: p.images.map(i => i.image_url),
          category_ids: p.categories.map(c => c.id),
          is_active: p.is_active
        };
        await this.fetchCategoriesForEntrepreneur();
      } catch (e) {
        console.error('Error fetching product:', e);
        this.generalError = 'Error al cargar el producto';
      } finally {
        this.loading = false;
      }
    },
    addImage() { this.form.images.push(''); },
    removeImage(idx) { this.form.images.splice(idx, 1); },
    async submitForm() {
      this.loading = true;
      this.errors = {};
      this.generalError = '';

      // Validaciones
      if (!this.form.entrepreneur_id) {
        this.generalError = 'Debe seleccionar un emprendedor';
        this.loading = false; return;
      }
      if (!this.form.name || this.form.price == null) {
        this.generalError = 'Complete los campos obligatorios';
        this.loading = false; return;
      }

      const payload = {
        ...this.form,
        price: parseFloat(this.form.price),
        images: this.form.images.filter(u => u.trim())
      };

      try {
        if (this.editing) {
          await api.put(`/products/${this.productId}`, payload);
        } else {
          await api.post('/products', payload);
        }
        this.$router.push('/products');
      } catch (err) {
        console.error('Error submitting form:', err);
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors || {};
          this.generalError = 'Corrija los errores del formulario';
        } else {
          this.generalError = err.response?.data?.message || 'Error al guardar producto';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');

.card {
  border-radius: 0.5rem;
  border: 1px solid rgba(0,0,0,0.125);
}

.card-header {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.card-header h5 {
  font-size: 1rem;
  font-weight: 600;
}

.form-control:focus,
.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control, .form-select, .input-group-text {
  padding: 0.5rem 0.75rem;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>