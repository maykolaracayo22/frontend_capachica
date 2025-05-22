<template>
    <div>
      <h1>Mis Reservas</h1>
      
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
  
      <div v-else>
        <div v-if="reservations.length === 0" class="alert alert-info">
          No tienes reservas.
        </div>
        
        <div v-for="reservation in reservations" :key="reservation.id" class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ reservation.product.name }}</h5>
            <p class="card-text">Cantidad: {{ reservation.quantity }}</p>
            <p class="card-text">Fecha de Reserva: {{ reservation.reservation_date }}</p>
            <p class="card-text">Estado: {{ reservation.status }}</p>
            <router-link :to="'/reservations/' + reservation.id" class="btn btn-info">
              Ver detalles
            </router-link>
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
        reservations: [],
        loading: true,
      };
    },
    mounted() {
      this.fetchReservations();
    },
    methods: {
      methods: {
        async fetchReservations() {
    try {
      const roles = JSON.parse(localStorage.getItem('user_roles') || '[]');

      let response;
      if (roles.includes('emprendedor')) {
        response = await api.get('/reservations/by-entrepreneur');
      } else if (roles.includes('cliente')) {
        response = await api.get('/reservations/by-client');
      } else {
        response = await api.get('/reservations');
      }

      this.reservations = response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      alert('No se pudieron cargar las reservas.');
    } finally {
      this.loading = false;
    }
  }
}

    }
  };
  </script>
  
  <style scoped>
  .card {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .card-text {
    font-size: 1rem;
    margin-bottom: 10px;
  }
  
  button {
    width: 100%;
  }
  </style>
  