<script setup lang="ts">
definePageMeta({ layout: 'public' })

const route = useRoute()
const { login } = usePatientPortal()
const email = ref('rosa@valencia.ph')
const password = ref('careops')
const remember = ref(false)
const showPass = ref(false)
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
  <div class="gate">
    <div class="gate-marks" aria-hidden="true">
      <span class="plus">+</span>
      <span class="plus plus-2">+</span>
      <span class="heart">♥</span>
    </div>
    <div class="lp-wrap gate-grid">
      <section class="gate-copy">
        <p class="lp-kicker">Patient access</p>
        <h1>Your health journey<br><span>starts here.</span></h1>
        <p class="lp-lede">
          Log in to the patient portal to access your appointments, medical records, and more — anytime, anywhere.
        </p>
        <div class="gate-art" aria-hidden="true">
          <div class="lp-care-pulse" />
          <svg class="lp-care-heart" viewBox="0 0 64 64" fill="none">
            <path d="M32 54S12 40 8 26c-2-8 4-16 12-16 5 0 8 3 12 8 4-5 7-8 12-8 8 0 14 8 12 16-4 14-24 28-24 28Z" fill="#12b5a0"/>
          </svg>
          <svg class="lp-ecg" viewBox="0 0 360 80" fill="none">
            <path class="lp-ecg-line" d="M0 40 H48 L58 40 L68 12 L82 68 L94 40 H150 L160 40 L170 18 L184 62 L196 40 H360" />
          </svg>
          <div class="lp-float-chip lp-float-a">Records</div>
          <div class="lp-float-chip lp-float-b">Appointments</div>
        </div>
      </section>

      <form class="gate-card" @submit.prevent="submit">
        <h2>Welcome back</h2>
        <p>Sign in to your patient account</p>
        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" autocomplete="username" required>
        </label>
        <div class="field">
          <label for="patient-password">Password</label>
          <span class="gate-pass">
            <input id="patient-password" v-model="password" :type="showPass ? 'text' : 'password'" autocomplete="current-password" required>
            <button type="button" :aria-label="showPass ? 'Hide password' : 'Show password'" @click="showPass = !showPass">
              {{ showPass ? 'Hide' : 'Show' }}
            </button>
          </span>
        </div>
        <div class="gate-row">
          <label class="gate-check">
            <input v-model="remember" type="checkbox">
            Remember me
          </label>
          <span class="muted">Forgot password?</span>
        </div>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="lp-cta" type="submit">Enter portal →</button>
        <p class="gate-or">or</p>
        <p class="muted">Demo: rosa@valencia.ph or junrey@valencia.ph / careops</p>
        <p class="muted">No account? <NuxtLink to="/portal/signup">Register a new patient account</NuxtLink></p>
      </form>
    </div>
  </div>
</template>
