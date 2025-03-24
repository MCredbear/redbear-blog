<template>
  <UApp>  
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPage />
  </UApp>
</template>

<script setup>
const sideNavigation = ref([
  {
    title: '文章分类',
    icon: 'i-lucide-book-open',
    children: [
      {
        title: '编程',
        path: '#programing',
      },
      {
        title: '其它',
        path: '#others',
      },
    ],
  },
  {
    title: '神必网站',
    icon: 'i-lucide-globe',
    children: [
      {
        title: '+ 1 s 舞萌科技',
        path: 'https://maitech.plus1second.icu',
      },
    ],
  },
  {
    title: '关于',
    icon: 'i-lucide-user',
    path: '/about',
  },
]);

provide('sideNavigation', sideNavigation);
</script>