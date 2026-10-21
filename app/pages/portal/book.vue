<script setup lang="ts">
definePageMeta({ layout: 'portal' })

import { extractSymptoms } from '~/utils/nlp'

const { identity } = usePatientPortal()
const { patients, facilities, doctors, bookFromPortal, facById } = usePlatform()

const me = computed(() => patients.value.find(p => p.id === identity.value?.patientId) ?? null)
const step = ref(1)
const complaint = ref('I have been experiencing chest discomfort and difficulty breathing.')
const picked = ref('')
const bookedId = ref('')
const emergency = ref(false)
const overflow = ref('')

const chips = ['Fever', 'Cough', 'Headache', 'Chest discomfort', 'Skin concern']
const hits = computed(() => extractSymptoms(complaint.value))
const specialty = computed(() => hits.value[0]?.specialty || 'General Practice')

const options = computed(() => {
  const spec = specialty.value
  const docs = doctors.value.filter(d => d.specialty === spec)
  const fallback = doctors.value.filter(d => d.specialty === 'General Practice')
  const pool = docs.length ? docs : fallback
  return pool.slice(0, 3).map((d, i) => {
    const fac = facById(d.facilityId)
    return {
      id: d.id,
      facilityId: d.facilityId,
      name: fac?.name || d.facilityId,
      doctor: d.name,
      wait: 18 + i * 8,
      tag: i === 0 ? 'Recommended' : i === 1 ? '2 slots left' : 'Walk-in support'
    }
  })
})

watch(options, (rows) => {
  if (!picked.value && rows[0]) picked.value = rows[0].id
}, { immediate: true })

const chosen = computed(() => options.value.find(o => o.id === picked.value) || options.value[0])
const booked = computed(() => bookedId.value)

function applyChip(c: string) {
  complaint.value = c === 'Chest discomfort'
    ? 'I have been experiencing chest discomfort and difficulty breathing.'
    : `I have been experiencing ${c.toLowerCase()}.`
}

function confirm() {
  const p = me.value
  if (!p || !chosen.value) return
  const result = bookFromPortal({
    name: p.name,
    age: p.age,
    sex: p.sex,
    barangay: p.barangay,
    contact: p.contact,
    philhealth: p.philhealth,
    complaint: complaint.value,
    facilityId: chosen.value.facilityId
  })
  if (result.emergency) {
    emergency.value = true
    return
  }
  if (!result.ok) {
    overflow.value = result.overflow || 'No open window at that site.'
    return
  }
  bookedId.value = result.appointment?.id || 'ok'
}

const sites = computed(() => facilities.value.filter(f => f.type === 'RHU' || f.type === 'BHS'))
</script>

