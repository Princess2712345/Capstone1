<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { appointments, patients, facById, docById, cancelAppointment } = usePlatform()
const { identity } = usePatientPortal()

const patient = computed(() => {
  const id = identity.value?.patientId
  if (!id) return null
  return patients.value.find(p => p.id === id) ?? null
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

function cancel(id: string) {
  cancelAppointment(id)
}
</script>

<template>
  <div class="desk">
    <header class="desk-head">
      <p class="lp-eyebrow">My visit</p>
      <h1>Your held 15-minute windows.</h1>
      <p class="lp-lede">Cancel if you cannot come — that slot returns to walk-ins.</p>
    </header>

    <p class="muted" style="margin:0 0 16px">{{ patient?.residentId }} · {{ patient?.name }} · {{ patient?.barangay }} · {{ patient?.contact || identity?.contact }}</p>
    <section class="desk-hero">
      <article class="desk-panel">
        <h2>Upcoming holds</h2>
        <p v-if="!upcoming.length" class="empty">No open online hold. <NuxtLink class="row-link" to="/portal/book">Book appointment</NuxtLink></p>
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
</template>
