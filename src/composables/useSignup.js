import { ref } from "vue";
import instance from "./axios";

export default function useSignup() {

    const error = ref(null)
    const isPending = ref(false)
    const jwt = ref(null)

    const signup = async (email, password) => {
        isPending.value = true
        error.value = null

        try{
            const response = await instance.post(
                "/auth/signup",
                {
                    email: email,
                    password: password
                },
            );

            // Check if the response status indicates success
            if (response.status !== 200) {
                error.value = `Unexpected response status: ${response.status}`;
            }
        } catch (errorExc) {
            // Handle errors returned from the server
            if (errorExc.response) {
                // The request was made, and the server responded with a status code
                // that falls out of the range of 2xx
                error.value = `Error: ${error.response.data.message || 'An error occurred while sending the email.'}`;
            } else if (errorExc.request) {
                // The request was made, but no response was received
                error.value = "Error: No response from the server. Please try again later.";
            } else {
                // Something happened in setting up the request that triggered an Error
                error.value = status.value 
            }
        }

        isPending.value = false
    }

    return {
        error,
        isPending,
        signup
    }
}