<template>
  <UPage class="min-h-screen">
    <template #left>
      <UPageAside>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15">
          <template #header>
            <UButton icon="i-lucide-layout-grid" color="neutral" variant="subtile" to="/categories">
              分类
            </UButton>
          </template>
          <UButton v-for="(category, index) in categories" :key="index" :label="category" :to="`/category/${category}`"
            color="neutral" variant="link" />
        </UCard>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15 mt-8">
          <template #header>
            <UButton icon="i-lucide-tags" color="neutral" variant="subtile" to="/tags">
              标签
            </UButton>
          </template>
          <UButton v-for="(tag, index) in tags" :key="index" :label="tag" :to="`/tag/${tag}`" color="neutral"
            variant="link" />
        </UCard>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15 mt-8">
          <template #header>
            <UButton icon="i-lucide-archive" color="neutral" variant="subtile" to="/archives">
              归档
            </UButton>
          </template>
          <UButton v-for="(archive, index) in archives" :key="index" :label="archive" :to="`/archive/${archive}`"
            color="neutral" variant="link" />
        </UCard>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15 mt-8">
          <UContentNavigation :navigation="sideNavigation" highlight highlight-color="primary" color="primary"
            variant="pill" />
        </UCard>
      </UPageAside>
    </template>
    <template #right>
      <Placeholder />

    </template>
    <UPageBody>
      <UBlogPosts orientation="vertical" class="mx-8">
        <UBlogPost v-for="article in articles" :key="article.id" :date="article.date" :title="article.title"
          :description="article.description" :to="article.path" :badge="article.meta.categories.join(' & ')"
          target="_blank" />
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

const { data: categories } = await useAsyncData(`categories`, async () => {
  return queryCollection('article').select('meta').all().then(articles => {
    const categories = articles.flatMap(article => article.meta.categories);
    return Array.from(new Set(categories));
  });
})

const { data: tags } = await useAsyncData(`tags`, async () => {
  return queryCollection('article').select('meta').all().then(articles => {
    const tags = articles.flatMap(article => article.meta.tags);
    return Array.from(new Set(tags));
  });
})

const { data: archives } = await useAsyncData(`archives`, async () => {
  return queryCollection('article').order("date", "DESC").select('date').all().then(articles => {
    return Array.from(new Set(articles.map(article => article.date.split('-')[0])));
  });
})

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