<template>
  <div>
    <NuxtLink class="vc-link" to="/portal">← Back to overview</NuxtLink>
    <p class="pt-kicker" style="text-align:right; margin-top:-22px">Book consultation · Step {{ step }} of 4</p>

    <div class="pt-steps">
      <div class="pt-step" :class="{ on: step === 1, done: step > 1 }"><div class="pt-dot">{{ step > 1 ? '✓' : '1' }}</div>Your concern</div>
      <div class="pt-step" :class="{ on: step === 2, done: step > 2 }"><div class="pt-dot">{{ step > 2 ? '✓' : '2' }}</div>Recommendation</div>
      <div class="pt-step" :class="{ on: step === 3, done: step > 3 }"><div class="pt-dot">{{ step > 3 ? '✓' : '3' }}</div>Availability</div>
      <div class="pt-step" :class="{ on: step === 4 }"><div class="pt-dot">4</div>Confirm</div>
    </div>

    <div v-if="emergency" class="flash alert">This sounds like an emergency. Go to City Infirmary ER in Poblacion, or call municipal emergency transport.</div>
    <div v-else-if="overflow" class="flash">{{ overflow }}</div>

    <article v-if="!booked" class="pt-card">
      <template v-if="step === 1">
        <p class="vc-kicker">Step 1 · Patient complaint</p>
        <h2>What are you experiencing?</h2>
        <p class="vc-lede">Tell us in your own words. Your answer helps the care team prepare — it is not a diagnosis.</p>
        <label class="field" style="margin-top:16px">
          <span>Describe your concern</span>
          <textarea v-model="complaint" rows="5" />
        </label>
        <p class="pt-kicker" style="margin-top:14px">Common concerns</p>
        <div class="pt-chips" style="margin:8px 0 16px">
          <button v-for="c in chips" :key="c" class="pt-chip" type="button" @click="applyChip(c)">{{ c }}</button>
        </div>
        <div class="pt-banner">AI-assisted recommendation: we’ll suggest a specialty for your review. A healthcare professional makes the final decision.</div>
        <div style="display:flex; justify-content:flex-end; margin-top:16px">
          <button class="btn" type="button" @click="step = 2">Review recommendation →</button>
        </div>
      </template>

      <template v-else-if="step === 2">
        <p class="vc-kicker">Step 2 · Review</p>
        <h2>Here’s a care pathway to consider.</h2>
        <p class="vc-lede">Based on the information provided, a {{ specialty }} consultation may be appropriate.</p>
        <div class="pt-banner" style="margin:16px 0">
          <p class="pt-kicker">Recommended specialty</p>
          <h3>{{ specialty }}</h3>
          <p class="muted">Your reported symptoms may require evaluation related to {{ hits[0]?.system || 'general care' }}.</p>
        </div>
        <p class="muted">This is an AI-assisted recommendation and does not replace professional medical evaluation.</p>
        <div style="display:flex; justify-content:space-between; margin-top:18px">
          <button class="btn secondary" type="button" @click="step = 1">← Edit information</button>
          <button class="btn" type="button" @click="step = 3">Continue to scheduling →</button>
        </div>
      </template>

      <template v-else-if="step === 3">
        <p class="vc-kicker">Step 3 · Facility &amp; doctor</p>
        <h2>Choose a time that works for you.</h2>
        <p class="vc-lede">Showing {{ specialty }} availability across the Valencia municipal health network.</p>
        <div style="display:grid; gap:10px; margin-top:16px">
          <button v-for="o in options" :key="o.id" class="pt-slot" :class="{ on: picked === o.id }" type="button" @click="picked = o.id">
            <span>
              <span class="pt-kicker">{{ o.tag }}</span>
              <strong style="display:block">{{ o.name }}</strong>
              <span class="muted">{{ o.doctor }}</span>
            </span>
            <span style="text-align:right">
              <strong>{{ sites.find(s => s.id === o.facilityId)?.hours?.slice(0,5) || '09:30' }}</strong>
              <div class="muted">~{{ o.wait }} min wait</div>
            </span>
          </button>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:18px">
          <button class="btn secondary" type="button" @click="step = 2">← Back</button>
          <button class="btn" type="button" @click="step = 4">Review appointment →</button>
        </div>
      </template>

      <template v-else>
        <p class="vc-kicker">Step 4 · Appointment confirmation</p>
        <h2>You’re almost there.</h2>
        <p class="vc-lede">Review the details below before confirming your appointment.</p>
        <div class="pt-banner" style="margin:16px 0">
          <p class="pt-kicker">New appointment · Ref. VC-{{ me?.residentId || 'POB' }}</p>
          <h3>{{ specialty }} consultation</h3>
          <p><strong>Patient</strong> {{ me?.name }}<br>
            <strong>Facility</strong> {{ chosen?.name }}<br>
            <strong>Doctor</strong> {{ chosen?.doctor }}<br>
            <strong>Specialty</strong> {{ specialty }}</p>
        </div>
        <div style="text-align:center; margin:18px 0">
          <div class="pt-qr" style="border:1px dashed var(--line); display:grid; place-items:center">QR</div>
          <p class="muted">Appointment QR · Present at check-in</p>
        </div>
        <div style="display:flex; justify-content:space-between">
          <button class="btn secondary" type="button" @click="step = 3">← Back</button>
          <button class="btn" type="button" @click="confirm">Confirm appointment</button>
        </div>
      </template>
    </article>

    <article v-else class="pt-card">
      <p class="vc-kicker">Confirmed</p>
      <h2>Your hold is on the municipal board.</h2>
      <p class="vc-lede">{{ chosen?.name }} · {{ chosen?.doctor }}. Arrive 5–10 minutes early.</p>
      <div class="vc-actions">
        <NuxtLink class="btn" to="/portal/visit">Manage this visit</NuxtLink>
        <NuxtLink class="btn secondary" to="/portal">Back to overview</NuxtLink>
      </div>
    </article>
  </div>
</template>
