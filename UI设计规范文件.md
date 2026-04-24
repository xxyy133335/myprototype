# myPrototype UI 设计与视觉规范 (Design System)

  

项目所属: 江森自控 (Johnson Controls) - 仓储与试制管理系统

版本: V1.1

基准参考文件: 20260414.html

  

## 更新记录

- V1.1 (2026-04-20): 对齐 20260414.html 实际实现，补充单页面架构、组件变体、交互细节规范
- V1.0 (初始版本): 基础设计系统建立

  

1\. 设计理念 (Design Philosophy)

  

本系统的设计遵循以下 B 端企业级应用原则：

  

专业严谨：以江森自控品牌蓝为主基调，传递工业科技与可靠性。

  

高效克制：去除冗余装饰，以数据和任务为核心，降低用户的视觉噪音。

  

状态明确：建立严格的语义化色彩系统（红绿灯原则），让异常与预警一目了然。

  

2\. 色彩规范 (Color Palette)

  

2.1 品牌与主色调 (Brand & Primary)

  

江森蓝 (Primary Blue) | #003366

  

用途: 侧边栏背景、主按钮背景、顶级标题强调、登录页主视觉。

  

科技青 (Accent Teal) | #00A3E0

  

用途: 选中状态高亮、文本链接、次级操作按钮（边框/文字）、输入框聚焦发光效果。

  

2.2 状态与语义色 (Semantic Colors)

  

严格用于反馈系统状态，不可滥用。

  

告警红 (Danger Red) | #E63946

  

用途: 安全库存跌破预警、严重超时、错误提示、消息角标、删除/驳回操作。

  

预警橙 (Warning Orange) | #F4A261

  

用途: 呆滞/账龄超期关注、暂存状态。

  

成功绿 (Success Green) | #2A9D8F

  

用途: 正常流转率、审批通过、操作成功提示。

  

标黄高亮 (Highlight Yellow) | 背景 #FFFDF0 / 边框 #FFE082 / 文本图标 #F57F17

  

用途: 针对高频且核心的操作（如：多条移库、二维码生成软件）进行视觉提亮。

  

2.3 中性色与灰阶 (Neutrals & Grayscale)

  

主背景色 (Background Gray) | #F5F7FA

  

用途: 整个网页的底层背景。

  

卡片背景 (Card White) | #FFFFFF

  

用途: 所有内容承载卡片、表格容器、表单区域。

  

主标题/正文重 (Text Dark) | #333333

  

用途: 一级/二级标题、重要数据数值、深色强调文本。

  

常规正文/辅助文字 (Text Light) | #666666

  

用途: 列表描述、次要信息、时间戳、表头文字。

  

分割线/边框 (Border Line) | #E0E0E0 或 #F0F0F0

  

用途: 卡片头部与内容分割线、输入框默认边框、列表底边。

  

3\. 字体规范 (Typography)

  

全局字体家族: 'Segoe UI', 'Microsoft YaHei' (微软雅黑), sans-serif

  

主页标题 (Page Title): 24px | Font-weight: 600 | 颜色: #333333

  

卡片标题 (Card Title): 16px | Font-weight: 600 | 颜色: #333333

  

数据大数字 (Stat Value): 32px | Font-weight: 700

  

标准正文 (Body Text): 14px | Font-weight: 400 | 颜色: #333333 或 #666666

  

辅助说明 (Meta/Small): 12px - 13px | Font-weight: 400 | 颜色: #888888

  

4\. 空间与布局 (Layout & Grid)

  

4.1 宏观架构

  

**单页面应用 (SPA) 架构:**

- 使用 `.screen` 类控制视图切换，默认 `display: none`
- 激活视图使用 `.screen.active`，`display: flex`
- 视图切换动画: `fadeIn 0.4s ease`
- 主要视图 ID: `#login-screen`, `#dashboard-screen`, `#inbound-screen`, `#outbound-screen` 等

  

侧边栏 (Sidebar): 固定宽度 250px

  

顶部导航栏 (Header): 固定高度 64px，吸顶 (sticky)

  

主内容区 (Main Content): 占据剩余流式空间

  

内部安全区 (Container): 左右内边距 30px，最大宽度限制 1400px (保证在大屏显示器下排版不松散)

  

4.2 间距系统 (Spacing)

  

统一采用 4 的倍数或 5 的倍数原则：

  

卡片内部 Padding: 20px - 24px

  

卡片之间 Grid Gap: 20px - 25px

  

列表项之间间距: 16px

  

5\. 核心组件 (UI Components)

  

5.1 阴影与圆角 (Shadows & Radius)

  

基础卡片圆角 (Card Radius): 8px

  

按钮/输入框圆角 (Control Radius): 6px

  

标签/微章圆角 (Tag Radius): 4px

  

标准卡片阴影 (Card Shadow): box-shadow: 0 4px 12px rgba(0,0,0,0.05); (轻量、干净的投影)

  

弹窗/登录框阴影 (Modal Shadow): box-shadow: 0 8px 24px rgba(0, 51, 102, 0.1); (更重的深度，带有微弱品牌蓝色调)

  

5.2 按钮 (Buttons)

  

