<template>
    <div
      style="background-image: url('/usagi.jpg'); background-size: cover; background-position: center; height: 100vh; width: 100vw; overflow-y: auto;">
      <UHeader title="MCredbear 的神必地带" />
      <UPage>
        <template #right>
          <UPageAside>
            <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15">
              <!-- <UContentNavigation :navigation="sideNavigation" highlight highlight-color="primary" color="primary"
                variant="pill" /> -->
                <!-- <br /> -->
                <UContentToc :links="markdown.body.toc.links"/>
            </UCard>
          </UPageAside>
        </template>
  
        <UCard class="bg-(--ui-bg)/75 backdrop-blur mt-8">
          <ContentRenderer class="prose dark:prose-invert max-w-screen" :value="markdown" />
          <!-- <div v-if="markdownText" class="prose dark:prose-invert" v-html="renderMarkdown(markdownText)" />
          <div v-else class="grid gap-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div> -->
        </UCard>
      </UPage>
    </div>
  </template>
  
  
  <script setup>
  const slug = "Linux 通过环境变量使用 Nvidia 显卡（Prime 方案）"
  
  const sideNavigation = ref([]);
  
  const { data: markdown } = await useAsyncData(`articles-${slug}`, async () => {
    console.log(slug);
    const result = await queryCollection('article').path(`articles/${slug}`).first();
  
    function convertNode(node) {
      const result = {
        title: node.text,
        path: `#${node.id}`
      };
  
      if (node.children && node.children.length > 0) {
        result.children = node.children.map(convertNode);
      }
  
      return result;
    };
  
    sideNavigation.value = result.body.toc.links.map(convertNode);
  
    return result;
  })
  
  
  </script>
  