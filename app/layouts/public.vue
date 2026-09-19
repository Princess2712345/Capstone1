<template>
  <div>
    <header class="pub-nav">
      <NuxtLink to="/" class="pub-brand">
        <strong>Care Ops</strong>
        <span class="muted">LGU Valencia City</span>
      </NuxtLink>
      <nav class="pub-links">
        <NuxtLink to="/portal">Patient desk</NuxtLink>
        <a href="/#modules">Modules</a>
        <a href="/#facilities">Facilities</a>
        <NuxtLink to="/login">Staff log in</NuxtLink>
        <NuxtLink class="btn" to="/portal/book">Book a visit</NuxtLink>
      </nav>
    </header>
    <slot />
  </div>
</template>
