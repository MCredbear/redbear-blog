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
            <UPageHeader title="归档" :headline="`数量: ${archives.length}`"/>
        </UCard>
        <UCard>
            <UPageList class="mx-8" divide>
              <UPageCard v-for="(archive, index) in archives" :key="index" :to="`/archive/${archive.name}`" color="neutral" variant="link">
                <UUser :name="archive.name" :description="`数量: ${archive.count}`" size="xl" />
              </UPageCard>
            </UPageList>
        </UCard>
    </UPageBody>
    </UPage>
</template>

<script setup>

const{ data: archives } = await useAsyncData(`archives`, async () => {
    return queryCollection('article').select('date').all().then(articles => {
        const archivesCounts = articles.reduce((acc, article) => {
            const year = article.date.split('-')[0];
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(archivesCounts).map(([name, count]) => ({ name, count }));
    });
})
</script>