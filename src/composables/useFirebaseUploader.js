import { ref } from "vue";
import useAuth from "./useAuth"

const useFirebaseUploader = () => {
    const pending = ref(false)

    const { user } = useAuth()

    const BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;

    async function UploadGeneralImage(file, _sub_folder = []){
        const append = []
        let relative_path = "";
        console.log("sub_folder", _sub_folder)
        let sub_folder = ["general" , ..._sub_folder]
        if (sub_folder.length > 0) {
            sub_folder.forEach((folder, idx) => {
                if (folder.trim() === "") {
                  return
                }
                relative_path += folder;
                if (idx < sub_folder.length - 1) {
                    relative_path += "/";
                }
            })
        }

        console.log("relative_path", relative_path)
        append.push({ argument: "relative_path", content: relative_path})
        
        console.log("UploadGeneralImage - append array:", append);
        const res = await UploadImageImp(file, "upload-site-image", append)
        return res
    }

    async function UploadSectionImage(file, section){
        const append = []
        append.push({ argument: 'relative_path', content: section})
        const res = await UploadImageImp(file, "upload-site-image", append)

        return res
    }

    async function UploadImageImp(file, endPoint, formDataAppend = null) {
        const formData = new FormData();
        formData.append("file", file);
        
        console.log("UploadImageImp - formDataAppend:", formDataAppend);
        
        if (formDataAppend && Array.isArray(formDataAppend)) {
            formDataAppend.forEach(({ argument, content }) => {
                console.log(`Appending to FormData: ${argument} = ${content}`);
                formData.append(argument, content);
            });
        }

        pending.value = true;
      
        const token = await user.value.getIdToken();
      
        let response = {
          success: true,
          error_code: 0,
          url: "",
          status: null,
          message: "",
        };
      
        try {
          const res = await fetch(`${BASE_URL}/${endPoint}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          console.log("res media server", res)
      
          response.status = res.status;
          response.error_code = res?.error_code || 0; // Always assign status as error_code

          
          if (!res.ok) {
            let errData = null
            try {
                response.success = false
                errData = await res.json();
                let errorMsg =
                typeof errData === "object" && "detail" in errData
                ? errData.detail
                : errData ? JSON.stringify(errData) : "Unknown error";
                
                console.error("errorMsg", errorMsg)
                response.error_code = errorMsg?.error_code
                response.message = errorMsg?.message
            } catch (parseError) {
                console.error(parseError)
                response.error_code = errData?.error_code
                
            }
          } else {
            const data = await res.json();
            response.error_code = 0
            response.success = true
            response.url = data.url || "";
            response.message = "Upload successful";
          }
        } catch (err) {
          response.success = false;
          response.error_code = -1;
          response.message = `${err}`;

          console.error("err", err)
        }

        console.log("response firebase uploader", response)
      
        pending.value = false;
        return response;
    }

    async function deleteGeneralImage(file){
      const append = []
      append.push({ argument: "relative", content: "general"})
      const res = await deleteImageImp(file, "delete-site-image", append)
      return res
    }

    async function deleteSectionImage(file, section){
        const append = []
        append.push({ argument: 'relative_path', content: section})
        const res = await deleteImageImp(file, "delete-site-image", append)

        return res
    }
    const deleteImageImp = async (filename, endPoint, propertiesAppend = []) => {
        pending.value = true;
      
        let response = {
          success: true,
          error_code: 0,
          status: null,
          message: "",
        };
      
        // Ensure propertiesAppend is safe and append filename
        propertiesAppend.push({ argument: "filename", content: filename });
      
        // Build URL query parameters safely
        const params = new URLSearchParams();
        propertiesAppend.forEach(({ argument, content }) => {
          params.append(argument, content);
        });
      
        const token = await user.value.getIdToken();
      
        try {
          const res = await fetch(
            `${BASE_URL}/${endPoint}?${params.toString()}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          response.status = res.status;
      
          if (!res.ok) {
            response.success = false;
            const errData = await res.json();
            if (errData?.error_code) {
              response.error_code = errData.error_code;
              response.message = errData.message || "An error occurred";
            } else if (errData?.detail) {
              response.message = errData.detail;
            } else {
              response.message = JSON.stringify(errData);
            }
      
            console.error("Error deleting image:", response.message);
          } else {
            const data = await res.json();
            response.success = true
            response.error_code = data?.error_code || 0
            response.message = data?.message || "Delete successful";
            console.log("delete result:", response.message);
          }
      
        } catch (err) {
          response.success = false;
          response.error_code = "9999";
          response.message = "Unexpected error";
          console.error("Delete error:", err);
        }
      
        pending.value = false;
        return response;
    };
      

     return { pending, UploadGeneralImage, deleteGeneralImage, UploadSectionImage, deleteSectionImage}
}


  export default useFirebaseUploader