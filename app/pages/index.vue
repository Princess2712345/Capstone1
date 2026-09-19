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
          Staff desks for specialty routing, hybrid queues, patient charts, e-prescription, FEFO inventory,
          facilities, reports, and directory access — one file for RHUs and Barangay Health Stations.
        </p>
        <div style="display:flex; gap:10px; margin-top:22px; flex-wrap:wrap">
          <NuxtLink class="btn" to="/portal">Patient desk</NuxtLink>
          <NuxtLink class="btn secondary" to="/login">Staff command floor</NuxtLink>
        </div>
      </div>
      <aside class="hero-panel">
        <div class="brand-kicker" style="color:#bfdbfe">What staff can run</div>
        <h2>Full operations layout</h2>
        <ul>
          <li>Command floor with live load, ESI mix, and stock exceptions</li>
          <li>Symptom routing to ICD-10, ESI, and a named consultant</li>
          <li>15-minute board: book, walk-in, check-in, consult, complete</li>
          <li>Patient registry and charts with encounter history</li>
          <li>e-Rx QR, FEFO dispense, transfers, and LGU purchase requests</li>
        </ul>
      </aside>
    </section>

    <section id="modules" class="band">
      <h2>Operational desks</h2>
      <div class="grid-3" style="margin-top:16px">
        <article class="card">
          <div class="stat-label">Operations</div>
          <h3>Command, routing, queue</h3>
          <p class="muted">Municipal picture, Cebuano/English intake, hybrid online and walk-in windows with no-show release and ER override.</p>
        </article>
        <article class="card">
          <div class="stat-label">Clinical</div>
          <h3>Registry, roster, e-Rx</h3>
          <p class="muted">Patient master index, clinician caps, Konsulta generics, allergy checks, and single-use QR dispensing.</p>
        </article>
        <article class="card">
          <div class="stat-label">Network</div>
          <h3>Sites, FEFO, procurement</h3>
          <p class="muted">Facility caps, goods receipt, peer transfers, seasonal forecasts, and CHO purchase requisitions.</p>
        </article>
      </div>
    </section>

    <section id="facilities" class="band">
      <h2>Covered sites</h2>
      <p class="lede" style="margin:8px 0 16px">Central hubs and satellite stations in the Valencia catchment.</p>
      <div class="grid-3">
        <article class="card"><strong>City Health Office</strong><p class="muted">Poblacion · command and procurement</p></article>
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
