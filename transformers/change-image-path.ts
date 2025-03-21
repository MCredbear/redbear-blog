import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'change-image-path',
  extensions: ['.md'],
  transform(file) {
    return {
      ...file,
      data() {
        return {
            
        }
      },
    }
  },
})
