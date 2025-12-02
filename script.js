 // DOM Elementlari
document.addEventListener('DOMContentLoaded', function() {
    // Asosiy elementlar
    const themeToggle = document.getElementById('themeToggle');
    const colorPickers = document.querySelectorAll('.color-picker');
    const colorHexes = document.querySelectorAll('.color-hex');
    const colorPreviews = document.querySelectorAll('.color-preview');
    const randomBtns = document.querySelectorAll('.random-btn');
    const randomPaletteBtn = document.getElementById('randomPalette');
    const savePaletteBtn = document.getElementById('savePalette');
    const copyPaletteBtn = document.getElementById('copyPalette');
    const exportCSSBtn = document.getElementById('exportCSS');
    const exportSCSSBtn = document.getElementById('exportSCSS');
    const exportJSONBtn = document.getElementById('exportJSON');
    const exportOutput = document.getElementById('exportOutput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const palettesGrid = document.getElementById('palettesGrid');
    const contrastModal = document.getElementById('contrastModal');
    const closeModal = document.querySelector('.close-modal');
    const contrastCheckerBtn = document.getElementById('contrastChecker');
    const colorPickerTool = document.getElementById('colorPickerTool');
    const imageExtractor = document.getElementById('imageExtractor');
    const imageUpload = document.getElementById('imageUpload');
    const communityPalettes = document.getElementById('communityPalettes');
    const sharePaletteBtn = document.getElementById('sharePalette');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Mavzuni o'zgartirish
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            showToast('Qora mavzu faollashtirildi');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            showToast('Oq mavzu faollashtirildi');
        }
    });
    
    // Rang tanlash funksiyalari
    function initColorPickers() {
        colorPickers.forEach((picker, index) => {
            const hexInput = colorHexes[index];
            const preview = colorPreviews[index];
            
            // Color picker o'zgarganda
            picker.addEventListener('input', function() {
                hexInput.value = this.value;
                preview.style.backgroundColor = this.value;
                updatePaletteDisplay();
                updatePreviewElements();
            });
            
            // Hex input o'zgarganda
            hexInput.addEventListener('input', function() {
                const color = this.value;
                if (isValidHex(color)) {
                    picker.value = color;
                    preview.style.backgroundColor = color;
                    updatePaletteDisplay();
                    updatePreviewElements();
                }
            });
            
            // Random tugmasi
            randomBtns[index].addEventListener('click', function() {
                const randomColor = getRandomColor();
                picker.value = randomColor;
                hexInput.value = randomColor;
                preview.style.backgroundColor = randomColor;
                updatePaletteDisplay();
                updatePreviewElements();
                showToast('Tasodifiy rang tanlandi: ' + randomColor);
            });
        });
    }
    
    // Butun palette uchun tasodifiy ranglar
    randomPaletteBtn.addEventListener('click', function() {
        colorPickers.forEach((picker, index) => {
            const randomColor = getRandomColor();
            picker.value = randomColor;
            colorHexes[index].value = randomColor;
            colorPreviews[index].style.backgroundColor = randomColor;
        });
        updatePaletteDisplay();
        updatePreviewElements();
        showToast('Yangi tasodifiy palette yaratildi');
    });
    
    // Palette displeyni yangilash
    function updatePaletteDisplay() {
        const paletteColors = document.getElementById('paletteColors');
        paletteColors.innerHTML = '';
        
        const colors = [];
        colorPickers.forEach(picker => {
            colors.push(picker.value);
        });
        
        colors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.title = color;
            
            // Rangni nusxalash
            colorBox.addEventListener('click', function() {
                navigator.clipboard.writeText(color);
                showToast('Rang nusxalandi: ' + color);
            });
            
            paletteColors.appendChild(colorBox);
        });
        
        // Kontrast ballini hisoblash
        updateContrastScore();
    }
    
    // Kontrast ballini hisoblash
    function updateContrastScore() {
        const colors = [];
        colorPickers.forEach(picker => {
            colors.push(picker.value);
        });
        
        // Oddiy kontrast tekshiruvi (real loyihada aniqroq algoritm kerak)
        let score = 'Yaxshi';
        if (colors.length > 0) {
            // Bir nechta ranglar orasidagi kontrastni tekshirish
            score = 'Yaxshi';
        }
        
        document.getElementById('contrastScore').textContent = score;
    }
    
    // Preview elementlarini yangilash
    function updatePreviewElements() {
        const colors = [];
        colorPickers.forEach(picker => {
            colors.push(picker.value);
        });
        
        if (colors[0]) {
            document.getElementById('previewHeader').style.backgroundColor = colors[0];
        }
        
        if (colors[1]) {
            document.getElementById('previewHero').style.backgroundColor = colors[1] + '20'; // 20 = opacity
            document.querySelector('.preview-btn').style.backgroundColor = colors[1];
        }
        
        if (colors[2]) {
            document.getElementById('previewCard1').style.backgroundColor = colors[2] + '20';
            document.getElementById('previewCard1').style.borderTop = `3px solid ${colors[2]}`;
        }
        
        if (colors[3]) {
            document.getElementById('previewCard2').style.backgroundColor = colors[3] + '20';
            document.getElementById('previewCard2').style.borderTop = `3px solid ${colors[3]}`;
        }
        
        if (colors[4]) {
            document.getElementById('previewCard3').style.backgroundColor = colors[4] + '20';
            document.getElementById('previewCard3').style.borderTop = `3px solid ${colors[4]}`;
        }
    }
    
    // Palette'ni saqlash
    savePaletteBtn.addEventListener('click', function() {
        const colors = [];
        colorPickers.forEach(picker => {
            colors.push(picker.value);
        });
        
        const paletteName = prompt('Palette nomini kiriting:', 'Mening palette\'m');
        if (paletteName) {
            const palette = {
                name: paletteName,
                colors: colors,
                date: new Date().toLocaleDateString()
            };
            
            // LocalStorage ga saqlash
            let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes')) || [];
            savedPalettes.push(palette);
            localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
            
            showToast('Palette saqlandi: ' + paletteName);
        }
    });
    
    // Palette'ni nusxalash
    copyPaletteBtn.addEventListener('click', function() {
        const colors = [];
        colorPickers.forEach(picker => {
            colors.push(picker.value);
        });
        
        const colorText = colors.join(', ');
        navigator.clipboard.writeText(colorText);
        showToast('Palette ranglari nusxalandi');
    });
    
    // Export funksiyalari
    exportCSSBtn.addEventListener('click', function() {
        const colors = [];
        colorPickers.forEach((picker, index) => {
            colors.push(picker.value);
        });
        
        let cssCode = ':root {\n';
        colors.forEach((color, index) => {
            cssCode += `  --color-${index + 1}: ${color};\n`;
        });
        cssCode += '}';
        
        exportOutput.textContent = cssCode;
        showToast('CSS kodi tayyor');
    });
    
    exportSCSSBtn.addEventListener('click', function() {
        const colors = [];
        colorPickers.forEach((picker, index) => {
            colors.push(picker.value);
        });
        
        let scssCode = '// Color Variables\n';
        colors.forEach((color, index) => {
            scssCode += `$color-${index + 1}: ${color};\n`;
        });
        
        scssCode += '\n// Usage example\n';
        scssCode += '.example {\n';
        scssCode += '  background-color: $color-1;\n';
        scssCode += '  color: $color-2;\n';
        scssCode += '}';
        
        exportOutput.textContent = scssCode;
        showToast('SCSS kodi tayyor');
    });
    
    exportJSONBtn.addEventListener('click', function() {
        const colors = [];
        colorPickers.forEach((picker, index) => {
            colors.push(picker.value);
        });
        
        const paletteObject = {
            name: "Custom Palette",
            colors: colors,
            created: new Date().toISOString()
        };
        
        exportOutput.textContent = JSON.stringify(paletteObject, null, 2);
        showToast('JSON formati tayyor');
    });
    
    // Tayyor palette'lar
    const samplePalettes = [
        { 
            name: "Ocean Breeze", 
            colors: ["#1abc9c", "#16a085", "#2c3e50", "#34495e", "#ecf0f1"],
            category: "modern"
        },
        { 
            name: "Sunset Vibes", 
            colors: ["#e74c3c", "#e67e22", "#f1c40f", "#f39c12", "#d35400"],
            category: "bright"
        },
        { 
            name: "Forest Green", 
            colors: ["#27ae60", "#2ecc71", "#16a085", "#1abc9c", "#55efc4"],
            category: "modern"
        },
        { 
            name: "Purple Dream", 
            colors: ["#8e44ad", "#9b59b6", "#3498db", "#2980b9", "#1abc9c"],
            category: "bright"
        },
        { 
            name: "Vintage Colors", 
            colors: ["#d35400", "#c0392b", "#7f8c8d", "#95a5a6", "#bdc3c7"],
            category: "vintage"
        },
        { 
            name: "Pastel Colors", 
            colors: ["#ff9ff3", "#feca57", "#ff6b6b", "#48dbfb", "#1dd1a1"],
            category: "pastel"
        },
        { 
            name: "Minimal Gray", 
            colors: ["#2d3436", "#636e72", "#b2bec3", "#dfe6e9", "#ffffff"],
            category: "minimal"
        },
        { 
            name: "Warm Sunset", 
            colors: ["#ff7675", "#fd79a8", "#fdcb6e", "#e17055", "#d63031"],
            category: "bright"
        }
    ];
    
    // Palette'lar galereyasini yuklash
    function loadPalettes(filter = 'all') {
        palettesGrid.innerHTML = '';
        
        const filteredPalettes = filter === 'all' 
            ? samplePalettes 
            : samplePalettes.filter(palette => palette.category === filter);
        
        filteredPalettes.forEach(palette => {
            const paletteCard = document.createElement('div');
            paletteCard.className = 'palette-card';
            
            let colorsHTML = '';
            palette.colors.forEach(color => {
                colorsHTML += `<div class="palette-color" style="background-color: ${color};" title="${color}"></div>`;
            });
            
            paletteCard.innerHTML = `
                <div class="palette-colors-card">
                    ${colorsHTML}
                </div>
                <div class="palette-info">
                    <h3>${palette.name}</h3>
                    <p>${palette.colors.length} ta rang</p>
                    <div class="palette-actions">
                        <button class="btn small-btn use-palette-btn" data-colors='${JSON.stringify(palette.colors)}'>
                            <i class="fas fa-paint-brush"></i> Ishlatish
                        </button>
                        <button class="btn small-btn copy-palette-btn" data-colors='${JSON.stringify(palette.colors)}'>
                            <i class="fas fa-copy"></i> Nusxalash
                        </button>
                    </div>
                </div>
            `;
            
            palettesGrid.appendChild(paletteCard);
        });
        
        // Use palette tugmalarini ishlatish
        document.querySelectorAll('.use-palette-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const colors = JSON.parse(this.getAttribute('data-colors'));
                colors.forEach((color, index) => {
                    if (colorPickers[index]) {
                        colorPickers[index].value = color;
                        colorHexes[index].value = color;
                        colorPreviews[index].style.backgroundColor = color;
                    }
                });
                updatePaletteDisplay();
                updatePreviewElements();
                showToast('Palette tanlandi');
            });
        });
        
        // Copy palette tugmalarini ishlatish
        document.querySelectorAll('.copy-palette-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const colors = JSON.parse(this.getAttribute('data-colors'));
                navigator.clipboard.writeText(colors.join(', '));
                showToast('Palette nusxalandi');
            });
        });
    }
    
    // Filter tugmalarini ishlatish
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Active classni o'zgartirish
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Palette'larni filter qilish
            const filter = this.getAttribute('data-filter');
            loadPalettes(filter);
        });
    });
    
    // Kontrast tekshiruvi modal
    contrastCheckerBtn.addEventListener('click', function() {
        contrastModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        contrastModal.style.display = 'none';
    });
    
    // Modal tashqarisiga bosilganda yopish
    window.addEventListener('click', function(event) {
        if (event.target === contrastModal) {
            contrastModal.style.display = 'none';
        }
    });
    
    // Kontrast tekshiruvi funksiyalari
    function initContrastChecker() {
        const textColor = document.getElementById('textColor');
        const textColorHex = document.getElementById('textColorHex');
        const bgColor = document.getElementById('bgColor');
        const bgColorHex = document.getElementById('bgColorHex');
        const contrastPreview = document.getElementById('contrastPreview');
        
        // Rang tanlovchilarini ulash
        textColor.addEventListener('input', function() {
            textColorHex.value = this.value;
            updateContrastChecker();
        });
        
        textColorHex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                textColor.value = this.value;
                updateContrastChecker();
            }
        });
        
        bgColor.addEventListener('input', function() {
            bgColorHex.value = this.value;
            updateContrastChecker();
        });
        
        bgColorHex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                bgColor.value = this.value;
                updateContrastChecker();
            }
        });
        
        // Kontrastni hisoblash
        function updateContrastChecker() {
            const text = textColor.value;
            const bg = bgColor.value;
            
            // Preview ni yangilash
            contrastPreview.style.color = text;
            contrastPreview.style.backgroundColor = bg;
            
            // Kontrast nisbatini hisoblash
            const contrastRatio = calculateContrastRatio(text, bg);
            document.getElementById('contrastRatio').textContent = contrastRatio.toFixed(2) + ':1';
            
            // WCAG standartlarini tekshirish
            const wcagAA = contrastRatio >= 4.5 ? '✅ O\'tdi' : '❌ O\'tmadi';
            const wcagAAA = contrastRatio >= 7 ? '✅ O\'tdi' : '❌ O\'tmadi';
            
            document.getElementById('wcagAA').textContent = wcagAA;
            document.getElementById('wcagAAA').textContent = wcagAAA;
            
            // Rang kodlarini ajratib ko'rsatish
            document.getElementById('wcagAA').innerHTML = wcagAA;
            document.getElementById('wcagAAA').innerHTML = wcagAAA;
        }
        
        // Dastlabki hisoblash
        updateContrastChecker();
    }
    
    // Community palette'lar
    function loadCommunityPalettes() {
        // LocalStorage dan saqlangan palette'larni olish
        let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes')) || [];
        
        communityPalettes.innerHTML = '';
        
        if (savedPalettes.length === 0) {
            communityPalettes.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-palette" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>Hali palette'lar yo'q</h3>
                    <p>Birinchi bo'lib palette'ingizni ulashing!</p>
                </div>
            `;
            return;
        }
        
        savedPalettes.slice(0, 6).forEach(palette => {
            const communityPalette = document.createElement('div');
            communityPalette.className = 'community-palette';
            
            let colorsHTML = '';
            palette.colors.forEach(color => {
                colorsHTML += `<div class="palette-color" style="background-color: ${color};"></div>`;
            });
            
            communityPalette.innerHTML = `
                <div class="community-colors">
                    ${colorsHTML}
                </div>
                <div class="community-palette-info">
                    <h4>${palette.name}</h4>
                    <p>${palette.colors.length} ta rang</p>
                    <p class="creator">${palette.date}</p>
                </div>
            `;
            
            communityPalettes.appendChild(communityPalette);
        });
    }
    
    // Palette'ni ulashish
    sharePaletteBtn.addEventListener('click', function() {
        const paletteName = document.getElementById('paletteName').value;
        const creatorName = document.getElementById('creatorName').value;
        const description = document.getElementById('paletteDescription').value;
        
        if (!paletteName.trim()) {
            showToast('Iltimos, palette nomini kiriting', 'error');
            return;
        }
        
        const colors = [];
        colorPickers.forEach(picker => {
            colors.push(picker.value);
        });
        
        const palette = {
            name: paletteName,
            creator: creatorName || 'Anonim',
            description: description,
            colors: colors,
            date: new Date().toLocaleDateString(),
            likes: 0
        };
        
        // LocalStorage ga saqlash
        let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes')) || [];
        savedPalettes.unshift(palette); // Yangisini boshiga qo'shish
        localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
        
        // Formani tozalash
        document.getElementById('paletteName').value = '';
        document.getElementById('creatorName').value = '';
        document.getElementById('paletteDescription').value = '';
        
        // Community palette'larni yangilash
        loadCommunityPalettes();
        
        showToast('Palette muvaffaqiyatli ulashildi!');
    });
    
    // Image upload uchun
    imageExtractor.addEventListener('click', function() {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Bu yerda rasmni tahlil qilish algoritmini qo'shishingiz mumkin
                // Oddiy demo uchun tasodifiy ranglar chiqaramiz
                const colors = [
                    getRandomColor(),
                    getRandomColor(),
                    getRandomColor(),
                    getRandomColor(),
                    getRandomColor()
                ];
                
                // Tanlangan ranglarni qo'llash
                colors.forEach((color, index) => {
                    if (colorPickers[index]) {
                        colorPickers[index].value = color;
                        colorHexes[index].value = color;
                        colorPreviews[index].style.backgroundColor = color;
                    }
                });
                
                updatePaletteDisplay();
                updatePreviewElements();
                showToast('Rasm palette\'si yaratildi');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Toast bildirishnomasi
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Toast rangini o'zgartirish
        if (type === 'error') {
            toast.style.backgroundColor = '#e74c3c';
        } else if (type === 'warning') {
            toast.style.backgroundColor = '#f1c40f';
        } else {
            toast.style.backgroundColor = '#2ecc71';
        }
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Yordamchi funksiyalar
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function isValidHex(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    
    function hexToRgb(hex) {
        // Hex kodini RGB ga o'girish
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function calculateContrastRatio(color1, color2) {
        // Kontrast nisbatini hisoblash
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 1;
        
        // Nisbiy yorqinlik
        const luminance1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
        const luminance2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
        
        // Kontrast nisbati
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    function getRelativeLuminance(r, g, b) {
        // RGB ni nisbiy yorqinligi
        const rs = r / 255;
        const gs = g / 255;
        const bs = b / 255;
        
        const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
        const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
        const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
        
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    
    // Dastlabki yuklash
    initColorPickers();
    updatePaletteDisplay();
    updatePreviewElements();
    loadPalettes();
    initContrastChecker();
    loadCommunityPalettes();
    
    // Navigation linklari uchun smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation linklarni o'zgartirish
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Dastlabki toast bildirishnoma
    setTimeout(() => {
        showToast('Rang kombinatsiyalari saytiga xush kelibsiz!');
    }, 1000);
});