<script setup lang="ts">
definePageMeta({ layout: 'public' })
</script>

<template>
  <div>
    <section class="hero">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">City Health Office · Bukidnon</div>
        <h1>Municipal health operations for Valencia City</h1>
        <p class="lede">
          One desk for AI-assisted specialty routing, hybrid online and walk-in queues,
          and FEFO prescription tracking across RHUs and Barangay Health Stations.
        </p>
        <div style="display:flex; gap:10px; margin-top:22px; flex-wrap:wrap">
          <NuxtLink class="btn" to="/signup">Create staff account</NuxtLink>
          <NuxtLink class="btn secondary" to="/login">Log in to the command floor</NuxtLink>
        </div>
      </div>
      <aside class="hero-panel">
        <div class="brand-kicker" style="color:#bfdbfe">Today’s municipal picture</div>
        <h2>RHU 1 walk-in buffer at 90%</h2>
        <p>Low-acuity overflow routes to RHU 2 Bagontaas and BHS Mailag. ESI 1–2 never wait in OPD.</p>
        <ul>
          <li>15-minute slots with no-show release</li>
          <li>Cebuano and English symptom mapping</li>
          <li>Konsulta e-Rx with single-use QR</li>
        </ul>
      </aside>
    </section>

    <section id="modules" class="band">
      <h2>Three operational domains</h2>
      <div class="grid-3" style="margin-top:16px">
        <article class="card">
          <div class="stat-label">Module 1</div>
          <h3>Specialty routing</h3>
          <p class="muted">Unstructured complaints map to ICD-10, ESI 1–5, and a named consultant. Saturated specialists overflow to a GP with prerequisite labs queued.</p>
        </article>
        <article class="card">
          <div class="stat-label">Module 2</div>
          <h3>Hybrid scheduling</h3>
          <p class="muted">Online holds, BHW walk-in buffers, satellite reroute at cap, and emergency override that rolls non-urgent windows by 15 minutes.</p>
        </article>
        <article class="card">
          <div class="stat-label">Module 3</div>
          <h3>e-Rx and supply</h3>
          <p class="muted">PhilHealth Konsulta generics, allergy checks, FEFO lots, inter-BHS vouchers, and CHO purchase requisitions from seasonal demand.</p>
        </article>
      </div>
    </section>

    <section id="facilities" class="band">
      <h2>Covered sites</h2>
      <p class="lede" style="margin:8px 0 16px">Central hubs and satellite stations in the Valencia catchment.</p>
      <div class="grid-3">
        <article class="card"><strong>Valencia RHU 1</strong><p class="muted">Poblacion · primary walk-in hub</p></article>
        <article class="card"><strong>Valencia RHU 2</strong><p class="muted">Bagontaas · overflow and tele-endo</p></article>
        <article class="card"><strong>City Infirmary ER</strong><p class="muted">ESI 1–2 bypass and transport</p></article>
        <article class="card"><strong>BHS Mailag</strong><p class="muted">Barangay intake and ORS stock</p></article>
        <article class="card"><strong>BHS Lumbayao</strong><p class="muted">Peripheral buffer and transfers</p></article>
        <article class="card"><strong>BHS San Carlos</strong><p class="muted">Pediatric and school-season load</p></article>
      </div>
    </section>
  </div>
</template>
