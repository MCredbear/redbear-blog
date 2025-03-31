---
title: 记 2025 年 1 月 Flutter 更新后安卓构建失败
description: *省流：JDK 版本要为 11 且不要用 zing JDK
date: 2025-01-04
categories:
  - Programing
tags:
  - Flutter
  - Dart
  - Android
  - Java
---

# 记 2025 年 1 月 Flutter 更新后安卓构建失败

**省流：JDK 版本要为 11 且不要用 zing JDK**  
_`flutter doctor` 显示的 JDK 版本始终是 Android Studio 捆绑的 JDK 的版本，可能会让人误以为 `flutter config --jdk-dir=` 不生效_

放寒假的时候，想把以前做的项目翻新一下，结果构建安卓包的时候报错了，报错的地方是 `path` 依赖，同时还提示更新 AGP。

`path` 这种依赖是有 Native 部分的，换句话说就是在安卓上有 Java 代码。

我第一时间想到尝试降级 `path` 依赖，于是从另一个还能构建成功的项目里复制了 `path` 版本，但还是不行，又试了几个更旧的版本，也不行。然后我又尝试了从那个能构建的项目里复制 Android 的配置文件以及删除 `andoird` 目录重新从模板创建，依旧不行。根据 Gradle 的提示更新了 AGP，还是不行。

最后我想到，之前玩 Minecraft 的时候，用 zing JDK 就启动不了游戏，换成 open JDK 就可以了，于是我试了下换成 open JDK 11，构建成功了。
