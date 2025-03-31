---
title: 用 Nuxt 全家桶搭建博客踩坑记录
description: 包含了 Nuxt 框架的各种 Bug 和对应的解决办法
date: 2025-03-26
categories:
  - Programing
tags:
  - Nuxt
  - Web
  - Cloudflare
---

# 用 Nuxt 全家桶搭建博客踩坑记录

*成品：[redbear-blog](github.com/MCredbear/redbear-blog/)，本文里没看懂的话可以直接来照抄代码*

作为一个千禧年之后出生的、顶着二次元头像的程序员，肯定希望自己的博客与众不同，于是我没用选择用 Hexo 这种现成的方案，而是用 Nuxt 手搓博客。

## 要用到的 Nuxt 框架的模块

- `@nuxt/content`: 用来管理 Markdown 文件，需要用到数据库，可以与 `@nuxt/ui-pro` 联动来检索和渲染 Markdown
- `@nuxt/ui-pro`: Nuxt 自己的 UI 组件库，可以与 `@nuxt/content` 联动来检索和渲染 Markdown
- `nuxthub`: Nuxt 与 Cloudflare 联动的平台，可以在部署时自动把 `@nuxt/content` 的数据库调成 Cloudflare D1 并上传（没有的话会自动创建），并且提供了一系列的 Cloudflare Bindings，_有部署时用不了非 ASCII 字符本地路径的 Bug，具体后面会说_
- `@nuxt/image`: Nuxt 自己的用来代替 HTML 原生 `<img>` 标签的东西，_其实可有可无，而且还有用不了非 ASCII 字符本地路径的 Bug，具体后面会说_

## ~~搭建~~踩坑步骤

### 第一坑：创建工程

根据 [NuxtHub 官网的命令](https://hub.nuxt.com/docs/getting-started/installation)创建工程

```
npx nuxthub init my-app
```

默认情况下它会使用 pnpm 作为包管理，但是不知道为什么 NuxtHub 官网上接下来启动 development server 的命令用的是 npm，正确的命令应该是

```
pnpm run dev
```

**然后你就会喜提找不到 better-sqlite 的 bindings 的报错**

#### 处理办法：

先给 pnpm 全局安装 `node-gyp`，然后删除工程目录里的 `node_modules`，再重新运行

```
pnpm install
```

执行完之后应该还会叫你再执行一下

```
pnpm approve-builds
```

### 第二坑：`@nuxt/content` 的 path 生成和文件请求

_注：我的文章标题和文件名是一样的_

_文件请求出错时记得检查 `.data/content/contents.sqlite` 文件_

我是想实现访问 `/articles/[文章标题]` 显示对应文章的，`[文章标题]` 里会带中文

`@nuxt/content` 官网上给出了差不多的实现方式：https://content.nuxt.com/docs/files/markdown#usage

它获取文件的代码是这么写的：

```ts
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').path(`/blog/${slug}`).first()
})
```

这里的 `.path()` 是根据 https://content.nuxt.com/docs/collections/types#path-generation 的规则生成的 path 属性请求文件，**但是这个规则没写全，除此之外它还会去掉所有非 ASCII 字符，也就是说中文没了，并且还会把空格替换成 `_`**

#### 处理办法：

1. 用 [transformers](https://content.nuxt.com/docs/getting-started/configuration#transformers) 覆盖掉原有的 path 生成：

```ts
import { defineTransformer } from "@nuxt/content";

export default defineTransformer({
  name: "override-path",
  extensions: [".md"],
  transform(file) {
    return {
      ...file,
      path: `blog/${file.title}`,
    };
  },
});
```

2. 改用 [stem](https://content.nuxt.com/docs/collections/types) 属性请求文件：

```ts
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').where('stem','=',`/blog/${slug}`).first()
})
```

### 第三坑：`@nuxt/image` 和 `nuxthub` 不支持非 ASCII 字符路径（中文路径） ＆ 实现在本地编辑 Markdown 时也能正常显示本地引用图片

- `@nuxt/image`: 在 dev 和 deploy 时都加载不了 public 里的中文路径的图片
- `nuxthub`: 如果不添加这个依赖，public 里的中文路径都是能正常访问的；如果添加了，在 deploy 一次之后，dev 时还是可以访问 public 的中文路径的，但 deploy 时就访问不了了

#### 处理办法：

这里假设你的 content 目录结构是这样的：

```
content/
└── blog/
       └── article1/
              ├── article1.md
              └── image1.png
```

并且你在 `article1.md` 里用 `![](./image1.png)` 来显示图片

先在 `nuxt.config.ts` 里添加一个脚本来自动把 `content/blog` 及其子目录下的所有非 Markdown 文件创建一个全英文的软链接到 public 目录下，这里使用文件名的哈希值作为新文件名：

```ts
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
        }
      },
    },
  },
```

再添加一个 [transformers](https://content.nuxt.com/docs/getting-started/configuration#transformers) 把存进 `@nuxt/content` 的数据库的 Markdown 里的本地引用的路径改成新路径：

```ts
import { defineTransformer } from '@nuxt/content'
import path from 'path';
import crypto from 'crypto';

function updateImageSrc(json: any): any {
    if (Array.isArray(json)) {
        return json.map(updateImageSrc);
    } else if (typeof json === "object" && json !== null) {
        for (const key in json) {
            if (key === "src" && typeof json[key] === "string" && json[key].startsWith("./")) {
                const fileName = path.basename(json[key]);
                const fileBuffer = Buffer.from(fileName);

                const hash = crypto.createHash('sha256');
                hash.update(fileBuffer);
                const fileHash = hash.digest('hex');

                const newFileName = `${fileHash}${path.extname(fileName)}`;
                json[key] = `/local_references/${newFileName}`;
            } else {
                json[key] = updateImageSrc(json[key]);
            }
        }
    }
    return json;
}

export default defineTransformer({
    name: 'override-reference',
    extensions: ['.md'],
    transform(file) {
        return {
            ...file,
            body: updateImageSrc(file.body)
        }
    },
})
```
