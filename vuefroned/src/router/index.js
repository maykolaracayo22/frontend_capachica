// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Tours from '@/views/Tours.vue'
import Reservations from '@/views/Reservations.vue'
import Payments from '@/views/Payments.vue'
import Profile from '@/views/Profile.vue'

// Admin Home
import AdminHomeDashboard from '@/views/admin/AdminHomeDashboard.vue'
import HomeEdit from '@/views/admin/HomeEdit.vue'
import AboutEditor from '@/views/admin/AboutEditor.vue'
import ToursManager from '@/views/admin/ToursManager.vue'
import GalleryManager from '@/views/admin/GalleryManager.vue'
import ContactEditor from '@/views/admin/ContactEditor.vue'
import PlacesManager from '@/views/admin/PlacesManager.vue'
import PlaceDetail from '@/views/PlaceDetail.vue'
import PlacesList from '@/views/PlacesList.vue'
import ExperienceManager from '@/views/admin/ExperienceManager.vue'
import ExperienceTabs from '@/views/ExperienceTabs.vue'
import TestimoniosSection from '@/views/TestimoniosSection.vue'
import TestimonioForm from '@/views/TestimonioForm.vue'
import CategoryForm from "@/views/emprendedor/components/CategoryForm.vue";
import AssociationForm from "@/views/emprendedor/components/AssociationForm.vue";
import EntrepreneurEdit from "@/views/emprendedor/views/EntrepreneurEdit.vue";
import AdminAssociations from '@/views/emprendedor/admin/AdminAssociations.vue'
import AdminEntrepreneurDashboard from '@/views/emprendedor/admin/AdminEntrepreneurDashboard.vue'
import EntrepreneurForm from '@/views/emprendedor/components/EntrepreneurForm.vue'
import AdminAssociationsList from '@/views/emprendedor/admin/AdminAssociationsList.vue'
import AdminEntrepreneursList from '@/views/emprendedor/admin/AdminEntrepreneursList.vue'
import AdminCategoriesList from '@/views/emprendedor/admin/AdminCategoriesList.vue'
import EntrepreneurDetail from '@/views/emprendedor/views/EntrepreneurDetail.vue'
import EntrepreneurDashboard from '@/views/emprendedor/views/EntrepreneurDashboard.vue'
import ProductList from '@/views/Product/Views/ProductList.vue'
import ProductForm from '@/views/Product/Views/ProductForm.vue'
import ReservationDetail from '@/views/reservas/ReservationDetail.vue'
import ReserForm from '@/views/reservas/ReservationForm.vue'
import ReservationList from '@/views/reservas/ReservationList.vue'
import ReservationForm from '@/views/reservas/ReservationForm.vue'
import ProductDetail from '@/views/Product/Views/ProductDetail.vue'
import DashboardCliente from '@/views/dashboard/DashboardCliente.vue'
import EditarPerfil from '@/views/register/EditarPerfil.vue'
import ReservarProducto from '@/views/reservas/ReservarProducto.vue'
import PaymentForm from '@/views/Payment/cliente/PaymentForm.vue'
import PaymentsList from '@/views/Payment/emprendedor/PaymentsList.vue'
import MyProductList from '@/views/Product/Views/MyProductList.vue'
import AdminPaymentsList from '@/views/Payment/admin/AdminPaymentsList.vue'

import DirectSaleForm from '@/views/reservas/form/DirectSaleForm.vue'
import PackageList from '@/views/Packages/PackageList.vue'
import PackageDetail from '@/views/Packages/PackageDetail.vue'
import CustomPackageList from '@/views/Packages/CustomPackages/CustomPackageList.vue'
import CustomPackageForm from '@/views/Packages/CustomPackages/CustomPackageForm.vue'
import CustomPackageDetail from '@/views/Packages/CustomPackages/CustomPackageDetail.vue'
import PackageForm from '@/views/Packages/Entrepreneur/PackageForm.vue'
import EmprenPackageList from '@/views/Packages/Entrepreneur/EmprenPackageList.vue'
import PackageReservations from '@/views/Packages/Entrepreneur/PackageReservations.vue'
import ReservarPaquete from '@/views/reservas/paquete/ReservarPaquete.vue'
import PaymentFormPaquete from '@/views/Payment/cliente/PaymentFormPaquete.vue'


