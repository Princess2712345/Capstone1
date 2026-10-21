<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const step = ref<'pick' | 'staff'>('pick')
const role = ref<'BHW' | 'clinician' | 'CHO officer'>('BHW')
const email = ref('cho@valencia.gov.ph')
const password = ref('careops')
const error = ref('')

async function submit() {
  error.value = login(email.value, password.value) ?? ''
  if (!error.value) await navigateTo('/ops')
}
</script>

<template>
  <div>
    <template v-if="step === 'pick'">
      <p class="vc-kicker">Welcome to Valencia Care</p>
      <h1>Patients and care teams use separate entry points.</h1>
      <p class="vc-lede">Every workspace starts with the right access and privacy controls.</p>
      <button class="access-card" type="button" @click="navigateTo('/portal/login')">
        <strong>Patient access</strong>
        <div class="muted">Sign in or create a patient account</div>
      </button>
      <button class="access-card" type="button" @click="step = 'staff'">
        <strong>Staff and LGU access</strong>
        <div class="muted">Healthcare worker, doctor, or administrator</div>
      </button>
      <p class="muted">This prototype uses sample data. Production accounts would require verified identity and role approval.</p>
    </template>

    <template v-else>
      <button class="vc-link" type="button" @click="step = 'pick'">← Back to access options</button>
      <h1>Welcome <span class="vc-accent">back.</span></h1>
      <p class="vc-lede">Staff access is provisioned by the municipal health office and restricted by role.</p>
      <form class="pt-card" style="margin-top:18px" @submit.prevent="submit">
        <p class="pt-kicker">Staff workspace sign in</p>
        <p>I am signing in as</p>
        <button class="access-card" :class="{ on: role === 'BHW' }" type="button" @click="role = 'BHW'">
          <strong>Healthcare worker</strong>
          <div class="muted">Coordinate intake, queues, and referrals</div>
        </button>
        <button class="access-card" :class="{ on: role === 'clinician' }" type="button" @click="role = 'clinician'">
          <strong>Doctor</strong>
          <div class="muted">Consult and update clinical records</div>
        </button>
        <button class="access-card" :class="{ on: role === 'CHO officer' }" type="button" @click="role = 'CHO officer'">
          <strong>LGU administrator</strong>
          <div class="muted">Monitor the municipal network</div>
        </button>
        <label class="field"><span>Work email or staff ID</span><input v-model="email" type="email" required></label>
        <label class="field" style="margin-top:12px"><span>Password</span><input v-model="password" type="password" required></label>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="btn" type="submit" style="width:100%; margin-top:16px">Open staff workspace</button>
        <p class="muted" style="margin-top:12px">Demo: cho@valencia.gov.ph / careops</p>
      </form>
    </template>
  </div>
</template>
