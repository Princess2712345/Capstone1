<script setup lang="ts">
const {
  patients,
  doctors,
  prescriptions,
  facilities,
  drugs,
  createRx,
  fulfill,
  redeemVoucher,
  voidRx,
  patientById,
  docById,
  facById,
  drugById,
  vouchers
} = usePlatform()

const rxPatient = ref(patients.value[0]?.id ?? '')
const rxDoctor = ref(doctors.value.find(d => d.specialty === 'General Practice')?.id ?? '')
const selectedDrugs = ref<string[]>(['metformin'])
const qty = ref(30)
const sig = ref('1 tab as directed after meals')
const scan = ref('RX-VLC-7K2M')
const scanFac = ref('rhu1')
const voucherCode = ref('VCH-VLC-10OF30')
const voucherFac = ref('rhu2')
const lastSigned = ref<(typeof prescriptions.value)[0] | null>(null)

function toggleDrug(id: string) {
  if (selectedDrugs.value.includes(id)) selectedDrugs.value = selectedDrugs.value.filter(x => x !== id)
  else selectedDrugs.value = [...selectedDrugs.value, id]
}

function sign() {
  const p = patients.value.find(x => x.id === rxPatient.value)
  const d = doctors.value.find(x => x.id === rxDoctor.value)
  if (!p || !d || !selectedDrugs.value.length) return
  lastSigned.value = createRx(p, d, selectedDrugs.value, qty.value, sig.value)
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--gold)">Module 3 · Clinical e-Rx</div>
        <h1>Konsulta prescribing &amp; QR dispensing</h1>
        <p class="lede">
          If this window can only release part of a Konsulta script — for example 10 of 30 tablets — FEFO posts that fill and mints a single-use transfer voucher for the balance at an adjacent RHU or BHS.
        </p>
      </div>
    </header>

    <section class="split">
      <article class="card">
        <h2>Issue e-prescription</h2>
        <div class="grid-2">
          <label class="field">
            <span>Patient</span>
            <select v-model="rxPatient">
              <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </label>
          <label class="field">
            <span>Prescriber</span>
            <select v-model="rxDoctor">
              <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.name }} · {{ d.specialty }}</option>
            </select>
          </label>
          <label class="field"><span>Quantity</span><input v-model.number="qty" type="number" min="1"></label>
          <label class="field"><span>Directions</span><input v-model="sig"></label>
        </div>
        <p class="muted">
          {{ patientById(rxPatient)?.conditions.join(', ') || 'No listed conditions' }} · current meds
          {{ patientById(rxPatient)?.meds.join(', ') || 'none' }} · allergies
          {{ patientById(rxPatient)?.allergies.join(', ') || 'none' }}
        </p>
        <div class="chips">
          <button
            v-for="d in drugs"
            :key="d.id"
            type="button"
            class="chip"
            :style="selectedDrugs.includes(d.id) ? 'border-color: var(--leaf); background:#e7f0ea' : ''"
            @click="toggleDrug(d.id)"
          >
            {{ d.generic }} · {{ d.konsultaCode }}
          </button>
        </div>
        <div class="toolbar" style="margin-top:14px">
          <button class="btn" type="button" @click="sign">Sign &amp; mint QR</button>
          <NuxtLink class="btn secondary" :to="`/patients/${rxPatient}`">Open chart</NuxtLink>
        </div>
      </article>

      <article class="card" v-if="lastSigned">
        <h2>Signed artifact</h2>
        <div style="display:flex; gap:16px; align-items:flex-start">
          <div>
            <div class="qr" aria-hidden="true" />
            <div class="muted" style="margin-top:6px">{{ lastSigned.qr }}</div>
          </div>
          <div>
            <p><strong>{{ patientById(lastSigned.patientId)?.name }}</strong></p>
            <p class="muted">Digitally signed {{ docById(lastSigned.doctorId)?.name }} · PRC {{ docById(lastSigned.doctorId)?.prc }}</p>
            <ul>
              <li v-for="item in lastSigned.items" :key="item.drugId">
                {{ drugById(item.drugId)?.generic }} × {{ item.qty }} · {{ item.sig }}
              </li>
            </ul>
            <p v-for="al in lastSigned.alerts" :key="al" class="flash alert">{{ al }}</p>
          </div>
        </div>
      </article>
      <article class="card" v-else>
        <h2>Signed artifact</h2>
        <p class="muted">A single-use QR is minted after signature. Duplicate scans after full fill are rejected. Void unused scripts from the ledger.</p>
      </article>
    </section>

    <section class="split" style="margin-top:16px">
      <article class="card">
        <h2>RHU / BHS QR window</h2>
        <label class="field">
          <span>Scan or type QR</span>
          <input v-model="scan">
        </label>
        <label class="field">
          <span>Dispensing site</span>
          <select v-model="scanFac">
            <option v-for="f in facilities.filter(x => x.type !== 'ER' && x.type !== 'CHO')" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <p class="muted">RHU 1 Metformin on-hand is short of a 30-tablet fill — scan RX-VLC-7K2M here to mint a voucher for the balance.</p>
        <button class="btn" type="button" @click="fulfill(scan, scanFac)">Verify batch &amp; release</button>
      </article>
      <article class="card">
        <h2>Redeem transfer voucher</h2>
        <p class="muted">Patient brings the remaining quantity to the named adjacent site. Demo: Tomas Lumbo still needs 20 of 30 Salbutamol at RHU 2 — code VCH-VLC-10OF30.</p>
        <label class="field">
          <span>Voucher code</span>
          <input v-model="voucherCode">
        </label>
        <label class="field">
          <span>Redeeming site</span>
          <select v-model="voucherFac">
            <option v-for="f in facilities.filter(x => x.type !== 'ER' && x.type !== 'CHO')" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <button class="btn gold" type="button" @click="redeemVoucher(voucherCode, voucherFac)">Release remaining tablets</button>
      </article>
    </section>

    <article class="card" style="margin-top:16px">
      <h2>Open transfer vouchers</h2>
      <p v-if="!vouchers.length" class="empty">No vouchers minted yet.</p>
      <table v-else>
        <thead>
          <tr><th>Code</th><th>Patient</th><th>Balance</th><th>From → to</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="v in vouchers" :key="v.id">
            <td><button class="chip" type="button" @click="voucherCode = v.code; voucherFac = v.toFacilityId">{{ v.code }}</button></td>
            <td>{{ patientById(v.patientId)?.name }}</td>
            <td>{{ v.remaining }} {{ drugById(v.drugId)?.generic }}</td>
            <td>{{ facById(v.fromFacilityId)?.name }} → {{ facById(v.toFacilityId)?.name }}</td>
            <td>{{ v.status }}</td>
          </tr>
        </tbody>
      </table>
    </article>

    <article class="card" style="margin-top:16px">
      <h2>Live prescription ledger</h2>
        <table>
          <thead>
            <tr><th>QR</th><th>Patient</th><th>Status</th><th>Fill</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="rx in prescriptions" :key="rx.id">
              <td>
                <button class="chip" type="button" @click="scan = rx.qr">{{ rx.qr }}</button>
              </td>
              <td>
                <NuxtLink class="row-link" :to="`/patients/${rx.patientId}`">{{ patientById(rx.patientId)?.name }}</NuxtLink>
              </td>
              <td>{{ rx.status }}<div v-if="rx.voucherCode" class="muted">{{ rx.voucherCode }} → {{ facById(rx.voucherTo)?.name }}</div></td>
              <td>
                <div v-for="item in rx.items" :key="item.drugId" class="muted">
                  {{ drugById(item.drugId)?.generic }} {{ item.dispensed }}/{{ item.qty }}
                </div>
              </td>
              <td>
                <button
                  v-if="rx.status !== 'dispensed' && rx.status !== 'voided'"
                  class="btn secondary"
                  type="button"
                  @click="voidRx(rx.id)"
                >Void</button>
              </td>
            </tr>
          </tbody>
        </table>
    </article>
  </div>
</template>
