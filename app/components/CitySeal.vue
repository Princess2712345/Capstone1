<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <img
    class="city-seal"
    :class="`city-seal-${size}`"
    src="/valencia-seal.png?v=2"
    alt="Official seal of the City of Valencia, Province of Bukidnon"
    width="128"
    height="128"
  >
</template>
