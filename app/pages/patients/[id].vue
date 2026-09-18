<script setup lang="ts">
const route = useRoute()
const {
  patientById,
  updatePatient,
  csv,
  appointments,
  prescriptions,
  encounters,
  facById,
  docById,
  drugById,
  bookNextOpen,
  facilities
} = usePlatform()

const id = computed(() => String(route.params.id))
const patient = computed(() => patientById(id.value))

const edit = reactive({
  contact: '',
  philhealth: '',
  allergies: '',
  conditions: '',
  meds: '',
  notes: '',
  barangay: ''
})

watch(patient, (p) => {
  if (!p) return
  edit.contact = p.contact
  edit.philhealth = p.philhealth
  edit.allergies = p.allergies.join(', ')
  edit.conditions = p.conditions.join(', ')
  edit.meds = p.meds.join(', ')
  edit.notes = p.notes
  edit.barangay = p.barangay
}, { immediate: true })

const visits = computed(() => appointments.value.filter(a => a.patientId === id.value).sort((a, b) => a.time.localeCompare(b.time)))
const rx = computed(() => prescriptions.value.filter(r => r.patientId === id.value))
const history = computed(() => encounters.value.filter(e => e.patientId === id.value))
const bookFac = ref('rhu1')

function save() {
  if (!patient.value) return
  updatePatient(patient.value.id, {
    contact: edit.contact,
    philhealth: edit.philhealth,
    barangay: edit.barangay,
    allergies: csv(edit.allergies),
    conditions: csv(edit.conditions),
    meds: csv(edit.meds),
    notes: edit.notes
  })
}

function book() {
  if (patient.value) bookNextOpen(patient.value, bookFac.value)
}
</script>

<template>
  <div v-if="patient">
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Patient chart</div>
        <h1>{{ patient.name }}</h1>
        <p class="lede">{{ patient.age }}{{ patient.sex }} · {{ patient.barangay }} · PhilHealth {{ patient.philhealth }} · {{ patient.contact || 'No mobile on file' }}</p>
      </div>
      <NuxtLink class="btn secondary" to="/patients">Back to registry</NuxtLink>
    </header>

    <section class="split">
      <article class="card">
        <h2>Demographics &amp; clinical flags</h2>
        <div class="grid-2">
          <label class="field"><span>Barangay</span><input v-model="edit.barangay"></label>
          <label class="field"><span>Contact</span><input v-model="edit.contact"></label>
          <label class="field"><span>PhilHealth</span><input v-model="edit.philhealth"></label>
          <label class="field"><span>Allergies</span><input v-model="edit.allergies"></label>
          <label class="field"><span>Conditions</span><input v-model="edit.conditions"></label>
          <label class="field"><span>Current meds</span><input v-model="edit.meds"></label>
        </div>
        <label class="field" style="margin-top:10px"><span>Notes</span><textarea v-model="edit.notes" rows="3" /></label>
        <div class="toolbar" style="margin-top:12px">
          <button class="btn" type="button" @click="save">Save chart</button>
          <select v-model="bookFac">
            <option v-for="f in facilities.filter(x => x.type !== 'CHO')" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
          <button class="btn secondary" type="button" @click="book">Book next open slot</button>
          <NuxtLink class="btn secondary" to="/triage">Route complaint</NuxtLink>
          <NuxtLink class="btn secondary" to="/pharmacy">Issue e-Rx</NuxtLink>
        </div>
      </article>
      <article class="card">
        <h2>Encounter log</h2>
        <p v-if="!history.length" class="empty">No triage or consult notes yet.</p>
        <div v-for="e in history" :key="e.id" class="slot">
          <strong>{{ e.kind }}</strong>
          <div>
            ESI {{ e.esi }} · {{ e.specialty }}
            <div class="muted">{{ e.createdAt }} · {{ e.note }}</div>
          </div>
          <span class="muted">{{ facById(e.facilityId || '')?.name }}</span>
        </div>
      </article>
    </section>

    <section class="grid-2" style="margin-top:16px">
      <article class="card">
        <h2>Appointments</h2>
        <p v-if="!visits.length" class="empty">No named windows for this patient.</p>
        <div v-for="a in visits" :key="a.id" class="slot">
          <strong>{{ a.time }}</strong>
          <div>{{ a.specialty }} · {{ a.status }}<div class="muted">{{ docById(a.doctorId)?.name }} · {{ facById(a.facilityId)?.name }}</div></div>
          <span v-if="a.esi" class="badge" :class="'esi-' + a.esi">ESI {{ a.esi }}</span>
        </div>
      </article>
      <article class="card">
        <h2>Prescriptions</h2>
        <p v-if="!rx.length" class="empty">No e-Rx on file.</p>
        <div v-for="r in rx" :key="r.id" class="slot">
          <strong>{{ r.qr }}</strong>
          <div>
            {{ r.status }} · {{ r.issuedAt }}
            <div class="muted" v-for="item in r.items" :key="item.drugId">{{ drugById(item.drugId)?.generic }} {{ item.dispensed }}/{{ item.qty }}</div>
          </div>
        </div>
      </article>
    </section>
  </div>
  <div v-else>
    <p class="empty">Patient not found. <NuxtLink class="row-link" to="/patients">Return to registry</NuxtLink></p>
  </div>
</template>
