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
  <div>
    <p class="vc-kicker">Patient access</p>
    <p class="vc-lede">Residents only. Staff use a separate workspace.</p>
    <form class="pt-card" style="margin-top:18px" @submit.prevent="submit">
      <label class="field"><span>Email</span><input v-model="email" type="email" required></label>
      <label class="field" style="margin-top:12px"><span>Password</span><input v-model="password" type="password" required></label>
      <p v-if="error" class="field-error">{{ error }}</p>
      <button class="btn" type="submit" style="width:100%; margin-top:16px">Enter portal</button>
      <p class="muted" style="margin-top:12px">
        Demo: rosa@valencia.ph or junrey@valencia.ph / careops
      </p>
      <p class="muted">No account? <NuxtLink class="vc-link" to="/portal/signup">Register a new patient account</NuxtLink></p>
    </form>
  </div>
</template>
