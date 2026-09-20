<script setup lang="ts">
import type { StaffRole } from '~/composables/useAuth'

const { accounts, registerStaff, session } = useAuth()
const error = ref('')
const form = reactive({
  name: '',
  email: '',
  password: 'careops',
  role: 'RHU clinician' as StaffRole,
  facility: 'Valencia RHU 1'
})

const roles: StaffRole[] = ['CHO officer', 'RHU clinician', 'BHW', 'Pharmacist']
const sites = [
  'City Health Office',
  'Valencia RHU 1',
  'Valencia RHU 2',
  'BHS Mailag',
  'BHS Lumbayao',
  'BHS San Carlos',
  'City Infirmary ER'
]

function add() {
  error.value = registerStaff({ ...form }) ?? ''
  if (!error.value) {
    form.name = ''
    form.email = ''
  }
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Access control</div>
        <h1>Staff directory</h1>
        <p class="lede">City Health, RHU, BHW, and dispensing-window accounts that can sign in to this operations file. You are signed in as {{ session?.email }}.</p>
      </div>
    </header>

    <section class="split">
      <article class="card">
        <h2>Create staff account</h2>
        <label class="field"><span>Full name</span><input v-model="form.name"></label>
        <label class="field" style="margin-top:10px"><span>Work email</span><input v-model="form.email" type="email"></label>
        <label class="field" style="margin-top:10px"><span>Temporary password</span><input v-model="form.password"></label>
        <div class="grid-2" style="margin-top:10px">
          <label class="field">
            <span>Role</span>
            <select v-model="form.role">
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </label>
          <label class="field">
            <span>Home facility</span>
            <select v-model="form.facility">
              <option v-for="s in sites" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
        </div>
        <p v-if="error" class="field-error">{{ error }}</p>
        <button class="btn" type="button" style="margin-top:12px" @click="add">Add account</button>
      </article>
      <article class="card">
        <h2>Directory</h2>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Facility</th></tr></thead>
          <tbody>
            <tr v-for="a in accounts" :key="a.email">
              <td>{{ a.name }}</td>
              <td>{{ a.email }}</td>
              <td>{{ a.role }}</td>
              <td>{{ a.facility }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </div>
</template>
