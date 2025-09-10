// 梦镜星轨 | Oneiria - 个性化二维码生成器 JavaScript
import QRCode from 'qrcode'

class OneiriaQRGenerator {
    constructor() {
        this.canvas = document.getElementById('qrcode');
        this.urlInput = document.getElementById('url-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.newQrBtn = document.getElementById('new-qr-btn');
        this.qrSection = document.getElementById('qr-section');
        this.configSection = document.getElementById('config-section');
        this.shareSection = document.getElementById('share-section');
        this.shareUrlInput = document.getElementById('share-url');
        this.copyShareBtn = document.getElementById('copy-share-btn');
        
        // 图片上传相关
        this.bgImageUpload = document.getElementById('bg-image-upload');
        this.uploadArea = document.getElementById('upload-area');
        this.imagePreview = document.getElementById('image-preview');
        this.previewImg = document.getElementById('preview-img');
        this.removeImageBtn = document.getElementById('remove-image-btn');
        
        // 配置选项
        this.sizeSlider = document.getElementById('size-slider');
        this.sizeValue = document.getElementById('size-value');
        this.errorLevel = document.getElementById('error-level');
        this.qrForegroundColor = document.getElementById('qr-foreground-color');
        this.qrBackgroundColor = document.getElementById('qr-background-color');
        this.bgOpacity = document.getElementById('bg-opacity');
        this.opacityValue = document.getElementById('opacity-value');
        this.bgBlendMode = document.getElementById('bg-blend-mode');
        this.colorExtractedInfo = document.getElementById('color-extracted-info');
        
        this.currentQRCode = null;
        this.backgroundImage = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSizeDisplay();
        this.updateOpacityDisplay();
        
        // 检查URL参数并恢复配置
        this.loadConfigFromURL();
    }

    bindEvents() {
        // 生成按钮事件
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        
        // 回车键生成
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateQRCode();
            }
        });

        // 下载按钮事件
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        
        // 分享按钮事件
        this.shareBtn.addEventListener('click', () => this.generateShareLink());
        this.copyShareBtn.addEventListener('click', () => this.copyShareLink());
        
        // 新二维码按钮事件
        this.newQrBtn.addEventListener('click', () => this.resetGenerator());

        // 图片上传事件
        this.bgImageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.removeImageBtn.addEventListener('click', () => this.removeBackgroundImage());
        
        // 拖拽上传事件
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // 配置选项事件
        this.sizeSlider.addEventListener('input', () => this.updateSizeDisplay());
        this.qrForegroundColor.addEventListener('change', () => this.updateQRCode());
        this.qrBackgroundColor.addEventListener('change', () => this.updateQRCode());
        this.bgOpacity.addEventListener('input', () => this.updateOpacityDisplay());
        this.bgBlendMode.addEventListener('change', () => this.updateQRCode());
    }

    async generateQRCode() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('请输入有效的URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('请输入有效的URL格式');
            return;
        }

        this.showLoading(true);
        
        try {
            const size = parseInt(this.sizeSlider.value);
            const errorCorrectionLevel = this.errorLevel.value;
            
            // 生成二维码到临时canvas
            const tempCanvas = document.createElement('canvas');
            const foregroundColor = this.qrForegroundColor.value;
            const backgroundColor = this.qrBackgroundColor.value;
            
            await QRCode.toCanvas(tempCanvas, url, {
                width: size,
                margin: 2,
                color: {
                    dark: foregroundColor,
                    light: backgroundColor
                },
                errorCorrectionLevel: errorCorrectionLevel
            });

            // 绘制到主canvas，支持背景图片
            this.drawQRCodeWithBackground(tempCanvas, size);

            this.currentQRCode = url;
            this.showQRCode();
            this.showConfig();
            
        } catch (error) {
            console.error('生成二维码失败:', error);
            this.showError('生成二维码失败，请重试');
        } finally {
            this.showLoading(false);
        }
    }

    showQRCode() {
        this.qrSection.style.display = 'block';
        this.qrSection.classList.add('show');
        
        // 滚动到二维码区域
        this.qrSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    showConfig() {
        this.configSection.style.display = 'block';
        this.configSection.classList.add('show');
    }


    downloadQRCode() {
        if (!this.currentQRCode) {
            this.showError('请先生成二维码');
            return;
        }

        try {
            // 创建下载链接
            const link = document.createElement('a');
            link.download = `oneiria-qr-${Date.now()}.png`;
            link.href = this.canvas.toDataURL('image/png');
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess('静态二维码下载成功！');
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('下载失败，请重试');
        }
    }



    resetGenerator() {
        // 清空输入
        this.urlInput.value = '';
        
        // 重置背景图片
        this.removeBackgroundImage();
        
        // 隐藏二维码区域
        this.qrSection.style.display = 'none';
        this.qrSection.classList.remove('show');
        
        // 隐藏配置区域
        this.configSection.style.display = 'none';
        this.configSection.classList.remove('show');
        
        // 清空画布
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 重置状态
        this.currentQRCode = null;
        
        // 聚焦到输入框
        this.urlInput.focus();
    }

    updateSizeDisplay() {
        this.sizeValue.textContent = `${this.sizeSlider.value}px`;
    }


    updateOpacityDisplay() {
        this.opacityValue.textContent = this.bgOpacity.value;
    }

    // 更新二维码颜色
    updateQRCode() {
        if (!this.currentQRCode) return;
        
        // 重新生成二维码
        this.generateQRCode();
    }

    // 生成分享链接
    generateShareLink() {
        if (!this.currentQRCode) {
            this.showError('请先生成二维码');
            return;
        }

        try {
            const config = this.getCurrentConfig();
            const shareUrl = this.createShareURL(config);
            
            // 检查URL长度并给出相应提示
            const urlLength = shareUrl.length;
            let message = '分享链接已生成！';
            
            if (urlLength > 1500) {
                message += ' (已压缩背景图片以缩短链接)';
            }
            
            if (shareUrl.includes('noimg=1')) {
                message = '分享链接已生成！ (由于背景图片过大，已生成不包含背景的版本)';
            }
            
            this.shareUrlInput.value = shareUrl;
            this.shareSection.style.display = 'block';
            
            // 更新分享信息显示
            this.updateShareInfo(urlLength, shareUrl.includes('noimg=1'));
            
            // 滚动到分享区域
            this.shareSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            this.showSuccess(message);
            
            // 在控制台显示URL长度信息
            console.log(`分享链接长度: ${urlLength} 字符`);
            if (urlLength > 2000) {
                console.warn('警告: 分享链接较长，可能在某些浏览器中无法正常工作');
            }
            
        } catch (error) {
            console.error('生成分享链接失败:', error);
            this.showError('生成分享链接失败，请重试');
        }
    }

    // 获取当前配置
    getCurrentConfig() {
        return {
            url: this.currentQRCode,
            size: this.sizeSlider.value,
            errorLevel: this.errorLevel.value,
            foregroundColor: this.qrForegroundColor.value,
            backgroundColor: this.qrBackgroundColor.value,
            bgOpacity: this.bgOpacity.value,
            bgBlendMode: this.bgBlendMode.value,
            hasBackground: !!this.backgroundImage
        };
    }

    // 创建分享URL
    createShareURL(config) {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        // 编码配置参数
        params.set('url', config.url);
        params.set('size', config.size);
        params.set('error', config.errorLevel);
        params.set('fg', config.foregroundColor);
        params.set('bg', config.backgroundColor);
        params.set('opacity', config.bgOpacity);
        params.set('blend', config.bgBlendMode);
        
        if (config.hasBackground && this.backgroundImage) {
            // 尝试压缩背景图片以减少URL长度
            const compressedImageData = this.compressBackgroundImage();
            if (compressedImageData) {
                // 检查压缩后的数据长度
                const fullUrl = `${baseUrl}?${params.toString()}&bgimg=${compressedImageData}`;
                if (fullUrl.length > 2000) { // 如果仍然太长，使用替代方案
                    return this.createShareURLWithoutImage(config);
                }
                params.set('bgimg', compressedImageData);
            }
        }
        
        const shareUrl = `${baseUrl}?${params.toString()}`;
        
        // 检查最终URL长度
        if (shareUrl.length > 2000) {
            return this.createShareURLWithoutImage(config);
        }
        
        return shareUrl;
    }

    // 压缩背景图片
    compressBackgroundImage() {
        if (!this.backgroundImage) return null;
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 限制最大尺寸以减少数据量
            const maxSize = 400;
            const scale = Math.min(maxSize / this.backgroundImage.width, maxSize / this.backgroundImage.height);
            canvas.width = this.backgroundImage.width * scale;
            canvas.height = this.backgroundImage.height * scale;
            
            // 绘制压缩后的图片
            ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
            
            // 使用更低的JPEG质量
            return canvas.toDataURL('image/jpeg', 0.6);
        } catch (error) {
            console.error('压缩背景图片失败:', error);
            return null;
        }
    }

    // 创建不包含背景图片的分享链接
    createShareURLWithoutImage(config) {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        // 只包含基本配置，不包含背景图片
        params.set('url', config.url);
        params.set('size', config.size);
        params.set('error', config.errorLevel);
        params.set('fg', config.foregroundColor);
        params.set('bg', config.backgroundColor);
        params.set('opacity', config.bgOpacity);
        params.set('blend', config.bgBlendMode);
        params.set('noimg', '1'); // 标记为无背景图片版本
        
        return `${baseUrl}?${params.toString()}`;
    }

    // 复制分享链接
    async copyShareLink() {
        try {
            await navigator.clipboard.writeText(this.shareUrlInput.value);
            this.showSuccess('分享链接已复制到剪贴板！');
            
            // 更新按钮文本
            const originalText = this.copyShareBtn.innerHTML;
            this.copyShareBtn.innerHTML = '<span>已复制</span>';
            setTimeout(() => {
                this.copyShareBtn.innerHTML = originalText;
            }, 2000);
        } catch (error) {
            console.error('复制失败:', error);
            // 降级方案：选中文本
            this.shareUrlInput.select();
            this.shareUrlInput.setSelectionRange(0, 99999);
            this.showSuccess('链接已选中，请手动复制');
        }
    }

    // 从URL参数加载配置
    loadConfigFromURL() {
        // 处理Vite开发服务器的URL参数问题
        const urlParams = this.parseURLParameters();
        
        if (urlParams.has('url')) {
            // 恢复基本配置
            this.urlInput.value = urlParams.get('url');
            
            if (urlParams.has('size')) {
                this.sizeSlider.value = urlParams.get('size');
                this.updateSizeDisplay();
            }
            
            if (urlParams.has('error')) {
                this.errorLevel.value = urlParams.get('error');
            }
            
            if (urlParams.has('fg')) {
                this.qrForegroundColor.value = urlParams.get('fg');
            }
            
            if (urlParams.has('bg')) {
                this.qrBackgroundColor.value = urlParams.get('bg');
            }
            
            if (urlParams.has('opacity')) {
                this.bgOpacity.value = urlParams.get('opacity');
                this.updateOpacityDisplay();
            }
            
            if (urlParams.has('blend')) {
                this.bgBlendMode.value = urlParams.get('blend');
            }
            
            // 检查是否为无背景图片版本
            const isNoImageVersion = urlParams.has('noimg') && urlParams.get('noimg') === '1';
            
            if (isNoImageVersion) {
                // 显示提示信息
                this.showSuccess('已加载分享配置 (不包含背景图片)');
                console.log('加载了不包含背景图片的分享配置');
            } else if (urlParams.has('bgimg')) {
                // 恢复背景图片
                this.loadBackgroundFromBase64(urlParams.get('bgimg'));
            }
            
            // 自动生成二维码
            setTimeout(() => {
                this.generateQRCode();
            }, 500);
        }
    }

    // 从base64加载背景图片
    loadBackgroundFromBase64(base64Data) {
        try {
            this.backgroundImage = new Image();
            this.backgroundImage.onload = () => {
                this.showImagePreview(base64Data);
                this.showSuccess('背景图片已从分享链接加载！');
            };
            this.backgroundImage.src = base64Data;
        } catch (error) {
            console.error('加载背景图片失败:', error);
        }
    }

    // 从背景图片中提取颜色
    extractColorsFromImage() {
        if (!this.backgroundImage) return;

        try {
            // 创建临时canvas来分析图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置canvas尺寸（使用较小尺寸提高性能）
            const maxSize = 200;
            const scale = Math.min(maxSize / this.backgroundImage.width, maxSize / this.backgroundImage.height);
            canvas.width = this.backgroundImage.width * scale;
            canvas.height = this.backgroundImage.height * scale;
            
            // 绘制图片到canvas
            ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
            
            // 获取图片数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            // 分析颜色
            const colors = this.analyzeColors(pixels);
            
            // 设置提取到的颜色
            this.setExtractedColors(colors);
            
            console.log('提取到的颜色:', colors);
            
        } catch (error) {
            console.error('颜色提取失败:', error);
        }
    }

    // 分析图片中的颜色
    analyzeColors(pixels) {
        const colorCounts = {};
        const sampleSize = 1000; // 采样数量
        const step = Math.max(1, Math.floor(pixels.length / 4 / sampleSize));
        
        // 采样像素
        for (let i = 0; i < pixels.length; i += step * 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // 跳过透明像素
            if (a < 128) continue;
            
            // 将颜色量化到较少的色调
            const quantizedR = Math.floor(r / 32) * 32;
            const quantizedG = Math.floor(g / 32) * 32;
            const quantizedB = Math.floor(b / 32) * 32;
            
            const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // 按出现频率排序
        const sortedColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return { r, g, b, hex: this.rgbToHex(r, g, b) };
            });
        
        // 选择最合适的颜色
        const dominantColor = sortedColors[0];
        const secondaryColor = this.findContrastingColor(dominantColor, sortedColors);
        
        return {
            dominant: dominantColor.hex,
            secondary: secondaryColor.hex,
            all: sortedColors.slice(0, 5).map(c => c.hex)
        };
    }

    // 查找对比色
    findContrastingColor(dominantColor, colors) {
        const dominantLuminance = this.getLuminance(dominantColor.r, dominantColor.g, dominantColor.b);
        
        // 寻找与主色对比度最高的颜色
        let bestContrast = 0;
        let bestColor = colors[1] || { r: 255, g: 255, b: 255 };
        
        for (const color of colors.slice(1, 10)) {
            const luminance = this.getLuminance(color.r, color.g, color.b);
            const contrast = Math.abs(dominantLuminance - luminance);
            
            if (contrast > bestContrast) {
                bestContrast = contrast;
                bestColor = color;
            }
        }
        
        return bestColor;
    }

    // 计算颜色亮度
    getLuminance(r, g, b) {
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // RGB转十六进制
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // 设置提取到的颜色
    setExtractedColors(colors) {
        // 设置二维码颜色（使用对比度较高的颜色）
        this.qrForegroundColor.value = colors.dominant;
        
        // 设置背景颜色（使用对比色或白色）
        this.qrBackgroundColor.value = colors.secondary;
        
        // 显示颜色提取信息
        this.colorExtractedInfo.style.display = 'block';
        this.colorExtractedInfo.innerHTML = `
            <span class="extracted-color-label">从背景图片提取</span>
            <div style="margin-top: 8px; font-size: 0.8rem; color: #b8b8b8;">
                主色: <span style="color: ${colors.dominant}; font-weight: 600;">${colors.dominant}</span> | 
                辅色: <span style="color: ${colors.secondary}; font-weight: 600;">${colors.secondary}</span>
            </div>
        `;
        
        // 更新颜色预览
        this.updateColorPreview(colors);
        
        // 显示提取结果
        this.showSuccess(`已提取颜色：主色 ${colors.dominant}，辅色 ${colors.secondary}`);
    }

    // 更新颜色预览
    updateColorPreview(colors) {
        const colorPreview = document.getElementById('color-preview');
        if (colorPreview) {
            colorPreview.innerHTML = `
                <div class="color-swatch" style="background-color: ${colors.dominant};" title="主色: ${colors.dominant}"></div>
                <div class="color-swatch" style="background-color: ${colors.secondary};" title="辅色: ${colors.secondary}"></div>
            `;
        }
    }

    // 更新分享信息显示
    updateShareInfo(urlLength, isNoImageVersion) {
        const shareInfo = document.getElementById('share-info');
        if (!shareInfo) return;

        let infoHtml = '<p class="share-description">复制此链接分享给他人，他们可以直接访问相同的二维码配置</p>';
        
        // 添加URL长度信息
        infoHtml += `<div class="url-length-info">`;
        infoHtml += `<span class="length-label">链接长度: ${urlLength} 字符</span>`;
        
        if (urlLength > 2000) {
            infoHtml += `<span class="length-warning">⚠️ 链接较长，可能无法正常分享</span>`;
        } else if (urlLength > 1500) {
            infoHtml += `<span class="length-info">ℹ️ 链接较长，已自动压缩</span>`;
        } else {
            infoHtml += `<span class="length-ok">✅ 链接长度正常</span>`;
        }
        
        if (isNoImageVersion) {
            infoHtml += `<span class="no-image-notice">📷 此链接不包含背景图片</span>`;
        }
        
        infoHtml += `</div>`;
        
        shareInfo.innerHTML = infoHtml;
    }

    // 解析URL参数，兼容Vite开发服务器
    parseURLParameters() {
        let searchParams = window.location.search;
        
        // 调试信息
        console.log('原始URL:', window.location.href);
        console.log('search参数:', window.location.search);
        console.log('hash参数:', window.location.hash);
        
        // 如果URL被Vite重写，尝试从hash中获取参数
        if (!searchParams && window.location.hash.includes('?')) {
            searchParams = window.location.hash.split('?')[1];
            console.log('从hash中获取参数:', searchParams);
        }
        
        // 如果仍然没有参数，尝试从完整的URL中解析
        if (!searchParams) {
            const fullUrl = window.location.href;
            const urlParts = fullUrl.split('?');
            if (urlParts.length > 1) {
                searchParams = '?' + urlParts.slice(1).join('?');
                console.log('从完整URL中解析参数:', searchParams);
            }
        }
        
        // 处理编码问题
        if (searchParams) {
            try {
                // 尝试解码URL
                searchParams = decodeURIComponent(searchParams);
                console.log('解码后的参数:', searchParams);
            } catch (e) {
                console.warn('URL解码失败，使用原始参数:', e);
            }
        }
        
        const urlParams = new URLSearchParams(searchParams);
        console.log('最终解析的参数:', Object.fromEntries(urlParams));
        
        return urlParams;
    }

    // 图片上传处理
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadBackgroundImage(file);
        } else {
            this.showError('请选择有效的图片文件');
        }
    }

    // 拖拽处理
    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadBackgroundImage(files[0]);
        } else {
            this.showError('请拖拽有效的图片文件');
        }
    }

    // 加载背景图片
    loadBackgroundImage(file) {
        console.log('开始加载背景图片:', file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            this.backgroundImage = new Image();
            this.backgroundImage.onload = () => {
                console.log('背景图片加载完成:', this.backgroundImage.width, 'x', this.backgroundImage.height);
                this.showImagePreview(e.target.result);
                
                // 从背景图片中提取颜色
                this.extractColorsFromImage();
                
                this.showSuccess('背景图片加载成功！');
            };
            this.backgroundImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 显示图片预览
    showImagePreview(imageSrc) {
        this.previewImg.src = imageSrc;
        this.imagePreview.style.display = 'block';
        this.uploadArea.style.display = 'none';
    }

    // 移除背景图片
    removeBackgroundImage() {
        this.backgroundImage = null;
        this.imagePreview.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.bgImageUpload.value = '';
        
        // 隐藏颜色提取信息
        this.colorExtractedInfo.style.display = 'none';
        
        // 重置颜色为默认值
        this.qrForegroundColor.value = '#000000';
        this.qrBackgroundColor.value = '#ffffff';
        
        this.showSuccess('背景图片已移除');
    }

    // 绘制带背景的二维码
    drawQRCodeWithBackground(qrCanvas, size) {
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = size;
        this.canvas.height = size;
        
        // 清空canvas
        ctx.clearRect(0, 0, size, size);
        
        console.log('绘制二维码，背景图片状态:', !!this.backgroundImage);
            
            // 绘制背景
        if (this.backgroundImage) {
            console.log('绘制背景图片');
            this.drawBackgroundImage(ctx, size);
        } else {
            console.log('使用默认白色背景');
            // 默认白色背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
        }
        
        // 绘制二维码，使用混合模式让白色部分透明
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(qrCanvas, 0, 0, size, size);
        ctx.restore();
    }

    // 绘制背景图片
    drawBackgroundImage(ctx, size) {
        const opacity = parseFloat(this.bgOpacity.value);
        const blendMode = this.bgBlendMode.value;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = blendMode;
        
        // 计算图片缩放和位置，保持宽高比并填充整个canvas
        const imgAspect = this.backgroundImage.width / this.backgroundImage.height;
        const canvasAspect = size / size;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspect > canvasAspect) {
            // 图片更宽，以高度为准
            drawHeight = size;
            drawWidth = size * imgAspect;
            drawX = (size - drawWidth) / 2;
            drawY = 0;
        } else {
            // 图片更高，以宽度为准
            drawWidth = size;
            drawHeight = size / imgAspect;
            drawX = 0;
            drawY = (size - drawHeight) / 2;
        }
        
        ctx.drawImage(this.backgroundImage, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
    }






    showLoading(show) {
        const btnText = this.generateBtn.querySelector('.btn-text');
        const btnLoading = this.generateBtn.querySelector('.btn-loading');
        
        if (show) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'block';
            this.generateBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            this.generateBtn.disabled = false;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a52)';
        } else {
            notification.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
        }
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    try {
        new OneiriaQRGenerator();
        
        // 添加页面加载动画
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        console.log('梦镜星轨 | Oneiria 初始化成功');
    } catch (error) {
        console.error('初始化失败:', error);
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0c0c0c; color: white; font-family: 'Noto Sans SC', sans-serif;">
                <div style="text-align: center;">
                    <h1 style="color: #ff6b6b; margin-bottom: 20px;">初始化失败</h1>
                    <p style="margin-bottom: 20px;">${error.message}</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #4ecdc4; border: none; border-radius: 5px; color: white; cursor: pointer;">重新加载</button>
                </div>
            </div>
        `;
    }
});

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 快速生成
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn && !generateBtn.disabled) {
            generateBtn.click();
        }
    }
    
    // Escape 重置生成器
    if (e.key === 'Escape') {
        const newQrBtn = document.getElementById('new-qr-btn');
        if (newQrBtn) {
            newQrBtn.click();
        }
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// 性能优化：使用 requestAnimationFrame 优化动画
function optimizeAnimations() {
    const animatedElements = document.querySelectorAll('.spiral-ring, .sakura');
    animatedElements.forEach(element => {
        element.style.willChange = 'transform';
    });
}

// 页面完全加载后优化动画
window.addEventListener('load', optimizeAnimations);
