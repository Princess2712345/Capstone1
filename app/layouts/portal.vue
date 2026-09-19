<script setup lang="ts">
const { identity, clearIdentity } = usePatientPortal()
</script>

<template>
  <div>
    <header class="pub-nav">
      <NuxtLink to="/portal" class="pub-brand">
        <strong>Care Ops</strong>
        <span class="muted">Patient desk</span>
      </NuxtLink>
      <nav class="pub-links">
        <NuxtLink to="/portal/book">Book a visit</NuxtLink>
        <NuxtLink to="/portal/visit">My visit</NuxtLink>
        <NuxtLink to="/portal/rx">e-Rx QR</NuxtLink>
        <button v-if="identity" class="chip" type="button" @click="clearIdentity">{{ identity.name }} · sign out</button>
        <NuxtLink to="/">City Health</NuxtLink>
        <NuxtLink class="btn secondary" to="/login">Staff</NuxtLink>
      </nav>
    </header>
    <slot />
  </div>
</template>
