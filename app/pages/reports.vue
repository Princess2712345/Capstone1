<script setup lang="ts">
const {
  appointments,
  patients,
  prescriptions,
  criticalBatches,
  inQueue,
  rhu1Load,
  audits,
  facilities,
  doctors,
  batches,
  facById,
  drugById,
  tier,
  stockOnHand
} = usePlatform()

const done = computed(() => appointments.value.filter(a => a.status === 'done').length)
const er = computed(() => appointments.value.filter(a => a.channel === 'emergency' && a.patientName).length)
const openRx = computed(() => prescriptions.value.filter(p => p.status !== 'dispensed' && p.status !== 'voided').length)

function printReport() {
  window.print()
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">CHO analytics</div>
        <h1>Operations reports</h1>
        <p class="lede">Throughput, acuity mix, stock risk, and an audit trail of every desk action on this municipal file.</p>
      </div>
      <div class="toolbar">
        <NuxtLink class="btn" to="/schedule">Open queue</NuxtLink>
        <NuxtLink class="btn secondary" to="/pharmacy">e-Rx desk</NuxtLink>
        <NuxtLink class="btn secondary" to="/supply">Supply</NuxtLink>
        <button class="btn secondary" type="button" @click="printReport">Print</button>
      </div>
    </header>

    <section class="grid-4" style="margin-bottom:16px">
      <article class="card"><div class="stat-value">{{ inQueue }}</div><div class="stat-label">Active named slots</div></article>
      <article class="card"><div class="stat-value">{{ done }}</div><div class="stat-label">Completed consults</div></article>
      <article class="card"><div class="stat-value">{{ openRx }}</div><div class="stat-label">Open e-Rx</div></article>
      <article class="card"><div class="stat-value">{{ criticalBatches.length }}</div><div class="stat-label">At-risk lots</div></article>
    </section>

    <section class="split">
      <article class="card">
        <h2>Facility throughput</h2>
        <table>
          <thead><tr><th>Site</th><th>Walk-in</th><th>Named slots</th><th>RHU 1 load</th></tr></thead>
          <tbody>
            <tr v-for="f in facilities.filter(x => x.type !== 'CHO')" :key="f.id">
              <td>{{ f.name }}</td>
              <td>{{ f.walkInUsed }}/{{ f.walkInCap || '—' }}</td>
              <td>{{ appointments.filter(a => a.facilityId === f.id && a.patientName).length }}</td>
              <td>{{ f.id === 'rhu1' ? rhu1Load + '%' : '—' }}</td>
            </tr>
          </tbody>
        </table>
        <p class="muted">{{ patients.length }} patients · {{ doctors.length }} clinicians · {{ er }} emergency inserts</p>
      </article>
      <article class="card">
        <h2>Formulary position</h2>
        <table>
          <thead><tr><th>Item</th><th>On-hand</th><th>Tier</th></tr></thead>
          <tbody>
            <tr v-for="b in [...new Set(batches.map(x => x.drugId))]" :key="b">
              <td>{{ drugById(b)?.generic }}</td>
              <td>{{ stockOnHand(b) }}</td>
              <td :class="'stock-' + tier(stockOnHand(b)).toLowerCase()">{{ tier(stockOnHand(b)) }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <article class="card" style="margin-top:16px">
      <h2>Audit trail</h2>
      <p v-if="!audits.length" class="empty">Desk actions will list here after triage, booking, dispensing, and stock moves.</p>
      <div class="table-wrap">
        <table v-if="audits.length">
          <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Detail</th></tr></thead>
          <tbody>
            <tr v-for="a in audits" :key="a.id">
              <td>{{ a.at }}</td>
              <td>{{ a.actor }}</td>
              <td>{{ a.action }}</td>
              <td>{{ a.detail }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
