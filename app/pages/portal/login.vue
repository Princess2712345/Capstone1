<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const route = useRoute()
const { login } = usePatientPortal()
const email = ref('rosa@valencia.ph')
const password = ref('careops')
const error = ref('')

async function submit() {
  error.value = login(email.value, password.value) ?? ''
  if (!error.value) {
    const next = typeof route.query.next === 'string' ? route.query.next : '/portal'
    await navigateTo(next.startsWith('/portal') ? next : '/portal')
  }
}
</script>

<template>
  <div class="desk">
    <header class="desk-head">
      <p class="lp-eyebrow">Patient portal</p>
      <h1>Log in to your health account.</h1>
      <p class="lp-lede">Residents only. Staff use a separate command-floor login.</p>
    </header>
    <form class="desk-panel desk-auth" @submit.prevent="submit">
      <h2>Log in</h2>
      <label class="field">
        <span>Email</span>
        <input v-model="email" type="email" autocomplete="username" required>
      </label>
      <label class="field" style="margin-top:12px">
        <span>Password</span>
        <input v-model="password" type="password" autocomplete="current-password" required>
      </label>
      <p v-if="error" class="field-error">{{ error }}</p>
      <button class="btn" type="submit" style="margin-top:16px; width:100%">Enter portal</button>
      <p class="muted" style="margin-top:14px">
        Demo: Rosa (Poblacion / RHU 1) <code>rosa@valencia.ph</code> · Junrey (Mailag / BHS Mailag) <code>junrey@valencia.ph</code> / <code>careops</code>
      </p>
      <p class="muted">No account yet? <NuxtLink to="/portal/signup" class="row-link">Sign up</NuxtLink></p>
    </form>
  </div>
</template>
