<script setup lang="ts">
definePageMeta({ layout: 'portal' })

import { homeStationOf } from '~/data/catchment'

const { identity } = usePatientPortal()
const {
  patients,
  appointments,
  prescriptions,
  facById,
  docById,
  drugById
} = usePlatform()

const me = computed(() => {
  const id = identity.value?.patientId
  if (!id) return null
  return patients.value.find(p => p.id === id) ?? null
})

const home = computed(() => homeStationOf(me.value?.barangay || identity.value?.barangay || 'Poblacion'))

const upcoming = computed(() => {
  const id = identity.value?.patientId
  if (!id) return []
  return appointments.value
    .filter(a => a.patientId === id && a.status !== 'cancelled' && a.status !== 'done' && a.status !== 'released')
    .sort((a, b) => a.time.localeCompare(b.time))
})

const openRx = computed(() => {
  const id = identity.value?.patientId
  if (!id) return []
  return prescriptions.value.filter(r => r.patientId === id && r.status !== 'voided' && r.status !== 'dispensed')
})
</script>

<template>
  <div class="desk">
    <header class="desk-head">
      <p class="lp-eyebrow">Dashboard</p>
      <h1>Hello, {{ identity?.name.split(' ')[0] }}.</h1>
      <p class="lp-lede">
        You are on file as a {{ home.name }} resident. Home station: {{ home.station }}.
      </p>
      <div class="lp-actions">
        <NuxtLink class="btn" to="/portal/book">Book appointment</NuxtLink>
        <NuxtLink class="btn secondary" to="/portal/visit">My visit</NuxtLink>
        <NuxtLink class="btn secondary" to="/portal/rx">e-Rx QR</NuxtLink>
      </div>
    </header>

    <dl class="id-strip">
      <div>
        <dt>Resident ID</dt>
        <dd class="resident-id">{{ me?.residentId || identity?.residentId || '—' }}</dd>
      </div>
      <div>
        <dt>Barangay</dt>
        <dd>{{ me?.barangay || identity?.barangay || '—' }}</dd>
      </div>
      <div>
        <dt>Home BHU</dt>
        <dd>{{ home.station }}</dd>
      </div>
      <div>
        <dt>PhilHealth</dt>
        <dd>{{ me?.philhealth || '—' }}</dd>
      </div>
    </dl>

    <section class="desk-hero">
      <article class="desk-panel">
        <h2>Upcoming visits</h2>
        <p v-if="!upcoming.length" class="empty">No open hold. <NuxtLink class="row-link" to="/portal/book">Book appointment</NuxtLink></p>
        <table v-else>
          <thead><tr><th>Time</th><th>Site</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="a in upcoming" :key="a.id">
              <td>{{ a.time }}</td>
              <td>{{ facById(a.facilityId)?.name }}<div class="muted">{{ docById(a.doctorId)?.name }}</div></td>
              <td>{{ a.status }}</td>
            </tr>
          </tbody>
        </table>
      </article>
      <article class="desk-panel">
        <h2>e-Prescriptions</h2>
        <p v-if="!openRx.length" class="empty">No open scripts. <NuxtLink class="row-link" to="/portal/rx">Open QR desk</NuxtLink></p>
        <table v-else>
          <thead><tr><th>QR</th><th>Items</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="r in openRx" :key="r.id">
              <td><NuxtLink class="row-link" to="/portal/rx">{{ r.qr }}</NuxtLink></td>
              <td class="muted">{{ r.items.map(i => drugById(i.drugId)?.generic).join(', ') }}</td>
              <td>{{ r.status }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </div>
</template>
