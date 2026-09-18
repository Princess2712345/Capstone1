<script setup lang="ts">
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

const rows = computed(() => {
  const q = filter.value.toLowerCase()
  return patients.value.filter(p =>
    !q || [p.name, p.barangay, p.philhealth, p.contact].join(' ').toLowerCase().includes(q)
  )
})

function save() {
  if (!form.name.trim()) return
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
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Clinical registry</div>
        <h1>Patient master index</h1>
        <p class="lede">Register, search, and open charts for RHU and BHS catchment records. PhilHealth numbers, allergies, and current meds travel with every triage and e-Rx.</p>
      </div>
    </header>

    <section class="split">
      <article class="card">
        <h2>Register patient</h2>
        <div class="grid-2">
          <label class="field"><span>Full name</span><input v-model="form.name" required></label>
          <label class="field"><span>Contact</span><input v-model="form.contact"></label>
          <label class="field"><span>Age</span><input v-model.number="form.age" type="number" min="0"></label>
          <label class="field">
            <span>Sex</span>
            <select v-model="form.sex">
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </label>
          <label class="field"><span>Barangay</span><input v-model="form.barangay"></label>
          <label class="field"><span>PhilHealth</span><input v-model="form.philhealth"></label>
        </div>
        <label class="field" style="margin-top:10px"><span>Allergies (comma-separated)</span><input v-model="form.allergies"></label>
        <label class="field" style="margin-top:10px"><span>Conditions</span><input v-model="form.conditions"></label>
        <label class="field" style="margin-top:10px"><span>Current medicines</span><input v-model="form.meds"></label>
        <label class="field" style="margin-top:10px"><span>Chart notes</span><textarea v-model="form.notes" rows="2" /></label>
        <button class="btn" type="button" style="margin-top:12px" @click="save">Save to registry</button>
      </article>
      <article class="card">
        <h2>Find a record</h2>
        <label class="field"><span>Filter</span><input v-model="filter" placeholder="Name, barangay, PhilHealth, mobile"></label>
        <p class="muted">{{ rows.length }} of {{ patients.length }} records in the city file.</p>
      </article>
    </section>

    <article class="card" style="margin-top:16px">
      <h2>Catchment list</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Age/sex</th><th>Barangay</th><th>PhilHealth</th><th>Allergies</th><th>Conditions</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in rows" :key="p.id">
              <td><NuxtLink class="row-link" :to="`/patients/${p.id}`">{{ p.name }}</NuxtLink></td>
              <td>{{ p.age }}{{ p.sex }}</td>
              <td>{{ p.barangay }}</td>
              <td>{{ p.philhealth }}</td>
              <td>{{ p.allergies.join(', ') || '—' }}</td>
              <td>{{ p.conditions.join(', ') || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
