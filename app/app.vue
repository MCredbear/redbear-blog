<template>
  <UApp>
    <UHeader title="MCredbear 的神必地带">
      <UNavigationMenu :items="navigationMenu" />
      <template #body>
        <UNavigationMenu :items="navigationMenu" orientation="vertical" class="-mx-2.5" />
      </template>
      <template #right>
        <UColorModeButton />
        <UTooltip text="Open on GitHub">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/MCredbear/blog-redbear"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
        <UContentSearchButton label="搜索" variant="subtle" />
      </template>
    </UHeader>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UMain>
      <NuxtLayout>
        <NuxtPage
          style="background-image: url('/usagi.jpg'); background-attachment: fixed;  background-size: cover; background-position: center;   width: 100vw; " />
      </NuxtLayout>
    </UMain>
    <UContentSearch v-model:search-term="searchTerm" :files="searchFiles" :navigation="searchNavigation"
      :fuse="{ resultLimit: 10 }" :color-mode="false" />
  </UApp>
</template>

<script setup>

const navigationMenu = ref([
  {
    label: "首页",
    icon: "i-lucide-home",
    to: "/"
  },
  {
    label: "分类",
    icon: "i-lucide-layout-grid",
    to: "/categories"
  },
  {
    label: "标签",
    icon: "i-lucide-tags",
    to: "/tags"
  },
  {
    label: "归档",
    icon: "i-lucide-archive",
    to: "/archives"
  }
])

const searchTerm = ref('')
const { data: searchNavigation } = await useAsyncData('navigation', () => queryCollectionNavigation('article'))
const { data: searchFiles } = await useAsyncData('search', () => queryCollectionSearchSections('article'))

console.log(searchNavigation)

</script>