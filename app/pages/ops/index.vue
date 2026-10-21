<script setup lang="ts">
import { matchesLoad, sortByLoad, type LoadFilter } from '~/utils/load'

const {
  facilities,
  doctors,
  appointments,
  prescriptions,
  criticalBatches,
  rhu1Load,
  inQueue,
  facById,
  drugById
} = usePlatform()

const loadFilter = ref<LoadFilter>('all')
const siteFilter = ref('all')

const loadSites = computed(() => {
  const ids = [...new Set(doctors.value.map(d => d.facilityId))]
  return ids
    .map(id => facById(id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
})

const rankedDoctors = computed(() => {
  return sortByLoad(doctors.value).filter(d => {
    if (!matchesLoad(d, loadFilter.value)) return false
    if (siteFilter.value !== 'all' && d.facilityId !== siteFilter.value) return false
    return true
  })
})

const esiMix = computed(() => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const a of appointments.value) {
    if (a.esi) counts[a.esi]++
  }
  return counts
})

const rxOpen = computed(() => prescriptions.value.filter(p => p.status !== 'dispensed' && p.status !== 'voided').length)
const tele = computed(() => doctors.value.filter(d => d.role === 'telehealth' || d.role === 'visiting').length)
const liveQueue = computed(() =>
  appointments.value
    .filter(a => a.patientId && a.status !== 'cancelled' && a.status !== 'open')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 6)
)
const doneToday = computed(() => appointments.value.filter(a => a.status === 'done').length)
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Staff workspace · Valencia RHU 1</div>
        <h1>Today’s patient flow</h1>
        <p class="lede">
          Live queues, walk-in capacity, and physician load across the municipal network.
        </p>
      </div>
      <div class="toolbar">
        <NuxtLink class="btn" to="/triage">Route a complaint</NuxtLink>
        <NuxtLink class="btn secondary" to="/schedule">Open queue</NuxtLink>
        <NuxtLink class="btn secondary" to="/pharmacy">e-Rx desk</NuxtLink>
        <NuxtLink class="btn secondary" to="/reports">Reports</NuxtLink>
      </div>
    </header>

    <article class="card" style="margin-bottom:16px; display:flex; justify-content:space-between; gap:16px; align-items:center; flex-wrap:wrap; border-color:#f3c7c2; background:#fff6f5">
      <div>
        <div class="brand-kicker" style="color:var(--danger)">Needs attention</div>
        <strong>High-urgency cases wait on the live board.</strong>
        <p class="muted" style="margin:4px 0 0">Triage notes and ESI 1–2 never sit in OPD.</p>
      </div>
      <NuxtLink class="btn" to="/schedule" style="background:#c2413b">Review queue →</NuxtLink>
    </article>

    <section class="grid-4" style="margin-bottom: 16px">
      <NuxtLink class="card" to="/schedule">
        <div class="stat-label">Today’s appointments</div>
        <div class="stat-value">{{ inQueue }}</div>
        <p class="stat-note">Named slots in play</p>
      </NuxtLink>
      <NuxtLink class="card" to="/schedule">
        <div class="stat-label">Waiting patients</div>
        <div class="stat-value">{{ liveQueue.length }}</div>
        <p class="stat-note">Across live queues</p>
      </NuxtLink>
      <NuxtLink class="card" to="/facilities">
        <div class="stat-label">Walk-in capacity</div>
        <div class="stat-value">{{ rhu1Load }}%</div>
        <p class="stat-note">Valencia RHU 1</p>
      </NuxtLink>
      <NuxtLink class="card" to="/reports">
        <div class="stat-label">Completed today</div>
        <div class="stat-value">{{ doneToday }}</div>
        <p class="stat-note">{{ rxOpen }} open e-Rx · {{ tele }} visiting seats</p>
      </NuxtLink>
    </section>

    <article class="card" style="margin-bottom:16px">
      <div class="load-head">
        <div>
          <p class="pt-kicker">Live queue · Valencia RHU 1</p>
          <h2>Today’s patient flow</h2>
        </div>
        <NuxtLink class="btn secondary" to="/patients">+ Register patient</NuxtLink>
      </div>
      <table>
        <thead><tr><th>Time</th><th>Patient</th><th>Type</th><th>Doctor</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="a in liveQueue" :key="a.id">
            <td>{{ a.time }}</td>
            <td>
              <NuxtLink v-if="a.patientId" class="row-link" :to="`/patients/${a.patientId}`">{{ a.patientName }}</NuxtLink>
              <span v-else>{{ a.patientName }}</span>
            </td>
            <td>{{ a.channel }}</td>
            <td>{{ a.specialty }}</td>
            <td>{{ a.status }}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top:10px"><NuxtLink class="vc-link" to="/schedule">Open full queue →</NuxtLink></p>
    </article>

    <section class="split">
      <article class="card">
        <h2>Facility buffer matrix</h2>
        <div v-for="f in facilities.filter(x => x.walkInCap > 0)" :key="f.id" style="margin-bottom: 12px">
          <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px">
            <NuxtLink class="row-link" :to="{ path: '/schedule', query: { site: f.id } }">{{ f.name }}</NuxtLink>
            <span class="muted">{{ f.type }} · {{ f.barangay }} · {{ f.walkInUsed }}/{{ f.walkInCap }}</span>
          </div>
          <div class="meter" :class="{ full: f.walkInUsed / f.walkInCap >= 1, hot: f.walkInUsed / f.walkInCap >= 0.8 }">
            <span :style="{ width: Math.min(100, (f.walkInUsed / f.walkInCap) * 100) + '%' }" />
          </div>
        </div>
      </article>
      <article class="card">
        <h2>ESI mix on the board</h2>
        <p class="muted">Levels 1–2 never sit in outpatient queues. Levels 3–5 occupy specialist or GP clinics.</p>
        <table>
          <thead>
            <tr><th>Level</th><th>Meaning</th><th>Today</th></tr>
          </thead>
          <tbody>
            <tr><td><span class="badge esi-1">ESI 1</span></td><td>Resuscitation / ER + transport</td><td>{{ esiMix[1] }}</td></tr>
            <tr><td><span class="badge esi-2">ESI 2</span></td><td>Emergency bypass</td><td>{{ esiMix[2] }}</td></tr>
            <tr><td><span class="badge esi-3">ESI 3</span></td><td>Urgent clinic</td><td>{{ esiMix[3] }}</td></tr>
            <tr><td><span class="badge esi-4">ESI 4</span></td><td>Less urgent</td><td>{{ esiMix[4] }}</td></tr>
            <tr><td><span class="badge esi-5">ESI 5</span></td><td>Non-urgent / Konsulta</td><td>{{ esiMix[5] }}</td></tr>
          </tbody>
        </table>
        <p class="stat-note">{{ tele }} visiting or telehealth consultants are in the city-wide matrix today.</p>
      </article>
    </section>

    <section class="grid-2" style="margin-top: 16px">
      <article class="card">
        <div class="load-head">
          <h2>Physician load vs daily cap</h2>
          <PhysicianLoadFilter v-model:load="loadFilter" v-model:site="siteFilter" :sites="loadSites" />
        </div>
        <p class="muted" style="margin:0 0 10px">{{ rankedDoctors.length }} {{ rankedDoctors.length === 1 ? 'clinician' : 'clinicians' }} · heaviest load first</p>
        <p v-if="!rankedDoctors.length" class="empty">No physicians in this slice. Clear a filter to see the full matrix.</p>
        <table v-else>
          <thead>
            <tr><th>Clinician</th><th>Role</th><th>Site</th><th>Load</th></tr>
          </thead>
          <tbody>
            <tr v-for="d in rankedDoctors" :key="d.id">
              <td>
                <NuxtLink class="row-link" to="/clinicians">{{ d.name }}</NuxtLink>
                <div class="muted">{{ d.specialty }}</div>
              </td>
              <td>{{ d.role }}</td>
              <td>{{ facById(d.facilityId)?.name }}</td>
              <td>
                {{ d.todayLoad }}/{{ d.dailyCap }}
                <div class="meter" :class="{ hot: d.todayLoad / d.dailyCap >= 0.85, full: d.todayLoad >= d.dailyCap }" style="margin-top:6px; width:88px">
                  <span :style="{ width: Math.min(100, (d.todayLoad / d.dailyCap) * 100) + '%' }" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
      <article class="card">
        <h2>Medicine exceptions</h2>
        <table>
          <thead>
            <tr><th>Lot</th><th>Item</th><th>Site</th><th>Qty</th><th>Expiry</th></tr>
          </thead>
          <tbody>
            <tr v-for="b in criticalBatches" :key="b.id">
              <td><NuxtLink class="row-link" to="/supply">{{ b.lot }}</NuxtLink></td>
              <td>{{ drugById(b.drugId)?.generic }}</td>
              <td>{{ facById(b.facilityId)?.name }}</td>
              <td :class="b.qty <= 20 ? 'stock-critical' : 'stock-moderate'">{{ b.qty }}</td>
              <td>{{ b.expiry }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </div>
</template>
