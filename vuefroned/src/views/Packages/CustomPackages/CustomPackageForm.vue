<template>
  <div class="container mt-4">
    <h2>Crear paquete personalizado</h2>

    <form @submit.prevent="submitPackage">
      <!-- Nombre del paquete -->
      <div class="mb-3">
        <label>Nombre del paquete:</label>
        <input v-model="form.name" class="form-control" placeholder="Ej. Aventura en la selva" />
      </div>

      <!-- Estado -->
      <div class="mb-3">
        <label>Estado:</label>
        <select v-model="form.status" class="form-select">
          <option value="borrador">Borrador</option>
          <option value="confirmado">Confirmado</option>
        </select>
      </div>

      <!-- Selector de productos -->
      <div class="mb-3">
        <label>Agregar productos:</label>
        <select v-model="selectedProductId" class="form-select">
          <option disabled value="">Seleccione un producto</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} - S/. {{ formatPrice(product.price) }}
          </option>
        </select>
        <button class="btn btn-primary mt-2" type="button" @click="addProduct">Agregar</button>
      </div>

      <!-- Lista de productos agregados -->
      <div v-if="form.products.length">
        <h5>Productos en el paquete:</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in form.products" :key="index">
              <td>{{ getProductName(p.id) }}</td>
              <td>S/. {{ formatPrice(getProductPrice(p.id)) }}</td>
              <td>
                <input type="number" v-model.number="p.quantity" min="1" class="form-control" />
              </td>
              <td>S/. {{ formatPrice(getProductPrice(p.id) * p.quantity) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" type="button" @click="removeProduct(index)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón enviar -->
      <button class="btn btn-success mt-3" type="submit">Guardar paquete</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createCustomPackage } from '@/services/customPackages'
import api from '@/services/axios'

export default {
  name: 'CustomPackageForm',
  setup() {
    const router = useRouter()
    const form = ref({
      name: '',
      status: 'borrador',
      products: [] // { id, quantity }
    })

    const products = ref([])
    const selectedProductId = ref('')

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products')
        products.value = res.data
      } catch (err) {
        console.error('Error al cargar productos:', err)
        alert('No se pudieron cargar los productos')
      }
    }

    const getProductById = id => products.value.find(p => p.id === id)
    const getProductName = id => getProductById(id)?.name || '---'
    const getProductPrice = id => {
      const price = getProductById(id)?.price
      return isNaN(price) ? 0 : Number(price)
    }

    const formatPrice = value => {
      const num = Number(value)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    }

    const addProduct = () => {
      const exists = form.value.products.find(p => p.id === selectedProductId.value)
      if (selectedProductId.value && !exists) {
        form.value.products.push({ id: selectedProductId.value, quantity: 1 })
      }
      selectedProductId.value = ''
    }

    const removeProduct = index => {
      form.value.products.splice(index, 1)
    }

    const submitPackage = async () => {
      try {
        console.log('Enviando:', form.value)
        const res = await createCustomPackage(form.value)
        const newPackageId = res.data?.id || res.data?.data?.id

        alert('Paquete creado correctamente')

        // Redirigir al flujo de reserva con Vue Router
        router.push(`/reservar-paquete/${newPackageId}`)
      } catch (error) {
        console.error('Error al guardar el paquete:', error.response?.data || error)
        const errors = error.response?.data?.errors
        if (errors) {
          const messages = Object.values(errors).flat().join('\n')
          alert(messages)
        } else {
          alert('Error al guardar el paquete')
        }
      }
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      form,
      products,
      selectedProductId,
      getProductName,
      getProductPrice,
      formatPrice,
      addProduct,
      removeProduct,
      submitPackage
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>
