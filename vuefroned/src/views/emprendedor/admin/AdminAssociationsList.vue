<template>
  <div class="container-fluid d-flex justify-content-center p-0">
    <div class="management-card card border-0 shadow-lg">
      <!-- Encabezado -->
      <div class="card-header bg-gradient-turquoise text-white">
        <div class="d-flex justify-content-between align-items-center">
          <router-link 
            :to="{ name: 'AdminEntrepreneurDashboard' }"
            class="btn btn-light btn-sm d-inline-flex align-items-center"
            aria-label="Volver al Panel Principal"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Panel Principal
          </router-link>
          <h3 class="h5 mb-0">
            <i class="bi bi-people-fill me-2"></i>
            Gestión de Asociaciones
          </h3>
          <router-link
            :to="{ name: 'AssociationForm' }"
            class="btn btn-primary btn-sm"
            aria-label="Agregar nueva asociación"
          >
            <i class="bi bi-plus-lg me-1"></i> Nueva
          </router-link>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="card-body p-0">
        <!-- Estados de carga -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-muted mt-2 mb-0">Cargando asociaciones...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="error" class="alert alert-danger mx-3 mt-3 mb-0">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Error al cargar las asociaciones
        </div>

        <!-- Tabla de datos -->
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="text-primary ps-3">Nombre</th>
                <th class="text-primary d-none d-md-table-cell">Descripción</th>
                <th class="text-primary">Región</th>
                <th class="text-primary text-end pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="association in associations" 
                :key="association.id"
                class="hover-effect"
              >
                <td class="ps-3">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-building me-2 text-primary"></i>
                    <div>
                      <div class="fw-medium">{{ association.name }}</div>
                      <small class="text-muted d-block">ID: {{ association.id }}</small>
                    </div>
                  </div>
                </td>
                <td class="d-none d-md-table-cell text-muted">
                  {{ truncateDescription(association.description) }}
                </td>
                <td>
                  <span class="badge bg-primary-subtle text-primary">
                    {{ association.region || 'Sin región' }}
                  </span>
                </td>
                <td class="text-end pe-3">
                  <div class="d-flex gap-1 justify-content-end">
                    <button 
                      @click="$emit('edit', association)"
                      class="btn btn-sm btn-outline-primary"
                      aria-label="Editar asociación"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button 
                    @click="openDeleteModal(association.id)"
                    :disabled="association.entrepreneurs_count > 0"
                    class="btn btn-sm btn-outline-danger"
                    >
                    <i class="bi bi-trash"></i>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mensaje sin resultados -->
          <div v-if="associations.length === 0" class="text-center text-muted py-4">
            <i class="bi bi-inbox display-6 opacity-50"></i>
            <p class="mt-2 mb-0">No se encontraron asociaciones registradas</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="card-footer bg-white border-top py-2 px-3">
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            Mostrando {{ associations.length }} registros
          </small>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div 
        v-if="showDeleteModal" 
        class="modal fade show" 
        style="display: block; background: rgba(0,0,0,0.5)"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-gradient-danger text-white py-2">
              <h5 class="modal-title mb-0">
                <i class="bi bi-exclamation-octagon me-2"></i>
                Confirmar eliminación
              </h5>
              <button 
                type="button" 
                class="btn-close btn-close-white" 
                @click="closeDeleteModal"
              ></button>
            </div>
            <div class="modal-body py-3">
              <p class="mb-2">¿Estás seguro de eliminar permanentemente esta asociación?</p>
              <p class="text-muted small mb-0">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer border-0 py-2">
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="closeDeleteModal"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                class="btn btn-danger" 
                @click="confirmDelete"
              >
                <i class="bi bi-trash me-1"></i>Eliminar
              </button>
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
  data() {
    return {
      associations: [],
      loading: false,
      error: false,
      showDeleteModal: false,
      selectedAssociation: null
    };
  },
  mounted() {
    this.fetchAssociations();
  },
  methods: {
    async fetchAssociations() {
      this.loading = true;
      try {
        const response = await api.get('/associations');
        this.associations = response.data.data || response.data;
        this.error = false;
      } catch (error) {
        console.error('Error al cargar asociaciones:', error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    truncateDescription(text) {
      if (!text) return 'Sin descripción';
      return text.length > 60 ? text.substring(0, 60) + '...' : text;
    },

    openDeleteModal(id) {
      this.selectedAssociation = id;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedAssociation = null;
    },

    async confirmDelete() {
  if (!this.selectedAssociation) return;

  try {
    await api.delete(`/associations/${this.selectedAssociation}`);
    this.associations = this.associations.filter(a => a.id !== this.selectedAssociation);
    this.closeDeleteModal();
  } catch (error) {
    console.error('Error al eliminar:', error);
    const message = error.response?.data?.message || 'No se pudo completar la eliminación';
    alert(message);
  }
}

  }
};
</script>

<style scoped>
.container-fluid {
  max-width: 1200px;
  min-height: calc(100vh - 2rem);
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.management-card {
  border-radius: 0.75rem;
  overflow: hidden;
  width: 100%;
}

.card-header {
  border-bottom: none;
  padding: 1rem;
  background: linear-gradient(45deg, #1c9c9c, #53a6a1);
}

.h5 {
  font-size: 1.25rem;
}

.table {
  --bs-table-bg: transparent;
  border-color: #e2e8f0;
}

.table th, .table td {
  padding: 1rem 1.25rem;
  font-size: 1rem;
}

.table th {
  font-weight: bold;
}

.table td {
  vertical-align: middle;
}

.hover-effect:hover {
  background-color: rgba(241, 245, 249, 0.5) !important;
  transition: background-color 0.15s ease;
}

.badge.bg-primary-subtle {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
}

.text-muted {
  font-size: 0.875rem;
}

.modal-content {
  border-radius: 0.75rem;
}

.modal-header {
  padding: 1rem;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }

  .card-header {
    padding: 0.75rem;
  }

  .table th, .table td {
    padding: 0.75rem;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
  }
}
</style>
