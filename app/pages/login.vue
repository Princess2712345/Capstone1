<script setup lang="ts">
import type { StaffRole } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const step = ref<'pick' | 'staff'>('pick')
const role = ref<StaffRole>('CHO officer')
const email = ref('cho@valencia.gov.ph')
const password = ref('careops')
const error = ref('')

const desks: { role: StaffRole; title: string; body: string; email: string; to: string }[] = [
  {
    role: 'BHW',
    title: 'Barangay health worker',
    body: 'Intake, barangay catchments, and referrals from BHS sites.',
    email: 'bhw.mailag@valencia.gov.ph',
    to: '/triage'
  },
  {
    role: 'RHU clinician',
    title: 'RHU clinician',
    body: 'Consults, SOAP notes, and the live queue at the assigned facility.',
    email: 'rhu1@valencia.gov.ph',
    to: '/schedule'
  },
  {
    role: 'CHO officer',
    title: 'CHO / LGU administrator',
    body: 'City-wide queues, load, facilities, and reports.',
    email: 'cho@valencia.gov.ph',
    to: '/ops'
  }
]

function pickRole(next: (typeof desks)[number]) {
  role.value = next.role
  email.value = next.email
}

async function submit() {
  error.value = login(email.value, password.value) ?? ''
  if (error.value) return
  const desk = desks.find(d => d.role === role.value)
  await navigateTo(desk?.to ?? '/ops')
}
</script>

<template>
  <div>
    <template v-if="step === 'pick'">
      <p class="vc-kicker">Valencia Care</p>
      <h1>Choose how you enter the municipal network.</h1>
      <p class="vc-lede">Patients and LGU staff use separate workspaces so records stay in the right hands.</p>
      <button class="access-card" type="button" @click="navigateTo('/portal/login')">
        <strong>Patient access</strong>
        <div class="muted">Book, queue, records, and e-prescriptions</div>
      </button>
      <button class="access-card" type="button" @click="step = 'staff'">
        <strong>Staff and LGU access</strong>
        <div class="muted">BHW, RHU clinician, pharmacist, or CHO officer</div>
      </button>
    </template>

    <template v-else>
      <button class="vc-link" type="button" @click="step = 'pick'">← Back to access options</button>
      <h1>Staff workspace</h1>
      <p class="vc-lede">Sign in with your City Health Office account. Access follows your assigned role and facility.</p>
      <form class="pt-card" style="margin-top:18px" @submit.prevent="submit">
        <p class="pt-kicker">LGU sign in</p>
        <p>I am signing in as</p>
        <button
          v-for="d in desks"
          :key="d.role"
          class="access-card"
          :class="{ on: role === d.role }"
          type="button"
          @click="pickRole(d)"
        >
          <strong>{{ d.title }}</strong>
          <div class="muted">{{ d.body }}</div>
        </button>
        <label class="field"><span>Work email</span><input v-model="email" type="email" required></label>
        <label class="field" style="margin-top:12px"><span>Password</span><input v-model="password" type="password" required></label>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="btn" type="submit" style="width:100%; margin-top:16px">Open workspace</button>
      </form>
    </template>
  </div>
</template>
