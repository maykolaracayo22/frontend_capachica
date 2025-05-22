
<template>
  <div class="p-4 max-w-lg mx-auto">
    <h2 class="text-2xl mb-4">Administrar Asociaciones</h2>
    <AssociationForm @saved="fetchAll" />
    <ul class="mt-4">
      <li v-for="a in associations" :key="a.id" class="flex justify-between py-2">
        <span>{{ a.name }} ({{ a.region }})</span>
        <button @click="deleteAssoc(a.id)" class="text-red-600">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/services/axios'
import AssociationForm from '../components/AssociationForm.vue';

export default {
  components: { AssociationForm },
  data() { return { associations: [] }; },
  methods: {
    fetchAll() { api.get('/associations').then(res => this.associations = res.data); },
    deleteAssoc(id) { api.delete(`/associations/${id}`).then(() => this.fetchAll()); }
  },
  mounted() { this.fetchAll(); }
};
</script>