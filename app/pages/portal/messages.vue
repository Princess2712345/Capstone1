<script setup lang="ts">
definePageMeta({ layout: 'portal' })
const note = ref('')
const sent = ref('')
function send() {
  sent.value = note.value ? `Queued SMS to your care team: “${note.value}”.` : 'Write a short update first.'
  note.value = ''
}
</script>
<template>
  <div>
    <h2>Messages / SMS</h2>
    <p class="vc-lede">Short updates only — not for emergencies.</p>
    <article class="pt-card" style="margin-top:16px">
      <label class="field"><span>Message</span><textarea v-model="note" rows="4" placeholder="Running 10 minutes late…" /></label>
      <p v-if="sent" class="muted" style="margin-top:10px">{{ sent }}</p>
      <button class="btn" type="button" style="margin-top:14px" @click="send">Send SMS update</button>
    </article>
  </div>
</template>
