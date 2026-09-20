<script setup lang="ts">
definePageMeta({ layout: 'public' })

const services = [
  {
    num: '01',
    title: 'Specialty routing',
    body: 'Unstructured complaints are mapped to ICD-10 categories, ESI 1–5 urgency, and the next available consultant.'
  },
  {
    num: '02',
    title: 'Unified scheduling',
    body: 'Online holds and walk-in buffers share 15-minute windows, with no-show release and emergency override.'
  },
  {
    num: '03',
    title: 'e-Prescription & supply',
    body: 'Konsulta generics, single-use QR, partial-fill vouchers, and FEFO lots across RHUs and barangay stations.'
  }
]

const sites = [
  { name: 'City Health Office', place: 'Poblacion', role: 'Command & procurement' },
  { name: 'Valencia RHU 1', place: 'Poblacion', role: 'Primary walk-in hub' },
  { name: 'Valencia RHU 2', place: 'Bagontaas', role: 'Overflow & telehealth' },
  { name: 'City Infirmary ER', place: 'Poblacion', role: 'ESI 1–2 bypass' },
  { name: 'BHS Mailag', place: 'Mailag', role: 'Barangay intake' },
  { name: 'BHS Lumbayao', place: 'Lumbayao', role: 'Satellite buffer' },
  { name: 'BHS San Carlos', place: 'San Carlos', role: 'Pediatric load' }
]
</script>

<template>
  <div class="lp">
    <section class="lp-hero">
      <div class="lp-wrap lp-hero-grid">
        <div>
          <p class="lp-eyebrow">Integrated Health Platform</p>
          <h1>Public care for Valencia City, in one municipal file.</h1>
          <p class="lp-lede">
            The City Health Office coordinates rural health units and barangay stations for triage, appointments, and medicine.
          </p>
          <div class="lp-actions">
            <NuxtLink class="btn" to="/portal">Patient portal</NuxtLink>
            <NuxtLink class="btn secondary" to="/login">Staff access</NuxtLink>
          </div>
        </div>

        <aside class="lp-plaque" aria-label="Official identity">
          <CitySeal size="lg" />
          <p class="lp-plaque-city">City of Valencia</p>
          <p class="lp-plaque-prov">Province of Bukidnon</p>
          <dl class="lp-plaque-stats">
            <div>
              <dt>Sites</dt>
              <dd>7</dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>15 min</dd>
            </div>
            <div>
              <dt>Triage</dt>
              <dd>ESI 1–5</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>

    <section class="lp-strip">
      <div class="lp-wrap lp-strip-grid">
        <p><span>Routing</span> NLP to specialty and ESI</p>
        <p><span>Queue</span> Hybrid online and walk-in</p>
        <p><span>e-Rx</span> QR, voucher, FEFO</p>
        <p><span>Supply</span> CHO purchase drafts</p>
      </div>
    </section>

    <section id="services" class="lp-section">
      <div class="lp-wrap">
        <header class="lp-section-head">
          <p class="lp-eyebrow">Services</p>
          <h2>Three desks, one catchment</h2>
        </header>
        <div class="lp-service-grid">
          <article v-for="item in services" :key="item.num" class="lp-service">
            <span class="lp-num">{{ item.num }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="network" class="lp-section lp-section-alt">
      <div class="lp-wrap">
        <header class="lp-section-head">
          <p class="lp-eyebrow">Network</p>
          <h2>Service delivery sites</h2>
        </header>
        <div class="lp-table" role="table">
          <div class="lp-tr lp-th" role="row">
            <span>Facility</span>
            <span>Barangay</span>
            <span>Function</span>
          </div>
          <div v-for="site in sites" :key="site.name" class="lp-tr" role="row">
            <strong>{{ site.name }}</strong>
            <span>{{ site.place }}</span>
            <span>{{ site.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="lp-foot">
      <div class="lp-wrap lp-foot-inner">
        <CitySeal size="sm" />
        <div>
          <p>City Health Office · LGU Valencia City · Northern Mindanao</p>
          <p class="muted">Operational system for municipal desks. Not a diagnostic device.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
