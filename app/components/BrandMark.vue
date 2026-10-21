<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <span class="brand-mark" :class="'brand-mark-' + size" aria-hidden="true">
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M16 26s-8.2-5.1-11-10.2C3.2 12.4 4.6 8 8.6 8c2.2 0 3.7 1.2 4.7 2.8C14.3 9.2 15.8 8 18 8c4 0 5.4 4.4 3.6 7.8C24.2 20.9 16 26 16 26Z" fill="currentColor"/>
      <path d="M11.5 15.2c1.6 0 2.7-1.4 4.5-1.4 1.8 0 2.6 1.2 4.5 1.2" stroke="#9ec4ff" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  </span>
</template>
