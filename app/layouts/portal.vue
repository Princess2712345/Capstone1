<script setup lang="ts">
const route = useRoute()
const { identity, logout } = usePatientPortal()
const menu = ref(false)

const title = computed(() => {
  const map: Record<string, string> = {
    '/portal': identity.value ? `Good morning, ${identity.value.name.split(' ')[0]}` : 'Patient portal',
    '/portal/book': 'Book a consultation',
    '/portal/visit': 'Appointments',
    '/portal/queue': 'My queue',
    '/portal/rx': 'Prescriptions',
    '/portal/records': 'Health records',
    '/portal/referrals': 'Referrals',
    '/portal/messages': 'Messages / SMS',
    '/portal/emergency': 'Emergency help',
    '/portal/login': 'Sign in',
    '/portal/signup': 'Create account'
  }
  return map[route.path] || 'Patient portal'
})

const initials = computed(() => {
  const parts = (identity.value?.name || 'P').split(' ')
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
})

async function signOut() {
  menu.value = false
  logout()
  await navigateTo('/portal/login')
}

const links = [
  { to: '/portal', label: 'Overview' },
  { to: '/portal/visit', label: 'Appointments' },
  { to: '/portal/queue', label: 'My queue' },
  { to: '/portal/records', label: 'Health records' },
  { to: '/portal/rx', label: 'Prescriptions' },
  { to: '/portal/referrals', label: 'Referrals' },
  { to: '/portal/messages', label: 'Messages / SMS' },
  { to: '/portal/book', label: 'Book consultation' }
]
</script>

<template>
  <div class="pt-shell">
    <header class="pt-top">
      <button class="pt-icon" type="button" aria-label="Open menu" @click="menu = true">☰</button>
      <h1>{{ title }}</h1>
      <div class="pt-tools">
        <button class="pt-icon" type="button" aria-label="Search">⌕</button>
        <button class="pt-icon" type="button" aria-label="Alerts">🔔</button>
        <span class="pt-avatar">{{ initials }}</span>
      </div>
    </header>
    <div v-if="menu" class="pt-scrim" @click="menu = false" />
    <aside v-if="menu" class="pt-drawer">
      <div class="vc-brand" style="margin-bottom:12px">
        <BrandMark size="sm" />
        <span><strong>ValenciaCare</strong><span>Patient portal</span></span>
      </div>
      <template v-if="identity">
        <NuxtLink v-for="l in links" :key="l.to" class="nav-link" :to="l.to" @click="menu = false">{{ l.label }}</NuxtLink>
        <button class="nav-link" type="button" style="text-align:left" @click="signOut">Sign out</button>
      </template>
      <template v-else>
        <NuxtLink class="nav-link" to="/portal/login" @click="menu = false">Log in</NuxtLink>
        <NuxtLink class="nav-link" to="/portal/signup" @click="menu = false">Sign up</NuxtLink>
        <NuxtLink class="nav-link" to="/" @click="menu = false">City site</NuxtLink>
      </template>
    </aside>
    <div class="pt-body">
      <slot />
    </div>
  </div>
</template>
