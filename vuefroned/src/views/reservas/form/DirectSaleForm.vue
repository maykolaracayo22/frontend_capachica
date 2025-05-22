<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-8">
        <div class="card border-0 shadow-lg">
          <div class="card-header bg-gradient-primary text-white py-4">
            <h3 class="mb-0 text-center">
              <i class="bi bi-cart-check me-2"></i>Registrar Venta Presencial
            </h3>
          </div>
          
          <div class="card-body p-4 p-md-5">
            <form @submit.prevent="submit" class="needs-validation" novalidate>
              <!-- Sección Cliente - Diseño en Tarjeta -->
              <div class="card mb-4 border-0 shadow-sm">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-person-circle me-2"></i>Datos del Cliente</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <!-- Búsqueda de cliente -->
                    <div class="col-12">
                      <div class="input-group">
                        <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
                        <input v-model="emailSearch" type="email" class="form-control" placeholder="Buscar cliente por email" />
                        <button class="btn btn-primary" type="button" @click="findClient">
                          Buscar
                        </button>
                      </div>
                    </div>
                    
                    <!-- Campos de cliente -->
                    <div class="col-md-4">
                      <label class="form-label small text-uppercase text-muted fw-bold">Nombre *</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                        <input v-model="form.client_name" class="form-control" required />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small text-uppercase text-muted fw-bold">Teléfono *</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light"><i class="bi bi-phone"></i></span>
                        <input v-model="form.client_phone" class="form-control" required />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label small text-uppercase text-muted fw-bold">Email</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light"><i class="bi bi-envelope"></i></span>
                        <input v-model="form.client_email" class="form-control" type="email" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sección Producto - Diseño en Tarjeta -->
              <div class="card mb-4 border-0 shadow-sm">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-box-seam me-2"></i>Selección de Producto</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3 mb-4">
                    <!-- Filtros -->
                    <div class="col-md-6">
                      <label class="form-label small text-uppercase text-muted fw-bold">Categoría</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light"><i class="bi bi-tags"></i></span>
                        <select v-model="selectedCategory" @change="filterProducts" class="form-select">
                          <option value="">Todas las categorías</option>
                          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small text-uppercase text-muted fw-bold">Buscar producto</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
                        <input v-model="productFilter" @input="filterProducts" class="form-control" placeholder="Nombre del producto..." />
                      </div>
                    </div>
                    
                    <!-- Selector de producto -->
                    <div class="col-12">
                      <label class="form-label small text-uppercase text-muted fw-bold">Producto *</label>
                      <select v-model="form.product_id" class="form-select form-select-lg" required>
                        <option value="">Seleccione un producto...</option>
                        <option v-for="p in filteredProducts" :key="p.id" :value="p.id">
                          {{ p.name }} (S/ {{ p.price }})
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Vista previa del producto - Solo muestra si hay producto seleccionado -->
                  <div v-if="selectedProduct" class="product-preview mt-4">
                    <div class="row g-4">
                      <div class="col-md-5">
                        <div class="ratio ratio-1x1 rounded-3 overflow-hidden shadow-sm">
                          <img :src="selectedProduct.images[0]?.image_url || 'https://via.placeholder.com/500'" 
                               class="object-fit-cover" 
                               alt="Imagen del producto" />
                        </div>
                      </div>
                      <div class="col-md-7">
                        <h4 class="fw-bold">{{ selectedProduct.name }}</h4>
                        <div class="d-flex align-items-center mb-3">
                          <span class="h4 text-primary fw-bold me-3">S/ {{ selectedProduct.price }}</span>
                          <span class="badge bg-success bg-opacity-10 text-success">
                            <i class="bi bi-check-circle-fill me-1"></i>{{ selectedProduct.stock }} disponibles
                          </span>
                        </div>
                        
                        <div class="mb-3">
                          <span class="text-muted small">Categorías:</span>
                          <div class="mt-1">
                            <span v-for="cat in selectedProduct.categories" :key="cat.id" 
                                  class="badge bg-light text-dark me-1 mb-1">
                              {{ cat.name }}
                            </span>
                          </div>
                        </div>
                        
                        <div class="d-flex flex-wrap gap-2 mt-4">
                          <a :href="`/products/${selectedProduct.id}`" target="_blank" 
                             class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye me-1"></i> Ver detalles
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sección Pago - Diseño en Tarjeta -->
              <div class="card mb-4 border-0 shadow-sm">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-credit-card me-2"></i>Detalles de Pago</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <!-- Cantidad y Total -->
                    <div class="col-md-6">
                      <label class="form-label small text-uppercase text-muted fw-bold">Cantidad *</label>
                      <div class="input-group" style="max-width: 150px;">
                        <button class="btn btn-outline-secondary" type="button" @click="form.quantity > 1 ? form.quantity-- : null">
                          <i class="bi bi-dash"></i>
                        </button>
                        <input v-model.number="form.quantity" type="number" class="form-control text-center" min="1" required />
                        <button class="btn btn-outline-secondary" type="button" @click="form.quantity++">
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label small text-uppercase text-muted fw-bold">Total a pagar</label>
                      <div class="bg-light p-3 rounded-3 text-center">
                        <span class="h4 fw-bold text-primary">S/ {{ totalAmount }}</span>
                        <span v-if="form.quantity > 1" class="d-block small text-muted">
                          ({{ form.quantity }} × S/ {{ selectedProduct?.price }})
                        </span>
                      </div>
                    </div>
                    
                    <!-- Método de pago -->
                    <div class="col-12 mt-3">
                      <label class="form-label small text-uppercase text-muted fw-bold">Método de pago *</label>
                      <div class="d-flex flex-wrap gap-2">
                        <button type="button" 
                          v-for="method in paymentMethods" 
                          :key="method.value"
                          @click="form.payment_method = method.value"
                          :class="['btn btn-outline-primary flex-grow-1', { 'active': form.payment_method === method.value }]">
                          <i :class="method.icon"></i> {{ method.label }}
                        </button>
                      </div>
                    </div>
                    
                    <!-- Detalles adicionales -->
                    <div class="col-md-6 mt-3">
                      <label class="form-label small text-uppercase text-muted fw-bold">Código de operación</label>
                      <input v-model="form.operation_code" class="form-control" placeholder="Ej: YAPE-12345" />
                    </div>
                    
                    <div class="col-12 mt-3">
                      <label class="form-label small text-uppercase text-muted fw-bold">Nota adicional</label>
                      <textarea v-model="form.note" class="form-control" rows="2" placeholder="Detalles importantes..."></textarea>
                    </div>
                    
                    <!-- Comprobante -->
                    <div class="col-12 mt-3">
                      <label class="form-label small text-uppercase text-muted fw-bold">Comprobante (opcional)</label>
                      <div class="border rounded-3 p-3 text-center bg-light">
                        <input type="file" @change="handleImage" class="d-none" id="fileInput" accept="image/*" />
                        <label for="fileInput" class="btn btn-outline-primary d-inline-flex align-items-center">
                          <i class="bi bi-cloud-arrow-up me-2"></i> Subir imagen
                        </label>
                        <p class="small text-muted mb-0 mt-2">Formatos: JPG, PNG. Máx. 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón de envío -->
              <div class="d-grid mt-4">
                <button class="btn btn-primary btn-lg py-3 fw-bold shadow" :disabled="loading || !selectedProduct">
                  <template v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </template>
                  <template v-else>
                    <i class="bi bi-check-circle-fill me-2"></i> 
                    Confirmar Venta — S/ {{ totalAmount }}
                  </template>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mensaje de cliente creado -->
        <div v-if="clientCreated" class="alert alert-success mt-4 d-flex align-items-center shadow-sm">
          <i class="bi bi-check-circle-fill me-3 fs-4"></i>
          <div class="flex-grow-1">
            <strong>¡Cliente registrado con éxito!</strong> Invítalo a completar su perfil para futuras compras.
          </div>
          <a :href="`/register?phone=${form.client_phone}`" target="_blank" class="btn btn-success btn-sm ms-3">
            <i class="bi bi-send me-1"></i> Enviar invitación
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'
import { useDark } from '@vueuse/core'
import { ref, onMounted } from 'vue'

