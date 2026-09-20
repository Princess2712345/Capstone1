<script setup lang="ts">
import { LOAD_FILTERS, type LoadFilter } from '~/utils/load'

const load = defineModel<LoadFilter>('load', { required: true })
const site = defineModel<string>('site', { default: 'all' })

const props = defineProps<{
  sites?: { id: string; name: string }[]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const label = computed(() => {
  const band = LOAD_FILTERS.find(f => f.id === load.value)?.label ?? 'All'
  const siteName = props.sites?.find(s => s.id === site.value)?.name
  if (load.value === 'all' && (!site.value || site.value === 'all')) return 'Filter'
  return siteName && site.value !== 'all' ? `Filter · ${band} · ${siteName}` : `Filter · ${band}`
})

function pickLoad(id: LoadFilter) {
  load.value = id
  open.value = false
}

function pickSite(id: string) {
  site.value = id
  open.value = false
}

function onDoc(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="filter-pop">
    <button class="btn secondary" type="button" :aria-expanded="open" @click.stop="open = !open">{{ label }}</button>
    <div v-if="open" class="filter-panel">
      <p class="filter-panel-kicker">Load</p>
      <button
        v-for="f in LOAD_FILTERS"
        :key="f.id"
        class="filter-option"
        type="button"
        :class="{ on: load === f.id }"
        @click="pickLoad(f.id)"
      >
        {{ f.label }}
      </button>
      <template v-if="sites?.length">
        <p class="filter-panel-kicker">Site</p>
        <button class="filter-option" type="button" :class="{ on: site === 'all' }" @click="pickSite('all')">All sites</button>
        <button
          v-for="s in sites"
          :key="s.id"
          class="filter-option"
          type="button"
          :class="{ on: site === s.id }"
          @click="pickSite(s.id)"
        >
          {{ s.name }}
        </button>
      </template>
    </div>
  </div>
</template>
