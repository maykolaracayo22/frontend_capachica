<template>
  <div class="admin-dashboard">
    <!-- Sidebar funcional -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <i class="bi bi-compass"></i>
          </div>
          <h2 class="logo-text">Capachica<span>Admin</span></h2>
        </div>
        <div class="user-profile">
          <div class="avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="user-info">
            <p class="username">{{ userName }}</p>
            <p class="user-role">{{ userRole }}</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in menuItems" :key="item.path">
            <router-link 
              :to="item.path" 
              class="nav-link"
              active-class="active"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-text">{{ item.name }}</span>
              <div class="nav-indicator"></div>
            </router-link>
          </li>
                <!-- parte del emprendedor-->

          <li>
            <router-link
              to="/admin/dashboard-empreneur"
              class="nav-link"
            >
              <div class="nav-icon">
                <i class="bi bi-person-circle"></i>
              </div>
              <span class="nav-text">Modo Emprendedor</span>
              <div class="nav-indicator"></div>

            </router-link>
          </li>

        </ul>
      </nav>
      

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <i class="bi bi-box-arrow-right"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal funcional -->
    <main class="admin-content">
      <div class="content-wrapper">
        <header class="content-header">
            <div class="section-header">
              <div class="header-left">
                <h1 class="welcome-title">Bienvenido al <span>Dashboard</span></h1>
                <p class="welcome-subtitle">Gestiona tus datos y operaciones desde aquí</p>

                
              </div>
              <router-link
                to="/"
                class="action-button"
              >
              <i class="bi bi-arrow-left"></i> Volver a la pagina
            </router-link>
          </div>
          
          
        </header>

        <!-- Sección de rol funcional -->
        <section class="role-section">
          <div class="role-card">
            <div class="role-icon">
              <i v-if="userRole === 'cliente'" class="bi bi-person-check"></i>
              <i v-else-if="userRole === 'emprendedor'" class="bi bi-briefcase"></i>
              <i v-else-if="userRole === 'super-admin'" class="bi bi-shield-lock"></i>
              <i v-else class="bi bi-exclamation-triangle"></i>
            </div>
            <div class="role-content">
              <h3>Tu Rol: <span>{{ userRole }}</span></h3>
              <p v-if="userRole === 'cliente'">
                Explora tus destinos favoritos y haz tus reservas fácilmente.
              </p>
              <p v-else-if="userRole === 'emprendedor'">
                Gestiona tus paquetes turísticos y obtén visibilidad de tus servicios.
              </p>
              <p v-else-if="userRole === 'super-admin'">
                Controla y administra la plataforma completa.
              </p>
              <p v-else>
                No tienes un rol asignado válido.
              </p>
            </div>
          </div>
        </section>

        <!-- Sección de acciones rápidas -->
        <section class="quick-actions">
          <h2 class="section-title">Acciones Rápidas</h2>
          <div class="actions-grid">
            <router-link 
              v-for="action in quickActions" 
              :key="action.path"
              :to="action.path"
              class="action-card"
            >
              <div class="action-icon">
                <i :class="action.icon"></i>
              </div>
              <h3>{{ action.title }}</h3>
              <p>{{ action.description }}</p>
            </router-link>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import api from '@/services/axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      menuItems: [
        { path: '/dashboard', name: 'Dashboard', icon: 'bi bi-speedometer2' },
        { path: '/tours', name: 'Tours', icon: 'bi bi-map' },
        { path: '/reservations', name: 'Reservas', icon: 'bi bi-calendar-check' },
        { path: '/payments', name: 'Pagos', icon: 'bi bi-credit-card' },
        { path: '/admin/homeedit', name: 'Editar Hero', icon: 'bi bi-image' },
        { path: '/admin/home-dashboard', name: 'Editar Home', icon: 'bi bi-house' }
      ],
      quickActions: [
        { 
          path: '/tours', 
          title: 'Crear Nuevo Tour', 
          description: 'Agrega un nuevo paquete turístico',
          icon: 'bi bi-plus-circle' 
        },
        { 
          path: '/reservations', 
          title: 'Ver Reservas', 
          description: 'Gestiona las reservas existentes',
          icon: 'bi bi-list-check' 
        },
        { 
          path: '/payments', 
          title: 'Revisar Pagos', 
          description: 'Consulta los pagos recibidos',
          icon: 'bi bi-cash-stack' 
        },
          { 
          path: '/admin/pagos', 
          title: 'adminRevisar Pagos', 
          description: 'Consulta los pagos recibidos',
          icon: 'bi bi-cash-stack' 
        },
          { 
          path: '/admin/ventas-presenciales', 
          title: 'Crear pago presencial', 
          description: 'Consulta los pagos recibidos',
          icon: 'bi bi-cash-stack' 
        },
         { 
          path: '/paquetes', 
          title: 'lista de paquetes empren', 
          description: 'Consulta los pagos recibidos',
          icon: 'bi bi-cash-stack' 
        },
        
         { 
          path: '/mis-paquetes/crear', 
          title: 'crear mi pqeute cliente', 
          description: 'Consulta los pagos recibidos',
          icon: 'bi bi-cash-stack' 
        },
          { 
          path: '/mis-paquetes/:id', 
          title: 'paqeute detalles clien', 
          description: 'Consulta los pagos recibidos',
          icon: 'bi bi-cash-stack' 
        },
        
        { 
          path: '/admin/homeedit', 
          title: 'Editar Portada', 
          description: 'Actualiza la sección principal',
          icon: 'bi bi-image-alt' 
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userRole', 'user']),
    userName() {
      return this.user?.name || 'Usuario';
    }
  },
  methods: {
    logout() {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Token no encontrado. Inicia sesión nuevamente.');
        return;
      }

      api.get('/sanctum/csrf-cookie', { withCredentials: true }).then(() => {
        api.post('/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          localStorage.removeItem('auth_token');
          this.$store.dispatch('logout');
          this.$router.push('/login');
        })
        .catch((err) => {
          console.error('Error al cerrar sesión', err);
        });
      });
    }
  }
};
</script>

