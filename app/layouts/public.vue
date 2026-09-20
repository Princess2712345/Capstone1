<template>
  <div class="lp-shell">
    <header class="lp-nav">
      <div class="lp-wrap lp-nav-inner">
        <NuxtLink to="/" class="lp-brand">
          <CitySeal size="sm" />
          <span class="lp-brand-copy">
            <span class="lp-brand-kicker">Local Government Unit</span>
            <strong>City of Valencia</strong>
            <span class="lp-brand-sub">City Health Office</span>
          </span>
        </NuxtLink>
        <nav class="lp-links" aria-label="Landing">
          <NuxtLink to="/portal">Patient portal</NuxtLink>
          <NuxtLink to="/login">Staff</NuxtLink>
          <NuxtLink class="btn" to="/portal/book">Book appointment</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
