# 梦镜星轨 | Oneiria

> 个性化二维码生成器 - 让每个二维码都成为独特的艺术品

## ✨ 项目简介

**梦镜星轨 | Oneiria** 是一个功能丰富的个性化二维码生成器。用户不仅可以生成精美的二维码，还能上传自定义背景图片、调整颜色、生成分享链接，让每个二维码都成为独特的艺术品。

## 🌟 核心功能

### 🎨 个性化定制
- **自定义颜色** - 自由设置二维码前景色和背景色
- **背景图片上传** - 支持拖拽上传图片作为二维码背景
- **智能颜色提取** - 自动从背景图片中提取最佳配色方案
- **混合模式** - 8种图片混合效果，创造独特视觉效果
- **透明度控制** - 精确调节背景图片透明度

### 📱 二维码生成
- **多种尺寸** - 200px-400px可调节二维码大小
- **容错级别** - 支持L/M/Q/H四个容错级别
- **实时预览** - 配置更改即时生效
- **高质量输出** - 支持PNG格式高清下载

### 🔗 分享功能
- **一键分享** - 生成包含完整配置的分享链接
- **配置恢复** - 通过链接自动恢复所有设置
- **背景图片分享** - 支持背景图片的完整分享
- **一键复制** - 快速复制分享链接到剪贴板

### 🎭 视觉效果
- **星旋装饰** - 三层旋转光环营造宇宙氛围
- **樱花飘落** - 浪漫的樱花飘落动画
- **渐变星空** - 深邃的星空背景效果
- **响应式设计** - 完美适配各种设备

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- 现代浏览器（支持ES6+）

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动开发服务器（推荐）
npm run dev

# 或者
npm start
```

开发服务器将在 `http://localhost:3000` 启动，支持热重载。

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建后的文件将输出到 `dist/` 目录。

## 📖 使用说明

### 基础使用
1. **输入URL** - 在输入框中输入要生成二维码的网址
2. **生成二维码** - 点击"生成星轨二维码"按钮
3. **个性化设置** - 调整二维码大小、容错级别、颜色等
4. **下载保存** - 点击"下载静态图"保存到本地

### 高级功能
1. **上传背景图片** - 点击或拖拽图片到上传区域
2. **智能配色** - 系统自动从背景图片提取最佳颜色
3. **调整效果** - 使用混合模式和透明度创造独特效果
4. **生成分享链接** - 点击"生成分享链接"创建可分享的配置

### 分享使用
1. **打开分享链接** - 在浏览器中打开分享链接
2. **自动加载** - 系统自动恢复所有配置和背景图片
3. **继续编辑** - 可以继续调整和修改设置
4. **重新分享** - 修改后可以生成新的分享链接

## 🎨 技术特性

### 前端技术栈

- **HTML5** - 语义化结构和现代API
- **CSS3** - 动画效果、响应式布局和混合模式
- **JavaScript ES6+** - 现代JavaScript特性和模块化
- **Vite** - 现代化构建工具和开发服务器
- **QRCode.js** - 二维码生成库
- **Canvas API** - 图片处理和颜色分析

### 构建工具

- **Vite 5.0** - 快速开发服务器和构建工具
- **ES6 模块** - 现代模块系统
- **热重载** - 开发时实时更新
- **代码分割** - 优化加载性能

### 核心算法

- **颜色提取算法** - 从图片中智能提取主色调和对比色
- **图片处理** - Canvas API进行图片缩放、压缩和格式转换
- **URL参数编码** - 完整的配置序列化和反序列化
- **Base64编码** - 图片数据的压缩和传输优化

### 动画效果

- **CSS3 动画** - 硬件加速的流畅动画
- **渐变背景** - 多色渐变营造梦幻氛围
- **关键帧动画** - 精确控制动画时序
- **变换效果** - 旋转、缩放、透明度变化

### 性能优化

- **Vite优化** - 快速的开发体验
- **代码分割** - 按需加载资源
- **Tree Shaking** - 移除未使用代码
- **图片压缩** - 背景图片自动压缩优化
- **Canvas优化** - 高效的图片处理算法

## 🎯 核心功能实现

### 二维码生成

```javascript
import QRCode from 'qrcode'

await QRCode.toCanvas(tempCanvas, url, {
    width: size,
    margin: 2,
    color: {
        dark: foregroundColor,  // 自定义前景色
        light: backgroundColor  // 自定义背景色
    },
    errorCorrectionLevel: errorCorrectionLevel
});
```

