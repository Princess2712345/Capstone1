<script setup lang="ts">
definePageMeta({ layout: 'portal' })
</script>

<template>
  <div>
    <section class="hero">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Valencia City Health · Patient desk</div>
        <h1>Book a 15-minute window, then show your QR at the pharmacy</h1>
        <p class="lede">
          Hold an online slot at an RHU or barangay station. Arrive 5–10 minutes early.
          Chest pain, collapse, or heavy bleeding belongs at City Infirmary ER — not this desk.
        </p>
        <div style="display:flex; gap:10px; margin-top:22px; flex-wrap:wrap">
          <NuxtLink class="btn" to="/portal/book">Book a visit</NuxtLink>
          <NuxtLink class="btn secondary" to="/portal/visit">Find my visit</NuxtLink>
          <NuxtLink class="btn secondary" to="/portal/rx">Show e-Rx QR</NuxtLink>
        </div>
      </div>
      <aside class="hero-panel">
        <div class="brand-kicker" style="color:#bfdbfe">If RHU 1 is full</div>
        <h2>You will be offered RHU 2 or BHS Mailag</h2>
        <ul>
          <li>English or Cebuano complaint is enough to hold a slot</li>
          <li>No-shows return the window after the municipal clock</li>
          <li>Bring your PhilHealth number if you have one</li>
        </ul>
      </aside>
    </section>
    <section class="band">
      <div class="grid-3">
        <article class="card">
          <div class="stat-label">1</div>
          <h3>Hold a slot</h3>
          <p class="muted">Name, barangay, mobile, and what hurts. The desk finds the next open 15-minute window.</p>
        </article>
        <article class="card">
          <div class="stat-label">2</div>
          <h3>Check in on site</h3>
          <p class="muted">A BHW or receptionist checks you in. ESI 1–2 never wait in the OPD line.</p>
        </article>
        <article class="card">
          <div class="stat-label">3</div>
          <h3>Pharmacy QR</h3>
          <p class="muted">After the clinician signs, open your e-Rx here. One scan at the window. Duplicate scans are rejected.</p>
        </article>
      </div>
    </section>
  </div>
</template>