<style scoped>
/* Estilos base mejorados */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --dark: #1e293b;
  --light: #f8fafc;
  --gray: #94a3b8;
  --gray-dark: #64748b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f1f5f9;
}

/* Sidebar mejorado */
.admin-sidebar {
  width: 280px;
  background: linear-gradient(195deg, #1a1a2e, #16213e);
  color: white;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 30px rgba(0, 0, 0, 0.2);
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-header {
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 2rem;
  color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.logo-text span {
  color: var(--primary);
  font-weight: 800;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.avatar {
  font-size: 2rem;
  color: var(--gray);
  margin-right: 12px;
}

.user-info {
  line-height: 1.4;
}

.username {
  font-weight: 600;
  color: white;
}

.user-role {
  font-size: 0.85rem;
  color: var(--gray);
  text-transform: capitalize;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
}

.sidebar-nav li {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.85rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  transform: translateX(5px);
}

.nav-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.nav-link i {
  font-size: 1.1rem;
  color: var(--gray);
}

.nav-text {
  flex: 1;
}

.nav-indicator {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.nav-link.active {
  background: rgba(99, 102, 241, 0.1);
  color: white;
  font-weight: 600;
}

.nav-link.active i {
  color: var(--primary);
}

.nav-link.active .nav-icon {
  background: rgba(99, 102, 241, 0.2);
}

.nav-link.active .nav-indicator {
  opacity: 1;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: white;
  transform: translateX(3px);
}

.logout-btn i {
  margin-right: 10px;
  font-size: 1.1rem;
}

/* Contenido principal mejorado */
.admin-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
}
.section-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.content-wrapper {
  padding: 2.5rem;
}

.content-header {
  margin-bottom: 2.5rem;
}


.welcome-title {
  font-size: 2.5rem;
  color: var(--dark);
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.welcome-title span {
  color: var(--primary);
  position: relative;
}

.welcome-title span::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(99, 102, 241, 0.2);
  z-index: -1;
  border-radius: 4px;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: var(--gray-dark);
  font-weight: 400;
}

/* Sección de rol mejorada */
.role-section {
  margin-bottom: 2.5rem;
}

.role-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

.role-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  color: var(--primary);
  font-size: 2.5rem;
}

.role-card .bi-person-check {
  color: var(--secondary);
}

.role-card .bi-briefcase {
  color: var(--warning);
}

.role-card .bi-shield-lock {
  color: var(--primary);
}

.role-card .bi-exclamation-triangle {
  color: var(--danger);
}

.role-content h3 {
  font-size: 1.3rem;
  color: var(--dark);
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.role-content h3 span {
  text-transform: capitalize;
  color: var(--primary);
}

.role-content p {
  color: var(--gray-dark);
  line-height: 1.6;
  font-size: 1.05rem;
}

/* Acciones rápidas */
.quick-actions {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.5rem;
  color: var(--dark);
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: block;
  text-decoration: none;
  color: inherit;
  border-left: 4px solid var(--primary);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--primary);
  font-size: 1.5rem;
}

.action-card h3 {
  font-size: 1.1rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.action-card p {
  color: var(--gray-dark);
  font-size: 0.95rem;
  line-height: 1.5;
}
/*BOTONES MEJORADOS */


.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4c6ef5, #5f27cd);
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background: linear-gradient(135deg, #3b5bdb, #4a1fb8);
  transform: translateY(-2px);
}

.action-button i {
  font-size: 1.2rem;
}

/* Responsive mejorado */
@media (max-width: 1200px) {
  .admin-sidebar {
    width: 260px;
  }
  
  .admin-content {
    margin-left: 260px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 1rem;
  }
  
  .admin-content {
    margin-left: 0;
  }
  
  .role-card {
    flex-direction: column;
    text-align: center;
  }
  
  .role-icon {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>