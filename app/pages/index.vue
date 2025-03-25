<template>
  <UPage class="min-h-screen">
    <template #left>
      <UPageAside>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15">
          <UContentNavigation :navigation="sideNavigation" highlight highlight-color="primary" color="primary"
            variant="pill" />
        </UCard>
      </UPageAside>
    </template>
    <template #right>
      <UPlaceHolder />

    </template>
    <UPageBody>
      <UBlogPosts class="mt-8" orientation="vertical">
        <UBlogPosts class="mb-5" v-for="article in articles" :key="article.id" :date="article.date"
          :title="article.title" :description="article.description" :to="article.path"
          :badge="article.meta.categories.join(' & ')" target="_blank" />
      </UBlogPosts>
    </UPageBody>
  </UPage>
</template>

<script setup>

const sideNavigation = ref([
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
    title: '友链',
    icon: 'i-lucide-users',
    children: [
      {
        title: 'NekoMoyi',
        path: 'https://github.com/NekoMoYi'
      },
    ],
  },
  {
    title: '关于',
    icon: 'i-lucide-user',
    path: '/about',
  },
]);

// const articles = ref([]);

const { data: articles } = await useAsyncData(`index`, async () => {
  return queryCollection('article').order("date", "DESC").select('title', 'description', 'date', 'meta', 'path').all();
})

// onMounted(async () => {
//   articles.value = await queryCollection('article').order("date", "DESC").select('title', 'description', 'date', 'meta', 'path').all();
//   // window.addEventListener('hashchange', async () => {
//   //   articles.value = await queryCollection('article').order("date", "DESC").select('title', 'description', 'date', 'meta', 'path').all();
//   //   if (window.location.hash == '#programing') {
//   //     articles.value = articles.value.filter(article => article.meta.tag == 'Programing');
//   //   } else if (window.location.hash == '#others') {
//   //     articles.value = articles.value.filter(article => article.meta.tag != 'Programing');
//   //   }
//   // });
// });


</script>
