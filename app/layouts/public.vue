<template>
  <div class="vc-shell">
    <header class="vc-nav">
      <div class="vc-wrap vc-nav-inner">
        <NuxtLink to="/" class="vc-brand">
          <BrandMark size="sm" />
          <span>
            <strong>ValenciaCare</strong>
            <span>Municipal health network</span>
          </span>
        </NuxtLink>
        <nav class="vc-links" aria-label="Landing">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Platform features</a>
          <a href="#privacy">Privacy &amp; security</a>
          <NuxtLink class="btn" to="/portal">Patient portal</NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
