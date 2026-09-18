<script setup lang="ts">
const {
  appointments,
  patients,
  facilities,
  clock,
  facById,
  docById,
  bookOnline,
  registerWalkIn,
  checkIn,
  startConsult,
  completeVisit,
  cancelAppointment,
  releaseNoShows,
  addWalkInPatient,
  generateBoard
} = usePlatform()

const filterFac = ref('rhu1')
const bookPatient = ref(patients.value[1]?.id ?? '')
const walkName = ref('')
const walkAge = ref(41)
const walkSex = ref<'F' | 'M'>('F')
const walkBarangay = ref('Mailag')
const walkFac = ref('rhu1')
const walkComplaint = ref('hilanat and sakit sa ulo since this morning')
const noteId = ref('')
const note = ref('')

const rows = computed(() =>
  appointments.value
    .filter(a => a.facilityId === filterFac.value)
    .sort((a, b) => a.time.localeCompare(b.time))
)

function bookSelected() {
  const open = rows.value.find(a => !a.patientName && (a.status === 'open' || a.status === 'reserved' || a.status === 'released'))
  const p = patients.value.find(x => x.id === bookPatient.value)
  if (open && p) bookOnline(p, open.id)
}

function walkIn() {
  const p = addWalkInPatient(walkName.value || 'Walk-in patient', walkAge.value, walkBarangay.value, walkSex.value)
  registerWalkIn(p, walkFac.value, walkComplaint.value)
  walkName.value = ''
}

function statusLabel(s: string) {
  return s.replace('-', ' ')
}

function finish(id: string) {
  completeVisit(id, note.value)
  note.value = ''
  noteId.value = ''
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--gold)">Module 2 · Unified scheduling</div>
        <h1>Hybrid online and walk-in queue</h1>
        <p class="lede">
          15-minute windows, walk-in cap, no-show release, consult start/complete, and satellite reroute when a hub saturates.
        </p>
      </div>
      <div class="toolbar">
        <span class="muted">Clock <strong>{{ clock }}</strong></span>
        <button class="btn secondary" type="button" @click="generateBoard(filterFac)">Fill empty windows</button>
      </div>
    </header>

    <section class="grid-3" style="margin-bottom:16px">
      <article class="card">
        <h3>Online / SMS / PWA</h3>
        <div class="field">
          <span>Patient</span>
          <select v-model="bookPatient">
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <p class="muted">Reserves the next open window at the site selected on the board.</p>
        <button class="btn" type="button" @click="bookSelected">Confirm reservation</button>
      </article>
      <article class="card">
        <h3>Walk-in desk</h3>
        <div class="field"><span>Name</span><input v-model="walkName" placeholder="Full name"></div>
        <div class="grid-2">
          <label class="field"><span>Age</span><input type="number" v-model.number="walkAge"></label>
          <label class="field">
            <span>Sex</span>
            <select v-model="walkSex"><option value="F">F</option><option value="M">M</option></select>
          </label>
        </div>
        <label class="field" style="margin-top:8px"><span>Barangay</span><input v-model="walkBarangay"></label>
        <label class="field" style="margin-top:8px"><span>Chief complaint</span><input v-model="walkComplaint"></label>
        <label class="field" style="margin-top:8px">
          <span>Intake site</span>
          <select v-model="walkFac">
            <option v-for="f in facilities.filter(x => x.type !== 'ER' && x.type !== 'CHO')" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <button class="btn gold" type="button" style="margin-top:10px" @click="walkIn">Register and assign slot</button>
      </article>
      <article class="card">
        <h3>Balancing</h3>
        <p class="muted">Online holds that never check in return to the walk-in pool versus the municipal clock.</p>
        <button class="btn secondary" type="button" @click="releaseNoShows">Release no-shows vs clock</button>
        <div style="margin-top:12px">
          <div v-for="f in facilities.filter(x => x.walkInCap > 0)" :key="f.id" class="muted" style="margin-bottom:6px">
            {{ f.name }} {{ f.walkInUsed }}/{{ f.walkInCap }}
            <div class="meter" :class="{ full: f.walkInUsed >= f.walkInCap, hot: f.walkInUsed / f.walkInCap >= 0.8 }">
              <span :style="{ width: Math.min(100, f.walkInUsed / f.walkInCap * 100) + '%' }" />
            </div>
          </div>
        </div>
      </article>
    </section>

    <article class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap">
        <h2 style="margin:0">Today’s 15-minute board</h2>
        <select v-model="filterFac">
          <option v-for="f in facilities.filter(x => x.type !== 'CHO')" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
      </div>
      <div class="slot" v-for="a in rows" :key="a.id">
        <strong>{{ a.time }}</strong>
        <div>
          <div>
            <NuxtLink v-if="a.patientId" class="row-link" :to="`/patients/${a.patientId}`">{{ a.patientName }}</NuxtLink>
            <span v-else>{{ a.patientName || 'Open window' }}</span>
            <span v-if="a.esi" class="badge" :class="'esi-' + a.esi" style="margin-left:6px">ESI {{ a.esi }}</span>
          </div>
          <div class="muted">
            {{ a.channel }} · {{ statusLabel(a.status) }} · {{ a.specialty }}
            · {{ docById(a.doctorId)?.name }}
            · {{ facById(a.facilityId)?.name }}
          </div>
          <div v-if="a.note" class="muted">{{ a.note }}</div>
          <div v-if="noteId === a.id" class="field" style="margin-top:8px">
            <span>Consult note</span>
            <textarea v-model="note" rows="2" />
          </div>
        </div>
        <div class="actions">
          <button v-if="a.patientName && a.status === 'reserved'" class="btn" type="button" @click="checkIn(a.id)">Check in</button>
          <button v-if="a.status === 'checked-in'" class="btn" type="button" @click="startConsult(a.id)">Start consult</button>
          <button v-if="a.status === 'in-consult'" class="btn gold" type="button" @click="noteId = a.id; finish(a.id)">Complete</button>
          <button v-if="a.status === 'checked-in' || a.status === 'reserved'" class="btn secondary" type="button" @click="noteId = a.id">Note</button>
          <button v-if="a.status === 'in-consult' && noteId === a.id" class="btn" type="button" @click="finish(a.id)">Save &amp; complete</button>
          <button v-if="a.status !== 'done' && a.status !== 'cancelled'" class="btn secondary" type="button" @click="cancelAppointment(a.id)">Release</button>
        </div>
      </div>
    </article>
  </div>
</template>
