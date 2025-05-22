<template>
    <div class="stat-card d-flex align-items-center p-3 rounded-4">
      <div class="stat-icon-wrapper me-3">
        <i class="bi" :class="icon"></i>
      </div>
      <div>
        <div class="stat-number">{{ value }}</div>
        <div class="stat-label">{{ label }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StatCard",
    props: {
      icon: {
        type: String,
        required: true
      },
      value: {
        type: [Number, String],
        required: true
      },
      label: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .stat-card {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }
  
  .stat-icon-wrapper {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    font-size: 1.5rem;
    color: #fff;
  }
  
  .stat-number {
    font-size: 1.75rem;
    font-weight: 700;
    color: #fff;
  }
  
  .stat-label {
    font-size: 0.9rem;
    opacity: 0.85;
    color: #f0f0f0;
  }
  </style>
  