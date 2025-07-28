<template>
    <div class="content-editor h-screen mt-[10%]">
        <form @submit.prevent="LoginHandler">
            <div class="flex flex-col justify-center items-center gap-3">
                <input type="email" placeholder="Email" @focus="error=null" v-model:="email" class="form-input">
                <input type="password" placeholder="Password" @focus="error=null" v-model:="password" class="form-input">
                <div class="error" v-if="error">{{ error }}</div>
                <button v-if="!isPending">Log In</button>
                <button v-else disabled>Loading</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import useLogin from '@/composables/useLogin';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const { error, isPending, login } = useLogin()
const router = useRouter()

const LoginHandler = async () => {
    const res = await login(email.value, password.value)

    if (!error.value){
        console.log('user logged in')
        router.push( { name: "Admin" } )
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