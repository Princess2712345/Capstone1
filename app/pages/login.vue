<script setup lang="ts">
import type { StaffRole } from '~/composables/useAuth'

definePageMeta({ layout: 'public' })

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
  <div class="gate">
    <div class="gate-marks" aria-hidden="true">
      <span class="plus">+</span>
      <span class="plus plus-2">+</span>
      <span class="heart">♥</span>
    </div>
    <div class="lp-wrap gate-grid">
      <section class="gate-copy">
        <template v-if="step === 'pick'">
          <p class="lp-kicker">Municipal access</p>
          <h1>Choose how you enter<br><span>the network.</span></h1>
          <p class="lp-lede">
            Patients and LGU staff use separate workspaces so records stay in the right hands.
          </p>
        </template>
        <template v-else>
          <p class="lp-kicker">Staff workspace</p>
          <h1>Sign in to your<br><span>care desk.</span></h1>
          <p class="lp-lede">
            Use your City Health Office account. Access follows your assigned role and facility.
          </p>
        </template>
        <div class="gate-art" aria-hidden="true">
          <div class="lp-care-pulse" />
          <svg class="lp-care-heart" viewBox="0 0 64 64" fill="none">
            <path d="M32 54S12 40 8 26c-2-8 4-16 12-16 5 0 8 3 12 8 4-5 7-8 12-8 8 0 14 8 12 16-4 14-24 28-24 28Z" fill="#12b5a0"/>
          </svg>
          <svg class="lp-ecg" viewBox="0 0 360 80" fill="none">
            <path class="lp-ecg-line" d="M0 40 H48 L58 40 L68 12 L82 68 L94 40 H150 L160 40 L170 18 L184 62 L196 40 H360" />
          </svg>
          <div class="lp-float-chip lp-float-a">RHU</div>
          <div class="lp-float-chip lp-float-b">BHS</div>
          <div class="lp-float-chip lp-float-c">CHO</div>
        </div>
      </section>

      <div v-if="step === 'pick'" class="gate-card">
        <h2>Welcome</h2>
        <p>Select the workspace you need today</p>
        <button class="gate-opt" type="button" @click="navigateTo('/portal/login')">
          <span>
            <strong>Patient access</strong>
            <em>Book, queue, records, and e-prescriptions</em>
          </span>
          <span aria-hidden="true">→</span>
        </button>
        <button class="gate-opt" type="button" @click="step = 'staff'">
          <span>
            <strong>Staff and LGU access</strong>
            <em>BHW, RHU clinician, pharmacist, or CHO officer</em>
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <form v-else class="gate-card" @submit.prevent="submit">
        <button class="gate-back" type="button" @click="step = 'pick'">← Back to access options</button>
        <h2>Welcome back</h2>
        <p>Sign in to your staff workspace</p>
        <p class="gate-label">I am signing in as</p>
        <button
          v-for="d in desks"
          :key="d.role"
          class="gate-opt compact"
          :class="{ on: role === d.role }"
          type="button"
          @click="pickRole(d)"
        >
          <span>
            <strong>{{ d.title }}</strong>
            <em>{{ d.body }}</em>
          </span>
        </button>
        <label class="field">
          <span>Work email</span>
          <input v-model="email" type="email" autocomplete="username" required>
        </label>
        <label class="field">
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" required>
        </label>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="lp-cta" type="submit">Open workspace →</button>
        <p class="muted">Demo: cho@valencia.gov.ph / careops</p>
      </form>
    </div>
  </div>
</template>
