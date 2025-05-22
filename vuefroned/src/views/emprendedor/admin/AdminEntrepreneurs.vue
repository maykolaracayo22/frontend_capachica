<template>
    <div class="p-4">
      <ul>
        <li v-for="e in entrepreneurs" :key="e.id" class="flex justify-between py-2 border-b">
          <div>
            <strong>{{ e.business_name }}</strong> — {{ e.association?.name || 'Sin asociación' }}
          </div>
          <div>
            <button @click="$router.push({ name: 'EntrepreneurEdit', params: { id: e.id } })" class="text-blue-600 hover:underline">Editar</button>
            <button @click="deleteEntrepreneur(e.id)" class="text-red-600 hover:underline ml-2">Eliminar</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import api from '@/services/axios'
  
  export default {
    name: 'AdminEntrepreneurs',
    data() { return { entrepreneurs: [] } },
    methods: {
      fetchAll() {
        api.get('/entrepreneurs').then(res => this.entrepreneurs = res.data.data)
      },
      deleteEntrepreneur(id) {
        api.delete(`/entrepreneurs/${id}`).then(() => this.fetchAll())
      }
    },
    mounted() {
      this.fetchAll()
    }
  }
  </script>
  