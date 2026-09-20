<script setup lang="ts">
const { identity, logout } = usePatientPortal()

async function signOut() {
  logout()
  await navigateTo('/portal/login')
}
</script>

<template>
  <div class="portal-shell">
    <header class="portal-nav">
      <div class="lp-wrap lp-nav-inner">
        <NuxtLink to="/portal" class="lp-brand">
          <CitySeal size="sm" />
          <span class="lp-brand-copy">
            <span class="lp-brand-kicker">Valencia City Health</span>
            <strong>Patient portal</strong>
            <span class="lp-brand-sub">Residents</span>
          </span>
        </NuxtLink>
        <nav v-if="identity" class="lp-links" aria-label="Patient portal">
          <NuxtLink to="/portal">Dashboard</NuxtLink>
          <NuxtLink to="/portal/book">Book appointment</NuxtLink>
          <NuxtLink to="/portal/visit">My visit</NuxtLink>
          <NuxtLink to="/portal/rx">e-Rx QR</NuxtLink>
          <button class="chip" type="button" @click="signOut">{{ identity.name }} · sign out</button>
        </nav>
        <nav v-else class="lp-links" aria-label="Patient account">
          <NuxtLink to="/portal/login">Log in</NuxtLink>
          <NuxtLink class="btn" to="/portal/signup">Sign up</NuxtLink>
          <NuxtLink to="/">City site</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
