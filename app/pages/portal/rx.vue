<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { prescriptions, patients, drugById, docById, facById, findPatientForPortal, vouchers } = usePlatform()
const { identity, remember } = usePatientPortal()

const qr = ref('RX-VLC-7K2M')
const lookup = reactive({ contact: '', philhealth: '' })
const notice = ref('')

const patient = computed(() => {
  const id = identity.value
  if (!id) return null
  return patients.value.find(p => p.id === id.patientId)
    || findPatientForPortal(id.contact, '', id.name)
    || null
})

const mine = computed(() => {
  const id = patient.value?.id
  if (!id) return []
  return prescriptions.value.filter(r => r.patientId === id && r.status !== 'voided')
})

const scanned = computed(() => {
  const code = qr.value.trim().toUpperCase()
  if (!code) return null
  return prescriptions.value.find(r => r.qr.toUpperCase() === code && r.status !== 'voided') ?? null
})

const shownVouchers = computed(() => {
  if (!shown.value) return []
  return vouchers.value.filter(v => v.prescriptionId === shown.value?.id)
})

function findRecord() {
  notice.value = ''
  const found = findPatientForPortal(lookup.contact, lookup.philhealth, '')
  if (!found) {
    notice.value = 'No patient file matches that mobile or PhilHealth number.'
    return
  }
  remember(found.id, found.name, found.contact)
}
</script>

<template>
  <div class="band" style="padding-top:32px">
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Pharmacy window</div>
        <h1>e-Prescription QR</h1>
        <p class="lede">Show this code at RHU or BHS pharmacy. One scan fills from the earliest-expiry lot. Fully used codes cannot be scanned again.</p>
      </div>
    </header>

    <section class="split">
      <article class="card">
        <h2>Open my scripts</h2>
        <p v-if="patient" class="muted">{{ patient.name }}</p>
        <div v-else class="grid-2">
          <label class="field"><span>Mobile</span><input v-model="lookup.contact"></label>
          <label class="field"><span>PhilHealth</span><input v-model="lookup.philhealth"></label>
        </div>
        <button v-if="!patient" class="btn" type="button" style="margin-top:12px" @click="findRecord">Find my e-Rx</button>
        <p v-if="notice" class="field-error">{{ notice }}</p>
        <label class="field" style="margin-top:14px">
          <span>Or type the QR code from the clinician</span>
          <input v-model="qr" placeholder="RX-VLC-7K2M">
        </label>
        <p class="muted">Demo fill: Rosa’s code RX-VLC-7K2M</p>
      </article>

      <article class="card" v-if="shown">
        <h2>{{ shown.qr }}</h2>
        <div style="display:flex; gap:16px; align-items:flex-start; flex-wrap:wrap">
          <div>
            <div class="qr" aria-hidden="true" />
            <div class="muted" style="margin-top:6px">{{ shown.status }}</div>
          </div>
          <div>
            <p><strong>{{ patients.find(p => p.id === shown.patientId)?.name }}</strong></p>
            <p class="muted">Signed {{ docById(shown.doctorId)?.name }} · {{ shown.issuedAt }}</p>
            <ul>
              <li v-for="item in shown.items" :key="item.drugId">
                {{ drugById(item.drugId)?.generic }} · {{ item.dispensed }}/{{ item.qty }} · {{ item.sig }}
              </li>
            </ul>
            <p v-if="shown.status === 'dispensed'" class="muted">This QR is closed after a full fill.</p>
            <div v-for="v in shownVouchers" :key="v.id" class="flash" style="margin-top:12px">
              <strong>{{ v.code }}</strong>
              · remaining {{ v.remaining }} {{ drugById(v.drugId)?.generic }}
              · redeem at {{ facById(v.toFacilityId)?.name }}
              · {{ v.status }}
            </div>
          </div>
        </div>
      </article>
      <article class="card" v-else>
        <h2>No script on screen</h2>
        <p class="muted">Book a visit and wait for the clinician to sign, or enter a QR code you were given at the desk.</p>
      </article>
    </section>

    <article class="card" style="margin-top:16px" v-if="mine.length">
      <h2>Ledger</h2>
      <table>
        <thead><tr><th>QR</th><th>Status</th><th>Items</th></tr></thead>
        <tbody>
          <tr v-for="r in mine" :key="r.id">
            <td><button class="chip" type="button" @click="qr = r.qr">{{ r.qr }}</button></td>
            <td>{{ r.status }}</td>
            <td class="muted">{{ r.items.map(i => drugById(i.drugId)?.generic).join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </div>
</template>
