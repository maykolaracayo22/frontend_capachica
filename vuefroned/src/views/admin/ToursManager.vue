<template>
  <div class="admin-tours-wrapper container-fluid px-3 px-md-4 py-4">

    <!-- Panel principal -->
    <div class="tour-card mx-auto p-4 bg-white shadow-sm rounded border">
      <router-link
  to="/admin/home-dashboard"
  class="btn btn-outline-primary mb-4 d-inline-flex align-items-center"
>
  <i class="bi bi-arrow-left me-2"></i>
  Volver al Panel Principal
</router-link>
      <!-- Encabezado -->
      <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
        <i class="bi bi-map-fill fs-3 text-primary me-3"></i>
        <h2 class="h4 fw-bold text-primary m-0">Gestionar Tours</h2>
      </div>

      <!-- Contenido dinámico -->
      <div class="tour-wrapper bg-light rounded p-4">
        <Tours />
      </div>

    </div>
  </div>
</template>


  
  <script setup>
  import Tours from '@/views/Tours.vue'
  </script>
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

/* Contenedor general */
.admin-tours-wrapper {
  background: linear-gradient(to bottom, #f0fdfa, #ffffff);
  min-height: 100vh;
}

/* Tarjeta principal */
.tour-card {
  max-width: 960px;
  background-color: #ffffff;
  border-radius: 1.25rem;
  padding: 2rem;
  margin-top: 2rem;
  margin-bottom: 3rem;
  border: 1px solid #cbd5e1;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
}

/* Título y encabezado */
h2 {
  font-weight: 700;
  color: #0f766e;
}

.bi {
  vertical-align: -0.15em;
  color: #0ea5e9;
}

/* Área del componente Tours */
.tour-wrapper {
  background-color: #e0f2fe;
  border: 1px solid #bae6fd;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  border-radius: 1rem;
  transition: all 0.3s ease;
  min-height: 300px;
}

.tour-wrapper:hover {
  background-color: #f0fdfa;
}

/* Inputs y botones dentro del componente */
.tour-wrapper :deep(input),
.tour-wrapper :deep(select),
.tour-wrapper :deep(button),
.tour-wrapper :deep(textarea) {
  border-radius: 0.5rem !important;
  font-size: 1rem;
}

.tour-wrapper :deep(button) {
  font-weight: 600;
  transition: all 0.2s ease;
}

.tour-wrapper :deep(button:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .tour-card {
    padding: 1.5rem;
  }

  .tour-wrapper {
    padding: 1rem;
  }
}
</style>
