<script setup lang="ts">
const { facilities, appointments, generateBoard, updateFacility } = usePlatform()

function load(id: string) {
  return appointments.value.filter(a => a.facilityId === id && a.patientName && a.status !== 'cancelled' && a.status !== 'released').length
}

async function openBoard(id: string) {
  generateBoard(id)
  await navigateTo({ path: '/schedule', query: { site: id } })
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <div class="brand-kicker" style="color: var(--leaf)">Service delivery network</div>
        <h1>Facilities</h1>
        <p class="lede">RHUs, barangay stations, Infirmary ER, and the City Health Office. Set walk-in caps and open a full 15-minute board for any site.</p>
      </div>
    </header>

    <section class="grid-3">
      <article class="card" v-for="f in facilities" :key="f.id">
        <div class="stat-label">{{ f.type }} · {{ f.barangay }}</div>
        <h3>{{ f.name }}</h3>
        <p class="muted">{{ f.hours }} · {{ f.phone }}</p>
        <p class="muted">Named visits today: {{ load(f.id) }}</p>
        <div v-if="f.walkInCap > 0" style="margin:10px 0">
          <div class="muted">Walk-in {{ f.walkInUsed }}/{{ f.walkInCap }}</div>
          <div class="meter" :class="{ full: f.walkInUsed >= f.walkInCap, hot: f.walkInUsed / f.walkInCap >= 0.8 }">
            <span :style="{ width: Math.min(100, (f.walkInUsed / f.walkInCap) * 100) + '%' }" />
          </div>
          <label class="field" style="margin-top:10px">
            <span>Walk-in cap</span>
            <input type="number" min="0" :value="f.walkInCap" @change="updateFacility(f.id, { walkInCap: Number(($event.target as HTMLInputElement).value) })">
          </label>
        </div>
        <div class="toolbar">
          <button class="btn" type="button" @click="openBoard(f.id)">Open full day board</button>
          <NuxtLink class="btn secondary" :to="{ path: '/schedule', query: { site: f.id } }">Queue desk</NuxtLink>
        </div>
      </article>
    </section>
  </div>
</template>
