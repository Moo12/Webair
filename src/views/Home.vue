<template>
  <div>
    <div class="w-full h-screen overflow-hidden">
      <video
      class="w-full rounded-lg"
      controls
      autoplay
      muted
      loop
      playsinline
    >
      <source src="/img/webair_welcome_video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    </div>
    <div>
      <Introduction class="h-screen"  language="he"/>
    </div>
    <div class="h-screen flex items-center">
      <AutoScrolled :images="images">
        <template #default="{ item }">
          <router-link :to="{ name: 'Destinations', query: {id: item.id}}" class="h-full w-full flex justify-center items-end mb-5">
            <p class=" text-white font-black text-twenty-seven-px">{{ item.title }}</p>
          </router-link>
        </template>
      </AutoScrolled>
    </div>

    <div class="h-screen flex-items-center">
      <NewAdventure/>
    </div>

    <div class="h-screen flex items-center">
      <AboutMe/>
    </div>  

    <div class="h-screen flex items-center">
      <BlogIntroduction/>
    </div>
    <div class="h-screen flex items-center">
      <ContactMeWrapper/>
    </div>
  </div>
</template>

<script setup>
import Introduction from '@/components/Introduction.vue';
import AutoScrolled from '@/components/AutoScrolled.vue';
import NewAdventure from '@/components/NewAdventure.vue';
import AboutMe from '@/components/AboutMe.vue';
import BlogIntroduction from '@/components/BlogIntroduction.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue';

import vietnam from '@/../public/img/webair-vietnam.jpg'
import cyprus from '@/../public/img/webair-cyprus.jpg'

const images = [
  {
   src: vietnam,
   title: "Vietnam",
   id: 1,
  },
  {
    src: cyprus,
    title: "Cyprus",
    id: 2,

  },
  {
    src: vietnam,
    title: "Vietnam",
    id: 3,
  },
  {
    src: cyprus,
    title: "Cyprus",
    id: 4,
  },
  {
    src: vietnam,
    title: "Vietnam",
    id: 5,
  },
  {
    src: cyprus,
    title: "Cyprus",
    id: 6,
  },
]


</script>
