<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <div class="brand-kicker">LGU Valencia City · CHO</div>
        <h1 class="brand-title">Care Ops</h1>
        <p class="brand-sub">Integrated routing, scheduling, and medicine supply for RHUs and barangay stations.</p>
      </div>
      <nav class="nav-list">
        <NuxtLink class="nav-link" to="/">Command floor</NuxtLink>
        <NuxtLink class="nav-link" to="/triage">Specialty routing</NuxtLink>
        <NuxtLink class="nav-link" to="/schedule">Hybrid queue</NuxtLink>
        <NuxtLink class="nav-link" to="/pharmacy">e-Prescription</NuxtLink>
        <NuxtLink class="nav-link" to="/supply">FEFO &amp; procurement</NuxtLink>
      </nav>
      <div class="sidebar-foot">
        Prototype for Northern Mindanao municipal health operations. Not a clinical device. Simulated 18 Sep 2026 census.
      </div>
    </aside>
    <main class="main">
      <slot />
    </main>
  </div>
</template>
