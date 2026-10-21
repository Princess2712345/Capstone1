<script setup lang="ts">
definePageMeta({ layout: 'public' })

const steps = [
  { n: '01', title: 'Describe', body: 'Share what you’re experiencing in plain language.' },
  { n: '02', title: 'Route', body: 'See an AI-assisted specialty recommendation.' },
  { n: '03', title: 'Coordinate', body: 'Choose a facility, doctor, date, and time.' },
  { n: '04', title: 'Continue', body: 'Track your records, prescriptions, and follow-up.' }
]

const features = [
  { title: 'AI-assisted routing', body: 'Guide patients to the right specialty without replacing clinical judgment.' },
  { title: 'Scheduling that fits', body: 'Coordinate online and walk-in availability across RHUs and BHS sites.' },
  { title: 'One care record', body: 'Give authorized teams the context they need at every visit.' },
  { title: 'Live queue visibility', body: 'Keep patients and front-desk teams aligned on wait times.' },
  { title: 'Prescription continuity', body: 'Track dispensing, remaining quantities, and secure transfers.' },
  { title: 'Emergency referral', body: 'Make urgent pathways visible and ready when minutes matter.' }
]

const journey = [
  { t: '08:12 AM', k: 'Patient describes symptoms', h: 'Ana shares what she’s feeling', b: 'Ana Reyes, 42, reports chest discomfort and difficulty breathing from her phone.' },
  { t: '08:13 AM', k: 'AI-assisted recommendation', h: 'Cardiology is suggested', b: 'The platform explains why Cardiology may be appropriate, while reminding Ana that this is not a diagnosis.' },
  { t: '08:16 AM', k: 'Scheduling across the network', h: 'Ana chooses Valencia RHU 1', b: 'She sees a cardiology window at 9:30 AM, with estimated wait time and an appointment QR code.' },
  { t: '09:18 AM', k: 'Check-in & live queue', h: 'The care team sees her arrival', b: 'A staff member scans her health ID, records vitals, and places her in queue A-014.' },
  { t: '09:42 AM', k: 'Consultation & record update', h: 'The doctor completes a SOAP note', b: 'The clinician reviews the shared record, makes the clinical decision, and saves the consultation.' },
  { t: '10:05 AM', k: 'Continuity of care', h: 'Prescription and follow-up stay connected', b: 'Ana tracks her prescription, receives a referral, and sees her follow-up in one place.' }
]
</script>

<template>
  <div>
    <section class="vc-hero">
      <div class="vc-wrap">
        <p class="vc-kicker">Built for Valencia City, Bukidnon</p>
        <h1>Better access to care, <em>closer to home.</em></h1>
        <p class="vc-lede">
          Valencia Care connects patients, healthcare workers, doctors, and local facilities in one calm, coordinated health network.
        </p>
        <div class="vc-actions">
          <NuxtLink class="btn" to="/portal">Explore the patient portal →</NuxtLink>
          <NuxtLink class="vc-link" to="/login">I’m a healthcare worker ›</NuxtLink>
        </div>
        <p class="vc-note">Designed around privacy, consent, and continuity of care.</p>
        <div class="vc-stage" aria-hidden="true">
          <div class="vc-stage-orb" style="inset:18% 22%" />
          <div class="vc-stage-orb" style="inset:8% 12%" />
          <div class="vc-node" style="left:18%; top:28%"><i>+</i> RHU 1</div>
          <div class="vc-node" style="left:12%; bottom:22%"><i>+</i> BHS</div>
          <div class="vc-node" style="right:38%; top:36%"><i>+</i> Doctor</div>
          <div class="vc-float">
            <p class="pt-kicker">Patient portal</p>
            <strong>Good morning, Rosa</strong>
            <p class="muted" style="margin:8px 0 0">Next appointment · General consultation<br>Sep 30 · 9:30 AM</p>
            <p class="muted">Current queue A-014 · 3 ahead</p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="vc-section alt">
      <div class="vc-wrap">
        <p class="vc-kicker">A simpler care journey</p>
        <h2>One platform, <span class="vc-accent">every step</span> of the patient journey.</h2>
        <p class="vc-lede">From first symptom to follow-up, Valencia Care helps local teams keep the whole picture in view.</p>
        <div class="vc-steps">
          <article v-for="s in steps" :key="s.n" class="vc-step">
            <div class="vc-num">{{ s.n }}</div>
            <h3>{{ s.title }}</h3>
            <p class="muted">{{ s.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="vc-section">
      <div class="vc-wrap vc-grid-2">
        <div>
          <p class="vc-kicker">Example scenario · Ana’s care journey</p>
          <h2>See how one visit <span class="vc-accent">moves through the network.</span></h2>
          <p class="vc-lede">A walkthrough for a fictional patient — designed to make the flow easy to explain during a demo.</p>
          <NuxtLink class="btn" to="/portal/book" style="margin-top:18px">Walk through the demo</NuxtLink>
        </div>
        <div class="vc-card">
          <h3>Ana Reyes · Cardiology pathway</h3>
          <div class="vc-timeline" style="margin-top:16px">
            <div v-for="j in journey" :key="j.t">
              <div class="vc-time">{{ j.t }} · {{ j.k }}</div>
              <strong>{{ j.h }}</strong>
              <p class="muted" style="margin:4px 0 0">{{ j.b }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="vc-section alt">
      <div class="vc-wrap">
        <p class="vc-kicker">The Valencia Care platform</p>
        <h2>Built for the rhythm of <span class="vc-accent">municipal care.</span></h2>
        <div class="vc-grid-3" style="margin-top:28px">
          <article v-for="f in features" :key="f.title" class="vc-card">
            <h3>{{ f.title }}</h3>
            <p class="muted">{{ f.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="privacy" class="vc-section dark">
      <div class="vc-wrap">
        <p class="vc-kicker" style="background:rgba(255,255,255,0.08); color:#9ec4ff">Trust is part of the system</p>
        <h2>Care coordination <span class="vc-accent">with guardrails.</span></h2>
        <p class="vc-lede">Every view is shaped by role-based access, patient consent, audit trails, and a clear distinction between assistive technology and clinical decisions.</p>
        <div class="vc-actions">
          <NuxtLink class="btn" to="/login" style="background:#fff; color:var(--ink)">See the staff workspace →</NuxtLink>
        </div>
      </div>
    </section>

    <footer class="vc-foot">
      <div class="vc-wrap vc-foot">
        <BrandMark size="sm" />
        <div>
          <p>Valencia Care · City Health Office · LGU Valencia City</p>
          <p>AI-assisted, never autonomous. Not a diagnostic device.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
