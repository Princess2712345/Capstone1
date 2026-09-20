<script setup lang="ts">
import { stationName } from '~/data/catchment'

const {
  patients,
  csv,
  addPatient
} = usePlatform()

const form = reactive({
  name: '',
  age: 35,
  sex: 'F' as 'F' | 'M',
  barangay: 'Poblacion',
  philhealth: '',
  contact: '',
  allergies: '',
  conditions: '',
  meds: '',
  notes: ''
})

const filter = ref('')
const notice = ref('')
const adding = ref(false)

const rows = computed(() => {
  const q = filter.value.toLowerCase()
  return patients.value.filter(p =>
    !q || [p.name, p.barangay, p.residentId, p.philhealth, p.contact, stationName(p.homeFacilityId)].join(' ').toLowerCase().includes(q)
  )
})

function save() {
  if (!form.name.trim()) {
    notice.value = 'A full name is required.'
    return
  }
  notice.value = ''
  addPatient({
    name: form.name,
    age: form.age,
    sex: form.sex,
    barangay: form.barangay,
    philhealth: form.philhealth,
    contact: form.contact,
    allergies: csv(form.allergies),
    conditions: csv(form.conditions),
    meds: csv(form.meds),
    notes: form.notes
  })
  form.name = ''
  form.philhealth = ''
  form.contact = ''
  form.allergies = ''
  form.conditions = ''
  form.meds = ''
  form.notes = ''
  adding.value = false
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker">Clinical registry</div>
        <h1>Patient registry</h1>
        <p class="lede">{{ patients.length }} records. Each resident has a CHO ID and a home barangay / BHU.</p>
      </div>
      <div class="toolbar">
        <button class="btn" type="button" @click="adding = !adding">{{ adding ? 'Close form' : 'Add patient' }}</button>
      </div>
    </header>

    <article v-if="adding" class="card" style="margin-bottom:16px">
      <h2>Add to registry</h2>
      <div class="form-grid">
        <label class="field"><span>Full name</span><input v-model="form.name" required></label>
        <label class="field"><span>Contact</span><input v-model="form.contact"></label>
        <label class="field"><span>PhilHealth</span><input v-model="form.philhealth"></label>
        <label class="field"><span>Age</span><input v-model.number="form.age" type="number" min="0"></label>
        <label class="field">
          <span>Sex</span>
          <select v-model="form.sex">
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
        </label>
        <BarangayField v-model="form.barangay" />
        <label class="field"><span>Allergies</span><input v-model="form.allergies"></label>
        <label class="field"><span>Conditions</span><input v-model="form.conditions"></label>
        <label class="field"><span>Current medicines</span><input v-model="form.meds"></label>
        <label class="field field-span"><span>Chart notes</span><textarea v-model="form.notes" rows="2" /></label>
      </div>
      <p v-if="notice" class="field-error">{{ notice }}</p>
      <button class="btn" type="button" style="margin-top:14px" @click="save">Save to registry</button>
    </article>

    <article class="card">
      <div class="registry-bar">
        <h2>Catchment</h2>
        <label class="field registry-search">
          <span>Find</span>
          <input v-model="filter" placeholder="Name, VLC-MLG, Mailag, BHS, PhilHealth">
        </label>
      </div>
      <p class="muted" style="margin:0 0 12px">{{ rows.length }} shown</p>
      <div class="table-wrap">
        <table class="registry-table">
          <thead>
            <tr>
              <th>Resident ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Barangay</th>
              <th>Home BHU</th>
              <th>PhilHealth</th>
              <th>Flags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in rows" :key="p.id">
              <td class="resident-id">{{ p.residentId }}</td>
              <td>
                <NuxtLink class="row-link" :to="`/patients/${p.id}`">{{ p.name }}</NuxtLink>
                <div class="muted">{{ p.contact || 'No mobile' }}</div>
              </td>
              <td>{{ p.age }} {{ p.sex === 'F' ? 'F' : 'M' }}</td>
              <td>{{ p.barangay }}</td>
              <td>{{ stationName(p.homeFacilityId) }}</td>
              <td>{{ p.philhealth || '—' }}</td>
              <td class="muted">{{ [...p.allergies, ...p.conditions].slice(0, 3).join(' · ') || '—' }}</td>
              <td><NuxtLink class="btn secondary" :to="`/patients/${p.id}`">Open</NuxtLink></td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
