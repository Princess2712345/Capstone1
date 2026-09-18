<script setup lang="ts">
const { session, logout } = useAuth()

async function signOut() {
  logout()
  await navigateTo('/')
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <div class="brand-kicker">LGU Valencia City · CHO</div>
        <h1 class="brand-title">Care Ops</h1>
        <p class="brand-sub">Integrated routing, scheduling, and medicine supply for RHUs and barangay stations.</p>
        <p v-if="session" class="session-chip">{{ session.name }} · {{ session.role }}</p>
      </div>
      <nav class="nav-list">
        <NuxtLink class="nav-link" to="/ops">Command floor</NuxtLink>
        <NuxtLink class="nav-link" to="/triage">Specialty routing</NuxtLink>
        <NuxtLink class="nav-link" to="/schedule">Hybrid queue</NuxtLink>
        <NuxtLink class="nav-link" to="/pharmacy">e-Prescription</NuxtLink>
        <NuxtLink class="nav-link" to="/supply">FEFO &amp; procurement</NuxtLink>
      </nav>
      <div class="sidebar-foot">
        <button class="btn secondary" type="button" style="width:100%; margin-bottom:12px; color:#e8eefc; border-color:#3b5aa0" @click="signOut">
          Sign out
        </button>
        Prototype for Northern Mindanao municipal health operations. Not a clinical device.
      </div>
    </aside>
    <main class="main">
      <slot />
    </main>
  </div>
</template>
