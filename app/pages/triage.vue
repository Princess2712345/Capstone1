<script setup lang="ts">
import { matchesLoad, sortByLoad, type LoadFilter } from '~/utils/load'

const {
  patients,
  facilities,
  doctors,
  lastTriage,
  runTriage,
  commitTriageToSchedule,
  emergencyInsert
} = usePlatform()

const loadFilter = ref<LoadFilter>('all')
const matrix = computed(() => sortByLoad(doctors.value).filter(d => matchesLoad(d, loadFilter.value)))

const patientId = ref(patients.value[0]?.id ?? '')
const complaint = ref('Sakit sa dughan since last night, lisod pagginhawa, sweating.')

const examples = [
  'Sakit sa dughan since last night, lisod pagginhawa, sweating.',
  'Bata, 4 years old, hilanat for two days and ubo.',
  'Nabali ang tuo nga bukton after a fall from a motorcycle.',
  'Buntis, 28 weeks, dugo samtang buntis this morning.',
  'Kalibanga and nagsuka since yesterday. Weak, thirsty.',
  'High blood, lipong, follow-up for diabetes medicines.',
  'Unresponsive after collapsing at the public market.'
]

const patient = computed(() => patients.value.find(p => p.id === patientId.value) ?? patients.value[0])

function run() {
  if (!patient.value) return
  runTriage(complaint.value, patient.value)
}

function assign() {
  if (!patient.value || !lastTriage.value) return
  if (lastTriage.value.bypassEr) emergencyInsert(patient.value, lastTriage.value)
  else commitTriageToSchedule(patient.value, lastTriage.value)
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--gold)">Module 1 · NLP specialty routing</div>
        <h1>Universal symptom intake</h1>
        <p class="lede">
          Prototype classifier reads English or Cebuano complaints, maps ICD-10 cues,
          scores ESI 1–5, and load-balances across Valencia consultants. High acuity never waits in OPD.
        </p>
      </div>
      <NuxtLink class="btn secondary" to="/patients">Open registry</NuxtLink>
    </header>

    <section class="split">
      <article class="card">
        <h2>Chief complaint</h2>
        <div class="field" style="margin-bottom: 12px">
          <span>Linked patient record</span>
          <select v-model="patientId">
            <option v-for="p in patients" :key="p.id" :value="p.id">
              {{ p.residentId }} · {{ p.name }} · {{ p.barangay }}
            </option>
          </select>
        </div>
        <p v-if="patient" class="muted" style="margin-top:0">
          PhilHealth {{ patient.philhealth }} · {{ patient.conditions.join(', ') || 'No listed NCDs' }}
          · Allergies: {{ patient.allergies.join(', ') || 'none' }}
        </p>
        <div class="field">
          <span>Unstructured text / BHW transcription / voice desk notes</span>
          <textarea v-model="complaint" rows="5" />
        </div>
        <div class="chips" style="margin: 12px 0">
          <button
            v-for="ex in examples"
            :key="ex"
            class="chip"
            type="button"
            style="cursor:pointer; text-align:left"
            @click="complaint = ex"
          >
            {{ ex }}
          </button>
        </div>
        <div style="display:flex; gap:8px">
          <button class="btn" type="button" @click="run">Extract &amp; route</button>
          <button class="btn secondary" type="button" :disabled="!lastTriage" @click="assign">
            Commit to schedule
          </button>
        </div>
      </article>

      <article class="card" v-if="lastTriage">
        <h2>Routing ticket</h2>
        <p>
          <span class="badge" :class="'esi-' + lastTriage.esi">ESI {{ lastTriage.esi }} · {{ lastTriage.esiLabel }}</span>
          &nbsp;
          <span class="badge">{{ lastTriage.specialty }}</span>
        </p>
        <p v-if="lastTriage.bypassEr" class="flash alert">
          Outpatient queue bypass. Alert Infirmary ER and dispatch municipal emergency transport.
        </p>
        <p>
          <strong>{{ lastTriage.doctor?.name }}</strong>
          <span class="muted"> · {{ lastTriage.doctor?.role }} · PRC {{ lastTriage.doctor?.prc }}</span>
        </p>
        <p class="muted">
          {{ lastTriage.facility?.name }} ({{ lastTriage.facility?.barangay }})
          <span v-if="lastTriage.overflowToGp"> · specialist cap full, GP with labs</span>
        </p>
        <h3>Prerequisite diagnostics</h3>
        <div class="chips">
          <span v-for="lab in lastTriage.labs" :key="lab" class="chip">{{ lab }}</span>
        </div>
        <h3 style="margin-top:16px">Engine rationale</h3>
        <ul>
          <li v-for="r in lastTriage.rationale" :key="r">{{ r }}</li>
        </ul>
      </article>
      <article class="card" v-else>
        <h2>Routing ticket</h2>
        <p class="muted">Run extraction to map organ system, ICD-10, ESI, and a named clinician across the city matrix.</p>
      </article>
    </section>

    <article class="card" style="margin-top:16px" v-if="lastTriage?.hits.length">
      <h2>Symptom → ICD-10 → specialty</h2>
      <table>
        <thead>
          <tr><th>Cue</th><th>System</th><th>ICD-10</th><th>Label</th><th>Clinic</th></tr>
        </thead>
        <tbody>
          <tr v-for="h in lastTriage.hits" :key="h.phrase + h.icd10">
            <td>{{ h.phrase }}</td>
            <td>{{ h.system }}</td>
            <td>{{ h.icd10 }}</td>
            <td>{{ h.icdLabel }}</td>
            <td>{{ h.specialty }}</td>
          </tr>
        </tbody>
      </table>
    </article>

    <article class="card" style="margin-top:16px">
      <div class="load-head">
        <h2>Cross-facility consultant matrix</h2>
        <PhysicianLoadFilter v-model:load="loadFilter" />
      </div>
      <p class="muted">Filter by load to send the next case to a desk that still has capacity.</p>
      <table>
        <thead>
          <tr><th>Clinician</th><th>Specialty</th><th>Site</th><th>Load</th></tr>
        </thead>
        <tbody>
          <tr v-for="d in matrix" :key="d.id">
            <td>{{ d.name }}</td>
            <td>{{ d.specialty }}</td>
            <td>{{ facilities.find(f => f.id === d.facilityId)?.name }}</td>
            <td>{{ d.todayLoad }}/{{ d.dailyCap }}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </div>
</template>