export default {
  name: 'DirectSaleForm',
  setup() {
    const isDark = useDark()
    return { isDark }
  },
  data() {
    return {
    loading: false,
    emailSearch: '',
    productFilter: '',
    selectedCategory: '',
    products: [],
    filteredProducts: [],
    categories: [],
    paymentMethods: [
      { value: 'efectivo', label: 'Efectivo', icon: 'bi bi-cash' },
      { value: 'yape', label: 'Yape', icon: 'bi bi-phone' },
      { value: 'plin', label: 'Plin', icon: 'bi bi-phone' },
      { value: 'transferencia', label: 'Transferencia', icon: 'bi bi-bank' }
    ],
    // ✅ Elimina el "form" anidado innecesariamente
    form: {
      product_id: '',
      client_name: '',
      client_phone: '',
      client_email: '',
      quantity: 1,
      payment_method: '',
      operation_code: '',
      note: '',
      image_file: null
    },
    clientCreated: false
  }
},
  computed: {
    selectedProduct() {
      return this.products.find(p => p.id === this.form.product_id)
    },
    totalAmount() {
      return this.selectedProduct ? (this.selectedProduct.price * this.form.quantity).toFixed(2) : '0.00'
    }
  },
  async mounted() {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ])
      this.products = prodRes.data
      this.filteredProducts = prodRes.data
      this.categories = catRes.data
    } catch (err) {
      console.error('Error cargando datos:', err)
    }
  },
  methods: {
    handleImage(event) {
      this.form.image_file = event.target.files[0]
    },
    filterProducts() {
      const filter = this.productFilter.toLowerCase()
      this.filteredProducts = this.products.filter(p => {
        const matchesCategory = this.selectedCategory
          ? p.categories?.some(c => c.id == this.selectedCategory)
          : true
        const matchesName = p.name.toLowerCase().includes(filter)
        return matchesCategory && matchesName
      })
    },
    async findClient() {
      if (!this.emailSearch) return alert('Ingresa un correo válido')
      try {
        const res = await api.get(`/users/search?email=${this.emailSearch}`)
        const user = res.data
        this.form.client_name = user.name
        this.form.client_phone = user.phone
        this.form.client_email = user.email
      } catch (e) {
        alert('Cliente no encontrado. Completa los datos manualmente.')
        console.warn('Cliente no encontrado:', e)
      }
    },
    async submit() {
      this.loading = true
      try {
        const formData = new FormData()
Object.entries(this.form).forEach(([key, value]) => {
  if (value !== null && value !== '') {
    formData.append(key, value)
  }
})


        const res = await api.post('/reservations/direct-sale', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('✅ Venta registrada correctamente')
        this.clientCreated = res.data?.reservation?.user_id && res.data?.client_created
        this.resetForm()
      } catch (e) {
        if (e.response?.status === 422) {
          alert('❌ Campos inválidos. Revisa los datos.')
          console.error('Validación:', e.response.data.errors)
        } else {
          alert('❌ Error inesperado')
          console.error(e)
        }
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.form = {
        product_id: '',
        client_name: '',
        client_phone: '',
        client_email: '',
        quantity: 1,
        payment_method: '',
        operation_code: '',
        note: '',
        image_file: null
      }
      this.emailSearch = ''
      this.productFilter = ''
      this.selectedCategory = ''
      this.filteredProducts = this.products
    }
  }
}
</script>

<style scoped>
/* Colores primarios y de acento */
:root {
  --primary-color: #00b8d4; /* Turquesa vibrante, evoca destinos tropicales y aventura */
  --secondary-color: #ffc107; /* Amarillo dorado, representa el sol, la alegría y la energía */
  --accent-color: #28a745; /* Verde esmeralda, simboliza naturaleza, frescura y exploración */
  --light-background: #f8f9fa; /* Gris muy claro, para fondos suaves */
  --dark-background: #343a40; /* Gris oscuro, para contrastes elegantes en modo oscuro */
  --text-primary: #212529; /* Negro suave para el texto principal */
  --text-secondary: #6c757d; /* Gris para texto secundario o menos importante */
  --border-color: #dee2e6; /* Gris claro para bordes sutiles */
}

.card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color); /* Añadido borde */
  background-color: white; /* Fondo blanco por defecto */
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important; /* Sombra sutil al pasar el ratón */
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
  background: var(--primary-color); /* Encabezado en turquesa */
  color: white !important;
}

