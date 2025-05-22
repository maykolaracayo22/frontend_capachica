<template>
  <div class="admin-dashboard-container">
    <!-- Encabezado con botón de volver -->
    <div class="dashboard-header">
      <router-link to="/dashboard" class="back-button">
        <i class="bi bi-chevron-left"></i>
        <span>Volver al Panel Principal</span>
      </router-link>
      
      <!-- Hero section mejorado -->
      <div class="dashboard-hero">
        <div class="hero-icon">
          <i class="bi bi-compass"></i>
        </div>
        <div class="hero-content">
          <h1>Dashboard de Contenido</h1>
          <p>Administra todas las secciones de tu sitio turístico</p>
        </div>
      </div>
    </div>

    <!-- Tarjetas de opciones mejoradas -->
    <div class="dashboard-grid">
      <router-link 
        v-for="(item, index) in cards" 
        :key="index"
        :to="item.link"
        class="dashboard-card"
        :class="'card-' + (index % 4 + 1)"
      >
        <div class="card-icon">
          <i :class="item.icon"></i>
        </div>
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <div class="card-arrow">
          <i class="bi bi-arrow-right"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const cards = [
  {
    title: "Hero (Bienvenida)",
    description: "Personaliza el encabezado principal con imágenes y texto",
    icon: "bi bi-stars",
    link: "/admin/homeedit"
  },
  {
    title: "Historia",
    description: "Edita la sección 'Sobre nosotros' y su contenido",
    icon: "bi bi-journal-bookmark",
    link: "/admin/about"
  },
  {
    title: "Tours Destacados",
    description: "Gestiona los tours que aparecen en la página principal",
    icon: "bi bi-binoculars",
    link: "/admin/tours-manager"
  },
  {
    title: "Galería",
    description: "Administra las imágenes de la galería del sitio",
    icon: "bi bi-images",
    link: "/admin/gallery-manager"
  },
  {
    title: "Contacto",
    description: "Actualiza información de contacto y ubicación",
    icon: "bi bi-geo-alt",
    link: "/admin/contact"
  },
  {
    title: "Destinos Turísticos",
    description: "Administra los destinos destacados",
    icon: "bi bi-map",
    link: "/admin/places"
  },
  {
    title: "Experiencias",
    description: "Gestiona las experiencias turísticas destacadas",
    icon: "bi bi-sun",
    link: "/admin/experience"
  }
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --primary: #4f46e5;
  --primary-light: #6366f1;
  --secondary: #10b981;
  --tertiary: #3b82f6;
  --quaternary: #f59e0b;
  --dark: #1e293b;
  --light: #f8fafc;
  --gray: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.admin-dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Encabezado */
.dashboard-header {
  margin-bottom: 3rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: var(--primary-light);
  transform: translateX(-3px);
}

.back-button i {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Hero section */
.dashboard-hero {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--primary);
}

.hero-icon {
  width: 70px;
  height: 70px;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  color: var(--primary);
  font-size: 2rem;
}

.hero-content h1 {
  font-size: 1.8rem;
  color: var(--dark);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.hero-content p {
  color: var(--gray);
  font-size: 1.05rem;
}

/* Grid de tarjetas */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: all 0.3s ease;
}

.dashboard-card:hover::before {
  width: 6px;
}

.card-1::before { background: var(--primary); }
.card-2::before { background: var(--secondary); }
.card-3::before { background: var(--tertiary); }
.card-4::before { background: var(--quaternary); }
.card-5::before { background: var(--primary); }
.card-6::before { background: var(--secondary); }
.card-7::before { background: var(--tertiary); }

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(79, 70, 229, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.2rem;
  color: var(--primary);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-1 .card-icon { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
.card-2 .card-icon { background: rgba(16, 185, 129, 0.1); color: var(--secondary); }
.card-3 .card-icon { background: rgba(59, 130, 246, 0.1); color: var(--tertiary); }
.card-4 .card-icon { background: rgba(245, 158, 11, 0.1); color: var(--quaternary); }
.card-5 .card-icon { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
.card-6 .card-icon { background: rgba(16, 185, 129, 0.1); color: var(--secondary); }
.card-7 .card-icon { background: rgba(59, 130, 246, 0.1); color: var(--tertiary); }

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 1.1rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card-content p {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.5;
}

.card-arrow {
  color: var(--gray);
  font-size: 1.2rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.dashboard-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-dashboard-container {
    padding: 1.5rem 1rem;
  }
  
  .dashboard-hero {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .hero-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }
  
  .card-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .card-arrow {
    display: none;
  }
}
</style>