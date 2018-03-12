vipm-cli
==========================

- 一次安装
- 无繁琐的webpack配置，项目内无需install
- 支持zepto vue react
- 多种模板支持 pug art-template
- 多种css预处理支持 sass less stylus
- jsx jsx-vue支持
- 区分三个环境，开发，测试和正式
- 支持Mock，可Mock请求，包括fetch
- 支持js编译输出拆分
- 支持单页SPA和多页应用
- 支持dev-server作为简单的服务器，并且可以区分出环境
- 内置组件库，工具库（可根据需要引入）
- 支持编译组件和库
- js css 图片处理（压缩，雪碧图，px2rem）
- 同时支持移动端和PC端（>IE9）

## Install

```
  $   git clone https://github.com/yyfrontend/vipm-cli.git
  $   cd vipm-cli
  $   npm install
  $   npm link
```

## Usage

### vipm init

``` bash
$ vipm init
```

### vipm dev

``` bash
$ vipm dev(d) [env]
```

### vipm build

``` bash
$ vipm build(b) [env]
```
