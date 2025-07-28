// composables/useFirestoreCollection.js
import { ref } from 'vue';
import { projectFireStore } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const useFirestoreCollection = () => {
  const documents = ref(null);
  const error = ref(null);
  let unsub = null; // unsubscribe function

  /**
   * Subscribe to a Firestore collection with optional conditions and ordering.
   * @param {string} collectionName - The Firestore collection name.
   * @param {Array} conditions - Array of where conditions (optional).
   * @param {Object} orderByObj - { field: string, order: 'asc' | 'desc' } (optional).
   */
  const subscribeToCollection = (collectionPath, conditions = [], orderByObj = null) => {
    // Prevent duplicate listeners
    if (unsub) unsub();

    try {
      let collectionRef;
      if (Array.isArray(collectionPath)) {
          // Join array segments into a single string path
          collectionRef = collection(projectFireStore, ...collectionPath); // Use spread operator for collection()
          console.log("Firestore: Subscribing to path array:", collectionPath.join('/'));
      } else if (typeof collectionPath === 'string') {
          collectionRef = collection(projectFireStore, collectionPath);
          console.log("Firestore: Subscribing to path string:", collectionPath);
      } else {
          error.value = new Error("Invalid collection path provided. Must be a string or an array of strings.");
          isPending.value = false;
          console.error("Firestore: Invalid collection path:", collectionPath);
          return;
      }

      const queries = [];

      // Add where conditions
      if (conditions.length > 0) {
        conditions.forEach((cond) => {
          queries.push(where(cond.field, cond.operator, cond.value));
        });
      }

      // Add orderBy if provided
      if (orderByObj && orderByObj.field) {
        queries.push(orderBy(orderByObj.field, orderByObj.order || 'desc'));
      }

      if (queries.length > 0) {
        collectionRef = query(collectionRef, ...queries);
      }

      unsub = onSnapshot(
        collectionRef,
        (snapshot) => {
          documents.value = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          error.value = null;
        },
        (err) => {
          console.error(err.message);
          documents.value = null;
          error.value = "Could not fetch the data";
        }
      );
    } catch (err) {
      console.error('Error in subscribeToCollection:', err.message);
      error.value = "Failed to set up Firestore listener";
    }
  };

  // Optional: call this when component unmounts
  const unsubscribe = () => {
    if (unsub) unsub();
  };

  return {
    documents,
    error,
    subscribeToCollection,
    unsubscribe,
  };
};

export default useFirestoreCollection;
