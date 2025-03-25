import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'override-path',
  extensions: ['.md'],
  transform(file) {
    return {
      ...file,
      path: `article/${file.title}`
    }
  },
})
