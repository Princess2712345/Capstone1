<script setup lang="ts">
definePageMeta({ layout: 'portal' })
</script>

<template>
  <div class="desk">
    <section class="desk-hero">
      <div>
        <p class="lp-eyebrow">Patient desk</p>
        <h1>Book a 15-minute visit at an RHU or barangay station.</h1>
        <p class="lp-lede">
          Arrive 5–10 minutes early. Chest pain, collapse, or heavy bleeding belongs at City Infirmary ER — not this desk.
        </p>
        <div class="lp-actions">
          <NuxtLink class="btn" to="/portal/book">Book a visit</NuxtLink>
          <NuxtLink class="btn secondary" to="/portal/visit">Find my visit</NuxtLink>
          <NuxtLink class="btn secondary" to="/portal/rx">Show e-Rx QR</NuxtLink>
        </div>
      </div>
      <aside class="desk-note">
        <p class="lp-eyebrow" style="color:#d4c48a">If RHU 1 is full</p>
        <h2>You will be offered RHU 2 or BHS Mailag</h2>
        <ul>
          <li>English or Cebuano is enough to hold a slot</li>
          <li>No-shows return the window after the municipal clock</li>
          <li>Bring your PhilHealth number if you have one</li>
        </ul>
      </aside>
    </section>

    <section class="desk-steps">
      <article>
        <p class="lp-eyebrow">1</p>
        <h3>Hold a slot</h3>
        <p>Name, barangay, mobile, and what hurts. The desk finds the next open 15-minute window.</p>
      </article>
      <article>
        <p class="lp-eyebrow">2</p>
        <h3>Check in on site</h3>
        <p>A BHW or receptionist checks you in. ESI 1–2 never wait in the OPD line.</p>
      </article>
      <article>
        <p class="lp-eyebrow">3</p>
        <h3>e-Rx QR</h3>
        <p>After the clinician signs, open your code here. One scan at the RHU or BHS window.</p>
      </article>
    </section>
  </div>
</template>
