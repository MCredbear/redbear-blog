<template>
    <UPage class="min-h-screen">
    <template #left>
      <PlaceHolder />
    </template>
    <template #right>
      <PlaceHolder />
    </template>
    <UPageBody>
        <UCard class="bg-(--ui-bg)/75 backdrop-blur">
            <UPageHeader title="分类" :headline="`数量: ${categories.length}`"/>
        </UCard>
        <UCard>
          <UPageList class="mx-8" divide>
              <UPageCard v-for="(category, index) in categories" :key="index" :to="`/category/${category.name}`" color="neutral" variant="link">
                <UUser :name="category.name" :description="`数量: ${category.count}`" size="xl" />
              </UPageCard>
            </UPageList>
        </UCard>
    </UPageBody>
    </UPage>
</template>

<script setup>

const{ data: categories } = await useAsyncData(`categories`, async () => {
    return queryCollection('article').select('meta').all().then(articles => {
        const categoriesCounts = articles.reduce((acc, article) => {
            const categories = article.meta.categories;
            for (const category of categories) {
                acc[category] = (acc[category] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(categoriesCounts).map(([name, count]) => ({ name, count }));
    });
})
</script>