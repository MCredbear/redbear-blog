<template>
    <UPage class="min-h-screen">
        <template #left>
      <UPageAside>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15">
            <template #header>
                分类
            </template>
            <UButton v-for="(category, index) in categories" :key="index" :label="category" :to="`/category/${category}`" color="neutral" variant="link" />
        </UCard>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15 mt-8">
            <template #header>
                标签
            </template>
            <UButton v-for="(tag, index) in tags" :key="index" :label="tag" :to="`/tag/${tag}`" color="neutral" variant="link" />
        </UCard>
      </UPageAside>
    </template>
    <template #right>
      <UPlaceHolder />

    </template>
    <UPageBody>
      <UBlogPosts orientation="vertical">
        <UBlogPost v-for="article in articles" :key="article.id" :date="article.date" :title="article.title"
          :description="article.description" :to="article.path" :badge="article.meta.categories.join(' & ')"
          target="_blank" />
      </UBlogPosts>
    </UPageBody>
    </UPage>
</template>

<script setup>
const slug = useRoute().params.slug

const{ data: categories } = await useAsyncData(`categories`, async () => {
    return queryCollection('article').select('meta').all().then(articles => {
        const categories = articles.flatMap(article => article.meta.categories);
        return Array.from(new Set(categories));
    });
})

const{ data: tags } = await useAsyncData(`tags`, async () => {
    return queryCollection('article').select('meta').all().then(articles => {
        const tags = articles.flatMap(article => article.meta.tags);
        return Array.from(new Set(tags));
    });
})

const { data: articles } = await useAsyncData(`tag-${slug}`, async () => {
    let queryResult = await queryCollection('article').order("date", "DESC").select('title', 'description', 'date', 'meta', 'path').all();

    queryResult = queryResult.filter(article => article.meta.tags.includes(slug));

    return queryResult;
})

watch(() => useRoute().fullPath, () => {
    location.reload();
});
</script>