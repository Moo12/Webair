
import { ref } from 'vue';
import { doc, updateDoc, deleteDoc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Import collection and addDoc
import { projectFireStore, timestamp } from '@/firebase/config'; // Ensure projectFireStore and timestamp are correctly imported

const useDocument = () => {
  const error = ref(null);
  const isPending = ref(false);
  const mainCollectionLoading = ref(false); // New loading state for main collection operations

  /**
   * Helper function to get a DocumentReference from an array of path segments.
   * Path segments must be in the format: ['collectionId', 'docId', 'subCollectionId', 'subDocId', ...]
   * The array must have an even number of segments.
   * @param {string[]} pathSegments - An array of collection and document IDs.
   * @returns {import('firebase/firestore').DocumentReference} - The Firestore DocumentReference.
   * @throws {Error} If the pathSegments array is invalid.
   */
  const getDocRef = (pathSegments) => {
    if (!Array.isArray(pathSegments) || pathSegments.length === 0 || pathSegments.length % 2 !== 0) {
      throw new Error("Invalid document path. Must be an array of collection/document IDs, with an even number of segments.");
    }
    return doc(projectFireStore, ...pathSegments);
  };

  /**
   * Helper function to get a CollectionReference from an array of path segments.
   * Path segments must be in the format: ['collectionId', 'docId', 'subCollectionId', ...]
   * The array must have an odd number of segments.
   * @param {string[]} pathSegments - An array of collection and document IDs.
   * @returns {import('firebase/firestore').CollectionReference} - The Firestore CollectionReference.
   * @throws {Error} If the pathSegments array is invalid.
   */
  const getCollectionRef = (pathSegments) => {
    if (!Array.isArray(pathSegments) || pathSegments.length === 0 || pathSegments.length % 2 !== 1) {
      throw new Error("Invalid collection path. Must be an array of collection/document IDs, with an odd number of segments.");
    }
    return collection(projectFireStore, ...pathSegments);
  };

  /**
   * Deletes a document at the specified path.
   * @param {string[]} docPathSegments - An array representing the full path to the document.
   * @returns {Promise<boolean>} - True if deletion was successful, false otherwise.
   */
  const _deleteDoc = async (docPathSegments) => {
    isPending.value = true;
    error.value = null;
    let success = true;
    try {
      const docRef = getDocRef(docPathSegments);
      await deleteDoc(docRef);
      console.log(`Document deleted at path: ${docPathSegments.join('/')}`);
    } catch (err) {
      console.error(`Error deleting document at path: ${docPathSegments.join('/')}`, err);
      error.value = `Could not delete the document: ${err.message}`;
      success = false;
    } finally {
      isPending.value = false;
      return success;
    }
  };

  /**
   * Checks if a document exists at the specified path.
   * @param {string[]} docPathSegments - An array representing the full path to the document.
   * @returns {Promise<boolean>} - True if the document exists, false otherwise.
   */
  const _docExists = async (docPathSegments) => {
    isPending.value = true;
    error.value = null;
    try {
      const docRef = getDocRef(docPathSegments);
      const docSnap = await getDoc(docRef);
      const exists = docSnap.exists();
      console.log(`Document existence check for path ${docPathSegments.join('/')}: ${exists}`);
      return { exists, docId: docSnap.id, data: docSnap.data() };
    } catch (err) {
      console.error(`Error checking document existence at path: ${docPathSegments.join('/')}`, err);
      error.value = `Could not check document existence: ${err.message}`;
      return false;
    } finally {
      isPending.value = false;
    }
  };

  /**
   * Checks if a document exists in a collection by searching with a specific condition.
   * @param {string[]} collectionPathSegments - An array representing the path to the collection.
   * @param {object} condition - The condition to search for. Format: { field: value } or { field: [operator, value] }
   * @returns {Promise<{ exists: boolean, docId: string | null, data: object | null }>} - Object containing existence status, document ID if found, and document data.
   */
  const _docExistsByCondition = async (collectionPathSegments, condition) => {
    isPending.value = true;
    error.value = null;
    
    try {
      const colRef = getCollectionRef(collectionPathSegments);
      
      // Build the query based on the condition
      let q;
      if (typeof condition === 'object' && condition !== null) {
        const conditions = Object.entries(condition).map(([field, value]) => {
          if (Array.isArray(value) && value.length === 2) {
            // Handle operators like ['==', value] or ['>', value]
            return where(field, value[0], value[1]);
          } else {
            // Simple equality check
            return where(field, '==', value);
          }
        });
        
        if (conditions.length === 1) {
          q = query(colRef, conditions[0]);
        } else if (conditions.length > 1) {
          q = query(colRef, ...conditions);
        } else {
          q = query(colRef);
        }
      } else {
        q = query(colRef);
      }
      
      const querySnapshot = await getDocs(q);
      const exists = !querySnapshot.empty;
      const docId = exists ? querySnapshot.docs[0].id : null;
      const data = exists ? querySnapshot.docs[0].data() : null;
      
      console.log(`Document existence check by condition in collection ${collectionPathSegments.join('/')}: ${exists}`, condition);
      if (exists) {
        console.log(`Found document with ID: ${docId}`);
      }
      
      return { exists, docId, data };
    } catch (err) {
      console.error(`Error checking document existence by condition in collection: ${collectionPathSegments.join('/')}`, err);
      error.value = `Could not check document existence by condition: ${err.message}`;
      return { exists: false, docId: null, data: null };
    } finally {
      isPending.value = false;
    }
  };

  /**
   * Adds a new document with an auto-generated ID to the specified collection path.
   * Automatically adds `created_at` and `last_update` metadata.
   * @param {string[]} collectionPathSegments - An array representing the full path to the collection.
   * @param {object} data - The data for the new document.
   * @returns {Promise<{ success: boolean, id: string | null }>} - Success status and the ID of the new document.
   */
  const _addDoc = async (collectionPathSegments, data) => {
    isPending.value = true;
    error.value = null;
    let success = true;
    let newDocId = null;
    try {
      const colRef = getCollectionRef(collectionPathSegments);
      const now = timestamp();
      const docData = {
        ...data,
        metadata: {
          ...data.metadata, // Preserve existing metadata if any
          created_at: now,
          last_update: now,
        }
      };
      const docRef = await addDoc(colRef, docData);
      newDocId = docRef.id;
      console.log(`Document added to collection ${collectionPathSegments.join('/')} with ID: ${newDocId}`);
    } catch (err) {
      console.error(`Error adding document to collection ${collectionPathSegments.join('/')}`, err);
      error.value = `Could not add the document: ${err.message}`;
      success = false;
    } finally {
      isPending.value = false;
      return { success, id: newDocId };
    }
  };

  /**
   * Sets or updates a document at the specified path with a specific ID.
   * If the document does not exist, it will be created.
   * Automatically updates `last_update` metadata and sets `created_at` on creation.
   * Uses `merge: true` for partial updates.
   * @param {string[]} docPathSegments - An array representing the full path to the document.
   * @param {object} data - The data to set or merge into the document.
   * @returns {Promise<boolean>} - True if the operation was successful, false otherwise.
   */
  const _setDoc = async (docPathSegments, data) => {
    isPending.value = true;
    error.value = null;
    let success = true;
    try {
        const docRef = getDocRef(docPathSegments);
        const docSnap = await getDoc(docRef);
        const exists = docSnap.exists();
        
        const docData = { ...data };
        docData.metadata = docData.metadata || {}; // Ensure metadata object exists

        const now = timestamp();
        if (!exists) {
        docData.metadata.created_at = now; // Set creation time only on new doc
        }
      
        docData.metadata.last_update = now; // Always update last_update

        await setDoc(docRef, docData, { merge: true }); // Use merge: true for upsert functionality
      
      console.log(`Document set/updated at path: ${docPathSegments.join('/')}`);
    } catch (err) {
      console.error(`Error setting/updating document at path: ${docPathSegments.join('/')}`, err);
      error.value = `Could not set/update the document: ${err.message}`;
      success = false;
    } finally {
      isPending.value = false;
      return success;
    }
  };

  return { error, isPending, _deleteDoc, _addDoc, _setDoc, _docExists, _docExistsByCondition };
};

export default useDocument;
