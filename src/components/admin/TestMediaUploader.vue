<template>
    <div class="container mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Media Manager Test</h1>
  
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">1. Select Files</h2>
        <input 
          type="file" 
          multiple 
          @change="handleFileChange" 
          class="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100 cursor-pointer"
        />
        <p v-if="selectedFiles.length" class="mt-3 text-sm text-gray-600">
          Selected: <span class="font-medium">{{ selectedFiles.length }}</span> files
        </p>
        <p v-else class="mt-3 text-sm text-gray-600">No files selected.</p>
      </div>

      <!-- File Configuration Section -->
      <div v-if="selectedFiles.length > 0" class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">2. Configure Files</h2>
        <div class="space-y-4">
          <div 
            v-for="(file, index) in selectedFiles" 
            :key="file.name + file.size" 
            class="border rounded-lg p-4 bg-gray-50"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-800">{{ file.name }}</h3>
              <span class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Section Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <div class="flex gap-2">
                  <select 
                    v-model="fileConfigs[index].sectionType" 
                    @change="updateSection(index)"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Section</option>
                    <option v-for="option in sectionOptions" :key="option" :value="option">
                      {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                    </option>
                    <option value="custom">Custom</option>
                  </select>
                  <input 
                    v-if="fileConfigs[index].sectionType === 'custom'"
                    v-model="fileConfigs[index].section"
                    type="text"
                    placeholder="Enter custom section"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Sub-Section Selection (conditional) -->
              <div v-if="hasSubOptions(fileConfigs[index].sectionType)">
                <label class="block text-sm font-medium text-gray-700 mb-2">Sub-Section</label>
                <div class="flex gap-2">
                  <select 
                    v-model="fileConfigs[index].subSectionType" 
                    @change="updateSubSection(index)"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Sub-Section</option>
                    <option v-for="option in getSubOptions(fileConfigs[index].sectionType)" :key="option" :value="option">
                      {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                    </option>
                    <option value="custom">Custom</option>
                  </select>
                  <input 
                    v-if="fileConfigs[index].subSectionType === 'custom'"
                    v-model="fileConfigs[index].subSection"
                    type="text"
                    placeholder="Enter custom sub-section"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Role Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div class="flex gap-2">
                  <select 
                    v-model="fileConfigs[index].roleType" 
                    @change="updateRole(index)"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option v-for="option in roleOptions" :key="option" :value="option">
                      {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                    </option>
                    <option value="custom">Custom</option>
                  </select>
                  <input 
                    v-if="fileConfigs[index].roleType === 'custom'"
                    v-model="fileConfigs[index].role"
                    type="text"
                    placeholder="Enter custom role"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">3. Manage Operations</h2>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="uploadFiles" 
            :disabled="selectedFiles.length === 0 || isUploading || isDeleting || !isConfigurationValid"
            class="px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {{ isUploading ? 'Uploading...' : 'Upload Selected Files' }}
          </button>
          <button 
            @click="deleteAllFiles" 
            :disabled="fileStatuses.length === 0 || isUploading || isDeleting"
            class="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete All Tracked Files' }}
          </button>
        </div>
        <p v-if="!isConfigurationValid && selectedFiles.length > 0" class="mt-2 text-sm text-red-600">
          Please configure section and role for all files before uploading. Sub-section is optional.
        </p>
      </div>
  
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">4. File Statuses</h2>
        <div v-if="fileStatuses.length === 0" class="text-gray-500 text-center py-4">
          No files currently being tracked.
        </div>
        <ul v-else class="space-y-4">
          <li 
            v-for="fileStatus in fileStatuses" 
            :key="fileStatus.file.name + fileStatus.file.size" 
            class="flex items-center p-4 rounded-md border"
            :class="{
              'border-blue-300 bg-blue-50': fileStatus.status === 'uploading' || fileStatus.status === 'deleting',
              'border-green-300 bg-green-50': fileStatus.status === 'success',
              'border-red-300 bg-red-50': fileStatus.status === 'error',
              'border-gray-300 bg-gray-50': fileStatus.status === 'pending',
            }"
          >
            <div class="flex-grow">
              <p class="font-medium text-gray-800 break-words">{{ fileStatus.file.name }}</p>
              <p v-if="fileStatus.section || fileStatus.role" class="text-sm text-gray-600">
                Section: <span class="font-medium">{{ fileStatus.section || 'N/A' }}</span> | 
                Sub-Section: <span class="font-medium">{{ fileStatus.subSection || 'N/A' }}</span> | 
                Role: <span class="font-medium">{{ fileStatus.role || 'N/A' }}</span>
              </p>
              <p class="text-sm" :class="{
                'text-blue-600': fileStatus.status === 'uploading' || fileStatus.status === 'deleting',
                'text-green-600': fileStatus.status === 'success',
                'text-red-600': fileStatus.status === 'error',
                'text-gray-600': fileStatus.status === 'pending',
              }">
                Status: <span class="font-bold">{{ fileStatus.status }}</span>
                <span v-if="fileStatus.progress > 0 && fileStatus.progress < 100"> ({{ fileStatus.progress }}%)</span>
              </p>
              <p v-if="fileStatus.url" class="text-xs text-blue-500 break-all">
                URL: <a :href="fileStatus.url" target="_blank" rel="noopener noreferrer">{{ fileStatus.url }}</a>
              </p>
              <p v-if="fileStatus.error" class="text-xs text-red-700">
                Error: {{ fileStatus.error }} <span v-if="fileStatus.errorCode">({{ fileStatus.errorCode }})</span>
              </p>
            </div>
            <!-- Optional: Individual delete button for each file -->
            <button 
              v-if="fileStatus.status === 'success'"
              @click="deleteIndividualFile(fileStatus.file)"
              class="ml-4 px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useFileUploadManager } from '@/composables/useMediaManager'; // Adjust path as needed
  
  // Initialize the file upload manager composable
  const { fileStatuses, validateFile, uploadGeneralFiles, deleteGeneralFiles } = useFileUploadManager(['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'gif']);
  
  // Reactive state for selected files from the input
  const selectedFiles = ref([]);
  
  // Reactive state for file configurations
  const fileConfigs = ref([]);
  
  // Reactive state for tracking overall upload/delete operations
  const isUploading = ref(false);
  const isDeleting = ref(false);

  // Hardcoded options
  const sectionOptions = ['home', 'blog', 'destinations', 'about', 'contact', 'prices', 'footer'];
  
  const roleOptions = ['side', 'sub', 'main'];

  const configOptions = {
    destinations: ['vietnam', 'cyprus', 'albania', 'azores', 'madeira', 'montenegro', 'morocco', 'portugal'],
    blog: ['posts', 'categories', 'tags'],
    prices: ['packages', 'services', 'addons'],
    // Add more as needed
  };

  // Computed property to check if all files are properly configured
  const isConfigurationValid = computed(() => {
    if (selectedFiles.value.length === 0) return false;
    return fileConfigs.value.every(config => {
      const sectionValid = config.sectionType === 'custom'
        ? config.section && config.section.trim() !== ''
        : config.sectionType && config.sectionType.trim() !== '';
      
      // Sub-section is optional - if section has sub-options but user doesn't select any, that's fine
      const subSectionValid = hasSubOptions(config.sectionType)
        ? (config.subSectionType === 'custom' 
            ? config.subSection && config.subSection.trim() !== '' // Only validate if custom is selected
            : true) // If dropdown is selected or empty, it's valid
        : true; // No sub-section required
      
      const roleValid = config.roleType === 'custom'
        ? config.role && config.role.trim() !== ''
        : config.roleType && config.roleType.trim() !== '';
      
      return sectionValid && subSectionValid && roleValid;
    });
  });

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to update section based on dropdown selection
  const updateSection = (index) => {
    const config = fileConfigs.value[index];
    if (config.sectionType && config.sectionType !== 'custom') {
      config.section = config.sectionType;
    }
  };

  // Helper function to update role based on dropdown selection
  const updateRole = (index) => {
    const config = fileConfigs.value[index];
    if (config.roleType && config.roleType !== 'custom') {
      config.role = config.roleType;
    }
  };

  // Check if a section has sub-options
  const hasSubOptions = (sectionType) => {
    return configOptions[sectionType] && configOptions[sectionType].length > 0;
  };

  // Get sub-options for a section
  const getSubOptions = (sectionType) => {
    return configOptions[sectionType] || [];
  };

  // Update sub-section based on selection
  const updateSubSection = (index) => {
    const config = fileConfigs.value[index];
    if (config.subSectionType && config.subSectionType !== 'custom') {
      config.subSection = config.subSectionType;
    }
  };
  
  /**
   * Handles the file input change event, updating selectedFiles and fileConfigs.
   * @param {Event} event - The DOM change event.
   */
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    selectedFiles.value = files;
    
    // Initialize file configurations
    fileConfigs.value = files.map(() => ({
      sectionType: '',
      section: '',
      subSectionType: '', // New field
      subSection: '',     // New field
      roleType: '',
      role: ''
    }));
  };
  
  /**
   * Triggers the upload of all currently selected files with their configurations.
   */
  const uploadFiles = async () => {
    if (selectedFiles.value.length === 0 || !isConfigurationValid.value) return;
  
    isUploading.value = true;
    try {
      // Create array of objects with file, section, and role
      const filesWithConfig = selectedFiles.value.map((file, index) => ({
        file: file,
        section: fileConfigs.value[index].sectionType === 'custom' 
          ? fileConfigs.value[index].section 
          : fileConfigs.value[index].sectionType,
        subSection: fileConfigs.value[index].subSectionType === 'custom'
          ? fileConfigs.value[index].subSection
          : fileConfigs.value[index].subSectionType || '', // Default to empty string if not set
        role: fileConfigs.value[index].roleType === 'custom'
          ? fileConfigs.value[index].role
          : fileConfigs.value[index].roleType
      }));

      console.log('Uploading files with config:', filesWithConfig);

      const result = await uploadGeneralFiles(filesWithConfig);
      if (result.status === "error") {
        console.error("Batch upload failed:", result.error, result.errorCode);
        // You might want to display a global error message here
      } else {
        console.log("Batch upload completed successfully.");
        selectedFiles.value = []; // Clear selected files after successful initiation
        fileConfigs.value = []; // Clear configurations
        // Reset file input value to allow re-uploading same files
        if (document.querySelector('input[type="file"]')) {
          document.querySelector('input[type="file"]').value = '';
        }
      }
    } catch (err) {
      console.error("Unexpected error during batch upload:", err);
    } finally {
      isUploading.value = false;
    }
  };
  
  /**
   * Triggers the deletion of all files currently tracked in fileStatuses.
   */
  const deleteAllFiles = async () => {
    if (fileStatuses.value.length === 0) return;
  
    isDeleting.value = true;
    try {
      // Pass a copy of the files to delete, as fileStatuses will be mutated during deletion
      const filesToDelete = fileStatuses.value.map(s => s.file); 
      const result = await deleteGeneralFiles(filesToDelete);
      if (result.status === "error") {
        console.error("Batch deletion failed:", result.error, result.errorCode);
        // You might want to display a global error message here
      } else {
        console.log("Batch deletion completed successfully.");
      }
    } catch (err) {
      console.error("Unexpected error during batch deletion:", err);
    } finally {
      isDeleting.value = false;
    }
  };
  
  // Optional: If you want to expose individual file deletion
  const deleteIndividualFile = async (file) => {
    isDeleting.value = true;
    try {
      await deleteGeneralFiles([file]); // Assuming deleteFile is exposed by useFileUploadManager
    } catch (err) { 
      console.error("Individual file deletion failed:", err);
    } finally {
      isDeleting.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* No specific scoped styles needed as Tailwind handles styling */
  </style>
  