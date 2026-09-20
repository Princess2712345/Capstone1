<script setup lang="ts">
import type { Doctor } from '~/utils/types'

const { doctors, facilities, addDoctor, updateDoctor } = usePlatform()

const form = reactive({
  name: '',
  specialty: 'General Practice',
  facilityId: 'rhu1',
  role: 'visiting' as Doctor['role'],
  dailyCap: 12,
  prc: '',
  contact: ''
})
const notice = ref('')

function save() {
  if (!form.name.trim() || !form.prc.trim()) {
    notice.value = 'Name and PRC number are required.'
    return
  }
  notice.value = ''
  addDoctor({ ...form, name: form.name.trim() })
  form.name = ''
  form.prc = ''
  form.contact = ''
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Clinical network</div>
        <h1>Clinician roster</h1>
        <p class="lede">Full-time, visiting, on-call, and telehealth seats. Daily caps drive overflow from specialty clinics to GP desks.</p>
      </div>
    </header>

    <section class="split">
      <article class="card">
        <h2>Add consultant</h2>
        <div class="grid-2">
          <label class="field"><span>Name</span><input v-model="form.name"></label>
          <label class="field"><span>PRC</span><input v-model="form.prc"></label>
          <label class="field"><span>Specialty</span><input v-model="form.specialty"></label>
          <label class="field"><span>Contact</span><input v-model="form.contact"></label>
          <label class="field">
            <span>Home facility</span>
            <select v-model="form.facilityId">
              <option v-for="f in facilities" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </label>
          <label class="field">
            <span>Role</span>
            <select v-model="form.role">
              <option value="full-time">full-time</option>
              <option value="visiting">visiting</option>
              <option value="on-call">on-call</option>
              <option value="telehealth">telehealth</option>
            </select>
          </label>
          <label class="field"><span>Daily cap</span><input v-model.number="form.dailyCap" type="number" min="1"></label>
        </div>
        <p v-if="notice" class="field-error">{{ notice }}</p>
        <button class="btn" type="button" style="margin-top:12px" @click="save">Add to matrix</button>
      </article>
      <article class="card">
        <h2>Load vs cap</h2>
        <div v-for="d in doctors" :key="d.id" style="margin-bottom:10px">
          <div style="display:flex; justify-content:space-between; font-size:13px">
            <strong>{{ d.name }}</strong>
            <span class="muted">{{ d.todayLoad }}/{{ d.dailyCap }}</span>
          </div>
          <div class="meter" :class="{ hot: d.todayLoad / d.dailyCap >= 0.85, full: d.todayLoad >= d.dailyCap }">
            <span :style="{ width: Math.min(100, (d.todayLoad / d.dailyCap) * 100) + '%' }" />
          </div>
        </div>
      </article>
    </section>

    <article class="card" style="margin-top:16px">
      <h2>City-wide matrix</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Clinician</th><th>Specialty</th><th>Role</th><th>Site</th><th>Cap</th><th>PRC</th></tr>
          </thead>
          <tbody>
            <tr v-for="d in doctors" :key="d.id">
              <td>{{ d.name }}<div class="muted">{{ d.contact }}</div></td>
              <td>{{ d.specialty }}</td>
              <td>{{ d.role }}</td>
              <td>{{ facilities.find(f => f.id === d.facilityId)?.name }}</td>
              <td>
                <input type="number" min="1" style="width:72px" :value="d.dailyCap" @change="updateDoctor(d.id, { dailyCap: Number(($event.target as HTMLInputElement).value) })">
              </td>
              <td>{{ d.prc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
