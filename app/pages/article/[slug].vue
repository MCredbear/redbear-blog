<template>
  <UPage class="min-h-screen">
    <template #right>
      <UPageAside class="bg-transparent">
        <UCard class="bg-(--ui-bg)/75 backdrop-blur">
          <!-- <UContentNavigation :navigation="sideNavigation" highlight highlight-color="primary" color="primary"
            variant="pill" /> -->
          <UContentToc :title="markdown.title" :links="markdown.body.toc.links" class="bg-transparent backdrop-blur-none" />
        </UCard>
      </UPageAside>
    </template>
    <UPageBody>
      <UCard class="bg-(--ui-bg)/75 backdrop-blur mt-8 mx-8">
        <ContentRenderer class="prose dark:prose-invert max-w-screen" :value="markdown" />
      </UCard>
    </UPageBody>
  </UPage>
</template>


<script setup>
const slug = useRoute().params.slug

// const sideNavigation = ref([]);

const { data: markdown } = await useAsyncData(`article-${slug}`, async () => {
  const result = await queryCollection('article').path(`article/${slug}`).first();

  // function convertNode(node) {
  //   const result = {
  //     title: node.text,
  //     path: `#${node.id}`
  //   };

  //   if (node.children && node.children.length > 0) {
  //     result.children = node.children.map(convertNode);
  //   }

  //   return result;
  // };

  // sideNavigation.value = result.body.toc.links.map(convertNode);

  return result;
})


</script>
