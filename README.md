# 常用工具

使用 vue3 + TypeScript + antd 实现的单页面网站，主要是日常工作和开发时使用的一些小工具

地址：[http://tool.yvke.top](http://tool.yvke.top)

# 功能介绍

- 首页：当前日期信息以及假期的倒计时
- 时间工具
  - 时间戳转换: 毫秒与格式化日期时间的互转；特定格式的时间转化为毫秒和秒；计算日期天数差以及指定天数后的日期
  - 公里、农历互转
  - 节假日查询(暂未支持)
- 数字工具
  - 数字列表去重&排序
  - 简易版计算器
- 文本工具
  - 文本处理工具: 根据指定正则提取内容，剔除指定关键字，多行文本去重
  - 文本合并拆分：多行文本合并为单行， 单号文本拆分为多行
- 代码生成 (暂未支持)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Deploy for Production

```sh
scp -r ./dist root@tx:/root/website/open-tool/
```
