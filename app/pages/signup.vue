<script setup lang="ts">
import type { StaffRole } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const { signup } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<StaffRole>('RHU clinician')
const facility = ref('Valencia RHU 1')
const error = ref('')

const roles: StaffRole[] = ['CHO officer', 'RHU clinician', 'BHW', 'Pharmacist']
const facilities = [
  'City Health Office',
  'Valencia RHU 1',
  'Valencia RHU 2',
  'BHS Mailag',
  'BHS Lumbayao',
  'BHS San Carlos',
  'City Infirmary ER'
]

async function submit() {
  error.value = signup({
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
    facility: facility.value
  }) ?? ''
  if (!error.value) await navigateTo('/ops')
}
</script>

<template>
  <form class="auth-card" @submit.prevent="submit">
    <h2>Create a staff account</h2>
    <p class="muted">For CHO, RHU, BHW, and pharmacy desks in Valencia City.</p>
    <label class="field" style="margin-top:16px">
      <span>Full name</span>
      <input v-model="name" required>
    </label>
    <label class="field" style="margin-top:12px">
      <span>Work email</span>
      <input v-model="email" type="email" required>
    </label>
    <label class="field" style="margin-top:12px">
      <span>Password</span>
      <input v-model="password" type="password" minlength="6" required>
    </label>
    <div class="grid-2" style="margin-top:12px">
      <label class="field">
        <span>Role</span>
        <select v-model="role">
          <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
        </select>
      </label>
      <label class="field">
        <span>Home facility</span>
        <select v-model="facility">
          <option v-for="f in facilities" :key="f" :value="f">{{ f }}</option>
        </select>
      </label>
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
    <button class="btn" type="submit" style="margin-top:16px; width:100%">Create account and enter</button>
    <p class="muted" style="margin-top:14px">
      Already registered? <NuxtLink to="/login" style="color:var(--leaf)">Log in</NuxtLink>
    </p>
  </form>
</template>
