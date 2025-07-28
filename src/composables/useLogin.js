import { ref } from "vue";
import instance from "./axios";

export default function useLogin() {

    const error = ref(null)
    const isPending = ref(false)
    const jwt = ref(null)

    const login = async (email, password) => {
        isPending.value = true
        error.value = null

        try{
            const response = await instance.post(
                "/auth/login",
                {
                    email: email,
                    password: password
                },
            );

            // Check if the response status indicates success
            if (response?.status === 200 && response?.data?.token) {
                console.log("response status", response?.status)
                jwt.value = response.data.token;
                localStorage.setItem("authToken", response.data.token); // save token locally
              } else {
                error.value = "Signup succeeded, but token is missing.";
            }
        } catch (errorExc) {
            console.log(errorExc)
            // Handle errors returned from the server
            if (errorExc?.status === 401) {
                // The request was made, and the server responded with a status code
                // that falls out of the range of 2xx
                error.value = 'Unauthorized';
            } else if (errorExc.request) {
                // The request was made, but no response was received
                error.value = "Error: No response from the server. Please try again later.";
            } else {
                // Something happened in setting up the request that triggered an Error
                error.value = "Fatal error" 
            }
        }

        if (error.value){
            console.error(error.value)
        }

        isPending.value = false
    }

    return {
        error,
        isPending,
        jwt,
        login
    }
}