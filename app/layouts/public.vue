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
          <NuxtLink to="/#how-it-works">How it works</NuxtLink>
          <NuxtLink to="/#features">Platform features</NuxtLink>
          <NuxtLink to="/#privacy">Privacy &amp; security</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
