/**
 * Utility functions for handling image URLs and image arrays
 */

/**
 * 1. Returns image URL from a document
 * @param {Object} doc - The document object
 * @param {string} [fieldName='url'] - The field name containing the image URL (default: 'url')
 * @returns {string|null} - The image URL or null if not found
 */
export const getImageUrlFromDoc = (doc, fieldName = 'url') => {
  if (!doc || typeof doc !== 'object') {
    console.warn('getImageUrlFromDoc: Invalid document provided');
    return null;
  }
  
  return doc[fieldName] || null;
};

/**
 * 2. Returns image URL from images array
 * @param {Array} imagesArray - Array of image objects
 * @param {string} [fieldName='url'] - The field name containing the image URL (default: 'url')
 * @returns {string|null} - The first image URL found or null if array is empty
 */
export const getImageUrlFromArray = (imagesArray, fieldName = 'url') => {
  if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
    console.warn('getImageUrlFromArray: Invalid or empty images array provided');
    return null;
  }
  
  // Return the URL of the first image in the array
  return imagesArray[0][fieldName] || null;
};

/**
 * 3. Returns array of all images with matching role from images array
 * @param {Array} imagesArray - Array of image objects
 * @param {string} role - The role to filter by
 * @param {string} [roleField='role'] - The field name containing the role (default: 'role')
 * @returns {Array} - Array of images with matching role
 */
export const getImagesByRole = (imagesArray, role, roleField = 'role') => {
  if (!Array.isArray(imagesArray)) {
    console.warn('getImagesByRole: Invalid images array provided');
    return [];
  }
  
  if (!role || typeof role !== 'string') {
    console.warn('getImagesByRole: Invalid role provided');
    return [];
  }
  
  return imagesArray.filter(image => {
    if (!image || typeof image !== 'object') {
      return false;
    }
    
    return image[roleField] === role;
  });
};

/**
 * Helper function to get the first image URL with a specific role
 * @param {Array} imagesArray - Array of image objects
 * @param {string} role - The role to filter by
 * @param {string} [roleField='role'] - The field name containing the role (default: 'role')
 * @param {string} [urlField='url'] - The field name containing the image URL (default: 'url')
 * @returns {string|null} - The first image URL with matching role or null if not found
 */
export const getFirstImageUrlByRole = (imagesArray, role, roleField = 'role', urlField = 'url') => {
  const imagesWithRole = getImagesByRole(imagesArray, role, roleField);
  
  if (imagesWithRole.length === 0) {
    return null;
  }
  
  return imagesWithRole[0][urlField] || null;
};

/**
 * Helper function to get all image URLs with a specific role
 * @param {Array} imagesArray - Array of image objects
 * @param {string} role - The role to filter by
 * @param {string} [roleField='role'] - The field name containing the role (default: 'role')
 * @param {string} [urlField='url'] - The field name containing the image URL (default: 'url')
 * @returns {Array} - Array of image URLs with matching role
 */
export const getImageUrlsByRole = (imagesArray, role, roleField = 'role', urlField = 'url') => {
  const imagesWithRole = getImagesByRole(imagesArray, role, roleField);
  
  return imagesWithRole
    .map(image => image[urlField])
    .filter(url => url != null); // Filter out null/undefined URLs
};

/**
 * Helper function to validate if an object has required image fields
 * @param {Object} imageObj - The image object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {boolean} - True if all required fields are present
 */
export const validateImageObject = (imageObj, requiredFields = ['url']) => {
  if (!imageObj || typeof imageObj !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => {
    return imageObj.hasOwnProperty(field) && imageObj[field] != null;
  });
}; 