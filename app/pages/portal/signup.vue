<script setup lang="ts">
definePageMeta({ layout: 'portal' })

const { addPatient, findPatientForPortal, updatePatient } = usePlatform()
const { signup } = usePatientPortal()

const form = reactive({
  name: '',
  email: '',
  password: '',
  contact: '',
  barangay: 'Poblacion',
  philhealth: '',
  age: 35,
  sex: 'F' as 'F' | 'M'
})
const error = ref('')

async function submit() {
  error.value = ''
  let patient = findPatientForPortal(form.contact, form.philhealth, form.name)
  if (!patient) {
    patient = addPatient({
      name: form.name,
      age: form.age,
      sex: form.sex,
      barangay: form.barangay,
      philhealth: form.philhealth,
      contact: form.contact
    })
  } else {
    updatePatient(patient.id, {
      barangay: form.barangay,
      contact: form.contact,
      philhealth: form.philhealth || patient.philhealth
    })
  }
  error.value = signup({
    patientId: patient.id,
    name: form.name,
    email: form.email,
    password: form.password,
    contact: form.contact,
    barangay: patient.barangay,
    residentId: patient.residentId,
    homeFacilityId: patient.homeFacilityId,
    philhealth: form.philhealth,
    age: form.age,
    sex: form.sex
  }) ?? ''
  if (!error.value) await navigateTo('/portal')
}
</script>

<template>
  <div class="desk">
    <header class="desk-head">
      <p class="lp-eyebrow">Patient portal</p>
      <h1>Create a resident account.</h1>
      <p class="lp-lede">Pick your barangay. The City Health Office issues a resident number and maps you to your home RHU or BHS.</p>
    </header>
    <form class="desk-panel desk-auth" @submit.prevent="submit">
      <h2>Sign up</h2>
      <div class="form-grid form-grid-2">
        <label class="field"><span>Full name</span><input v-model="form.name" required></label>
        <label class="field"><span>Mobile</span><input v-model="form.contact" required placeholder="09xx"></label>
        <label class="field field-span"><span>Email</span><input v-model="form.email" type="email" required></label>
        <label class="field field-span"><span>Password</span><input v-model="form.password" type="password" minlength="6" required></label>
        <label class="field"><span>Age</span><input v-model.number="form.age" type="number" min="0" required></label>
        <label class="field">
          <span>Sex</span>
          <select v-model="form.sex">
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
        </label>
        <BarangayField v-model="form.barangay" />
        <label class="field"><span>PhilHealth (optional)</span><input v-model="form.philhealth"></label>
      </div>
      <p class="muted" style="margin-top:12px">
        Mailag residents are tagged <code>VLC-MLG</code> and home-stationed at BHS Mailag. Poblacion uses <code>VLC-POB</code> and RHU 1.
      </p>
      <p v-if="error" class="field-error">{{ error }}</p>
      <button class="btn" type="submit" style="margin-top:16px; width:100%">Create account</button>
      <p class="muted" style="margin-top:14px">
        Already registered? <NuxtLink to="/portal/login" class="row-link">Log in</NuxtLink>
      </p>
    </form>
  </div>
</template>