const routes = [
  // Público
  { path: '/', component: Home },

  // Auth
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', component: Register },

  // Panel general
  { path: '/dashboard', component: Dashboard },

  // CRUD principal
  { path: '/tours', component: Tours },
  { path: '/reservations', component: Reservations },
  { path: '/payments', component: Payments },
  { path: '/profile', component: Profile },
  {
    path: '/places',
    name: 'PlacesList',
    component: PlacesList
  },
  
  {
    path: '/places/:id',
    name: 'PlaceDetail',
    component: PlaceDetail,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente']}
  },
  {
    path: '/experience',
    name: 'ExperienceTabs',
    component: ExperienceTabs
  },
  //testimonio
  { path: '/testimonios', name: 'TestimoniosSection', component: TestimoniosSection },
  { path: '/testimonios/new', name: 'TestimonioForm', component: TestimonioForm, meta: { requiresAuth: true, roles: ['cliente'] } },


  //agregado
   // Nuevas rutas
   { path: '/admin/categories/new', name: 'CategoryForm', component: CategoryForm, meta: { requiresAuth: true, roles: ['super-admin'] } },
   { path: '/admin/associations/new', name: 'AssociationForm', component: AssociationForm, meta: { requiresAuth: true, roles: ['super-admin'] } },
   { path: '/admin/emprendedores/:id/edit', name: 'EntrepreneurEdit', component: EntrepreneurEdit, meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] } },
   
  {
    path: '/admin/emprendedores/',
    name: 'EntrepreneurForm',
    component: EntrepreneurForm,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor'] }
  },
  //nuevolist
  {
    path: '/association-list', // Ruta para la lista de asociaciones
    name: 'AssociationList',
    component: AdminAssociationsList,
    meta: { requiresAuth: true, roles: ['super-admin']}
  },
  {
    path: '/category-list', // Ruta para la lista de categorías
    name: 'AdminCategoriesList',
    component: AdminCategoriesList,
    meta: { requiresAuth: true, roles: ['super-admin']}
  },
  {
    path: '/entrepreneur-list', // Ruta para la lista de emprendedores
    name: 'EntrepreneurList',
    component: AdminEntrepreneursList,
    meta: { requiresAuth: true, roles: ['super-admin']}
  },
  {
    path: '/entrepreneurs/:id',
    name: 'EntrepreneurDetail',
    component: EntrepreneurDetail,
    props: true
  },

  // === Paquetes turísticos (público) ===
{
  path: '/paquetes',
  name: 'PackageList',
  component: PackageList,
  props: true
},
{
  path: '/paquetes/:id',
  name: 'PackageDetail',
  component: PackageDetail,
  props: true
},
{
  path: '/pago-paquete/:id',
  name: 'PagoPaquete',
  component: PaymentFormPaquete ,
  meta: { requiresAuth: true, roles: ['cliente'] }
},
// === Paquetes personalizados (cliente) ===
{
  path: '/mis-paquetes',
  name: 'CustomPackageList',
  component: CustomPackageList,
  meta: { requiresAuth: true, roles: ['cliente'] }
},
{
  path: '/mis-paquetes/crear',
  name: 'CustomPackageForm',
  component: CustomPackageForm,
  meta: { requiresAuth: true, roles: ['cliente'] }
},
{
  path: '/mis-paquetes/:id',
  name: 'CustomPackageDetail',
  component: CustomPackageDetail,
  meta: { requiresAuth: true, roles: ['cliente'] }
},
{
  path: '/reservar-paquete/:id',
  name: 'ReservarPaquete',
  component: ReservarPaquete,
  meta: { requiresAuth: true, roles: ['cliente'] }
},
// === Paquetes turísticos del emprendedor ===
{
  path: '/emprendedor/paquetes',
  name: 'EmprenPackageList',
  component: EmprenPackageList,
  meta: { requiresAuth: true, roles: ['emprendedor','super-admin'] }
},
{
  path: '/emprendedor/paquetes/crear',
  name: 'EntrepreneurPackageForm',
  component: PackageForm,
  meta: { requiresAuth: true, roles: ['emprendedor','super-admin'] }
},
{
  path: '/emprendedor/paquetes/:id/editar',
  name: 'EntrepreneurPackageEdit',
  component: PackageForm,
  props: true,
  meta: { requiresAuth: true, roles: ['emprendedor'] }
},
{
  path: '/emprendedor/reservas-de-paquetes',
  name: 'EntrepreneurPackageReservations',
  component: PackageReservations,
  meta: { requiresAuth: true, roles: ['emprendedor'] }
},

  
  // === Admin Home Dashboard ===
  {
    path: '/admin/home-dashboard',
    name: 'AdminHomeDashboard',
    component: AdminHomeDashboard,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor'] }
  },
  // Hero
  {
    path: '/admin/homeedit',
    name: 'HomeEdit',
    component: HomeEdit,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  // Historia
  {
    path: '/admin/about',
    name: 'AboutEditor',
    component: AboutEditor,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  // Tours destacados
  {
    path: '/admin/tours-manager',
    name: 'ToursManager',
    component: ToursManager,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor'] }
  },
  // Galería
  {
    path: '/admin/gallery-manager',
    name: 'GalleryManager',
    component: GalleryManager,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  // Contacto
  {
    path: '/admin/contact',
    name: 'ContactEditor',
    component: ContactEditor,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  //Places
  {
    path: '/admin/places',
    name: 'PlacesManager',
    component: PlacesManager,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor'] }
  },
  
  //Experiencia
  {
    path: '/admin/experience',
    name: 'ExperienceManager',
    component: ExperienceManager,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  {
    path: '/admin/admin-associations',
    name: 'AdminAssociations',
    component: AdminAssociations,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  {
    path: '/admin/dashboard-empreneur',
    name: 'AdminEntrepreneurDashboard',
    component: AdminEntrepreneurDashboard,
    meta: { requiresAuth: true, roles: ['super-admin'] }
  },
  {
    path: '/entrepreneur-dashboard',
    name: 'EntrepreneurDashboard',
    component: EntrepreneurDashboard,
    meta: { requiresAuth: true, roles: ['emprendedor'] }
  },
  //product
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
    
  },
  {
    path: '/products/create',
    name: 'ProductCreate',
    component: ProductForm,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor'] }
  },
  {
    path: '/products/edit/:id',
    name: 'ProductEdit',
    component: ProductForm,
    props: route => ({ productId: route.params.id }),
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor'] }
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: ProductDetail,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
  },

  //reservas
  {
    path: '/reservations/:id',
    name: 'ReservationDetail',
    component: ReservationDetail,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
  },
  {
    path: '/reservations',
    name: 'reservation-list',
    component: ReservationList,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
  },
  {
    path: '/reservations/create',
    name: 'ReservationForm',
    component: ReservationForm,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
  },
  {
    path: '/reservations/edit/:id',
    name: 'ReservationForm',
    component: ReservationForm,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
  },
  {
    path: '/reservar',
    name: 'ReservarProducto',
    component: ReservarProducto,
    meta: { requiresAuth: true, roles: ['super-admin','emprendedor','cliente'] }
  },
    //  {
  //   path: '/admin/pagos/crear',
  //   name: 'PaymentCreate',
  //   component: PaymentCreate,
  //   meta: { requiresAuth: true, roles: [ 'super-admin'] }
  // },
  {
    path: '/admin/ventas-presenciales',
    name: 'DirectSaleForm',
    component: DirectSaleForm,
    meta: { requiresAuth: true, roles: ['super-admin', 'emprendedor'] }
  },

  //daboart
  {
    path: '/dashboard-cliente',
    name: 'DashboardCliente',
    component: DashboardCliente,
    meta: { requiresAuth: true, roles: ['cliente'] }
  },
  //registereeit
  {
    path: '/perfil',
    name: 'EditarPerfil',
    component: EditarPerfil,
    meta: { requiresAuth: true, roles: ['cliente','super-admin'] }
  },
  //pago
  {
    path: '/pago/:id',
    name: 'PaymentForm',
    component: PaymentForm,
    meta: { requiresAuth: true, roles: ['cliente', 'super-admin'] }
  },
  {
    path: '/pagos',
    name: 'PaymentsList',
    component: PaymentsList,
    meta: { requiresAuth: true, roles: ['emprendedor', 'super-admin'] }
  },
   {
    path: '/admin/pagos',
    name: 'AdminPaymentsList',
    component: AdminPaymentsList,
    meta: { requiresAuth: true, roles: [ 'super-admin'] }
  },

  {
    path: '/products/my',
    name: 'MyProducts',
    component: MyProductList, // <-- este componente debe hacer GET a /products/my
    meta: { requiresAuth: true, roles: ['emprendedor'] }
  },
  


  // Alias para no romper viejos enlaces
  { path: '/homeedit', redirect: '/admin/homeedit' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guardia global basada en token + roles almacenados
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }
  if (to.meta.roles && token) {
    const roles = JSON.parse(localStorage.getItem('user_roles') || '[]')
    const ok = roles.some(r => to.meta.roles.includes(r))
    if (!ok) return next('/dashboard')
  }
  next()
})

export default router
