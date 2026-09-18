<template>
  <div class="auth-shell">
    <aside class="auth-aside">
      <div>
        <NuxtLink to="/" class="brand-kicker" style="color:#bfdbfe">LGU Valencia City · CHO</NuxtLink>
        <h1>Care Ops</h1>
        <p>Staff access for rural health units, barangay stations, pharmacy desks, and the City Health command floor.</p>
      </div>
      <p style="font-size:13px; color:#bfdbfe">Prototype directory. Not connected to PhilHealth or a live identity provider.</p>
    </aside>
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>
