// File: src/views/AdminUploader.vue
<template>
  <div class="w-full flex flex-col justify-center items-center gap-4 bg-white rounded-xl shadow-md mt-10">
    <h2 class="text-2xl font-bold mb-4">Image Uploader</h2>

    <form @submit.prevent="handleUpload" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Domain</label>
        <input v-model="domain" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block mb-1 font-medium">Choose an image</label>
        <input type="file" @change="onFileChange" accept="image/*" class="w-full" required />
      </div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Upload
      </button>
    </form>

    <div v-if="uploadResult" class="mt-4">
      <p class="text-green-600 font-medium">Upload successful!</p>
      <a :href="uploadResult.url" target="_blank" class="text-blue-500 underline">View Image</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const domain = ref('')
const file = ref(null)
const uploadResult = ref(null)

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function handleUpload() {
  if (!file.value) return
  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('domain', domain.value)

  try {
    const response = await axios.post('https://urbanistit.com//api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    uploadResult.value = response.data
  } catch (err) {
    console.error('Upload failed', err)
    alert('Upload failed')
  }
}
</script>

<style scoped>
body {
  background-color: #f9fafb;
}
</style>
