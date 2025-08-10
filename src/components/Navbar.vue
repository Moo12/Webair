<template>
    <div class="fixed top-0 left-0 right-0 w-full z-[99]">
 
        <div class="flex justify-between items-center main-padding  w-full" :class="navClass">
            <router-link to="/" class="max-w-[20%] w-[20%] md:max-w-[7%] md:w-[7%] h-auto">
                <img :src="mediaServer + logoImage" alt="" class="w-full object-cover">
            </router-link>

            <!-- Desktop/ Tablet -->
             <div v-if="!isMobile" class="flex flex-grow justify-between items-center">
                 <div  class="invisible md:visible" v-for="(link,i) in navItems" :key="i">
                     <router-link :to="link.href" class="py-4 px-4  btn"
                     :class="{
                         'opacity-60 rounded-3xl border-3 border-black' : isActive(link.href),
                         'bg-transparent': !isActive(link.href)
                     }">
                         <span class="text-eighteen-px">{{ link.name }}</span>
                     </router-link>
                 </div>
                 <!-- Login Button for Desktop -->
                 <div v-if="isAdminRoute && !user">
                     <button v-if="!user" @click="loginWithGoogle" class="btn bg-yellow-orange text-black rounded-lg px-4 py-2 font-bold">
                         התחבר עם Google
                     </button>
                     <span v-else class="text-green-400 font-bold">{{ user.email }}</span>
                 </div>
             </div>

            <!-- Mobile -->
            <div v-else-if="!isMenuOpen" class="visible md:invisible w-8 h-8 ">
                <div @click="isMenuOpen = !isMenuOpen" class="btn">
                    <!-- Hamburger icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 cursor-pointer text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>

                </div>

            </div>
        </div>

    </div>
    <div v-if="isMenuOpen" class="visible md:invisible fixed top-0 right-0 w-[80vw] h-screen z-[100] bg-gray-600 ">
        <div class="flex flex-col items-start h-full  top-padding right-padding  gap-16" :style="ellipseStyle">
            <div @click="isMenuOpen = false" class="btn text-white">
                <!-- X icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>

            </div>

            <div v-for="(link,i) in navItems" :key="i">
                <router-link @click="isMenuOpen=false" :to="link.href" class="py-4 px-4 btn rounded-3xl bg-purple-light"
                    :class="[{
                        'bg-purple-blue opacity-60' : isActive(link.href)
                    }]">
                        <span class="text-eighteen-px font-black text-right">{{ link.name }}</span>
                </router-link>
            </div>
            
            <!-- Login Button for Mobile -->
            <div v-if="isAdminRoute && !user" class="w-full">
                
                <button v-if="!user" @click="loginWithGoogle" class="btn bg-yellow-orange text-black rounded-lg px-4 py-2 font-bold w-full">
                    התחבר עם Google
                </button>
                <span v-else class="text-green-400 font-bold text-right block">{{ user.email }}</span>
                <span v-if="authError" class="text-red-500 text-sm">{{ authError }}</span>
            </div>            
        </div>        
    </div>
  
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useRoute } from 'vue-router'

import { storeToRefs } from 'pinia';
import { useViewModeStore } from '@/stores/viewModeStores';
import { useLayoutStore } from '@/stores/layoutStore'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'
import useAuth from '@/composables/useAuth'

const { mode } = storeToRefs(useViewModeStore());
const { mt: marginT , mx : marginX } = storeToRefs(useLayoutStore());

const generalCollectionStore = useGeneralCollectionStore()


// Auth
const { user, loginWithGoogle, error: authError } = useAuth();

const navItems = [
    {
        name: "בלוג",
        href: "/blog",
    },
    {
        name: "צרו קשר",
        href: "/#contact-me",
    },
    {
        name: "קצת עליי",
        href: "/#about-me",
    },
    {
        name: "מחירון",
        href: "/prices",
    },
    {
        name: "יעדים",
        href: "/destinations",
    }
]

const route = useRoute()

const isScrolled = ref(false);

const isMobile = ref(false)

const isMenuOpen = ref(false)

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const logoImage = computed(() => {
  const doc = generalCollectionStore.document('navbar')
  return getImageUrlFromDoc(doc, 'home')
})

const isActive =  (href) => {
        return route.path === href
    }
    
    const checkScreen = () => {
        isMobile.value = window.innerWidth < 768
    }

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50; // Change when scrolled past 50px
    };

    onMounted(() => {
        checkScreen()
        window.addEventListener('resize', checkScreen)

        window.addEventListener("scroll", handleScroll);
    })

    onUnmounted(() => {
        window.removeEventListener('resize', checkScreen)

        window.removeEventListener("scroll", handleScroll);
    })

    const ellipseStyle = computed(() => {
        return {
            width: "100%",   // 70% of the menu width
            height: "100%",  // 50% of the menu height
            borderTopLeftRadius: "50% 100%",  // Top-left curved
            borderBottomLeftRadius: "50% 100%", // Bottom-left curved
            borderTopRightRadius: "0", // Keep right side straight
            borderBottomRightRadius: "0", // Keep right side straight
        };
        });

    const navClass = computed(() => {
        let bgClass;

        switch (mode.value) {
            case 'dark':
                bgClass = 'text-white';
                break;
            case 'light':
                bgClass = 'text-black-light';
                break;
            default:
                bgClass = 'text-black-light';
        }

        console.log("mode", mode.value, "bg class ", bgClass)
        return  isScrolled.value
            ? "bg-white text-black border-gray-400 shadow-md" // White background when scrolled
            :  `${bgClass} bg-transparent ${marginX.value} ${marginT.value}` // Transparent when at the top
    });

// Only show navbar on admin routes
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>

</style>