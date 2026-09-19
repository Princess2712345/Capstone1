<template>
  <div class="auth-shell">
    <aside class="auth-aside">
      <div class="auth-glow" aria-hidden="true" />
      <div class="auth-orb auth-orb-a" aria-hidden="true" />
      <div class="auth-orb auth-orb-b" aria-hidden="true" />
      <div class="auth-orb auth-orb-c" aria-hidden="true" />
      <div class="auth-grid" aria-hidden="true" />

      <div class="auth-aside-inner">
        <div>
          <NuxtLink to="/" class="brand-kicker auth-kicker">LGU Valencia City · CHO</NuxtLink>
          <h1>Care Ops</h1>
          <p class="auth-lede">
            Staff access for rural health units, barangay stations, pharmacy desks, and the City Health command floor.
          </p>
          <div class="auth-pills">
            <span>Routing</span>
            <span>Queues</span>
            <span>e-Rx</span>
            <span>FEFO</span>
          </div>
        </div>

        <div class="auth-tiles">
          <article class="auth-tile">
            <div class="auth-tile-kicker">RHU 1 · Poblacion</div>
            <strong>90%</strong>
            <p>Walk-in buffer near cap. Overflow to RHU 2 and BHS Mailag.</p>
          </article>
          <article class="auth-tile">
            <div class="auth-tile-kicker">Network</div>
            <strong>7 sites</strong>
            <p>CHO, 2 RHUs, 3 BHS, Infirmary ER on one municipal board.</p>
          </article>
          <article class="auth-tile auth-tile-wide">
            <div class="auth-tile-kicker">Today’s desks</div>
            <p>Specialty routing · hybrid 15-minute slots · Konsulta QR · FEFO lots</p>
          </article>
        </div>

        <p class="auth-foot">Staff directory for CHO, RHU, BHS, and pharmacy desks. Not connected to PhilHealth identity.</p>
      </div>
    </aside>
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>
