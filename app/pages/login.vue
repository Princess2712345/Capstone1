<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const email = ref('cho@valencia.gov.ph')
const password = ref('careops')
const error = ref('')

async function submit() {
  error.value = login(email.value, password.value) ?? ''
  if (!error.value) await navigateTo('/ops')
}
</script>

<template>
  <form class="auth-card" @submit.prevent="submit">
    <CitySeal size="sm" />
    <h2>Staff log in</h2>
    <p class="muted">Use your City Health or facility directory email.</p>
    <label class="field" style="margin-top:16px">
      <span>Work email</span>
      <input v-model="email" type="email" autocomplete="username" required>
    </label>
    <label class="field" style="margin-top:12px">
      <span>Password</span>
      <input v-model="password" type="password" autocomplete="current-password" required>
    </label>
    <p v-if="error" class="field-error">{{ error }}</p>
    <button class="btn" type="submit" style="margin-top:16px; width:100%">Enter command floor</button>
    <p class="muted" style="margin-top:14px">
      Demo: <code>cho@valencia.gov.ph</code> / <code>careops</code>
    </p>
    <p class="muted">No account yet? <NuxtLink to="/signup" style="color:var(--leaf)">Sign up</NuxtLink></p>
  </form>
</template>
