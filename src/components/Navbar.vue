<template>
    <div class="fixed top-0 left-0 right-0 w-full z-[99]">
 
        <div class="flex justify-around items-center main-padding w-full" :class="navClass">
            <router-link to="/" class="max-w-[5%]" @click="currentTab = null">
                <img src="../../public/img/home_icon_temp.png" alt="" class="w-full aspect-square">
            </router-link>

            <!-- Desktop/ Tablet -->
             <div v-if="!isMobile" class="flex flex-grow justify-around">
                 <div  class="invisible md:visible" v-for="(link,i) in navItems" :key="i">
                     <router-link :to="link.href" @click="currentTab = i" class="py-4 px-4  btn"
                     :class="{
                         'bg-gray-300 border-3 border-black' : currentTab === i,
                         'bg-transparent': currentTab !== i
                     }">
                         <span class="text-eighteen-px">{{ link.name }}</span>
                     </router-link>
                 </div>
             </div>

            <!-- Mobile -->
            <div v-else class="visible md:invisible w-8 h-8">
                <div @click="isMenuOpen = !isMenuOpen" class="btn">
                    <!-- Hamburger icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 cursor-pointer text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>

                </div>

            </div>
        </div>

    </div>
    <div v-if="isMenuOpen" class="visible md:invisible fixed top-0 right-0 w-[80vw] h-screen z-100 bg-gray-600">
        <div class="flex flex-col items-end h-full  top-padding right-padding  gap-16" :style="ellipseStyle">
            <div @click="isMenuOpen = false" class="btn text-white">
                <!-- X icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>

            </div>

            <div v-for="(link,i) in navItems" :key="i">
                <router-link :to="link.href" @click="currentTab = i" class="py-4 px-4 btn rounded-3xl bg-purple-light"
                    :class="[{
                        'bg-purple-blue' : currentTab === i
                    }]">
                        <span class="text-eighteen-px font-black text-right">{{ link.name }}</span>
                </router-link>
            </div>            
        </div>        
    </div>
  
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';

    const navItems = [
        {
            name: "בלוג",
            href: "#",
        },
        {
            name: "צרו קשר",
            href: "#",
        },
        {
            name: "קצת עליי",
            href: "#",
        },
        {
            name: "מחירון",
            href: "#",
        },
        {
            name: "יעדים",
            href: "#",
        }
    ]

    const isScrolled = ref(false);

    const isMobile = ref(false)

    const currentTab = ref(null)

    const isMenuOpen = ref(false)

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

    const onTabClick = (i) => {
        currentTab.value = i
    }

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
        return  isScrolled.value
            ? "bg-white text-black border-gray-400 shadow-md" // White background when scrolled
            :  `text-white bg-transparent` // Transparent when at the top
    });



    const homeIocnSrc = "../../public/img/home_icon_temp.png"
</script>

<style>

</style>