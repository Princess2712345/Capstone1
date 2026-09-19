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
  <div class="band" style="padding-top:32px">
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Online hold</div>
        <h1>Book a 15-minute visit</h1>
        <p class="lede">The municipal clock is {{ clock }}. Arrive 5–10 minutes before your window.</p>
      </div>
    </header>

    <div v-if="emergency" class="flash alert">
      This sounds like an emergency. Go to <strong>City Infirmary ER</strong> in Poblacion, or call municipal emergency transport. Do not wait in the RHU queue.
    </div>
    <div v-else-if="overflow" class="flash">{{ overflow }}</div>

    <section class="split" v-if="!booked">
      <article class="card">
        <h2>Your details</h2>
        <div class="grid-2">
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
        </div>
        <label class="field" style="margin-top:10px">
          <span>Preferred site</span>
          <select v-model="form.facilityId">
            <option v-for="f in sites" :key="f.id" :value="f.id">{{ f.name }} · {{ f.barangay }}</option>
          </select>
        </label>
        <label class="field" style="margin-top:10px">
          <span>What is the complaint? (English or Cebuano)</span>
          <textarea v-model="form.complaint" rows="3" placeholder="Sakit sa ulo since this morning, hilanat..." />
        </label>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="btn" type="button" style="margin-top:14px" @click="submit">Hold next open window</button>
      </article>
      <article class="card">
        <h2>If your first choice is full</h2>
        <p class="muted">RHU 1 Poblacion saturates first. The desk will try RHU 2 Bagontaas, then BHS Mailag, then a morning priority tomorrow.</p>
        <div v-for="f in sites" :key="f.id" style="margin-bottom:10px">
          <div style="display:flex; justify-content:space-between; font-size:13px">
            <strong>{{ f.name }}</strong>
            <span class="muted">{{ f.walkInUsed }}/{{ f.walkInCap }} walk-in</span>
          </div>
          <div class="meter" :class="{ full: f.walkInUsed >= f.walkInCap, hot: f.walkInUsed / f.walkInCap >= 0.8 }">
            <span :style="{ width: Math.min(100, (f.walkInUsed / f.walkInCap) * 100) + '%' }" />
          </div>
        </div>
      </article>
    </section>

    <article class="card" v-else>
      <h2>Visit confirmed</h2>
      <p>
        <strong>{{ booked.time }}</strong> at {{ facById(booked.facilityId)?.name }}
        · {{ docById(booked.doctorId)?.name }}
      </p>
      <p class="lede">Arrive 5–10 minutes early. Bring this confirmation and a valid ID. SMS/PWA notice is queued to {{ form.contact }}.</p>
      <p v-if="booked.note" class="muted">Complaint on file: {{ booked.note }}</p>
      <div class="toolbar" style="margin-top:16px">
        <NuxtLink class="btn" to="/portal/visit">Manage this visit</NuxtLink>
        <NuxtLink class="btn secondary" to="/portal/rx">e-Rx QR later</NuxtLink>
      </div>
    </article>
  </div>
</template>