主按钮 (.btn-primary): 背景 #003366，文字白色，Hover 时变深 #002244。

  



高亮按钮 (.btn-highlight / .action-btn.highlight): 
- 背景 #FFFDF0，边框 1px solid #FFE082，文字/图标 #F57F17
- 用于高频核心操作的视觉提亮
- Hover: 背景变白，阴影加深

  



**按钮命名统一规范:**
- `.btn-primary` - 主按钮（蓝底白字）
- `.btn-outline` - 线框按钮（青边框）
- `.btn-highlight` - 高亮按钮（黄底橙字）
- `.btn-submit` - 表单提交专用
- `.btn-action` - 操作按钮（线框样式）

  

线框按钮 (.btn-outline): 边框 1px solid #00A3E0，文字 #00A3E0，背景透明；Hover 时背景变为 #00A3E0，文字变白。

  

5.3 标签 (Tags)

  

用于流程和状态的快速分类：

  

蓝色 (样机试制类): 背景 #E3F2FD，文字 #1976D2 — `.tag.blue`

  

紫色 (盘点系统类): 背景 #F3E5F5，文字 #7B1FA2 — `.tag.purple`

  

橙色 (报废/异常类): 背景 #FFF3E0，文字 #F57C00 — `.tag.orange`

  

绿色 (发运/完成类): 背景 #E8F5E9，文字 #388E3C — `.tag.green`

  



**类名写法:** 采用组合类名 `.tag.blue` 而非 BEM 写法 `.tag-blue`

  

5.4 输入框 (Input Fields)

  

默认状态: 边框 #E0E0E0，背景色 #FAFAFA

  

聚焦状态 (Focus): 边框变为 #00A3E0，背景色变为 #FFFFFF，外发光 box-shadow: 0 0 0 3px rgba(0, 163, 224, 0.1);

  



**搜索框 (.search-bar):**
- 背景: #F5F7FA
- 圆角: 20px (胶囊形)
- 宽度: 350px
- 聚焦: 边框变为科技青，背景变白

  



5.5 统计卡片 (Stat Cards)

  



基础样式: 白色背景，圆角 8px，阴影 0 4px 12px rgba(0,0,0,0.05)

  



**左侧彩色边框指示器 (.stat-card::before):**
- 宽度: 4px，高度: 100%
- danger: 告警红 #E63946
- warning: 预警橙 #F4A261
- primary: 江森蓝 #003366
- success: 成功绿 #2A9D8F

  



**悬停效果:** `transform: translateY(-2px)`

  



5.6 快捷操作按钮 (Quick Actions)

  



容器: `.quick-actions` - Grid 布局，2列

  



按钮 (.action-btn):
- 默认: 背景 #F5F7FA，无边框，圆角 8px
- 高亮 (.highlight): 背景 #FFFDF0，边框 1px solid #FFE082，图标 #F57F17
- 悬停: translateY(-2px)，背景变白，阴影加深

  

6\. 图标规范 (Iconography)

  

采用图标库: FontAwesome 6.x

  

侧边栏及主要功能使用面性图标 (Solid Icons, 如 fas fa-box)。

  

辅助信息（如时间、用户标识）使用线性图标 (Regular Icons, 如 far fa-clock)，以降低视觉重量。

  



7\. 侧边栏导航激活状态 (Sidebar Nav Active State)

  



激活状态 (.menu-item.active / .nav-link.active):
- 左边框: 4px solid #00A3E0 (科技青)
- 背景: rgba(255,255,255,0.1) (半透明白色)
- 文字: 白色，font-weight: 600
- 注意: 不使用纯色背景填充，保持左侧边框高亮风格

  



8\. CSS 架构模式

  



**原型开发阶段:**
- 单 HTML 文件，内联 `<style>` 标签
- 便于快速迭代和演示

  



**生产环境阶段:**
- 分离为外部 CSS 文件:
  - `variables.css` - CSS 变量定义
  - `layout.css` - 布局、侧边栏、导航
  - `components.css` - 按钮、表单、表格、标签等组件
- 参考实现: dashboard.html, pages/*.html

  

7\. 给 AI 生成后续页面的 Prompt 指令标准

  

如果您使用 AI 生成该系统的后续页面，请在 Prompt 末尾附带以下指令以确保一致性：

  

"请严格遵守 myPrototype 设计规范 (V1.1)：

  

使用原生 CSS :root 定义的江森蓝色 (#003366) 和科技青 (#00A3E0)。

  

页面背景使用 #F5F7FA，内容区域使用带圆角 8px 和阴影 0 4px 12px rgba(0,0,0,0.05) 的白色卡片包裹。

  

表格必须带表头底色、斑马纹，操作按钮使用青色线框按钮。

  

使用 FontAwesome 6 提供图标支持。

  

侧边栏导航激活状态使用左侧边框高亮 (4px solid #00A3E0) + 半透明背景。

  



统计卡片添加左侧彩色边框指示器，快捷操作按钮支持高亮变体。

  



表格必须带表头底色、斑马纹，操作按钮使用青色线框按钮。

  



标签类名使用组合写法如 `.tag.blue`，FontAwesome 6 提供图标支持。

  



保持字体采用 'Segoe UI', 'Microsoft YaHei'。"