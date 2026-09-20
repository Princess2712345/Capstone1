<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { facilities, appointments, bookFromPortal, facById, docById, clock } = usePlatform()
const { remember } = usePatientPortal()

const form = reactive({
  name: '',
  age: 35,
  sex: 'F' as 'F' | 'M',
  barangay: 'Poblacion',
  contact: '',
  philhealth: '',
  complaint: '',
  facilityId: 'rhu1'
})

const error = ref('')
const emergency = ref(false)
const overflow = ref('')
const bookedId = ref('')

const booked = computed(() => appointments.value.find(a => a.id === bookedId.value))
const sites = computed(() => facilities.value.filter(f => f.type === 'RHU' || f.type === 'BHS'))

function submit() {
  error.value = ''
  emergency.value = false
  overflow.value = ''
  if (!form.name.trim() || !form.contact.trim() || !form.complaint.trim()) {
    error.value = 'Name, mobile number, and a short complaint are required.'
    return
  }
  const result = bookFromPortal({ ...form })
  if (result.emergency) {
    emergency.value = true
    return
  }
  if (!result.ok) {
    overflow.value = result.overflow || 'No open window. Try RHU 2, BHS Mailag, or tomorrow 08:00.'
    if (result.patient) remember(result.patient.id, result.patient.name, result.patient.contact)
    return
  }
  if (result.patient && result.appointment) {
    remember(result.patient.id, result.patient.name, result.patient.contact)
    bookedId.value = result.appointment.id
  }
}
</script>

<template>
  <div class="desk">
    <header class="desk-head">
      <p class="lp-eyebrow">Online hold</p>
      <h1>Hold the next 15-minute window.</h1>
      <p class="lp-lede">Municipal clock {{ clock }}. Arrive 5–10 minutes before your slot.</p>
    </header>

    <div v-if="emergency" class="flash alert">
      This sounds like an emergency. Go to <strong>City Infirmary ER</strong> in Poblacion, or call municipal emergency transport.
    </div>
    <div v-else-if="overflow" class="flash">{{ overflow }}</div>

    <section class="desk-hero" v-if="!booked">
      <article class="desk-panel">
        <h2>Your details</h2>
        <div class="form-grid form-grid-2">
          <label class="field"><span>Full name</span><input v-model="form.name" required></label>
          <label class="field"><span>Mobile</span><input v-model="form.contact" required placeholder="09xx"></label>
          <label class="field"><span>Age</span><input v-model.number="form.age" type="number" min="0"></label>
          <label class="field">
            <span>Sex</span>
            <select v-model="form.sex">
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </label>
          <label class="field"><span>Barangay</span><input v-model="form.barangay"></label>
          <label class="field"><span>PhilHealth (optional)</span><input v-model="form.philhealth"></label>
          <label class="field field-span">
            <span>Preferred site</span>
            <select v-model="form.facilityId">
              <option v-for="f in sites" :key="f.id" :value="f.id">{{ f.name }} · {{ f.barangay }}</option>
            </select>
          </label>
          <label class="field field-span">
            <span>Complaint (English or Cebuano)</span>
            <textarea v-model="form.complaint" rows="3" placeholder="Sakit sa ulo since this morning, hilanat..." />
          </label>
        </div>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="btn" type="button" style="margin-top:16px" @click="submit">Hold next open window</button>
      </article>
      <aside class="desk-note">
        <p class="lp-eyebrow" style="color:#d4c48a">If the first site is full</p>
        <h2>Overflow order</h2>
        <p>RHU 1, then RHU 2, then BHS Mailag, then a morning priority tomorrow.</p>
        <div v-for="f in sites" :key="f.id" style="margin-top:14px">
          <div style="display:flex; justify-content:space-between; font-size:13px">
            <span>{{ f.name }}</span>
            <span>{{ f.walkInUsed }}/{{ f.walkInCap }}</span>
          </div>
          <div class="meter" style="margin-top:6px; background:rgba(255,255,255,0.12)" :class="{ full: f.walkInUsed >= f.walkInCap, hot: f.walkInUsed / f.walkInCap >= 0.8 }">
            <span :style="{ width: Math.min(100, (f.walkInUsed / f.walkInCap) * 100) + '%' }" />
          </div>
        </div>
      </aside>
    </section>

    <article v-else class="desk-panel">
      <p class="lp-eyebrow">Confirmed</p>
      <h2>{{ booked.time }} · {{ facById(booked.facilityId)?.name }}</h2>
      <p class="lp-lede">{{ docById(booked.doctorId)?.name }}. Arrive 5–10 minutes early. A notice is queued to {{ form.contact }}.</p>
      <div class="lp-actions">
        <NuxtLink class="btn" to="/portal/visit">Manage this visit</NuxtLink>
        <NuxtLink class="btn secondary" to="/portal/rx">e-Rx QR later</NuxtLink>
      </div>
    </article>
  </div>
</template>
