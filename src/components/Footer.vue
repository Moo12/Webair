<template>
    <div class="main-padding absolute bottom-0 left-0 w-full z-[99]">
        <div class="main-padding flex items-center justify-between gap-4">
            <router-link :to="link.href" v-for="(link,i) in navItems" :key="i" class="flex-grow-0 btn inline-block"
            :class="{
                'w-[7%]' : link.imageSrc && link.imageSrc !== ''
            }">

                <div v-if="link.imageSrc && link.imageSrc" class="w-full h-auto">
                    <img :src="link.imageSrc" alt="nav icon" class=" w-full object-cover" />
                </div>
                <div v-else>
                    <span class="text-eighteen-px">{{ link.name }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import homeIcom from '@/../public/img/webair_home_icon.gif'
    const navItems = [
        {
            name: "בלוג",
            href: "#",
        },
        {
            name: "קצת עליי",
            href: "#",
        },
        {
            name: "בית",
            href: "/",
            imageSrc: homeIcom
        },
        {
            name: "מחירון",
            href: "#",
        },
        {
            name: "יעדים",
            href: "/destinations",
        },
    ]

</script>