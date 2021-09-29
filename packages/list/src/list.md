---
title: ProList - 高级列表
order: 12
group:
  path: /
nav:
  title: 组件
  path: /components
---

# ProList - 高级列表

## 何时使用

基于 ProTable 实现，可以认为是 ProTable 的一个特例，在完成一个标准的列表时即可使用。

## 代码演示

### 基本使用

<code src="./demos/base.tsx" background="#f5f5f5" title="基本使用" />

### 编辑列表

<code src="./demos/editable.tsx" background="#f5f5f5" title="编辑列表" />

### 支持展开的列表

<code src="./demos/expand.tsx" background="#f5f5f5" title="支持展开的列表" />

### 支持选中的列表

<code src="./demos/selectedRow.tsx" background="#f5f5f5" title="支持选中的列表"/>

### 查询列表

<code src="./demos/search.tsx" background="#f5f5f5" title="查询列表" />

### 带筛选和异步请求的列表

<code src="./demos/filter.tsx" background="#f5f5f5" title="带筛选和异步请求的列表" />

### 大小和分割线

<code src="./demos/size.tsx" background="#f5f5f5" title="大小和分割线" />

### 竖排样式

<code src="./demos/layout.tsx" background="#f5f5f5" title="竖排样式" />

### 一些预设的模式

<code src="./demos/special.tsx" background="#f5f5f5" title="一些预设的模式" />

### 翻页

<code src="./demos/pagination.tsx" background="#f5f5f5" title="翻页" />

### 卡片列表

<code src="./demos/card-list.tsx" background="#f5f5f5" title="卡片列表" />

## API

### ProList API

ProList 与 antd 的 [List](https://ant.design/components/list-cn/) 相比，API 设计上更像 Table，使得可以通过配置化的方式快速定义数据项的展现形式。也使得 Table 和 List 的切换变得更加容易。另外 ProList 基于 ProTable 实现，除了 Table 相关的 API 以外 ProList 支持大部分 ProTable 的 API。

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| dataSource | 与 antd 相同的[配置](https://ant.design/components/list-cn/#API) | `any[]` | `false` |
| metas | 列表项配置，类似 Table 中的 columns | `Metas` | - |
| rowKey | 行的 key，一般是行 id | `string` \| `(row,index)=>string` | `'id'` |
| headerTitle | 列表头部主标题 | `React.ReactNode` | - |
| loading | 是否加载中 | `boolean` \| `(item: any) => boolean` | `false` |
| split | 是否有分割线 | `boolean` | `false` |
| rowSelection | 与 antd 相同的[配置](https://ant.design/components/table-cn/#rowSelection) | `object` \|`boolean` | false |
| expandable | 与 antd 相同的[配置](https://ant.design/components/table-cn/#expandable) | `object` \| `false` | - |
| showActions | 何时展示 actions | `'hover'` \| `'always'` | `'always'` |
| showExtra | 何时展示 extra | `'hover'` \| `'always'` | `'always'` |
| onRow | 与 antd 相同的[配置](https://ant.design/components/table-cn/#onRow-%E7%94%A8%E6%B3%95) | `function(record, index)` | - |
| itemHeaderRender | 自定义每一列的 header，与 itemRender 不同的时，它会保留多选和展开收起 | - | - |

### 批量操作

与 ProTable 相同的[配置](https://procomponents.ant.design/components/table/#%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C)。

### Metas.[Meta] 通用 API

| 参数 | 说明 | 类型 | 默认值 |
| :-- | :-- | :-- | :-- |
| dataIndex | 数据在数据项中对应的路径，支持通过数组查询嵌套路径 | `string` \| `string[]` | - |
| valueType | 值的类型，和 ProTable 一致 | `'text'` \| `'date'` ... | `'text'` |
| render | 自定义渲染函数 | `(text: React.ReactNode,record: T,index: number) => React.ReactNode \| React.ReactNode[]` | - |

### Metas.type

对应 dataSource 的字段类型为 `'new'` \| `'top'` \| `'inline'`。

| 参数      | 说明 | 类型 | 默认值   |
| :-------- | :--- | :--- | :------- |
| dataIndex | -    | -    | `'type'` |

### Metas.title

| 参数      | 说明 | 类型 | 默认值    |
| :-------- | :--- | :--- | :-------- |
| dataIndex | -    | -    | `'title'` |

### Metas.subTitle

| 参数      | 说明 | 类型 | 默认值       |
| :-------- | :--- | :--- | :----------- |
| dataIndex | -    | -    | `'subTitle'` |

### Metas.description

| 参数      | 说明 | 类型 | 默认值          |
| :-------- | :--- | :--- | :-------------- |
| dataIndex | -    | -    | `'description'` |

### Metas.avatar

| 参数      | 说明 | 类型 | 默认值     |
| :-------- | :--- | :--- | :--------- |
| dataIndex | -    | -    | `'avatar'` |

### Metas.actions

| 参数      | 说明 | 类型 | 默认值      |
| :-------- | :--- | :--- | :---------- |
| dataIndex | -    | -    | `'actions'` |

### Metas.content

| 参数      | 说明 | 类型 | 默认值      |
| :-------- | :--- | :--- | :---------- |
| dataIndex | -    | -    | `'content'` |

### Metas.extra

| 参数      | 说明 | 类型 | 默认值    |
| :-------- | :--- | :--- | :-------- |
| dataIndex | -    | -    | `'extra'` |
