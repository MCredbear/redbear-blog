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
            <UPageHeader title="标签" :headline="`数量: ${tags.length}`"/>
        </UCard>
        <UCard>
            <!-- <UPageList class="mx-8"> -->
              <UButton v-for="(tag, index) in tags" :key="index" :label="tag" :to="`/tag/${tag}`" color="secondary" variant="link" />
            <!-- </UPageList> -->
        </UCard>
    </UPageBody>
    </UPage>
</template>

<script setup>

const{ data: tags } = await useAsyncData(`tags`, async () => {
    return queryCollection('article').select('meta').all().then(articles => {
        const tags = articles.flatMap(article => article.meta.tags);
        return Array.from(new Set(tags));
    });
})
</script>