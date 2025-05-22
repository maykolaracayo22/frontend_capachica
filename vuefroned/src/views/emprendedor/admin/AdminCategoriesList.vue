<template>
  <div class="container py-5">
    <div class="card shadow-lg border-0 rounded-lg">
      <div class="card-header bg-primary text-white py-3 px-4 rounded-top">
        <div class="d-flex justify-content-between align-items-center">
          <router-link 
            :to="{ name: 'AdminEntrepreneurDashboard' }"
            class="btn btn-light btn-sm d-inline-flex align-items-center"
            aria-label="Volver al Panel Principal"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Panel Principal
          </router-link>
          <h2 class="h6 mb-0 fw-bold d-flex align-items-center">
            <i class="bi bi-tags-fill me-2"></i>
            Gestionar Categorías de Turismo
          </h2>
          <router-link
            :to="{ name: 'CategoryForm' }"
            class="btn btn-sm btn-light rounded-pill"
            title="Crear nueva categoría"
          >
            <i class="bi bi-plus-lg me-1"></i> Nueva
          </router-link>
        </div>
        <p class="mb-0 mt-1 small text-white-50">Administra las secciones de tu oferta turística.</p>
      </div>

      <div class="card-body p-0">
        <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-muted mt-2">Cargando el catálogo de categorías...</p>
        </div>

        <div v-if="error" class="alert alert-danger m-4 rounded-lg d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <p class="mb-0">¡Oops! No pudimos cargar las categorías. Intenta recargar la página.</p>
        </div>

        <div v-if="categories.length === 0 && !loading" class="text-center py-5">
          <i class="bi bi-tag display-4 text-muted opacity-50"></i>
          <p class="mt-3 mb-0 text-muted">No hay categorías creadas aún. ¡Empieza a agregar!</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle m-0">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="px-3 py-3 text-center border-bottom" style="width: 70px;">#</th>
                <th scope="col" class="px-3 py-3 border-bottom">Nombre de la Categoría</th>
                <th scope="col" class="px-3 py-3 text-end border-bottom" style="width: 180px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in categories" :key="category.id">
                <td class="px-3 py-2 text-center">{{ index + 1 }}</td>
                <td class="px-3 py-2">{{ category.name }}</td>
                <td class="px-3 py-2 text-end">
                  <div class="btn-group" role="group">
                    <router-link
                      :to="{ name: 'CategoryForm', params: { id: category.id } }"
                      class="btn btn-sm btn-outline-primary rounded-pill me-2"
                      title="Editar categoría"
                    >
                      <i class="bi bi-pencil-square"></i> Editar
                    </router-link>
                    <button
                      class="btn btn-sm btn-outline-danger rounded-pill"
                      @click="deleteCategory(category.id)"
                      title="Eliminar categoría"
                    >
                      <i class="bi bi-trash-fill"></i> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="categories.length > 0" class="card-footer bg-white py-3 px-4 border-top rounded-bottom text-muted small">
        Total de categorías: {{ categories.length }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  data() {
    return {
      categories: [],
      loading: false,
      error: false
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      this.loading = true;
      this.error = false;
      api.get('/categories')
        .then(res => {
          this.categories = res.data.data || res.data;
        })
        .catch(() => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteCategory(id) {
      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        api.delete(`/categories/${id}`)
          .then(() => {
            this.categories = this.categories.filter(c => c.id !== id);
            this.$toast.success('Categoría eliminada con éxito.'); // Asegúrate de tener un plugin de notificaciones como vue-toastification
          })
          .catch(() => {
            this.$toast.error('No se pudo eliminar la categoría.');
          });
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem !important; /* Más redondeado */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; /* Sombra más pronunciada */
}

.card-header {
  background-color: #007bff !important; /* Azul primario de Bootstrap */
  padding: 1.25rem 1.5rem !important;
}

.card-header h2 {
  font-size: 1.1rem !important;
}

.btn-light {
  --bs-btn-bg: transparent !important;
  --bs-btn-border-color: rgba(255, 255, 255, 0.8) !important;
  --bs-btn-color: white !important;
  --bs-btn-hover-bg: rgba(255, 255, 255, 0.15) !important;
  --bs-btn-hover-border-color: rgba(255, 255, 255, 0.8) !important;
}

.table th,
.table td {
  padding: 1rem !important;
  font-size: 0.9rem !important;
}

.table thead th {
  font-weight: 600 !important;
  color: #495057 !important;
  background-color: #f8f9fa !important;
  border-bottom: 2px solid #dee2e6 !important;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.075) !important; /* Hover sutil */
}

.btn-sm {
  padding: 0.4rem 0.8rem !important;
  font-size: 0.8rem !important;
  border-radius: 0.5rem !important; /* Más redondeado */
}

.btn-outline-primary {
  border-color: #007bff !important;
  color: #007bff !important;
}

.btn-outline-primary:hover {
  background-color: #007bff !important;
  color: #fff !important;
}

.btn-outline-danger {
  border-color: #dc3545 !important;
  color: #dc3545 !important;
}

.btn-outline-danger:hover {
  background-color: #dc3545 !important;
  color: #fff !important;
}

.alert-danger {
  border-radius: 0.5rem !important;
}
</style>