<template>
  <div
    style="background-image: url('/usagi.jpg'); background-size: cover; background-position: center; height: 100vh; width: 100vw; overflow-y: auto;">
    <UHeader title="MCredbear 的神必地带" />
    <UPage>
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
      <UPageList class="mt-8">
        <UBlogPost class="mb-5" v-for="article in articles" :key="article.id" :date="article.date"
            :title="article.title" :description="article.description" :to="article.path" :badge="article.meta.tag"
          target="_blank" />
      </UPageList>
    </UPage>
  </div>
</template>

<script setup>
const sideNavigation = inject('sideNavigation');

const articles = ref([]);

onMounted(async () => {
  articles.value = await queryCollection('article').order("date", "DESC").select('title','description','date','meta','path').all();
  window.addEventListener('hashchange', async () => {
    articles.value = await queryCollection('article').order("date", "DESC").select('title','description','date','meta','path').all();
    if (window.location.hash == '#programing') {
      articles.value = articles.value.filter(article => article.meta.tag == 'Programing');
    } else if (window.location.hash == '#others') {
      articles.value = articles.value.filter(article => article.meta.tag != 'Programing');
    }
  });
});


</script>
