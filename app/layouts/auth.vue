<template>
  <div class="pt-shell">
    <div class="pt-body" style="max-width:640px; padding-top:48px">
      <NuxtLink to="/" class="vc-brand" style="margin-bottom:24px">
        <BrandMark size="sm" />
        <span><strong>ValenciaCare</strong><span>Secure municipal health access</span></span>
      </NuxtLink>
      <slot />
    </div>
  </div>
</template>
