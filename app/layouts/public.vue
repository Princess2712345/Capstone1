<template>
  <div>
    <header class="pub-nav">
      <NuxtLink to="/" class="pub-brand">
        <strong>Care Ops</strong>
        <span class="muted">LGU Valencia City</span>
      </NuxtLink>
      <nav class="pub-links">
        <a href="/#modules">Modules</a>
        <a href="/#facilities">Facilities</a>
        <NuxtLink to="/login">Log in</NuxtLink>
        <NuxtLink class="btn" to="/signup">Sign up</NuxtLink>
      </nav>
    </header>
    <slot />
  </div>
</template>