.product-preview {
  background-color: rgba(var(--primary-color-rgb), 0.1); /* Fondo turquesa suave */
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px dashed var(--accent-color); /* Borde punteado en verde */
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-outline-primary.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 8px rgba(var(--primary-color-rgb), 0.2);
}

.form-control,
.form-select {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  background-color: var(--light-background); /* Fondo gris claro */
  color: var(--text-primary);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--secondary-color); /* Foco en amarillo dorado */
  box-shadow: 0 0 0 0.25rem rgba(var(--secondary-color-rgb), 0.15);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  border-radius: 10px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0097a7; /* Un tono más oscuro al pasar el ratón */
  border-color: #0097a7;
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.btn-lg {
  border-radius: 10px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.input-group-text {
  border-radius: 8px 0 0 8px;
  background-color: var(--light-background);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.input-group .form-control {
  border-radius: 0 8px 8px 0 !important;
  border-left: none;
}

.badge.bg-light {
  background-color: #e9ecef !important; /* Un gris más claro para las etiquetas */
  color: var(--text-secondary) !important;
}

.text-muted {
  color: var(--text-secondary) !important;
}

.bg-light {
  background-color: var(--light-background) !important;
}

/* Dark mode adjustments */
.dark .card {
  background-color: var(--dark-background);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-color: #444;
}

.dark .card-header {
  background-color: #2c3e50 !important; /* Un azul oscuro para el encabezado en modo oscuro */
  color: white !important;
}

.dark .product-preview {
  background-color: rgba(var(--dark-background-rgb), 0.5);
  border-color: var(--primary-color);
}

.dark .form-control,
.dark .form-select {
  background-color: #495057;
  border-color: #555;
  color: #f8f9fa;
}

.dark .form-control:focus,
.dark .form-select:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 0.25rem rgba(var(--secondary-color-rgb), 0.3);
}

.dark .input-group-text {
  background-color: #495057;
  color: #f8f9fa;
  border-color: #555;
}

.dark .text-muted {
  color: #adb5bd !important;
}

.dark .bg-light {
  background-color: #495057 !important;
  color: #f8f9fa !important;
}

.dark .badge.bg-light {
  background-color: #555 !important;
  color: #f8f9fa !important;
}
</style>