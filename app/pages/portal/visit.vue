<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { appointments, patients, facById, docById, cancelAppointment } = usePlatform()
const { identity } = usePatientPortal()

const patient = computed(() => patients.value.find(p => p.id === identity.value?.patientId) ?? null)
const upcoming = computed(() =>
  appointments.value
    .filter(a => a.patientId === patient.value?.id && !['cancelled', 'done', 'released'].includes(a.status))
    .sort((a, b) => a.time.localeCompare(b.time))
)
</script>

<template>
  <div>
    <p class="muted">{{ patient?.residentId }} · {{ patient?.name }}</p>
    <h2 style="margin:8px 0 14px">Upcoming appointments</h2>
    <article v-if="!upcoming.length" class="pt-card">
      No open hold. <NuxtLink class="vc-link" to="/portal/book">Book consultation</NuxtLink>
    </article>
    <article v-for="a in upcoming" :key="a.id" class="pt-slot" style="margin-bottom:10px">
      <span>
        <strong>{{ a.specialty }}</strong>
        <div class="muted">{{ facById(a.facilityId)?.name }} · {{ docById(a.doctorId)?.name }} · {{ a.status }}</div>
      </span>
      <span style="text-align:right">
        <strong>{{ a.time }}</strong>
        <div>
          <button class="btn secondary" type="button" style="margin-top:8px" @click="cancelAppointment(a.id)">Cancel</button>
        </div>
      </span>
    </article>
  </div>
</template>
