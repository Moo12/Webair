<template>
    <div class="content-editor h-screen mt-[10%]">
        <form @submit.prevent="SignupHandler">
            <div class="flex flex-col justify-center items-center gap-3">
                <input type="email" placeholder="Email" v-model:="email" class="form-input">
                <input type="password" placeholder="Password" v-model:="password" class="form-input">
                <div class="error" v-if="error">{{ error }}</div>
                <button v-if="!isPending">Signup</button>
                <button v-else disabled>Loading</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import useSignup from '@/composables/useSignup';
import { ref } from 'vue';
import { useRouter } from 'vue-router'


const email = ref('')
const password = ref('')

const { error, isPending, signup } = useSignup()
const router = useRouter()

const SignupHandler = async () => {
    const res = await signup(email.value, password.value)

    if (!error.value){
        console.log('user signup')
        router.push( { name: "Login" } )
    }
}
</script>

<style>
.content-editor {
  margin: auto;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

</style>