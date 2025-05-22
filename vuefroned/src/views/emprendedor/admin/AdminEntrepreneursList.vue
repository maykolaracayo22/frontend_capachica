<template>
  <div class="container-fluid py-4">
    <div class="card shadow-sm border-0">
      <!-- Header con título y botones -->
      <div class="card-header bg-gradient-tourism text-white d-flex justify-content-between align-items-center">
        <h2 class="h4 mb-0">
          <i class="bi bi-people-fill me-2"></i>
          Gestión de Emprendedores Turísticos
        </h2>
        <div>
          <router-link 
            :to="{ name: 'AdminEntrepreneurDashboard' }"
            class="btn btn-light btn-sm me-2"
          >
            <i class="bi bi-arrow-left me-1"></i> Volver
          </router-link>
          <router-link
            :to="{ name: 'EntrepreneurForm' }"
            class="btn btn-light btn-sm"
          >
            <i class="bi bi-plus-lg me-1"></i> Nuevo
          </router-link>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="card-body border-bottom">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input 
                v-model="searchQuery"
                type="text" 
                class="form-control" 
                placeholder="Buscar emprendedores..."
                @input="filterEntrepreneurs"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="selectedCategory" class="form-select" @change="filterEntrepreneurs">
              <option value="">Todas las categorías</option>
              <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="selectedAssociation" class="form-select" @change="filterEntrepreneurs">
              <option value="">Todas las asociaciones</option>
              <option v-for="association in associations" :value="association.id">{{ association.name }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise"></i> Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Estados de carga y error -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-2">Cargando emprendedores...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger m-4">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Error al cargar los emprendedores
      </div>

      <!-- Tabla de datos -->
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="text-center" style="width: 50px">#</th>
              <th>Emprendedor</th>
              <th class="d-none d-lg-table-cell">Contacto</th>
              <th>Negocio</th>
              <th class="d-none d-md-table-cell">Ubicación</th>
              <th class="text-center">Estado</th>
              <th class="text-end" style="width: 180px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entrepreneur, index) in filteredEntrepreneurs" :key="entrepreneur.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <img 
                    v-if="entrepreneur.profile_image_url" 
                    :src="entrepreneur.profile_image_url" 
                    class="rounded-circle me-3" 
                    style="width: 40px; height: 40px; object-fit: cover" 
                    alt="Foto"
                  >
                  <div>
                    <div class="fw-semibold">{{ entrepreneur.user.name }}</div>
                    <small class="text-muted d-block">{{ entrepreneur.user.email }}</small>
                  </div>
                </div>
              </td>
              <td class="d-none d-lg-table-cell">
                <div>{{ entrepreneur.phone }}</div>
                <small class="text-muted">{{ entrepreneur.user.email }}</small>
              </td>
              <td>
                <div class="fw-medium">{{ entrepreneur.business_name }}</div>
                <div class="small">
                  <span v-for="category in entrepreneur.categories" class="badge bg-primary-subtle text-primary me-1">
                    {{ category.name }}
                  </span>
                </div>
              </td>
              <td class="d-none d-md-table-cell">
                <div>{{ entrepreneur.district }}</div>
                <small class="text-muted">{{ entrepreneur.association?.name }}</small>
              </td>
              <td class="text-center">
                <span class="badge" :class="entrepreneur.user.active ? 'bg-success' : 'bg-secondary'">
                  {{ entrepreneur.user.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <router-link
                    :to="{ name: 'EntrepreneurEdit', params: { id: entrepreneur.id } }"
                    class="btn btn-sm btn-outline-primary"
                    title="Editar"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </router-link>

                  <button 
                    @click="showCredentials(entrepreneur)"
                    class="btn btn-sm btn-outline-info"
                    title="Ver credenciales"
                  >
                    <i class="bi bi-key"></i>
                  </button>
                  <router-link
                    :to="{ name: 'EntrepreneurDetail', params: { id: entrepreneur.id } }"
                    class="btn btn-sm btn-outline-secondary"
                    title="Ver detalle"
                  >
                    <i class="bi bi-eye"></i>
                  </router-link>
                  <button 
                    @click="confirmDelete(entrepreneur.id)"
                    class="btn btn-sm btn-outline-danger"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                  <button 
                  @click="updateStatus(entrepreneur)"
                  class="btn btn-sm btn-outline-warning"
                  title="Cambiar estado"
                >
                  <i class="bi bi-arrow-repeat"></i>
                </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div v-if="filteredEntrepreneurs.length > 0" class="d-flex justify-content-between align-items-center p-3 border-top">
          <div class="text-muted small">
            Mostrando {{ filteredEntrepreneurs.length }} de {{ entrepreneurs.length }} registros
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--">&laquo;</button>
              </li>
              <li 
                v-for="page in totalPages" 
                class="page-item" 
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++">&raquo;</button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Mensaje sin resultados -->
        <div v-if="!loading && filteredEntrepreneurs.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-people display-6 opacity-50"></i>
          <p class="mt-2 mb-0">No se encontraron emprendedores</p>
          <p class="small">Intenta con otros criterios de búsqueda</p>
        </div>
      </div>
    </div>

    <!-- Modal de Credenciales -->
    <div v-if="showCredentialsModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-key me-2"></i>
              Credenciales de Acceso
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showCredentialsModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Emprendedor</label>
              <input type="text" class="form-control" :value="selectedEntrepreneur?.user?.name" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="text" class="form-control" :value="selectedEntrepreneur?.user?.email" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña Temporal</label>
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  :value="selectedEntrepreneur?.user?.temp_password || 'No generada'" 
                  readonly
                  ref="passwordInput"
                >
                <button 
                  v-if="selectedEntrepreneur?.user?.temp_password"
                  class="btn btn-outline-secondary" 
                  type="button"
                  @click="copyPassword"
                >
                  <i class="bi bi-clipboard"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showCredentialsModal = false">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showDeleteModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de eliminar permanentemente a <strong>{{ selectedEntrepreneur?.user?.name }}</strong>?</p>
            <p class="text-muted small mb-0">Esta acción no se puede deshacer y eliminará todos los datos asociados.</p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteEntrepreneur">
              <i class="bi bi-trash me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'AdminEntrepreneursList',
  emits: ['edit'],
  setup() {
    // Datos principales
    const entrepreneurs = ref([]);
    const categories = ref([]);
    const associations = ref([]);
    const loading = ref(false);
    const error = ref(false);

    // Filtros y búsqueda
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const selectedAssociation = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Modales y selección
    const showCredentialsModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedEntrepreneur = ref(null);
    const entrepreneurToDelete = ref(null);

    // Obtener datos iniciales
    const fetchData = async () => {
      loading.value = true;
      error.value = false;
      try {
        const [entRes, catRes, assocRes] = await Promise.all([
          api.get('/entrepreneurs'),
          api.get('/categories'),
          api.get('/associations')
        ]);
        
        entrepreneurs.value = entRes.data.data || entRes.data;
        categories.value = catRes.data;
        associations.value = assocRes.data;
      } catch (err) {
        console.error('Error al cargar datos:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    // Filtrar emprendedores
    const filteredEntrepreneurs = computed(() => {
      let filtered = entrepreneurs.value;
      
      // Aplicar filtros
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(e => 
          e.user.name.toLowerCase().includes(query) ||
          e.user.email.toLowerCase().includes(query) ||
          e.business_name.toLowerCase().includes(query) ||
          e.phone.toLowerCase().includes(query)
        );
      }
      
      if (selectedCategory.value) {
        filtered = filtered.filter(e => 
          e.categories.some(c => c.id === selectedCategory.value)
        );
      }
      
      if (selectedAssociation.value) {
        filtered = filtered.filter(e => 
          e.association_id === selectedAssociation.value
        );
      }
      
      // Paginación
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filtered.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(entrepreneurs.value.length / itemsPerPage.value);
    });

    // Resetear filtros
    const resetFilters = () => {
      searchQuery.value = '';
      selectedCategory.value = '';
      selectedAssociation.value = '';
      currentPage.value = 1;
    };

    // Mostrar credenciales
    const showCredentials = (entrepreneur) => {
      selectedEntrepreneur.value = entrepreneur;
      showCredentialsModal.value = true;
    };

    // Copiar contraseña
    const copyPassword = () => {
      const input = document.querySelector('#passwordInput');
      input.select();
      document.execCommand('copy');
      alert('Contraseña copiada al portapapeles');
    };

    // Confirmar eliminación
    const confirmDelete = (id) => {
      entrepreneurToDelete.value = id;
      selectedEntrepreneur.value = entrepreneurs.value.find(e => e.id === id);
      showDeleteModal.value = true;
    };

    // Eliminar emprendedor
    const deleteEntrepreneur = async () => {
      try {
        await api.delete(`/entrepreneurs/${entrepreneurToDelete.value}`);
        entrepreneurs.value = entrepreneurs.value.filter(e => e.id !== entrepreneurToDelete.value);
        showDeleteModal.value = false;
        alert('Emprendedor eliminado exitosamente');
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el emprendedor');
      }
    };

    // Actualizar estado del emprendedor
    const updateStatus = async (entrepreneur) => {
  try {
    // Asegúrate de que el ID del emprendedor sea válido
    if (!entrepreneur || !entrepreneur.id) {
      throw new Error('ID de emprendedor no válido');
    }

    // Realizar la solicitud POST
    const res = await api.post(`/entrepreneurs/${entrepreneur.id}/toggle-status`);
    const updatedEntrepreneur = res.data.entrepreneur;

    // Actualiza la lista de emprendedores
    const index = entrepreneurs.value.findIndex(e => e.id === updatedEntrepreneur.id);
    if (index !== -1) {
      entrepreneurs.value[index] = updatedEntrepreneur;
    }

    alert('Estado actualizado exitosamente');
  } catch (err) {
    console.error('Error al actualizar el estado:', err);
    alert('Error al actualizar el estado del emprendedor');
  }
};

    onMounted(fetchData);

    return {
      // Datos
      entrepreneurs,
      categories,
      associations,
      loading,
      error,
      
      // Filtros
      searchQuery,
      selectedCategory,
      selectedAssociation,
      currentPage,
      itemsPerPage,
      filteredEntrepreneurs,
      totalPages,
      
      // Funciones
      resetFilters,
      showCredentials,
      copyPassword,
      confirmDelete,
      deleteEntrepreneur,
      updateStatus,
      
      // Modales
      showCredentialsModal,
      showDeleteModal,
      selectedEntrepreneur,
      entrepreneurToDelete
    };
  }
};
</script>

<style scoped>
.bg-gradient-tourism {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.badge.bg-primary-subtle {
  background-color: rgba(13, 110, 253, 0.1) !important;
  color: #0d6efd !important;
  padding: 0.25rem 0.5rem;
  font-weight: 500;
}

.btn-sm {
  padding: 0.35rem 0.65rem;
  border-radius: 0.375rem;
}

.modal-content {
  border-radius: 0.75rem;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .d-none {
    display: none !important;
  }
}
</style>
