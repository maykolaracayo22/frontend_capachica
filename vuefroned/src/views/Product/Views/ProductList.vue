<template>
  <div>
    <h2>Lista de Productos Turísticos</h2>
    <router-link to="/products/create" class="btn btn-primary mb-3">
      Crear Nuevo Producto
    </router-link>
    
    <div v-if="loading" class="text-center">Cargando...</div>
    
    <div v-else>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" v-for="product in products" :key="product.id">
          <div class="card h-100">
            <img 
              :src="product.main_image || 'https://via.placeholder.com/300'" 
              class="card-img-top" 
              :alt="product.name"
            >
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <p class="text-muted">Precio: ${{ product.price }}</p>
              
              <!-- Mostrar lugar asociado al producto -->
              <p class="text-muted">Ubicación: {{ product.place ? product.place.name : 'No disponible' }}</p>

              <!-- Mostrar categorías asociadas al producto -->
              <div class="mb-2">
                <span v-for="category in product.categories" :key="category.id" class="badge bg-secondary me-1">
                  {{ category.name }}
                </span>
              </div>

              <div class="btn-group">
                <router-link 
                  :to="`/products/edit/${product.id}`" 
                  class="btn btn-sm btn-outline-secondary"
                >
                  Editar
                </router-link>
                <button 
                  @click="deleteProduct(product.id)" 
                  class="btn btn-sm btn-outline-danger"
                >
                  Eliminar
                </button>
              </div>
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
      products: [],
      loading: true,
      error: null
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.get('/products');
        // Aseguramos que cada producto tenga sus categorías y lugar cargado correctamente
        this.products = response.data.map(product => ({
          ...product,
          categories: product.categories || [],
          place: product.place || null
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'No se pudieron cargar los productos';
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct(id) {
      if (!confirm('¿Estás seguro de eliminar este producto?')) return;
      
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  }
};
</script>

<style scoped>
.spinner-border { 
  vertical-align: middle; 
  margin-right: 5px; 
}
.card-img-top {
  height: 200px;
  object-fit: cover;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}
.card-text {
  font-size: 1rem;
  color: #6c757d;
}
.badge {
  font-size: 0.9rem;
}
</style>
