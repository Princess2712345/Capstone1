<script setup lang="ts">
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

const esiMix = computed(() => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const a of appointments.value) {
    if (a.esi) counts[a.esi]++
  }
  return counts
})

const rxOpen = computed(() => prescriptions.value.filter(p => p.status !== 'dispensed' && p.status !== 'voided').length)
const tele = computed(() => doctors.value.filter(d => d.role === 'telehealth' || d.role === 'visiting').length)
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">City Health Office · 18 September 2026</div>
        <h1>Valencia municipal command floor</h1>
        <p class="lede">
          Live picture of RHU 1, RHU 2, satellite BHS, and Infirmary ER — specialty routing, 15-minute hybrid slots, charts, e-Rx, and FEFO risk on one desk.
        </p>
      </div>
      <div class="toolbar">
        <NuxtLink class="btn" to="/triage">Route a complaint</NuxtLink>
        <NuxtLink class="btn secondary" to="/schedule">Open queue</NuxtLink>
      </div>
    </header>

    <section class="grid-4" style="margin-bottom: 16px">
      <article class="card">
        <div class="stat-value">{{ rhu1Load }}%</div>
        <div class="stat-label">RHU 1 walk-in buffer</div>
        <p class="stat-note">Hard cap nearly reached. Low-acuity overflow should pivot to Mailag or RHU 2.</p>
      </article>
      <article class="card">
        <div class="stat-value">{{ inQueue }}</div>
        <div class="stat-label">Named slots in play</div>
        <p class="stat-note">Check in, start consult, complete, or release no-shows from the hybrid queue.</p>
      </article>
      <article class="card">
        <div class="stat-value">{{ rxOpen }}</div>
        <div class="stat-label">Open e-prescriptions</div>
        <p class="stat-note">Single-use QR. Partial fills mint transfer vouchers between facilities.</p>
      </article>
      <article class="card">
        <div class="stat-value">{{ criticalBatches.length }}</div>
        <div class="stat-label">Critical / near-expiry lots</div>
        <p class="stat-note">FEFO queue prefers earliest expiry before any peer transfer.</p>
      </article>
    </section>

    <section class="split">
      <article class="card">
        <h2>Facility buffer matrix</h2>
        <div v-for="f in facilities.filter(x => x.walkInCap > 0)" :key="f.id" style="margin-bottom: 12px">
          <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px">
            <NuxtLink class="row-link" to="/facilities">{{ f.name }}</NuxtLink>
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
        <h2>Physician load vs daily cap</h2>
        <table>
          <thead>
            <tr><th>Clinician</th><th>Role</th><th>Site</th><th>Load</th></tr>
          </thead>
          <tbody>
            <tr v-for="d in doctors" :key="d.id">
              <td>{{ d.name }}<div class="muted">{{ d.specialty }}</div></td>
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
              <td>{{ b.lot }}</td>
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
