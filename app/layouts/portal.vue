<script setup lang="ts">
const { identity, clearIdentity } = usePatientPortal()
</script>

<template>
  <div class="lp-shell">
    <header class="lp-nav">
      <div class="lp-wrap lp-nav-inner">
        <NuxtLink to="/portal" class="lp-brand">
          <CitySeal size="sm" />
          <span class="lp-brand-copy">
            <span class="lp-brand-kicker">City Health Office</span>
            <strong>Patient desk</strong>
            <span class="lp-brand-sub">Valencia City</span>
          </span>
        </NuxtLink>
        <nav class="lp-links" aria-label="Patient desk">
          <NuxtLink to="/portal/book">Book a visit</NuxtLink>
          <NuxtLink to="/portal/visit">My visit</NuxtLink>
          <NuxtLink to="/portal/rx">e-Rx QR</NuxtLink>
          <button v-if="identity" class="chip" type="button" @click="clearIdentity">{{ identity.name }} · sign out</button>
          <NuxtLink to="/">City Health</NuxtLink>
          <NuxtLink class="btn" to="/login">Staff</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
