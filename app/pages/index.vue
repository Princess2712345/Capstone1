<script setup lang="ts">
definePageMeta({ layout: 'public' })

const journey = [
  { t: '08:12 AM', k: 'Patient describes symptoms', h: 'Ana shares what she’s feeling', b: 'Ana Reyes, 42, reports chest discomfort and difficulty breathing from her phone.', c: 'teal' },
  { t: '08:13 AM', k: 'AI-assisted recommendation', h: 'Cardiology is suggested', b: 'The platform explains why Cardiology may be appropriate, while reminding Ana that this is not a diagnosis.', c: 'violet' },
  { t: '08:16 AM', k: 'Scheduling across the network', h: 'Ana chooses Valencia RHU 1', b: 'She sees a cardiology window at 9:30 AM, with estimated wait time and an appointment QR code.', c: 'blue' },
  { t: '09:18 AM', k: 'Check-in & live queue', h: 'The care team sees her arrival', b: 'A staff member scans her health ID, records vitals, and places her in queue A-014.', c: 'green' },
  { t: '09:42 AM', k: 'Consultation & record update', h: 'The doctor completes a SOAP note', b: 'The clinician reviews the shared record, makes the clinical decision, and saves the consultation.', c: 'violet' },
  { t: '10:05 AM', k: 'Continuity of care', h: 'Prescription and follow-up stay connected', b: 'Ana tracks her prescription, receives a referral, and sees her follow-up in one place.', c: 'orange' }
]

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
  <div>
    <section class="lp-hero">
      <div class="lp-wrap lp-hero-grid">
        <div>
          <p class="lp-kicker">Example scenario · Ana’s care journey</p>
          <h1>See how one visit <span>moves</span> through the network.</h1>
          <p class="lp-lede">
            A walkthrough for a fictional patient — so residents and care teams can see how a visit moves through Valencia Care.
          </p>
          <div class="lp-actions">
            <NuxtLink class="lp-cta lp-cta-lg" to="/portal/login">Patient →</NuxtLink>
            <NuxtLink class="lp-cta-ghost lp-cta-lg" to="/login">Staff workers →</NuxtLink>
          </div>
        </div>
        <aside class="lp-timeline-card">
          <h2>Ana Reyes · Cardiology pathway</h2>
          <ol>
            <li v-for="j in journey" :key="j.t" :class="'tone-' + j.c">
              <i aria-hidden="true" />
              <div>
                <p class="lp-when">{{ j.t }} · {{ j.k }}</p>
                <strong>{{ j.h }}</strong>
                <p>{{ j.b }}</p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </section>

    <section class="lp-network">
      <div class="lp-wrap lp-network-grid">
        <article class="lp-network-copy">
          <p class="lp-kicker">The Valencia Care network</p>
          <h2>Connected care. Closer to home.</h2>
          <p class="lp-lede">
            Valencia Care connects patients, healthcare workers, doctors, and local facilities in one calm, coordinated health network.
          </p>
          <NuxtLink class="lp-cta" to="/portal/login">Explore the patient portal →</NuxtLink>
          <p class="lp-ok">Designed around privacy, consent, and continuity of care.</p>
        </article>
        <div class="lp-map" aria-hidden="true">
          <button class="lp-node lp-node-rhu" type="button">RHU 1</button>
          <button class="lp-node lp-node-doc" type="button">Doctor</button>
          <div class="lp-core">Patient</div>
          <button class="lp-node lp-node-bhs" type="button">BHS</button>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="lp-journey">
      <div class="lp-wrap lp-journey-grid">
        <header>
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
        <header>
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

    <section id="privacy" class="lp-privacy">
      <div class="lp-wrap lp-privacy-grid">
        <div>
          <p class="lp-kicker light">A simpler care journey</p>
          <h2>See how one visit <span>moves</span> through the network.</h2>
          <p>Routing is assistive. Clinical decisions stay with licensed staff. Access is limited by role and consent.</p>
          <NuxtLink class="lp-cta lp-cta-light" to="/login">Staff workspace →</NuxtLink>
        </div>
        <aside class="lp-timeline-card lp-timeline-compact">
          <h2>Ana Reyes · Cardiology pathway</h2>
          <ol>
            <li v-for="j in journey.slice(0, 3)" :key="j.t" :class="'tone-' + j.c">
              <i aria-hidden="true" />
              <div>
                <p class="lp-when">{{ j.t }} · {{ j.k }}</p>
                <strong>{{ j.h }}</strong>
                <p>{{ j.b }}</p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </section>
  </div>
</template>
