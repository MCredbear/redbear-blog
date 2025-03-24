---
date: 2020-10-04
description: 常用于没有开启独显直连的游戏本
tag: Programing
---

# Linux 通过环境变量使用 Nvidia 显卡（Prime 方案）

[为老显卡折腾 Prime OnDemand](https://zhuanlan.zhihu.com/p/355814581)

经过实际测试，AMD 的核显配上 Nvidia 的独显也是可以使用这个方案的。我的电脑是天选 1 代 2060 版（TUF Gaming 506 IV），当时这个笔记本刚出来的时候，我尝试了大黄蜂方案，但是没有成功，不过这个方案是可行的。

我用的系统是 Debian Testing，所以接下来的包管理命令是 `apt`。

## 让 AMD 核显可用

请先用 `uname -r` 检查你的 Linux 内核版本，5.x 以后的版本才有 AMD 核显驱动，若内核版本较低请先进行更新。

**Debian 10 才有 5.x 及以上版本的 Linux 内核**

然后安装 `firmware-amd-graphics`。

```
sudo apt install firmware-amd-graphics
```

然后禁用一下 `nouveau` 驱动，理论上接下来安装 Nvidia 驱动会自动禁用 nouveau 驱动，但保险起见你可以手动禁用一下。

## 安装 Nvidia 显卡驱动

直接使用 apt 源中的驱动即可，不需要去官网下载。

```
sudo apt install nvidia-driver nvidia-vulkan-common nvidia-vulkan-icd nvidia-vaapi-driver nvidia-vdpau-driver
```

安装完毕之后需要重启你的电脑。

## 配置环境变量

现在你已经可以通过在命令前加上
```
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia __VK_LAYER_NV_optimus=NVIDIA_only
```
来使用 Nvidia 显卡运行命令，例如：
```
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia __VK_LAYER_NV_optimus=NVIDIA_only glxgears -info
```
如果你使用的是 Bash，那么你可以在 ~/.bashrc 文件的最后加上一行：
```
alias optirun='__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia __VK_LAYER_NV_optimus=NVIDIA_only'
```
重新登录后就可以直接使用 optirun 代替冗长的环境变量。
```
optirun glxgears -info
```
你也可以极端一点把这段环境变量添加到 `/etc/profile` 中，所有应用程序均使用 Nvidia 显卡进行渲染，但是这么做会造成一些渲染错误。

## 可能遇到的问题

### DKMS 模块编译时可能会遇到以下问题：

- #### 编译器版本不对

  删除 /usr/bin/gcc 和 /usr/bin/g++ 再重新创建需要的编译器软链接，例如：
  ```
  sudo ln -s /usr/bin/gcc-11 /usr/bin/gcc
  sudo ln -s /usr/bin/g++-11 /usr/bin/g++
  ```

- #### 源码有错误

  *这种情况通常是因为 Nvidia 驱动和 Linux 内核没用同步更新。*
  
  **在进行以下步骤前，建议先卸载 nvidia-driver 以避免其它软件包安装失败。**
  
  - 如果你使用的是官方内核：
    
    ```
    sudo apt install linux-image-amd64 linux-headers-amd64
    ```
    安装完毕之后需要重启你的电脑，再安装 Nvidia 显卡驱动，应该可以解决绝大部分问题。
  
  - 如果你使用的是第三方内核：
    
    回退显卡驱动版本，然后等待两个星期再进行更新。我用 Liquorix 内核时就会遇到这种情况。

### 使用 Nvidia 独显连接外部显示器时，可能会遇到选不了更高的分辨率和帧数的问题：
往你的 grub 的 linux 内核参数上添加 `nvidia_drm.modeset=1`