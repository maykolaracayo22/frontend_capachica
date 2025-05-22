<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-gradient-tourism text-white d-flex justify-content-between align-items-center">
            <router-link
              :to="{ name: 'AdminEntrepreneurDashboard' }"
              class="btn btn-outline-light btn-sm d-inline-flex align-items-center rounded-pill"
              aria-label="Volver al Panel Principal"
            >
              <i class="bi bi-arrow-left me-1"></i>
              Volver
            </router-link>
            <h3 class="h5 mb-0 fw-bold">
              <i :class="category.id ? 'bi-pencil-square' : 'bi-plus-circle'" class="me-2"></i>
              {{ category.id ? 'Editar' : 'Crear' }} Categoría Turística
            </h3>
            <div style="width: 100px"></div>
          </div>

          <div class="card-body p-4">
            <div v-if="showAlert" class="alert alert-success alert-dismissible fade show mb-3 rounded-pill" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              Categoría guardada exitosamente.
              <button type="button" class="btn-close" @click="showAlert = false" aria-label="Cerrar"></button>
            </div>
            
            <div v-if="showError" class="alert alert-danger alert-dismissible fade show mb-3 rounded-pill" role="alert">
              <i class="bi bi-x-circle-fill me-2"></i>
              Ocurrió un error al guardar la categoría.
              <button type="button" class="btn-close" @click="showError = false" aria-label="Cerrar"></button>
            </div>

            <form @submit.prevent="submitForm" novalidate>
              <!-- Campo nombre -->
              <div class="mb-4">
                <label for="categoryName" class="form-label fw-semibold">Nombre de la Categoría <span class="text-danger">*</span></label>
                <input
                  v-model.trim="form.name"
                  id="categoryName"
                  type="text"
                  class="form-control form-control-lg rounded-pill"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Ej: Aventura, Gastronomía, Ecoturismo"
                  required
                >
                <div class="invalid-feedback" v-if="errors.name">
                  {{ errors.name }}
                </div>
                <small class="form-text text-muted">Nombre descriptivo de la categoría.</small>
              </div>

              <!-- Iconos -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Icono Recomendado</label>
                <div class="d-flex flex-wrap gap-3 mb-3">
                  <button
                    v-for="icon in tourismIcons"
                    :key="icon.value"
                    type="button"
                    class="btn btn-outline-primary d-flex flex-column align-items-center rounded-circle"
                    :class="{ 'active': form.icon === icon.value }"
                    @click="form.icon = icon.value"
                    style="width: 70px; height: 70px; justify-content: center;"
                  >
                    <i class="bi fs-4" :class="icon.value"></i>
                    <small class="mt-1 text-center">{{ icon.label }}</small>
                  </button>
                </div>

                <!-- Campo personalizado -->
                <label for="categoryIcon" class="form-label fw-semibold">O escribe el nombre del icono</label>
                <div class="input-group input-group-lg rounded-pill">
                  <span class="input-group-text bg-light border-0">
                    <i :class="form.icon || 'bi-question-circle'" class="bi"></i>
                  </span>
                  <input
                    v-model.trim="form.icon"
                    id="categoryIcon"
                    type="text"
                    class="form-control border-0"
                    placeholder="Ej: bi-airplane, bi-umbrella, bi-camera"
                  >
                </div>
                <small class="text-muted">
                  Explora más iconos en <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">Bootstrap Icons</a>
                </small>
              </div>

              <!-- Botones -->
              <div class="d-flex justify-content-between border-top pt-4">
                <router-link
                  :to="{ name: 'AdminEntrepreneurDashboard' }"
                  class="btn btn-outline-secondary rounded-pill"
                >
                  <i class="bi bi-x-circle me-1"></i> Cancelar
                </router-link>
                <button
                  type="submit"
                  class="btn btn-primary rounded-pill"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-else :class="category.id ? 'bi-check-circle' : 'bi-save'" class="bi me-1"></i>
                  {{ category.id ? 'Actualizar' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  name: 'TourismCategoryForm',
  props: {
    category: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: this.category.name || '',
        icon: this.category.icon || 'bi-geo-alt'
      },
      errors: {},
      loading: false,
      tourismIcons: [
        { value: 'bi-geo-alt', label: 'Lugar' },
        { value: 'bi-airplane', label: 'Aéreo' },
        { value: 'bi-bicycle', label: 'Ciclismo' },
        { value: 'bi-camera', label: 'Fotografía' },
        { value: 'bi-cup-hot', label: 'Gastronomía' },
        { value: 'bi-tree', label: 'Naturaleza' },
        { value: 'bi-water', label: 'Acuático' },
        { value: 'bi-signpost', label: 'Aventura' },
        { value: 'bi-building', label: 'Urbano' },
        { value: 'bi-flower1', label: 'Cultural' }
      ],
      showAlert: false,
      showError: false
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.form.name.trim()) {
        this.errors.name = 'El nombre es requerido';
        isValid = false;
      } else if (this.form.name.length < 3) {
        this.errors.name = 'Mínimo 3 caracteres';
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      if (!this.validateForm()) return;

      this.loading = true;

      const request = this.category.id
        ? api.put(`/categories/${this.category.id}`, this.form)
        : api.post('/categories', this.form);

      request
        .then(() => {
          this.$emit('saved');
          // Mostrar alerta de éxito
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
            this.$router.push({ name: 'AdminCategoriesList' });
          }, 1500);
        })
        .catch(error => {
          console.error('Error al guardar:', error);
          // Mostrar alerta de error
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.bg-gradient-tourism {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
}

.card {
  border-radius: 1rem;
  overflow: hidden;
  border: none;
}

.card-header {
  padding: 1.25rem 1.5rem;
}

.form-control-lg {
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
}

.input-group-lg .input-group-text {
  padding: 0.8rem 1rem;
  background-color: #e9ecef;
  border: none;
}

.btn.active {
  background-color: #1e88e5;
  color: white;
  border-color: #1e88e5;
}

.btn-outline-primary {
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
}

.alert-success {
  border-radius: 0.75rem;
}

.btn-outline-light {
  --bs-btn-color: #fff;
  --bs-btn-border-color: #fff;
  --bs-btn-hover-bg: rgba(255, 255, 255, 0.15);
  --bs-btn-hover-border-color: #fff;
}

.btn-primary {
  --bs-btn-bg: #007bff;
  --bs-btn-border-color: #007bff;
  --bs-btn-hover-bg: #0056b3;
  --bs-btn-hover-border-color: #004085;
}
</style>
