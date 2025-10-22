# memos-extensions

<p align="center">
 [<a href="https://github.com/yozi9257/memos-extensions/blob/main/README_EN.md">English</a>]  [<a href="https://github.com/yozi9257/memos-extensions/blob/main/README.md">简体中文</a>] 
</p>

memos 的浏览器扩展插件，可帮助你更便捷地使用 [memos](https://github.com/usememos/memos) 服务。

本插件基于 [memos-bber](https://github.com/lmm214/memos-bber) 项目开发，采用 React + TypeScript 进行重写，提升了代码可维护性与扩展性。

### 功能特点

*   一键发送文本、链接及图片至你的 memos 服务，无需跳转页面。
*   支持右键菜单快速分享，覆盖多种场景：
    
    *   发送选中的页面文本
    *   发送当前浏览页面的链接
    *   发送页面中的图片
*   内置功能丰富的编辑器：
    
    *   原生支持 Markdown 语法格式
    *   快速插入待办事项（Todo）
    *   一键添加当前页面链接
    *   支持文件与图片上传，粘贴图片可自动触发上传
*   可配置内容可见性，包含三种权限：仅自己可见、登录用户可见、所有人可见。
*   内置多语言支持，默认包含中文与英文。

### 安装方法

1.  访问项目 [Releases 页面](https://github.com/yozi9257/memos-extensions/releases)，下载最新版本的插件包。
2.  打开浏览器扩展程序管理页（Chrome/Edge 浏览器地址：`chrome://extensions/`）。
3.  开启页面右上角的「开发者模式」。
4.  将下载的插件包拖拽至扩展程序页面，完成安装。

### 使用说明

1.  安装后，点击浏览器工具栏中的「memos」图标，打开插件面板。
2.  进入设置页面，填写你的 memos 服务地址与访问令牌（Token）：
    
    *   访问令牌获取路径：memos 平台 → 个人设置 → 我的账户 → 访问令牌 → 新建令牌。
3.  配置完成后，可直接在插件编辑器中创建并发布新备忘录。
4.  浏览网页时，可通过右键菜单快速将内容分享至 memos。

### 许可证

本项目基于 **MIT 许可证**开源，详细许可条款请查看 [LICENSE](./LICENSE) 文件。
