<template>
  <nav :class="['navbar', 'navbar-expand-lg', 'fixed-top', { 'navbar-scrolled': scrolled }]">
    <div class="container-fluid">
      <!-- Reemplazamos el texto con una imagen -->
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/logoca2.png" alt="Logo" class="navbar-logo" />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><router-link to="/" class="nav-link">Inicio</router-link></li>
          <li class="nav-item"><router-link to="/dashboard" class="nav-link">Dashboard</router-link></li>
          <li class="nav-item"><router-link to="/tours" class="nav-link">Tours</router-link></li>
          <li class="nav-item"><router-link to="/reservations" class="nav-link">Reservas</router-link></li>
          <li class="nav-item"><router-link to="/payments" class="nav-link">Pagos</router-link></li>
          <li class="nav-item"><router-link to="/profile" class="nav-link">Perfil</router-link></li>
          <li class="nav-item" v-if="!auth.isLoggedIn">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-if="!auth.isLoggedIn">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
          <li class="nav-item" v-if="auth.isLoggedIn">
            <button @click="logout" class="btn btn-danger">Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { auth } from '../store/auth';
import api from '../api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const scrolled = ref(false);

async function logout() {
  await api.post('/logout');
  auth.isLoggedIn = false;
  auth.user = null;
  auth.token = null;
  auth.roles = [];
  router.push('/');
}

function handleScroll() {
  scrolled.value = window.scrollY > 50;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Navbar con fondo transparente y sombra al hacer scroll */
.navbar {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background-color: transparent !important;
}

.navbar-scrolled {
  background-color: rgba(44, 85, 127, 0.436) !important; /* fondo oscuro y opaco */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Estilo de los enlaces en el navbar */
.nav-link {
  font-weight: 500;
  font-family: 'Raleway', sans-serif;
  font-size: 1rem;  /* Aumento del tamaño de texto */
  color: white !important;  /* Cambiar color de texto a blanco */
  margin-right: 30px;  /* Separar más los enlaces */
  transition: color 0.5s ease;
}

.nav-link:hover {
  color: #c0cd0b !important;  /* Efecto de hover, color más brillante */
}

/* Estilo para el nombre de la marca */
.navbar-brand {
  font-size: 1.8rem;  /* Aumento del tamaño de la fuente */
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  color: white !important;  /* Cambiar color de la marca a blanco */
}

/* Estilo para la imagen del logo */
.navbar-brand img {
  height: 60px; /* Ajusta la altura del logo */
  width: auto;
}

.navbar-toggler-icon {
  background-color: white;  /* Cambiar color del ícono a blanco */
}
</style>
