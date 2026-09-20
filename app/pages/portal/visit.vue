<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { appointments, patients, facById, docById, cancelAppointment, findPatientForPortal } = usePlatform()
const { identity, remember } = usePatientPortal()

const lookup = reactive({ contact: '', philhealth: '', name: '' })
const notice = ref('')

watch(identity, (id) => {
  if (id?.contact && !lookup.contact) lookup.contact = id.contact
}, { immediate: true })

const patient = computed(() => {
  const id = identity.value
  if (!id) return null
  return patients.value.find(p => p.id === id.patientId)
    || findPatientForPortal(id.contact, '', id.name)
    || null
})

const visits = computed(() => {
  const id = patient.value?.id
  if (!id) return []
  return appointments.value
    .filter(a => a.patientId === id && a.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time))
})

const upcoming = computed(() => visits.value.filter(a => a.status !== 'done' && a.status !== 'released'))
const done = computed(() => visits.value.filter(a => a.status === 'done'))

function findRecord() {
  notice.value = ''
  const found = findPatientForPortal(lookup.contact, lookup.philhealth, lookup.name)
  if (!found) {
    notice.value = 'No patient file matches that mobile or PhilHealth number.'
    return
  }
  remember(found.id, found.name, found.contact)
}

function cancel(id: string) {
  cancelAppointment(id)
}
</script>

<template>
  <div class="desk">
    <header class="desk-head">
      <p class="lp-eyebrow">My visit</p>
      <h1>Look up the window you already hold.</h1>
      <p class="lp-lede">Use the mobile number from booking. Cancel if you cannot come — that slot returns to walk-ins.</p>
    </header>

    <article v-if="!patient" class="desk-panel">
      <h2>Find my record</h2>
      <div class="form-grid form-grid-2">
        <label class="field"><span>Mobile</span><input v-model="lookup.contact"></label>
        <label class="field"><span>PhilHealth</span><input v-model="lookup.philhealth"></label>
      </div>
      <p v-if="notice" class="field-error">{{ notice }}</p>
      <button class="btn" type="button" style="margin-top:16px" @click="findRecord">Open my visits</button>
    </article>

    <div v-else>
      <p class="muted" style="margin:0 0 16px">{{ patient.name }} · {{ patient.contact || 'no mobile' }}</p>
      <section class="desk-hero">
        <article class="desk-panel">
          <h2>Upcoming holds</h2>
          <p v-if="!upcoming.length" class="empty">No open online hold. <NuxtLink class="row-link" to="/portal/book">Book a visit</NuxtLink></p>
          <div v-for="a in upcoming" :key="a.id" class="slot">
            <strong>{{ a.time }}</strong>
            <div>
              {{ facById(a.facilityId)?.name }}
              <div class="muted">{{ a.status }} · {{ a.specialty }} · {{ docById(a.doctorId)?.name }}</div>
            </div>
            <button class="btn secondary" type="button" @click="cancel(a.id)">Cancel</button>
          </div>
        </article>
        <article class="desk-panel">
          <h2>Earlier today</h2>
          <p v-if="!done.length" class="empty">No completed consults on this file today.</p>
          <p v-for="a in done" :key="a.id" class="muted">{{ a.time }} · {{ facById(a.facilityId)?.name }} · done</p>
        </article>
      </section>
    </div>
  </div>
</template>
