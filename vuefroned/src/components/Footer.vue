<template>
  <footer class="footer mt-auto py-3 text-white">
    <div class="container text-center">
      <p>&copy; 2025 Capachica Tours. Todos los derechos reservados.</p>
      <div class="footer-links">
        <router-link to="/" class="text-white me-3">Inicio</router-link>
        <router-link to="/tours" class="text-white me-3">Tours</router-link>
        <router-link to="/contact" class="text-white">Contacto</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No necesitas nada aquí por ahora, todo es estático
</script>

<style scoped>
.footer {
  background-color: #2c557f;
  margin-top: auto;
}

.footer-links a {
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #c0cd0b;
}
</style>
