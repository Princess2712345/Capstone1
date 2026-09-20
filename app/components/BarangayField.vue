<script setup lang="ts">
import { BARANGAYS, homeStationOf } from '~/data/catchment'

const model = defineModel<string>({ required: true })
</script>

<template>
  <label class="field">
    <span>Home barangay</span>
    <select v-model="model" required>
      <option v-for="b in BARANGAYS" :key="b.code" :value="b.name">
        {{ b.name }} · {{ homeStationOf(b.name).station }}
      </option>
    </select>
  </label>
</template>
