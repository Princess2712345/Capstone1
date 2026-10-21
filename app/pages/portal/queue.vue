<script setup lang="ts">
definePageMeta({ layout: 'portal' })
const { identity } = usePatientPortal()
const { appointments, facById } = usePlatform()
const next = computed(() =>
  appointments.value.find(a => a.patientId === identity.value?.patientId && !['cancelled', 'done', 'released'].includes(a.status))
)
const ahead = computed(() =>
  next.value
    ? appointments.value.filter(a => a.facilityId === next.value!.facilityId && a.time < next.value!.time && a.patientId).length
    : 0
)
</script>
<template>
  <div>
    <article class="pt-card">
      <p class="pt-kicker">Live queue · {{ facById(next?.facilityId || 'rhu1')?.name }}</p>
      <h2>{{ next ? 'You’re checked in' : 'Not in a live queue' }}</h2>
      <div class="pt-stats" style="margin-top:16px">
        <div><strong>{{ next ? 'A-014' : '—' }}</strong><span class="muted">Your number</span></div>
        <div><strong>{{ ahead }}</strong><span class="muted">Ahead</span></div>
        <div><strong>~{{ Math.max(8, ahead * 6) }} min</strong><span class="muted">Wait</span></div>
      </div>
      <div class="pt-progress"><span :style="{ width: Math.min(90, 20 + ahead * 12) + '%' }" /></div>
      <p class="muted" style="margin-top:12px">Front-desk teams see the same number when they scan your appointment QR.</p>
    </article>
  </div>
</template>
