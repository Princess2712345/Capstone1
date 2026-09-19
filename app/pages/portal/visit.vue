<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { appointments, patients, facById, docById, cancelAppointment, findPatientForPortal } = usePlatform()
const { identity, remember } = usePatientPortal()

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
  <div class="band" style="padding-top:32px">
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Your window</div>
        <h1>My visit</h1>
        <p class="lede">Look up a hold with the mobile number used at booking. Cancel if you cannot come — that window returns to walk-ins.</p>
      </div>
    </header>

    <article class="card" v-if="!patient">
      <h2>Find my record</h2>
      <div class="grid-2">
        <label class="field"><span>Mobile</span><input v-model="lookup.contact"></label>
        <label class="field"><span>PhilHealth</span><input v-model="lookup.philhealth"></label>
      </div>
      <p v-if="notice" class="field-error">{{ notice }}</p>
      <button class="btn" type="button" style="margin-top:12px" @click="findRecord">Open my visits</button>
    </article>

    <div v-else>
      <p class="muted" style="margin-bottom:12px">Signed in as {{ patient.name }} · {{ patient.contact || 'no mobile' }}</p>
      <article class="card">
        <h2>Upcoming holds</h2>
        <p v-if="!upcoming.length" class="empty">No open online hold. <NuxtLink class="row-link" to="/portal/book">Book a visit</NuxtLink></p>
        <div v-for="a in upcoming" :key="a.id" class="slot">
          <strong>{{ a.time }}</strong>
          <div>
            {{ facById(a.facilityId)?.name }}
            <div class="muted">{{ a.status }} · {{ a.specialty }} · {{ docById(a.doctorId)?.name }}</div>
            <div v-if="a.note" class="muted">{{ a.note }}</div>
            <p class="muted">Arrive 5–10 minutes early.</p>
          </div>
          <button class="btn secondary" type="button" @click="cancel(a.id)">Cancel visit</button>
        </div>
      </article>
      <article class="card" style="margin-top:16px">
        <h2>Earlier visits today</h2>
        <p v-if="visits.filter(v => v.status === 'done').length === 0" class="empty">No completed consults on this file today.</p>
        <p v-for="a in visits.filter(v => v.status === 'done')" :key="a.id" class="muted">
          {{ a.time }} · {{ facById(a.facilityId)?.name }} · done
        </p>
      </article>
    </div>
  </div>
</template>
