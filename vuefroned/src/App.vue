<template>
  <Navbar v-if="!hideNavbar" />
  <router-view />
  <Footer v-if="showFooter" />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

// Detecta la ruta actual
const route = useRoute();

// Oculta el Navbar en rutas de administración
const hideNavbar = computed(() =>
  [
    '/dashboard', '/admin/homeedit', '/admin/tours-manager',
    '/admin/about', '/admin/gallery-manager', '/admin/places',
    '/admin/experience', '/admin/home-dashboard', '/admin/contact','/admin/dashboard-empreneur','/entrepreneur-dashboard',
    '/association-list','/admin/associations/new','/category-list','/admin/categories/new'
    ,'/admin/emprendedores','/entrepreneur-list','/products','/pagos','/reservar','/admin/pagos/crear','/emprendedor/paquetes'
  ].some(path => route.path.startsWith(path))
);

// Muestra el Footer solo en la página de inicio
const showFooter = computed(() => route.path === '/');
</script>
