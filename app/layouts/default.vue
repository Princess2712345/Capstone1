<script setup lang="ts">
const { session, logout } = useAuth()
const { flash, clock, tickClock, query, resetOps } = usePlatform()
const q = ref('')

async function signOut() {
  logout()
  await navigateTo('/')
}

async function goSearch() {
  query.value = q.value
  await navigateTo({ path: '/search', query: { q: q.value } })
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <NuxtLink to="/ops" class="sidebar-brand">
          <BrandMark size="md" />
          <div>
            <div class="brand-kicker">Valencia Care</div>
            <h1 class="brand-title">Staff workspace</h1>
            <p class="brand-sub" style="margin:0">Municipal health network</p>
          </div>
        </NuxtLink>
        <p class="brand-sub">Intake, queues, charts, e-Rx, and FEFO for RHUs and BHS.</p>
        <p v-if="session" class="session-chip">{{ session.name }} · {{ session.role }} · {{ session.facility }}</p>
      </div>
      <nav class="nav-list">
        <div class="nav-group-label">Operations</div>
        <NuxtLink class="nav-link" to="/ops">Command floor</NuxtLink>
        <NuxtLink class="nav-link" to="/triage">Specialty routing</NuxtLink>
        <NuxtLink class="nav-link" to="/schedule">Hybrid queue</NuxtLink>
        <div class="nav-group-label">Clinical</div>
        <NuxtLink class="nav-link" to="/patients">Patient registry</NuxtLink>
        <NuxtLink class="nav-link" to="/clinicians">Clinician roster</NuxtLink>
        <NuxtLink class="nav-link" to="/pharmacy">e-Rx &amp; vouchers</NuxtLink>
        <div class="nav-group-label">Network</div>
        <NuxtLink class="nav-link" to="/facilities">Facilities</NuxtLink>
        <NuxtLink class="nav-link" to="/supply">FEFO &amp; procurement</NuxtLink>
        <div class="nav-group-label">Admin</div>
        <NuxtLink class="nav-link" to="/reports">Reports</NuxtLink>
        <NuxtLink class="nav-link" to="/staff">Staff directory</NuxtLink>
        <NuxtLink class="nav-link" to="/search">Search</NuxtLink>
      </nav>
      <div class="sidebar-foot">
        <NuxtLink class="btn secondary" to="/" style="width:100%; margin-bottom:8px; display:block; text-align:center">Public site</NuxtLink>
        <button class="btn secondary" type="button" style="width:100%; margin-bottom:8px" @click="signOut">Sign out</button>
        <button class="btn secondary" type="button" style="width:100%; margin-bottom:12px" @click="resetOps">Restore baseline data</button>
        Valencia City Health operations. Not a diagnostic device.
      </div>
    </aside>
    <div class="workspace">
      <header class="topbar">
        <form class="top-search" @submit.prevent="goSearch">
          <input v-model="q" type="search" placeholder="Search patients, QR, clinicians, slots">
          <button class="btn secondary" type="submit">Search</button>
        </form>
        <div class="top-meta">
          <span class="chip">18 Sep 2026</span>
          <span class="chip">Clock {{ clock }}</span>
          <button class="btn secondary" type="button" @click="tickClock(15)">+15 min</button>
        </div>
      </header>
      <div v-if="flash" class="flash flash-bar">
        {{ flash }}
        <button class="chip" type="button" @click="flash = ''">Dismiss</button>
      </div>
      <main class="main">
        <slot />
      </main>
    </div>
  </div>
</template>
