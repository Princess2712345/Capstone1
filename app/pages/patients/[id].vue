<script setup lang="ts">
import { homeStationOf, stationName } from '~/data/catchment'

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

const visits = computed(() => appointments.value.filter(a => a.patientId === id.value).sort((a, b) => a.time.localeCompare(b.time)))
const rx = computed(() => prescriptions.value.filter(r => r.patientId === id.value))
const history = computed(() => encounters.value.filter(e => e.patientId === id.value))
const bookFac = ref('rhu1')
const home = computed(() => homeStationOf(patient.value?.barangay || 'Poblacion'))
const sites = computed(() => facilities.value.filter(x => x.type !== 'CHO'))

watch(patient, (p) => {
  if (!p) return
  edit.contact = p.contact
  edit.philhealth = p.philhealth
  edit.allergies = p.allergies.join(', ')
  edit.conditions = p.conditions.join(', ')
  edit.meds = p.meds.join(', ')
  edit.notes = p.notes
  edit.barangay = p.barangay
  if (p.homeFacilityId) bookFac.value = p.homeFacilityId
}, { immediate: true })

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
        <div class="brand-kicker">Patient chart</div>
        <h1>{{ patient.name }}</h1>
        <p class="lede">{{ patient.residentId }} · {{ patient.barangay }} · {{ stationName(patient.homeFacilityId) }}</p>
      </div>
      <div class="toolbar">
        <NuxtLink class="btn secondary" to="/patients">Registry</NuxtLink>
        <NuxtLink class="btn secondary" to="/triage">Route</NuxtLink>
        <NuxtLink class="btn secondary" to="/pharmacy">Issue e-Rx</NuxtLink>
      </div>
    </header>

    <dl class="id-strip">
      <div>
        <dt>Resident ID</dt>
        <dd class="resident-id">{{ patient.residentId }}</dd>
      </div>
      <div>
        <dt>Barangay</dt>
        <dd>{{ patient.barangay }}</dd>
      </div>
      <div>
        <dt>Home BHU</dt>
        <dd>{{ home.station }}</dd>
      </div>
      <div>
        <dt>Age / sex</dt>
        <dd>{{ patient.age }} {{ patient.sex === 'F' ? 'Female' : 'Male' }}</dd>
      </div>
    </dl>

    <section class="split">
      <article class="card">
        <h2>Chart</h2>
        <div class="form-grid form-grid-2">
          <BarangayField v-model="edit.barangay" />
          <label class="field"><span>Contact</span><input v-model="edit.contact"></label>
          <label class="field"><span>PhilHealth</span><input v-model="edit.philhealth"></label>
          <label class="field"><span>Allergies</span><input v-model="edit.allergies"></label>
          <label class="field field-span"><span>Conditions</span><input v-model="edit.conditions"></label>
          <label class="field field-span"><span>Current meds</span><input v-model="edit.meds"></label>
          <label class="field field-span"><span>Notes</span><textarea v-model="edit.notes" rows="3" /></label>
        </div>
        <div class="toolbar" style="margin-top:14px">
          <button class="btn" type="button" @click="save">Save chart</button>
          <select v-model="bookFac">
            <option v-for="f in sites" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
          <button class="btn secondary" type="button" @click="book">Book next window</button>
        </div>
      </article>
      <article class="card">
        <h2>Today’s windows</h2>
        <p v-if="!visits.length" class="empty">No named windows.</p>
        <table v-else>
          <thead><tr><th>Time</th><th>Site</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="a in visits" :key="a.id">
              <td>{{ a.time }}</td>
              <td>{{ facById(a.facilityId)?.name }}<div class="muted">{{ a.specialty }} · {{ docById(a.doctorId)?.name }}</div></td>
              <td>
                {{ a.status }}
                <span v-if="a.esi" class="badge" :class="'esi-' + a.esi" style="margin-left:6px">ESI {{ a.esi }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section class="grid-2" style="margin-top:16px">
      <article class="card">
        <h2>e-Prescriptions</h2>
        <p v-if="!rx.length" class="empty">No e-Rx on file.</p>
        <table v-else>
          <thead><tr><th>QR</th><th>Items</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="r in rx" :key="r.id">
              <td><NuxtLink class="row-link" to="/pharmacy">{{ r.qr }}</NuxtLink></td>
              <td class="muted">
                <div v-for="item in r.items" :key="item.drugId">{{ drugById(item.drugId)?.generic }} {{ item.dispensed }}/{{ item.qty }}</div>
              </td>
              <td>{{ r.status }}</td>
            </tr>
          </tbody>
        </table>
      </article>
      <article class="card">
        <h2>Encounter log</h2>
        <p v-if="!history.length" class="empty">No triage or consult notes yet.</p>
        <table v-else>
          <thead><tr><th>Kind</th><th>Note</th><th>When</th></tr></thead>
          <tbody>
            <tr v-for="e in history" :key="e.id">
              <td>ESI {{ e.esi }} · {{ e.kind }}</td>
              <td>{{ e.specialty }}<div class="muted">{{ e.note }}</div></td>
              <td>{{ e.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </div>
  <div v-else>
    <p class="empty">Patient not found. <NuxtLink class="row-link" to="/patients">Return to registry</NuxtLink></p>
  </div>
</template>
