<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="mb-4">
          <i class="bi bi-box-seam me-2"></i>
          {{ isEdit ? 'Editar' : 'Crear' }} paquete turístico
        </h2>

        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
          <!-- Nombre -->
          <div class="mb-3">
            <label class="form-label fw-bold">Nombre del paquete</label>
            <input v-model="form.name" class="form-control" required placeholder="Ej. Aventura en Capachica" />
          </div>

          <!-- Descripción -->
          <div class="mb-3">
            <label class="form-label fw-bold">Descripción</label>
            <textarea v-model="form.description" class="form-control" rows="3" placeholder="Describe la experiencia..."></textarea>
          </div>

          <!-- Duración -->
          <div class="mb-3">
            <label class="form-label fw-bold">Duración estimada</label>
            <input v-model="form.duration" class="form-control" placeholder="Ej. 2 días / 1 noche" />
          </div>

          <!-- Precio -->
          <div class="mb-3">
            <label class="form-label fw-bold">Precio fijo (opcional):</label>
            <input v-model.number="form.price" class="form-control" type="number" min="0" placeholder="Dejar vacío para usar el estimado" />
            <div class="form-text">Si se deja vacío, se calculará automáticamente.</div>
            <div v-if="!form.price" class="alert alert-info mt-2">
              <strong>Precio estimado:</strong> S/. {{ formatPrice(estimatedPrice) }}
            </div>
          </div>

          <!-- Imágenes -->
          <div class="mb-3">
            <label class="form-label fw-bold">Imágenes del paquete</label>
            <input type="file" multiple accept="image/*" @change="handleFileChange" class="form-control" />
            <div class="mt-3 d-flex flex-wrap gap-3">
              <img v-for="(img, i) in previewImages" :key="i" :src="img" class="img-thumbnail" style="max-height: 120px;" />
            </div>
          </div>

          <!-- Productos -->
          <div class="mb-3">
            <label class="form-label fw-bold">Agregar productos al paquete:</label>
            <div class="d-flex">
              <select v-model="selectedProductId" class="form-select me-2">
                <option disabled value="">Seleccione un producto</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.name }} - S/. {{ formatPrice(p.price) }} | {{ p.place?.name || 'Sin lugar' }}
                </option>
              </select>
              <button type="button" class="btn btn-outline-primary" @click="addProduct" :disabled="!selectedProductId">
                <i class="bi bi-plus-circle"></i> Agregar
              </button>
            </div>
          </div>

          <!-- Productos seleccionados -->
          <div v-if="form.product_ids.length" class="mb-3">
            <h6 class="fw-bold">Productos incluidos:</h6>
            <ul class="list-group">
              <li v-for="id in form.product_ids" :key="id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ getProduct(id)?.name }}</strong><br />
                  <small class="text-muted">
                    S/. {{ formatPrice(getProduct(id)?.price) }} | {{ getProduct(id)?.place?.name || 'Sin lugar' }}
                  </small>
                </div>
                <button class="btn btn-sm btn-danger" @click.prevent="removeProduct(id)">
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
          </div>

          <!-- Botón -->
          <div class="text-end mt-4">
            <button class="btn btn-success px-4" type="submit" :disabled="submitting">
              <i class="bi bi-save me-1"></i>
              {{ submitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }} paquete
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/services/axios'

export default {
  name: 'EntrepreneurPackageForm',
  data() {
    return {
      form: {
        name: '',
        description: '',
        duration: '',
        price: null,
        product_ids: []
      },
      products: [],
      selectedProductId: '',
      previewImages: [],
      imageFiles: [],
      isEdit: false,
      submitting: false
    }
  },
  computed: {
    estimatedPrice() {
      return this.products
        .filter(p => this.form.product_ids.includes(p.id))
        .reduce((sum, p) => sum + Number(p.price || 0), 0)
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    },
    handleFileChange(e) {
      const files = Array.from(e.target.files)
      this.imageFiles = files
      this.previewImages = files.map(file => URL.createObjectURL(file))
    },
    async loadProducts() {
      try {
        const res = await api.get('/products/my')
        this.products = res.data
      } catch (err) {
        console.error('Error al cargar productos:', err)
        alert('No se pudieron cargar los productos.')
      }
    },
    getProduct(id) {
      return this.products.find(p => p.id === id) || {}
    },
    addProduct() {
      const id = this.selectedProductId
      if (id && !this.form.product_ids.includes(id)) {
        this.form.product_ids.push(id)
      }
      this.selectedProductId = ''
    },
    removeProduct(id) {
      this.form.product_ids = this.form.product_ids.filter(pid => pid !== id)
    },
    async loadPackage(id) {
      try {
        const res = await api.get(`/packages/${id}`)
        const pkg = res.data
        this.form = {
          name: pkg.name,
          description: pkg.description,
          duration: pkg.duration || '',
          price: pkg.price,
          product_ids: pkg.products.map(p => p.id)
        }
        // NOTA: Imágenes no se editan aún (mejorarlo luego si lo necesitas)
      } catch (err) {
        console.error('Error al cargar paquete:', err)
        alert('No se pudo cargar el paquete.')
      }
    },
    async handleSubmit() {
      if (this.form.product_ids.length === 0) {
        alert('Debes agregar al menos un producto.')
        return
      }

      try {
        this.submitting = true
        const resAuth = await api.get('/entrepreneur/authenticated')
        const entrepreneurId = resAuth.data?.entrepreneur?.id

        if (!entrepreneurId) {
          alert('No se pudo obtener el ID del emprendedor.')
          return
        }

        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('description', this.form.description || '')
        formData.append('duration', this.form.duration || '')
        formData.append('price', this.form.price || this.estimatedPrice)
        formData.append('entrepreneur_id', entrepreneurId)

        this.form.product_ids.forEach(id => formData.append('product_ids[]', id))
        this.imageFiles.forEach(img => formData.append('images[]', img))

        if (this.isEdit) {
          const id = this.$route.params.id
          await api.post(`/packages/${id}?_method=PUT`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          alert('Paquete actualizado correctamente.')
        } else {
          await api.post('/packages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          alert('Paquete creado correctamente.')
        }

        this.$router.push('/emprendedor/paquetes')
      } catch (err) {
        console.error('Error al guardar el paquete:', err)
        alert('Ocurrió un error al guardar el paquete.')
      } finally {
        this.submitting = false
      }
    }
  },
  async mounted() {
    await this.loadProducts()
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      await this.loadPackage(id)
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.btn-danger {
  font-size: 0.9rem;
  padding: 4px 8px;
}
.alert-info {
  font-size: 0.95rem;
}
</style>
