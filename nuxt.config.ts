// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [//'@nuxt/image'
  '@nuxt/content', '@nuxthub/core', '@nuxt/ui-pro', '@nuxt/eslint'],

  css: ['./main.css'],

  hub: { database: true },

  content: {
    build: {
      transformers: [
        './transformers/override-path',
      ],
      markdown: {
        highlight: {
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai'
          },
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'xml', 'php', 'sql', 'python', 'java', 'csharp', 'c', 'cpp', 'ruby', 'perl', 'go', 'swift', 'kotlin', 'rust', 'scala', 'groovy', 'bash', 'powershell', 'dockerfile'],
        }
      },
    },
  },
})