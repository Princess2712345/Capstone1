<template>
  <div class="auth-shell">
    <aside class="auth-aside">
      <div class="auth-aside-inner">
        <div>
          <CitySeal size="lg" />
          <NuxtLink to="/" class="brand-kicker auth-kicker">Local Government Unit</NuxtLink>
          <h1>City of Valencia</h1>
          <p class="auth-lede">
            Staff access for the City Health Office, rural health units, and barangay stations.
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
            <strong>Walk-in hub</strong>
            <p>Overflow routes to RHU 2 and BHS Mailag when the buffer is full.</p>
          </article>
          <article class="auth-tile">
            <div class="auth-tile-kicker">Network</div>
            <strong>7 sites</strong>
            <p>CHO, 2 RHUs, 3 BHS, Infirmary ER on one municipal file.</p>
          </article>
          <article class="auth-tile auth-tile-wide">
            <div class="auth-tile-kicker">Staff desks</div>
            <p>Specialty routing · hybrid 15-minute slots · Konsulta e-Rx · FEFO lots</p>
          </article>
        </div>

        <p class="auth-foot">Directory for CHO, RHU, BHW, and dispensing windows. Not connected to PhilHealth identity.</p>
      </div>
    </aside>
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>
