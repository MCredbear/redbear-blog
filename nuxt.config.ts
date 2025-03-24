import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import chokidar from 'chokidar';

export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/ui-pro', '@nuxt/eslint', '@nuxt/content', '@nuxt/fonts', '@nuxt/image',
    '@nuxt/icon', '@nuxt/scripts'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-03-01',

  hub: { database: true },

  css: ['./main.css'],

  content: {
    build: {
      transformers: [
        './transformers/override-path',
        './transformers/override-reference',
      ],
      markdown: {
        toc: { depth: 4 },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai'
          },
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'xml', 'php', 'sql', 'python', 'java', 'csharp', 'c', 'cpp', 'ruby', 'perl', 'go', 'swift', 'kotlin', 'rust', 'scala', 'groovy', 'bash', 'powershell', 'dockerfile'],
        }
      },
    },
  },

  hooks: {
    build: {
      before(builder: any) {
        const articlesDir = path.resolve(__dirname, 'content/articles/');
        const outputDir = path.resolve(__dirname, 'public/local_references');

        async function processFilesInDirectory(dir: string, outputDir: string) {
          const filesAndDirs = fs.readdirSync(dir);

          for (const fileOrDir of filesAndDirs) {
            const fullPath = path.join(dir, fileOrDir);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              await processFilesInDirectory(fullPath, outputDir);
            } else {
              if (path.extname(fullPath) == '.md')
                continue;
              await handleFileChange(fullPath, outputDir);
            }
          }
        }

        async function handleFileChange(filePath: string, outputDir: string) {
          const fileName = encodeURIComponent(path.basename(filePath));
          const fileBuffer = Buffer.from(fileName);

          const hash = crypto.createHash('sha256');
          hash.update(fileBuffer);
          const fileHash = hash.digest('hex');

          const newFileName = `${fileHash}${path.extname(fileName)}`;
          const newFilePath = path.join(outputDir, newFileName);

          if (!fs.existsSync(newFilePath)) {
            fs.copyFileSync(filePath, newFilePath);
          }
        }

        if (fs.existsSync(outputDir)) {
          const files = fs.readdirSync(outputDir);
          for (const file of files) {
            const filePath = path.join(outputDir, file);
            fs.unlinkSync(filePath);
          }
        } else {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        if (process.env.NODE_ENV == 'production') {
          processFilesInDirectory(articlesDir, outputDir);
        } else {
          const watcher = chokidar.watch(articlesDir, {
            persistent: true,
            recursive: true,
            ignoreInitial: false,
            ignored: /\.md$/i,
          });

          watcher.on('add', async (filePath: string) => {
            if (fs.statSync(filePath).isFile()) {
              await handleFileChange(filePath, outputDir);
            }
          });

          // watcher.on('change', async (filePath: string) => {
          //   if (fs.statSync(filePath).isFile()) {
          //     await handleFileChange(filePath, outputDir);
          //   }
          // });
        }
      },
    },
  },
})