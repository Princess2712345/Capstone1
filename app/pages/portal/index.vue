<script setup lang="ts">
definePageMeta({ layout: 'portal' })

import { homeStationOf } from '~/data/catchment'

const { identity } = usePatientPortal()
const { patients, appointments, prescriptions, facById, docById, drugById } = usePlatform()

const me = computed(() => patients.value.find(p => p.id === identity.value?.patientId) ?? null)
const home = computed(() => homeStationOf(me.value?.barangay || identity.value?.barangay || 'Poblacion'))
const upcoming = computed(() =>
  appointments.value
    .filter(a => a.patientId === identity.value?.patientId && !['cancelled', 'done', 'released'].includes(a.status))
    .sort((a, b) => a.time.localeCompare(b.time))
)
const next = computed(() => upcoming.value[0] || null)
const openRx = computed(() =>
  prescriptions.value.filter(r => r.patientId === identity.value?.patientId && r.status !== 'voided' && r.status !== 'dispensed')
)
const queueAhead = computed(() =>
  next.value
    ? appointments.value.filter(a => a.facilityId === next.value!.facilityId && a.time < next.value!.time && a.patientId && a.status !== 'cancelled').length
    : 0
)
</script>

<template>
  <div>
    <p v-if="me?.residentId" class="pt-kicker">{{ me.residentId }} · {{ me.barangay }} · {{ home.station }}</p>
    <article class="pt-banner" style="margin:12px 0 18px">Your lab result is ready to view. Open health records for the latest visit note.</article>

    <p class="pt-kicker">Your next step</p>
    <h2 style="margin:6px 0 14px">Keep your care moving</h2>

    <article v-if="next" class="pt-hero-apt">
      <div>
        <div class="day">{{ next.time.slice(0, 2) }}</div>
        <div class="muted" style="color:#c9d7e6">Today</div>
      </div>
      <div>
        <p class="pt-kicker" style="color:#9ec4ff">Upcoming appointment</p>
        <h3 style="margin:4px 0">{{ next.specialty }} consultation</h3>
        <p>{{ docById(next.doctorId)?.name }} · {{ facById(next.facilityId)?.name }}</p>
        <p>{{ next.time }} · In-person visit</p>
      </div>
      <div style="text-align:center">
        <div class="pt-qr" style="width:72px;height:72px;background:#0c1c30;color:#9ec4ff;display:grid;place-items:center;font-size:11px">QR</div>
        <p class="muted" style="color:#9ec4ff">Show QR at check-in</p>
      </div>
    </article>
    <article v-else class="pt-card" style="margin-bottom:16px">
      <p>No open hold. Book the next window that fits.</p>
      <NuxtLink class="btn" to="/portal/book" style="margin-top:12px">Book consultation</NuxtLink>
    </article>

    <article class="pt-card" style="margin:16px 0">
      <p class="pt-kicker">Live queue · {{ home.station }}</p>
      <h3 style="margin:6px 0 12px">{{ next ? 'You’re checked in' : 'Not in queue yet' }}</h3>
      <div class="pt-stats">
        <div><strong>{{ next ? 'A-014' : '—' }}</strong><span class="muted">Your queue number</span></div>
        <div><strong>{{ next ? queueAhead : 0 }}</strong><span class="muted">Patients ahead</span></div>
        <div><strong>~{{ Math.max(8, queueAhead * 6) }} min</strong><span class="muted">Estimated wait</span></div>
      </div>
      <div class="pt-progress"><span :style="{ width: Math.min(90, 20 + queueAhead * 12) + '%' }" /></div>
    </article>

    <p class="pt-kicker" style="margin-top:22px">Shortcuts</p>
    <h2 style="margin:6px 0 12px">What do you need today?</h2>
    <div class="pt-tiles">
      <NuxtLink class="pt-tile" to="/portal/book"><span class="pt-ico" style="background:#e8f0ff">📅</span><span><strong>Book consultation</strong><div class="muted">Find the right care</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/visit"><span class="pt-ico" style="background:#e7f8ef">🗓</span><span><strong>My appointments</strong><div class="muted">{{ upcoming.length }} upcoming</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/queue"><span class="pt-ico" style="background:#fff4e0">⏱</span><span><strong>My queue</strong><div class="muted">A-014 · {{ queueAhead }} ahead</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/records"><span class="pt-ico" style="background:#f3e8ff">♡</span><span><strong>Health records</strong><div class="muted">Recent visits</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/rx"><span class="pt-ico" style="background:#fff4e0">💊</span><span><strong>Prescriptions</strong><div class="muted">{{ openRx.length }} active</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/referrals"><span class="pt-ico" style="background:#e7f8ef">↗</span><span><strong>Referrals</strong><div class="muted">In progress</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/messages"><span class="pt-ico" style="background:#e8f0ff">💬</span><span><strong>Message care team</strong><div class="muted">Send SMS updates</div></span></NuxtLink>
      <NuxtLink class="pt-tile" to="/portal/emergency"><span class="pt-ico" style="background:#fde8e6">!</span><span><strong>Emergency help</strong><div class="muted">For urgent needs</div></span></NuxtLink>
    </div>

    <div class="vc-grid-2" style="margin-top:16px">
      <article class="pt-card">
        <p class="pt-kicker">Care team</p>
        <p v-if="next"><strong>{{ docById(next.doctorId)?.name }}</strong><br><span class="muted">{{ docById(next.doctorId)?.specialty }}</span></p>
        <p v-else class="muted">Assigned at booking.</p>
      </article>
      <article class="pt-card">
        <p class="pt-kicker">Recent prescription</p>
        <p v-if="openRx[0]"><strong>{{ drugById(openRx[0].items[0]?.drugId)?.generic }}</strong></p>
        <p v-else class="muted">No open e-Rx.</p>
      </article>
    </div>
  </div>
</template>
