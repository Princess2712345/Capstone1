<script setup lang="ts">
definePageMeta({ layout: 'portal' })
const { identity } = usePatientPortal()
const { appointments, encounters, facById, docById } = usePlatform()
const visits = computed(() =>
  appointments.value.filter(a => a.patientId === identity.value?.patientId && a.status === 'done')
)
const notes = computed(() =>
  encounters.value.filter(e => e.patientId === identity.value?.patientId)
)
</script>
<template>
  <div>
    <h2>Health records</h2>
    <p class="vc-lede">Authorized care teams see the same visit notes. This is not a full EMR export.</p>
    <article v-if="!visits.length && !notes.length" class="pt-card" style="margin-top:16px">
      <p>No completed visits on this file yet. After consult, notes appear here.</p>
    </article>
    <article v-for="a in visits" :key="a.id" class="pt-card" style="margin-top:12px">
      <p class="pt-kicker">{{ a.time }}</p>
      <h3>{{ a.specialty }}</h3>
      <p class="muted">{{ facById(a.facilityId)?.name }} · {{ docById(a.doctorId)?.name }}</p>
    </article>
    <article v-for="e in notes" :key="e.id" class="pt-card" style="margin-top:12px">
      <p class="pt-kicker">{{ e.createdAt }}</p>
      <h3>{{ e.complaint }}</h3>
      <p class="muted">{{ e.note || e.specialty }}</p>
    </article>
  </div>
</template>
