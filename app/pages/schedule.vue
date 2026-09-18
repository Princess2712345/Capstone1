<script setup lang="ts">
const {
  appointments,
  patients,
  facilities,
  flash,
  clock,
  facById,
  docById,
  bookOnline,
  registerWalkIn,
  checkIn,
  releaseNoShows,
  addWalkInPatient,
} = usePlatform()

const filterFac = ref('rhu1')
const bookPatient = ref(patients.value[1]?.id ?? '')
const walkName = ref('BHW intake: Elena Mailag')
const walkAge = ref(41)
const walkBarangay = ref('Mailag')
const walkFac = ref('rhu1')
const walkComplaint = ref('hilanat and sakit sa ulo since this morning')

const rows = computed(() =>
  appointments.value
    .filter(a => a.facilityId === filterFac.value)
    .sort((a, b) => a.time.localeCompare(b.time))
)

function bookSelected() {
  const open = rows.value.find(a => !a.patientName && a.status === 'reserved')
  const p = patients.value.find(x => x.id === bookPatient.value)
  if (open && p) bookOnline(p, open.id)
}

function walkIn() {
  const p = addWalkInPatient(walkName.value, walkAge.value, walkBarangay.value)
  registerWalkIn(p, walkFac.value, walkComplaint.value)
}

function statusLabel(s: string) {
  return s.replace('-', ' ')
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--gold)">Module 2 · Unified scheduling</div>
        <h1>Hybrid online and walk-in queue</h1>
        <p class="lede">
          Fixed 15-minute windows, a walk-in buffer with a hard cap, no-show release, ESI override,
          and satellite reroute when RHU 1 saturates.
        </p>
      </div>
      <div class="muted">Simulated clock <strong>{{ clock }}</strong></div>
    </header>

    <div v-if="flash" class="flash">{{ flash }}</div>

    <section class="grid-3" style="margin-bottom:16px">
      <article class="card">
        <h3>Online / SMS / PWA</h3>
        <div class="field">
          <span>Patient</span>
          <select v-model="bookPatient">
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <p class="muted">Reserves the next open window. Confirmation tells the patient to check in 5–10 minutes early.</p>
        <button class="btn" type="button" @click="bookSelected">Confirm reservation</button>
      </article>
      <article class="card">
        <h3>Walk-in desk (BHW / receptionist)</h3>
        <div class="field"><span>Name</span><input v-model="walkName"></div>
        <div class="grid-2">
          <label class="field"><span>Age</span><input type="number" v-model.number="walkAge"></label>
          <label class="field"><span>Barangay</span><input v-model="walkBarangay"></label>
        </div>
        <label class="field" style="margin-top:8px">
          <span>Chief complaint</span>
          <input v-model="walkComplaint">
        </label>
        <label class="field" style="margin-top:8px">
          <span>Intake site</span>
          <select v-model="walkFac">
            <option v-for="f in facilities.filter(x => x.type !== 'ER')" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <button class="btn gold" type="button" style="margin-top:10px" @click="walkIn">Assign earliest buffer slot</button>
      </article>
      <article class="card">
        <h3>Balancing actions</h3>
        <p class="muted">Online holds that never check in are released into the walk-in pool. Try RHU 1 when the bar is red.</p>
        <div style="display:flex; flex-direction:column; gap:8px">
          <button class="btn secondary" type="button" @click="releaseNoShows">Release no-shows vs clock</button>
          <p class="muted">If walk-in cap is hit, the desk shows RHU 2 / BHS Mailag / tomorrow 08:00 priority.</p>
        </div>
        <div style="margin-top:12px">
          <div v-for="f in facilities.filter(x => x.type !== 'ER')" :key="f.id" class="muted" style="margin-bottom:6px">
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
          <option v-for="f in facilities" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
      </div>
      <div class="slot" v-for="a in rows" :key="a.id">
        <strong>{{ a.time }}</strong>
        <div>
          <div>
            {{ a.patientName || 'Open window' }}
            <span v-if="a.esi" class="badge" :class="'esi-' + a.esi" style="margin-left:6px">ESI {{ a.esi }}</span>
          </div>
          <div class="muted">
            {{ a.channel }} · {{ statusLabel(a.status) }} · {{ a.specialty }}
            · {{ docById(a.doctorId)?.name }}
            · {{ facById(a.facilityId)?.name }}
          </div>
          <div v-if="a.labs?.length" class="chips" style="margin-top:6px">
            <span v-for="lab in a.labs" :key="lab" class="chip">{{ lab }}</span>
          </div>
        </div>
        <div style="display:flex; gap:6px">
          <button
            v-if="a.patientName && a.status === 'reserved'"
            class="btn"
            type="button"
            @click="checkIn(a.id)"
          >Check in</button>
          <span v-else class="muted">{{ a.patientName ? statusLabel(a.status) : 'buffer' }}</span>
        </div>
      </div>
    </article>
  </div>
</template>
