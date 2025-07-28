import { ref } from "vue";
import useFirebaseUploader from "@/composables/useFirebaseUploader"; 
import useDocument from "@/composables/useDocument";
import { collection } from "firebase/firestore";

/**
 * Manages file uploads and deletions, providing reactive status updates.
 * @param {string[]} [_allowedExtensions=["jpg", "jpeg", "png", "pdf"]] - Array of allowed file extensions.
 * @returns {object} - An object containing reactive file statuses and management functions.
 */
export function useFileUploadManager(_allowedExtensions = ["jpg", "jpeg", "png", "pdf"]) {
  const { UploadSectionImage, UploadGeneralImage, deleteSectionImage, deleteGeneralImage } = useFirebaseUploader();
  
  const allowedExtensions = _allowedExtensions;
  /**
   * @typedef {object} FileStatus
   * @property {File} file - The original File object.
   * @property {'pending'|'uploading'|'deleting'|'success'|'error'} status - Current status of the file operation.
   * @property {number} progress - Progress percentage (0-100), if applicable.
   * @property {string|null} url - URL of the uploaded file, if successful.
   * @property {string|null} error - Error message, if operation failed.
   * @property {string|null} errorCode - Custom error code, if applicable.
   */
  /** @type {import('vue').Ref<FileStatus[]>} */
  const fileStatuses = ref([]);

  /**
   * Validates if a file's extension is allowed.
   * @param {File} file - The file to validate.
   * @returns {boolean} - True if the file extension is allowed, false otherwise.
   */
  const validateFile = (file) => {
    if (!file || !file.name) {
      return false; // Handle cases where file or file.name is undefined
    }
    const ext = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(ext);
  };

  /**
   * Updates the status properties of a specific file entry in the fileStatuses array.
   * @param {File} fileToUpdate - The original File object whose status needs to be updated.
   * @param {Partial<FileStatus>} newProps - An object containing the new properties to merge.
   */
  const updateFileStatus = (fileToUpdate, newProps) => {
    const index = fileStatuses.value.findIndex(s => s.file === fileToUpdate);
    if (index !== -1) {
      Object.assign(fileStatuses.value[index], newProps);
    } else {
      // Optionally, if the file is not found, you might want to add it.
      // For this composable's current use case (pre-populating fileStatuses),
      // this 'else' block might not be necessary.
      console.warn("Attempted to update status for a file not found in fileStatuses:", fileToUpdate);
    }
  };

  /**
 * Creates or updates a document in a main collection or adds a document to a subcollection.
 *
 * @param {string} mainCollectionName - The name of the main collection (e.g., 'general', 'wishes').
 * @param {string} parentDocId - The ID of the document in the main collection (e.g., 'destination').
 * @param {string} url - The URL to set in the document.
 * @param {string} role - The role to set in the document.
 * @param {string | null} subCollectionName - The name of the subcollection if adding to one (e.g., 'locations').
 * If null, the document is created/updated in the main collection.
 * @returns {Promise<{ success: boolean, msg: string | null, id: string | null }>} - Success status, error message, and the ID of the new document if added to a subcollection.
 */
const updateMetaDoc = async (mainCollectionName, parentDocId, url, role, subDocName = null) => {
  // Instantiate useDocument once
  const { _setDoc, _addDoc, error, _docExistsByCondition, _docExists } = useDocument();

  let success = true;
  let message = null;

  const doc_data = {
  };

  try {
    let collectionPathSegments = [mainCollectionName, parentDocId]
    
    if (subDocName) {
      collectionPathSegments.push(parentDocId)
      
      const { exists, docId, data } = await _docExistsByCondition(collectionPathSegments, { field: "name.en", operator: "==", value: subDocName });
      
      if (!exists) {
        doc_data.name = {
          en: subDocName,
        }
  
        doc_data.images = [ {url: url, role: role} ]
        success = (await _addDoc(collectionPathSegments, doc_data)).success;
      }
      else{
  
        doc_data.images = [ ...data.images, {url: url, role: role} ]
        success = (await _setDoc(collectionPathSegments, doc_data, docId));
  
      }
    }
    else{
      const { exists, docId, data } = await _docExists(collectionPathSegments);
      if (!exists) {
        doc_data.images = [ {url: url, role: role} ]
        success = (await _setDoc(collectionPathSegments, doc_data));
      }
      else{
        doc_data.images = [ ...data.images, {url: url, role: role} ]
        success = (await _setDoc(collectionPathSegments, doc_data ));
      }
    }
          


    message = error.value; // `error` ref from useDocument will be updated on failure

    return { success: success, msg: message };
      
  } catch (err) {
      console.error("Error in updateMetaDoc:", err);
      success = false;
      message = err.message; // Catch any unexpected errors here
  }

  console.log("updateMetaDoc final result:", { success: success, msg: message });
  
  // Return the result, including the newDocId if applicable
  return { success: success, msg: message };
};

  /**
   * Handles the upload of a single file and updates its status.
   * @param {File} file - The file to upload.
   * @returns {Promise<void>}
   */
  const uploadFile = async (file, section, role, subSection) => {
    updateFileStatus(file, { status: "uploading", progress: 0, error: null, errorCode: null });
    try {
      const result = await UploadGeneralImage(file, [section, subSection]); // Assuming this returns { status: 'success', url: '...' } or { status: 'error', error: '...', errorCode: '...' }
      if (result.success === true) {

        const metaDocResult = await updateMetaDoc("general", section, result.url, role, subSection )
        if (metaDocResult.success === true) {
          updateFileStatus(file, { status: "success", url: result.url });
        } else {
          updateFileStatus(file, { status: "error", error: metaDocResult.msg, errorCode: metaDocResult.error_code });
        }
      } 
      else {
        updateFileStatus(file, { status: "error", error: result.message, errorCode: result.error_code });
      }
    } catch (err) {
      console.error("Upload failed for file:", file.name, err); 
      updateFileStatus(file, { status: "error", error: err.message || String(err), errorCode: err.code || null });
    }
  };

  /**
   * Handles the deletion of a single file and updates its status.
   * @param {File} file - The file to delete (or an object with its identifying properties like 'url' or 'name').
   * @returns {Promise<void>}
   */
  const deleteFile = async (file) => {
    updateFileStatus(file, { status: "deleting", error: null, errorCode: null });
    try {
      // Assuming deleteGeneralImage expects the file object or a specific identifier from it
      const res = await deleteGeneralImage(file); // Adjust this if deleteGeneralImage needs a URL or filename string
      
      if (res.success === true) {
        // Remove the file from the reactive list upon successful deletion
        updateFileStatus(file, { status: "success", error: res.message, errorCode: res.error_code });
      } else {
        updateFileStatus(file, { status: "error", error: res.message, errorCode: res.error_code });
      }
    } catch (err) {
      console.error("Deletion failed for file:", file.name, err);
      updateFileStatus(file, { status: "error", error: err.message || String(err), errorCode: err.code || null });
    }
  };


  /**
   * Initiates the upload of multiple general files.
   * @param {File[]} files - Array of File objects to upload.
   * @returns {Promise<{status: 'success'|'error', error: string|null, errorCode: string|null}>} - Overall batch status.
   */
  const uploadGeneralFiles = async (files) => {
    fileStatuses.value = []; // Clear previous statuses for a new batch upload

    const uploadPromises = [];
    files.forEach(fileObj => {
      const { file, section, role, subSection } = fileObj;
      
      if (file instanceof File && validateFile(file)) {
        fileStatuses.value.push({ 
          file: file, 
          section: section,
          role: role,
          status: "pending", 
          progress: 0, 
          url: null, 
          error: null, 
          errorCode: null 
        });
        uploadPromises.push(uploadFile(file, section, role, subSection));
      } else {
        fileStatuses.value.push({ 
          file: file, 
          section: section,
          subSection: subSection,
          role: role,
          status: "error", 
          error: "Invalid file type or not a File object", 
          errorCode: "INVALID_FILE_TYPE" 
        });
      }
    });

    try {
      await Promise.all(uploadPromises);
      // Check if any individual file failed to set overall batch status
      const hasErrors = fileStatuses.value.some(s => s.status === 'error');
      if (hasErrors) {
        return { status: "error", error: "Some files failed to upload.", errorCode: "PARTIAL_UPLOAD_FAILURE" };
      }
      return { status: "success", error: null, errorCode: null };
    } catch (err) {
      console.error("Batch upload encountered a critical error:", err);
      // This catch block would primarily catch errors from Promise.all itself,
      // not individual file upload errors which are handled by uploadFile.
      return { status: "error", error: err.message || String(err), errorCode: err.code || null };
    }
  };

  /**
   * Initiates the deletion of multiple general files.
   * @param {File[]} files - Array of File objects (or objects representing files) to delete.
   * @returns {Promise<{status: 'success'|'error', error: string|null, errorCode: string|null}>} - Overall batch status.
   */
  const deleteGeneralFiles = async (files) => {
    // For deletion, it might be better to manage fileStatuses more granularly
    // if you want to track files that were NOT part of this deletion batch.
    // If this is always for a fresh set of files to be deleted, then clearing is fine.
    // Assuming it's for a fresh set of files to be deleted:
    fileStatuses.value = [];



    const deletePromises = [];
    files.forEach(file => {
      // Add a status entry for each file being deleted
      const file_name = file.name
      fileStatuses.value.push({ file: file_name, status: "pending", progress: 0, error: null, errorCode: null });
      deletePromises.push(deleteFile(file_name));
    });

    try {
      await Promise.all(deletePromises);
      const hasErrors = fileStatuses.value.some(s => s.status === 'error');
      if (hasErrors) {
        return { status: "error", error: "Some files failed to delete.", errorCode: "PARTIAL_DELETE_FAILURE" };
      }
      return { status: "success", error: null, errorCode: null };
    } catch (err) {
      console.error("Batch deletion encountered a critical error:", err);
      return { status: "error", error: err.message || String(err), errorCode: err.code || null };
    }
  };

  return {
    fileStatuses,
    validateFile,
    uploadGeneralFiles,
    deleteGeneralFiles,
    // If needed, expose individual upload/delete for fine-grained control
    // uploadFile, 
    // deleteFile 
  };
}
