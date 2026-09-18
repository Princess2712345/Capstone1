<script setup lang="ts">
const {
  batches,
  drugs,
  facilities,
  forecasts,
  requisitions,
  transfers,
  facById,
  drugById,
  stockOnHand,
  tier,
  recommendTransfers,
  executeTransfer,
  draftRequisition,
  submitRequisition,
  receiveRequisition,
  receiveStock
} = usePlatform()

const recs = computed(() => recommendTransfers())
const receive = reactive({
  drugId: 'paracetamol',
  facilityId: 'rhu1',
  lot: '',
  expiry: '2027-12-31',
  qty: 50
})

const grouped = computed(() =>
  drugs.value.map(d => ({
    drug: d,
    total: stockOnHand(d.id),
    tier: tier(stockOnHand(d.id))
  }))
)
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--gold)">Module 3 · Supply chain</div>
        <h1>FEFO inventory &amp; LGU forecasting</h1>
        <p class="lede">
          Earliest-expiry lots leave first. Critical / moderate / optimal thresholds fire per site.
          Peer transfers rebalance RHU hubs and BHS, then seasonal demand drafts a City Health purchase requisition.
        </p>
      </div>
    </header>

    <section class="grid-3" style="margin-bottom:16px">
      <article class="card" v-for="row in grouped.slice(0, 3)" :key="row.drug.id">
        <div class="stat-label">{{ row.drug.generic }}</div>
        <div class="stat-value">{{ row.total }}</div>
        <p :class="'stock-' + row.tier.toLowerCase()">{{ row.tier }} network position</p>
      </article>
    </section>

    <article class="card">
      <h2>Multi-facility on-hand (FEFO lots)</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lot</th>
              <th>Item</th>
              <th>Site</th>
              <th>Qty</th>
              <th>Expiry</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in [...batches].sort((a,c) => a.expiry.localeCompare(c.expiry))" :key="b.id">
              <td>{{ b.lot }}</td>
              <td>{{ drugById(b.drugId)?.generic }}</td>
              <td>{{ facById(b.facilityId)?.name }}</td>
              <td>{{ b.qty }}</td>
              <td>{{ b.expiry }}</td>
              <td :class="'stock-' + tier(b.qty).toLowerCase()">{{ tier(b.qty) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <section class="split" style="margin-top:16px">
      <article class="card">
        <h2>Inter-RHU / BHS rebalancing</h2>
        <p class="muted">Recommendations use localized on-hand versus peer surplus — not a blind equal split.</p>
        <div v-if="!recs.length" class="muted">No material imbalance after the last transfer.</div>
        <div v-for="r in recs" :key="r.id" class="slot">
          <strong>{{ r.qty }}</strong>
          <div>
            {{ r.drug }}
            <div class="muted">{{ facById(r.fromId)?.name }} → {{ facById(r.toId)?.name }} · {{ r.reason }}</div>
          </div>
          <button class="btn secondary" type="button" @click="executeTransfer(r)">Execute FEFO move</button>
        </div>
        <div v-if="transfers.length" style="margin-top:16px">
          <h3>Posted transfers</h3>
          <p v-for="t in transfers" :key="t.id" class="muted">
            {{ t.qty }} {{ t.drug }} · {{ facById(t.fromId)?.name }} → {{ facById(t.toId)?.name }}
          </p>
        </div>
      </article>
      <article class="card">
        <h2>Seasonal demand (Valencia epi)</h2>
        <table>
          <thead>
            <tr><th>Item</th><th>Season</th><th>History</th><th>Projected</th></tr>
          </thead>
          <tbody>
            <tr v-for="f in forecasts" :key="f.drug">
              <td>{{ f.drug }}<div class="muted">{{ f.driver }}</div></td>
              <td>{{ f.season }}</td>
              <td>{{ f.historical }}</td>
              <td>{{ f.projected }}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn" type="button" style="margin-top:12px" @click="draftRequisition">Draft LGU purchase requisition</button>
      </article>
    </section>

    <article class="card" style="margin-top:16px">
      <h2>Receive goods</h2>
      <div class="grid-2">
        <label class="field">
          <span>Item</span>
          <select v-model="receive.drugId">
            <option v-for="d in drugs" :key="d.id" :value="d.id">{{ d.generic }}</option>
          </select>
        </label>
        <label class="field">
          <span>Site</span>
          <select v-model="receive.facilityId">
            <option v-for="f in facilities.filter(x => x.type !== 'CHO')" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <label class="field"><span>Lot</span><input v-model="receive.lot"></label>
        <label class="field"><span>Expiry</span><input v-model="receive.expiry" type="date"></label>
        <label class="field"><span>Quantity</span><input v-model.number="receive.qty" type="number" min="1"></label>
      </div>
      <button class="btn" type="button" style="margin-top:12px" @click="receiveStock(receive.drugId, receive.facilityId, receive.lot, receive.expiry, receive.qty)">Post receipt</button>
    </article>

    <article class="card" style="margin-top:16px" v-if="requisitions.length">
      <h2>CHO procurement drafts</h2>
      <div v-for="req in requisitions" :key="req.id" style="margin-bottom:18px">
        <p>
          <strong>{{ req.id }}</strong> · {{ req.createdAt }} · {{ req.status }}
          <button
            v-if="req.status === 'draft'"
            class="btn gold"
            type="button"
            style="margin-left:8px"
            @click="submitRequisition(req.id)"
          >Submit to BAC / CHO</button>
          <button
            v-if="req.status === 'submitted'"
            class="btn"
            type="button"
            style="margin-left:8px"
            @click="receiveRequisition(req.id)"
          >Receive into RHU 1</button>
        </p>
        <table>
          <thead><tr><th>Line</th><th>Qty</th><th>Justification</th></tr></thead>
          <tbody>
            <tr v-for="line in req.lines" :key="line.drug">
              <td>{{ line.drug }}</td>
              <td>{{ line.qty }}</td>
              <td>{{ line.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </div>
</template>
