
<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-2xl mb-4">Administrar Categorías</h2>
    <CategoryForm @saved="fetchAll" />
    <ul class="mt-4">
      <li v-for="c in categories" :key="c.id" class="flex justify-between py-2">
        <span>{{ c.name }}</span>
        <button @click="deleteCat(c.id)" class="text-red-600">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/services/axios'
import CategoryForm from '../components/CategoryForm.vue';


export default {
  components: { CategoryForm },
  data() { return { categories: [] }; },
  methods: {
    fetchAll() { api.get('/categories').then(res => this.categories = res.data); },
    deleteCat(id) { api.delete(`/categories/${id}`).then(() => this.fetchAll()); }
  },
  mounted() { this.fetchAll(); }
};
</script>