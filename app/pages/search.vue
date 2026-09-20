<script setup lang="ts">
const route = useRoute()
const { searchAll, query } = usePlatform()
const q = ref(String(route.query.q || query.value || ''))

const results = computed(() => searchAll(q.value))

watch(() => route.query.q, (v) => {
  if (typeof v === 'string') q.value = v
})

async function go() {
  query.value = q.value
  await navigateTo({ path: '/search', query: q.value ? { q: q.value } : {} })
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker">Find anything</div>
        <h1>Municipal search</h1>
        <p class="lede">Patients, named slots, e-Rx QR codes, and clinicians in one pass.</p>
      </div>
    </header>
    <article class="card">
      <form class="toolbar" @submit.prevent="go">
        <label class="field" style="flex:1; min-width:220px">
          <span>Query</span>
          <input v-model="q" placeholder="Rosa, RX-VLC, Cardiology, 09:00">
        </label>
        <button class="btn" type="submit" style="align-self:flex-end">Search</button>
      </form>
    </article>
    <section class="grid-2" style="margin-top:16px">
      <article class="card">
        <h2>Patients</h2>
        <p v-if="!results.patients.length" class="empty">No patient matches.</p>
        <p v-for="p in results.patients" :key="p.id">
          <NuxtLink class="row-link" :to="`/patients/${p.id}`">{{ p.name }}</NuxtLink>
          <span class="muted"> · {{ p.barangay }} · {{ p.philhealth }}</span>
        </p>
      </article>
      <article class="card">
        <h2>Clinicians</h2>
        <p v-if="!results.doctors.length" class="empty">No clinician matches.</p>
        <p v-for="d in results.doctors" :key="d.id">
          <NuxtLink class="row-link" to="/clinicians">{{ d.name }}</NuxtLink>
          <span class="muted"> · {{ d.specialty }} · PRC {{ d.prc }}</span>
        </p>
      </article>
      <article class="card">
        <h2>Slots</h2>
        <p v-if="!results.appointments.length" class="empty">No slot matches.</p>
        <p v-for="a in results.appointments" :key="a.id">
          <NuxtLink class="row-link" :to="{ path: '/schedule', query: { site: a.facilityId } }">{{ a.time }} · {{ a.patientName || 'Open' }}</NuxtLink>
          <span class="muted"> · {{ a.status }} · {{ a.specialty }}</span>
        </p>
      </article>
      <article class="card">
        <h2>e-Prescriptions</h2>
        <p v-if="!results.prescriptions.length" class="empty">No QR matches.</p>
        <p v-for="r in results.prescriptions" :key="r.id">
          <NuxtLink class="row-link" to="/pharmacy">{{ r.qr }}</NuxtLink>
          <span class="muted"> · {{ r.status }}</span>
        </p>
      </article>
    </section>
  </div>
</template>
