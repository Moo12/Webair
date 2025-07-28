import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import useFirestoreCollection from '@/composables/getCollection'; // Assuming this path
import useDocument from '@/composables/useDocument'; // Assuming this path (still needed for _getDoc, if we add it back)

// Define the subcollections you want to listen to on initialization
// Each entry should be { parentDocId: 'yourParentDocId', subCollectionName: 'yourSubCollectionName' }
// For example, if you have 'general/wishes/images_url' and 'general/settings/preferences'
const SUBCOLLECTION_CONFIG = [
  { parentDocId: 'destinations', subCollectionName: 'destinations' },
  // Add other predefined subcollections here as needed
  // { parentDocId: 'settings', subCollectionName: 'preferences' },
];

export const useGeneralCollectionStore = defineStore('generalDocStore', {
  state: () => ({
    // Stores top-level documents from the 'general' collection (real-time)
    generalDocuments: [],
    generalLoading: true,
    generalError: null,

    // Stores fetched subcollection documents (now real-time for configured ones)
    // Structure: { parentDocId: { subCollectionName: [doc1, doc2, ...], ... }, ... }
    subCollectionData: {},
    subCollectionLoading: {}, // { parentDocId_subCollectionName: boolean }
    subCollectionError: {},   // { parentDocId_subCollectionName: error }
  }),

  getters: {
    /**
     * Retrieves a specific top-level document from the 'general' collection by its ID.
     * @param {string} docId - The ID of the document to retrieve.
     * @returns {object | null} The document object, or null if not found.
     */
    document: (state) => (docId) => {
      return state.generalDocuments.find(doc => doc.id === docId);
    },

    documents: (state) => (parentDocId) => {
      return state.subCollectionData[parentDocId]?.[parentDocId] || [];
    },

    isMainCollectionLoading: (state) => {
      return state.generalLoading
    },

    /**
     * Retrieves documents from a specific subcollection that have been loaded.
     * This getter now accesses real-time data for configured subcollections.
     * @param {string} parentDocId - The ID of the parent document.
     * @param {string} subCollectionName - The name of the subcollection.
     * @returns {Array} An array of subcollection documents, or an empty array if not loaded/found.
     */
    subCollection: (state) => (parentDocId, subCollectionName) => {
      return state.subCollectionData[parentDocId]?.[subCollectionName] || [];
    },

    /**
     * Checks if a specific subcollection is currently loading.
     * @param {string} parentDocId - The ID of the parent document.
     * @param {string} subCollectionName - The name of the subcollection.
     * @returns {boolean} True if loading, false otherwise.
     */
    isSubCollectionLoading: (state) => (parentDocId, subCollectionName) => {
      return state.subCollectionLoading[`${parentDocId}_${subCollectionName}`] || false;
    },

    /**
     * Retrieves the error for a specific subcollection.
     * @param {string} parentDocId - The ID of the parent document.
     * @param {string} subCollectionName - The name of the subcollection.
     * @returns {Error | null} The error object, or null if no error.
     */
    getSubCollectionError: (state) => (parentDocId, subCollectionName) => {
      return state.subCollectionError[`${parentDocId}_${subCollectionName}`] || null;
    },

    getImagesByRole: (state) => (parentDocId, role) => {
      return state.subCollectionData[parentDocId]?.[parentDocId]?.filter(doc => doc.images?.some(image => image.role === role)) || [];
    },
  },

  actions: {
    /**
     * Initializes the store by subscribing to the main 'general' collection
     * and all predefined subcollections. This should typically be called once.
     */
    init() {
      // 1. Subscribe to the top-level 'general' collection
      const {
        documents: fetchedGeneralDocs,
        error: generalCollectionError,
        isPending: generalCollectionPending,
        subscribeToCollection: subscribeGeneral,
      } = useFirestoreCollection();

      subscribeGeneral("general");

      watch(
        () => fetchedGeneralDocs?.value,
        (newDocs) => {
          this.generalDocuments = newDocs || [];
          this.generalLoading = newDocs === null; // True if documents is still null (initial state)
          this.generalError = null;
          console.log(`General Docs Store: Updated generalDocuments ${this.generalDocuments?.length}. isPending: ${this.generalLoading}`);
        },
        { immediate: true }
      );

      watch(
        generalCollectionError,
        (err) => {
          if (err) {
            this.generalError = err;
            this.generalLoading = false;
            console.error("General Docs Store: Error fetching general collection:", err);
          }
        }
      );

      watch(
        generalCollectionPending,
        (pending) => {
          this.generalLoading = pending;
        }
      );

      // 2. Subscribe to predefined subcollections
      SUBCOLLECTION_CONFIG.forEach(config => {
        const { parentDocId, subCollectionName } = config;
        const collectionPathSegments = ['general', parentDocId, subCollectionName];
        const key = `${parentDocId}_${subCollectionName}`;

        const {
          documents: fetchedSubDocs,
          error: subCollectionError,
          isPending: subCollectionPending,
          subscribeToCollection: subscribeSub,
        } = useFirestoreCollection();

        subscribeSub(collectionPathSegments); // Subscribe to the subcollection

        watch(
            () => fetchedSubDocs?.value,
          (newDocs) => {
            if (!this.subCollectionData[parentDocId]) {
              this.subCollectionData[parentDocId] = {};
            }
            this.subCollectionData[parentDocId][subCollectionName] = newDocs || [];
            this.subCollectionLoading[key] = newDocs === null;
            this.subCollectionError[key] = null;
            console.log(`General Docs Store: Updated subcollection '${key}'. Docs: ${this.subCollectionData[parentDocId][subCollectionName]?.length}. isPending: ${this.subCollectionLoading[key]}`);
          },
          { immediate: true }
        );

        watch(
          subCollectionError,
          (err) => {
            if (err) {
              this.subCollectionError[key] = err;
              this.subCollectionLoading[key] = false;
              console.error(`General Docs Store: Error fetching subcollection '${key}':`, err);
            }
          }
        );

        watch(
          subCollectionPending,
          (pending) => {
            this.subCollectionLoading[key] = pending;
          }
        );
      });
    },

    // Removed fetchSubCollection and fetchSubDocument as configured subcollections are now real-time.
    // If you need to fetch *other* subcollections on-demand, a new action would be needed.
  },
});
