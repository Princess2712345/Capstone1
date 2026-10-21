<script setup lang="ts">
definePageMeta({ layout: 'public' })

const steps = [
  { n: '01', title: 'Describe', body: 'Share what you’re experiencing in plain language.', c: 'teal' },
  { n: '02', title: 'Route', body: 'See an AI-assisted specialty recommendation.', c: 'blue' },
  { n: '03', title: 'Coordinate', body: 'Choose a facility, doctor, date, and time.', c: 'violet' },
  { n: '04', title: 'Continue', body: 'Track your records, prescriptions, and follow-up.', c: 'orange' }
]

const features = [
  { title: 'AI-assisted routing', body: 'Guide patients to the right specialty without replacing clinical judgment.' },
  { title: 'Scheduling that fits', body: 'Coordinate online and walk-in availability across RHUs and BHS sites.' },
  { title: 'One care record', body: 'Give authorized teams the context they need at every visit.' },
  { title: 'Live queue visibility', body: 'Keep patients and front-desk teams aligned on wait times.' },
  { title: 'Prescription continuity', body: 'Track dispensing, remaining quantities, and secure transfers.' },
  { title: 'Emergency referral', body: 'Make urgent pathways visible and ready when minutes matter.' }
]
</script>

<template>
  <div class="lp-page">
    <div class="lp-leaves" aria-hidden="true">
      <span class="leaf leaf-a" />
      <span class="leaf leaf-b" />
      <span class="leaf leaf-c" />
      <span class="plus plus-a">+</span>
      <span class="plus plus-b">+</span>
      <span class="heart">♥</span>
    </div>

    <section class="lp-hero">
      <div class="lp-wrap lp-hero-grid">
        <div>
          <p class="lp-kicker">City Health Office · LGU Valencia City</p>
          <h1>See how one visit <span>moves</span> through the network.</h1>
          <p class="lp-lede">
            Valencia Care helps residents and municipal care teams coordinate appointments, queues, records, and e-prescriptions in one place.
          </p>
          <div class="lp-actions">
            <NuxtLink class="lp-cta" to="/portal/login">Patient →</NuxtLink>
            <NuxtLink class="lp-cta-ghost" to="/login">Staff workers →</NuxtLink>
          </div>
        </div>
        <aside class="lp-care" aria-hidden="true">
          <div class="lp-care-pulse" />
          <svg class="lp-care-heart" viewBox="0 0 64 64" fill="none">
            <path d="M32 54S12 40 8 26c-2-8 4-16 12-16 5 0 8 3 12 8 4-5 7-8 12-8 8 0 14 8 12 16-4 14-24 28-24 28Z" fill="#12b5a0"/>
          </svg>
          <svg class="lp-ecg" viewBox="0 0 360 80" fill="none">
            <path class="lp-ecg-line" d="M0 40 H48 L58 40 L68 12 L82 68 L94 40 H150 L160 40 L170 18 L184 62 L196 40 H360" />
          </svg>
          <div class="lp-float-chip lp-float-a">RHU</div>
          <div class="lp-float-chip lp-float-b">BHS</div>
          <div class="lp-float-chip lp-float-c">CHO</div>
        </aside>
      </div>
    </section>

    <section class="lp-network">
      <div class="lp-wrap lp-network-grid">
        <article>
          <p class="lp-kicker">The Valencia Care network</p>
          <h2>Connected care. Closer to home.</h2>
          <p class="lp-lede">
            Valencia Care connects patients, healthcare workers, doctors, and local facilities in one calm, coordinated health network.
          </p>
          <p class="lp-ok">Designed around privacy, consent, and continuity of care.</p>
        </article>
        <div class="lp-map" aria-hidden="true">
          <svg class="lp-map-lines" viewBox="0 0 360 240" fill="none">
            <path d="M90 70 C140 70, 150 110, 180 120" stroke="#9ad9cc" stroke-width="2" stroke-dasharray="5 7" />
            <path d="M270 70 C220 70, 210 110, 180 120" stroke="#9ad9cc" stroke-width="2" stroke-dasharray="5 7" />
            <path d="M90 190 C140 190, 150 140, 180 128" stroke="#9ad9cc" stroke-width="2" stroke-dasharray="5 7" />
          </svg>
          <div class="lp-node lp-node-rhu"><span class="lp-node-ico teal">⌂</span> RHU 1</div>
          <div class="lp-node lp-node-doc"><span class="lp-node-ico blue">✚</span> Doctor</div>
          <div class="lp-core">Patient</div>
          <div class="lp-node lp-node-bhs"><span class="lp-node-ico teal">▤</span> BHS</div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="lp-journey">
      <div class="lp-wrap">
        <header class="lp-head">
          <p class="lp-kicker">A simpler care journey</p>
          <h2>One platform, <span>every step</span> of the patient journey.</h2>
          <p class="lp-lede">From first symptom to follow-up, Valencia Care helps local teams keep the whole picture in view.</p>
        </header>
        <ol class="lp-steps">
          <li v-for="s in steps" :key="s.n" :class="'tone-' + s.c">
            <span>{{ s.n }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.body }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section id="features" class="lp-features">
      <div class="lp-wrap">
        <header class="lp-head">
          <p class="lp-kicker">The Valencia Care platform</p>
          <h2>Built for the rhythm of municipal care.</h2>
        </header>
        <div class="lp-feat-grid">
          <article v-for="f in features" :key="f.title">
            <h3>{{ f.title }}</h3>
            <p>{{ f.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <footer id="privacy" class="lp-foot">
      <div class="lp-foot-band">
        <div class="lp-wrap lp-foot-cta">
          <p class="lp-kicker light">A simpler care journey</p>
          <h2>See how one visit <span>moves</span> through the network.</h2>
        </div>
      </div>
      <div class="lp-foot-bar">
        <div class="lp-wrap lp-foot-inner">
          <NuxtLink to="/" class="lp-brand">
            <BrandMark size="sm" />
            <span>
              <strong>Valencia Care</strong>
              <em>Municipal health network</em>
            </span>
          </NuxtLink>
          <nav>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Platform features</a>
            <a href="#privacy">Privacy &amp; security</a>
          </nav>
          <p>Your health. Our priority.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
