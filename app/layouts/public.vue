<template>
  <div class="lp-shell">
    <header class="lp-nav">
      <div class="lp-wrap lp-nav-inner">
        <NuxtLink to="/" class="lp-brand">
          <BrandMark size="sm" />
          <span>
            <strong>Valencia Care</strong>
            <em>Municipal health network</em>
          </span>
        </NuxtLink>
        <nav class="lp-links" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Platform features</a>
          <a href="#privacy">Privacy &amp; security</a>
          <NuxtLink to="/portal/login">Patient</NuxtLink>
          <NuxtLink class="lp-cta" to="/login">Staff workers →</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
