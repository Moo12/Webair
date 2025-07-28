<template>
    <div class="grid grid-cols-6 md:gap-[3.6%] gap-[8%] md:right-padding w-full pt-[2%] pb-[20%] md:pb-[2%] md:px-[4%] px-0 bg-black rounded-3xl">
        <div class="md:col-span-2 col-span-6 flex flex-wrap items-center text-center md:text-left justify-center md:text-[54px] text-[27px] text-white font-black">
            <p>בואו נתפור <br>חופשה <br>לפי מידה</p>
        </div>
            <div class="md:col-span-4 col-span-6 my-auto md:px-3 px-[10%] ">
                <form @submit.prevent="handleSend">
                <div class="grid md:grid-cols-2 grid-cols-1  w-full md:gap-[10%] gap-y-10">
                    <div class="w-full">
                        <input 
                            type="text" 
                            v-model="name"
                            class="form-input"
                            placeholder="שם מלא"
                            required    
                            />
                    </div>
                    <div class="form-div">
                        <textarea 
                        v-model="message"
                        rows="1"
                        class="form-input "
                        placeholder="מה יעד החלומות?"
                        required
                        ></textarea>
                    </div>
                        <!-- Email Input -->
                    <div class="form-div">
                            <input 
                            type="email" 
                            v-model="email"
                            class="form-input"
                            placeholder="כתובת מייל"
                            required
                        />
                    </div>
                    <div class="w-full justify-self-center  flex items-end ">
                        <button 
                        type="submit"
                        class="btn h-full w-full bg-yellow-orange rounded-lg  px-6 py-2 text-center transition duration-300">
                                <span class="font-black">יוצאים לדרך!</span>
                        </button>
                    </div>
                    
                </div>
                </form>
                <div v-if="errorStatus">
                    <p>{{ errorStatus }}</p>
                </div>
                <div v-else-if="status && status === succesStr">
                    <p>הפרטים נשלחו בהצלחה</p>
                </div>
                <div v-else-if="status && status === pendingStr">
                    <span class="spinner"></span>
                </div>
            </div>
            <div v-if="displaySocialMediaIcons" class="btn flex flex-row space-x-2"> <!-- social media icons -->
                <a href="https://facebook.com" target="_blank">
                <i class="btn fab fa-facebook text-black text-4xl m-6 md:text-6xl xl:text-7xl rounded-lg"></i>
                </a>
                <a href="https://instagram.com" target="_blank">
                <i class="btn fab fa-instagram text-black text-4xl m-6 md:text-6xl xl:text-7xl rounded-lg"></i>
                </a>
                <a href="https://youtube.com" target="_blank">
                <i class="btn fab fa-youtube text-black text-4xl md:text-6xl xl:text-7xl bg-white rounded-lg m-6"></i>
                </a>
            </div>
    </div>

</template>
<script>
import { ref } from 'vue';
import axios from "axios";

export default {
    setup(){
        const displaySocialMediaIcons = ref(false)

        const message = ref('')
        const name = ref('')
        const email = ref('')
        const status = ref('')
        const errorStatus = ref(null)
        const succesStr = ref("success")
        const failStr = "fail"
        const pendingStr = "pending"
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const handleSend = async () => {
            errorStatus.value = null
            status.value =  pendingStr
            
            await sleep(2000); // Wait for 2 secondsbg-green-site
            
            try {
                const response = await axios.post(
                    "https://webair.com/api/contact",
                    {
                        name: name.value,
                        email: email.value,
                        message: message.value,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Check if the response status indicates success
                if (response.status === 200) {
                    status.value = succesStr.value
                } else {
                    status.value = `Unexpected response status: ${response.status}`;
                    error.value = 'Unexpected response. Please Try Again'
                    errorStatus = error.value 
                }
            } catch (error) {
                // Handle errors returned from the server
                if (error.response) {
                    // The request was made, and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Server responded with:', error.response.data);
                    status.value = `Error: ${error.response.data.message || 'An error occurred while sending the email.'}`;
                    errorStatus.value = 'An error occurred while sending the email.'
                } else if (error.request) {
                    // The request was made, but no response was received
                    console.error('No response received:', error.request);
                    status.value = "Error: No response from the server. Please try again later.";
                    errorStatus.value = status.value
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message);
                    status.value = "Error: Failed to send the request. Please check your network connection.";
                    errorStatus.value = status.value 
                }
            }
        };

        return { displaySocialMediaIcons, name, email, message, handleSend, succesStr, failStr, errorStatus, status, pendingStr }
    }

}

</script>

<style>

</style>