### 颜色提取算法

```javascript
// 从图片中提取主要颜色
analyzeColors(pixels) {
    const colorCounts = {};
    // 采样像素并量化颜色
    for (let i = 0; i < pixels.length; i += step * 4) {
        const r = Math.floor(pixels[i] / 32) * 32;
        const g = Math.floor(pixels[i + 1] / 32) * 32;
        const b = Math.floor(pixels[i + 2] / 32) * 32;
        // 统计颜色频率
    }
    // 返回对比度最高的颜色组合
}
```

### 分享链接生成

```javascript
// 创建包含完整配置的分享URL
createShareURL(config) {
    const params = new URLSearchParams();
    params.set('url', config.url);
    params.set('size', config.size);
    params.set('fg', config.foregroundColor);
    params.set('bg', config.backgroundColor);
    // 背景图片转换为base64
    if (config.hasBackground) {
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        params.set('bgimg', imageData);
    }
    return `${baseUrl}?${params.toString()}`;
}
```

### 背景图片处理

```javascript
// 绘制带背景的二维码
drawQRCodeWithBackground(qrCanvas, size) {
    // 绘制背景图片
    if (this.backgroundImage) {
        this.drawBackgroundImage(ctx, size);
    }
    // 使用混合模式绘制二维码
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(qrCanvas, 0, 0, size, size);
}
```

### 星旋动画

```css
@keyframes spiral-rotate {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
```

### 樱花飘落

```css
@keyframes sakura-fall {
    0% {
        transform: translateY(-100px) rotate(45deg);
        opacity: 1;
    }
    100% {
        transform: translateY(500px) rotate(405deg);
        opacity: 0;
    }
}
```

## 🎨 功能特色

### 智能颜色提取
- 自动分析背景图片的主要颜色
- 智能选择对比度最高的配色方案
- 实时预览提取结果

### 多种混合模式
- 正常、正片叠底、叠加
- 柔光、强光、颜色减淡
- 颜色加深、滤色

### 完整的分享系统
- 一键生成包含所有配置的分享链接
- 支持背景图片的完整分享
- 自动恢复配置和图片

## 🎬 功能演示

### 基础二维码生成
1. 输入目标URL
2. 选择二维码尺寸和容错级别
3. 自定义前景色和背景色
4. 一键生成并下载

### 个性化背景定制
1. 上传自定义背景图片
2. 系统自动提取最佳配色
3. 调整透明度和混合模式
4. 预览最终效果

### 分享协作
1. 生成包含完整配置的分享链接
2. 一键复制链接到剪贴板
3. 他人打开链接自动恢复所有设置
4. 支持继续编辑和重新分享

## 📱 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

## 🛠️ 开发说明

### 项目结构

```
Oneiria/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── vite.config.js      # Vite配置
├── package.json        # 项目配置
├── .gitignore         # Git忽略文件
└── README.md          # 项目说明
```

### Vite配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['qrcode']
  }
})
```

### 自定义配置

可以通过修改 `vite.config.js` 来自定义：

- 开发服务器端口
- 构建输出目录
- 代码分割策略
- 优化配置

### 扩展功能

项目采用模块化设计，易于扩展：

- 添加新的动画效果
- 集成更多二维码样式
- 支持批量生成
- 添加用户偏好保存
- 集成更多图片处理滤镜
- 支持更多分享平台

## 🎨 设计理念

**梦镜星轨 | Oneiria** 的设计灵感来源于：

- **宇宙星轨** - 旋转的光环象征永恒的时间流转
- **樱花飘落** - 粉色花瓣代表美好与希望
- **渐变星空** - 深邃的蓝色营造神秘氛围
- **现代简约** - 简洁的界面突出核心功能
- **个性化表达** - 让每个二维码都成为独特的艺术品
- **智能交互** - 通过AI辅助创造最佳视觉效果

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v2.0.0 (最新)
- ✨ 新增自定义颜色功能
- ✨ 新增背景图片上传支持
- ✨ 新增智能颜色提取算法
- ✨ 新增分享链接功能
- ✨ 新增多种混合模式
- 🎨 优化用户界面设计
- 🚀 提升性能和用户体验

### v1.0.0
- 🎉 初始版本发布
- ✨ 基础二维码生成功能
- ✨ 星旋和樱花动画效果
- ✨ 响应式设计支持

## 📞 联系我们

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]
- 邮箱：contact@oneiria.dev

---

**让每个二维码都成为独特的艺术品** ✨
