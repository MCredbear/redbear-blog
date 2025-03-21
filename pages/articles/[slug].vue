<template>
  <div
    style="background-image: url('/usagi.jpg'); background-size: cover; background-position: center; height: 100vh; width: 100vw; overflow-y: auto;">

    <UPage>
      <UCard class="bg-(--ui-bg)/75 backdrop-blur ml-15">
        <ContentRenderer class="prose dark:prose-invert max-w-screen" :value="markdown" />
      </UCard>
    </UPage>
  </div>
</template>


<script setup>
const slug = useRoute().params.slug

// const markdown = ref(null);

// onMounted(async () => {
//   markdown.value = await queryCollection('blog').path(`/articles/${slug}`).first();
// });


const { data: markdown } = await useAsyncData(`articles-${slug}`, async () => {
  return queryCollection('blog').path(`articles/${slug}`).first();
})

// import MarkdownIt from 'markdown-it';
// import frontMatter from 'markdown-it-front-matter';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark.css';

// const slug = useRoute().params.slug;

// const markdownText = ref('');

// const md = new MarkdownIt({
//   highlight: function (str, lang) {
//     if (lang && hljs.getLanguage(lang)) {
//       try {
//         return hljs.highlight(lang, str).value;
//       } catch (__) { }
//     }

//     return '';
//   }
// });

// md.use(frontMatter, fm => { });

// const fetchMarkdown = async (url) => {
//   try {
//     const response = await fetch(url);
//     if (response.ok) {
//       const text = await response.text();
//       markdownText.value = text;
//     } else {
//       console.error('Failed to fetch Markdown file:', response.status);
//     }
//   } catch (error) {
//     console.error('Error fetching Markdown:', error);
//   }
// };

// const renderMarkdown = (text) => {
//   return md.render(text);
// };

// onMounted(() => {
//   const markdownUrl = `/articles/${slug}.md`;
//   fetchMarkdown(markdownUrl);
// });

</script>
