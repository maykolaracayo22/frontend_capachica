<template>
    <div class="max-w-xl mx-auto p-4">
      <EntrepreneurForm :entrepreneurId="id" @saved="goBack" />
    </div>
  </template>
  
  <script>
import EntrepreneurForm from '../components/EntrepreneurForm.vue';


  export default {
    components: { EntrepreneurForm },
    props: ['id'],
    methods: {
      goBack() {
        this.$router.push({ name: 'EntrepreneurDashboard' });
      }
    }
  };
  </script>
  
