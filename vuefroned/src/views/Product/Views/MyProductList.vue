<template>
  <main class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="h3 fw-bold text-gradient">Mis Productos</h1>
        <p class="text-muted mb-0">Administra tu inventario de productos</p>
      </div>
      <router-link 
        to="/products/create" 
        class="btn btn-primary rounded-pill px-4 py-2 shadow-sm"
      >
        <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando tu colección de productos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-glass alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-octagon-fill me-2"></i>
      {{ error }}
      <button type="button" class="btn-close" @click="error = null" aria-label="Cerrar"></button>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="empty-state text-center py-5">
      <div class="empty-state-icon mb-4">
        <i class="bi bi-box-seam display-4 text-muted"></i>
      </div>
      <h3 class="h4 mb-3">Tu inventario está vacío</h3>
      <p class="text-muted mb-4">Comienza agregando productos para mostrarlos aquí</p>
      <router-link to="/products/create" class="btn btn-primary rounded-pill px-4 py-2">
        <i class="bi bi-plus-lg me-2"></i>Agregar primer producto
      </router-link>
    </div>

    <!-- Products Grid -->
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      <div v-for="product in products" :key="product.id" class="col">
        <div class="product-card card border-0 h-100 overflow-hidden">
          <!-- Product Image with Floating Badge -->
          <div class="product-image-wrapper position-relative">
            <img
              :src="product.main_image || 'https://via.placeholder.com/400x300/f8f9fa/6c757d?text=Sin+imagen'"
              class="product-image card-img-top"
              :alt="`Imagen de ${product.name}`"
              loading="lazy"
            >
            <div class="product-badge position-absolute top-0 end-0 m-3">
              <span class="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2">
                <i class="bi bi-tag-fill me-1"></i>
                {{ product.status || 'Disponible' }}
              </span>
            </div>
          </div>
          
          <!-- Product Body -->
          <div class="card-body p-4 d-flex flex-column">
            <!-- Categories -->
            <div v-if="product.categories.length > 0" class="product-categories mb-2">
              <span 
                v-for="category in product.categories" 
                :key="category.id" 
                class="badge bg-light text-dark rounded-pill border me-1 mb-1"
              >
                {{ category.name }}
              </span>
            </div>
            
            <!-- Title and Description -->
            <h3 class="product-title h5 mb-2">{{ product.name }}</h3>
            <p class="product-description text-muted mb-3 flex-grow-1">
              {{ truncateDescription(product.description) }}
            </p>
            
            <!-- Price and Location -->
            <div class="product-meta d-flex justify-content-between align-items-center mb-3">
              <div class="product-price">
                <span class="h5 fw-bold text-primary">${{ formatPrice(product.price) }}</span>
              </div>
              <div class="product-location text-end">
                <small class="text-muted">
                  <i class="bi bi-geo-alt-fill me-1"></i>
                  {{ product.place?.name || '—' }}
                </small>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="product-actions d-flex gap-2">
              <router-link 
                :to="`/products/edit/${product.id}`" 
                class="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill"
                title="Editar producto"
              >
                <i class="bi bi-pencil-fill me-1"></i> Editar
              </router-link>
              <button 
                @click="confirmDelete(product)" 
                class="btn btn-outline-danger btn-sm flex-grow-1 rounded-pill"
                title="Eliminar producto"
              >
                <i class="bi bi-trash-fill me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Confirmar eliminación</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body py-4">
            <div class="text-center mb-4">
              <i class="bi bi-exclamation-triangle-fill text-danger display-4"></i>
            </div>
            <p class="text-center mb-1">¿Estás seguro de eliminar el producto:</p>
            <h4 class="text-center fw-bold mb-3">{{ productToDelete?.name }}</h4>
            <p class="text-center text-danger small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-lg btn-outline-secondary rounded-pill px-4" @click="showDeleteModal = false">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-lg btn-danger rounded-pill px-4" 
              @click="deleteProductConfirmed"
              :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ deleting ? 'Eliminando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
  </main>
</template>

<script>
import api from '@/services/axios';

export default {
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      showDeleteModal: false,
      productToDelete: null,
      deleting: false
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.get('/products/my');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Error al cargar tus productos. Por favor, intenta nuevamente.';
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },
    async deleteProductConfirmed() {
      if (!this.productToDelete) return;
      
      this.deleting = true;
      try {
        await api.delete(`/products/${this.productToDelete.id}`);
        this.products = this.products.filter(p => p.id !== this.productToDelete.id);
        this.showDeleteModal = false;
        
        // Mostrar notificación de éxito
        this.$toast.success('Producto eliminado correctamente', {
          position: 'top-right',
          duration: 3000,
          icon: 'bi bi-check-circle-fill'
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        this.$toast.error('Error al eliminar el producto', {
          position: 'top-right',
          duration: 3000,
          icon: 'bi bi-exclamation-circle-fill'
        });
      } finally {
        this.deleting = false;
        this.productToDelete = null;
      }
    },
    truncateDescription(text, maxLength = 120) {
      if (!text) return 'Este producto no tiene descripción';
      return text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text;
    },
    formatPrice(price) {
      return new Intl.NumberFormat('es-ES').format(price);
    }
  }
};
</script>

<style scoped>
/* Text Gradient Effect */
.text-gradient {
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

/* Glass Effect for Alerts */
.alert-glass {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Product Card Styles */
.product-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.product-image {
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
}

.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Modal Styles */
.modal-content {
  border-radius: 16px;
}

.modal-header, .modal-footer {
  padding: 1.5rem;
}

.modal-body {
  padding: 0 1.5rem;
}

/* Empty State */
.empty-state {
  background: rgba(248, 249, 250, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px dashed #dee2e6;
}

.empty-state-icon {
  opacity: 0.7;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .product-image {
    height: 180px;
  }
  
  .product-actions .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>