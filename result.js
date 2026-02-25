import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyBJfElFwmkySfGIwL7HxhzTAsPeJTIqd8U";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const materials = [
    { name: "Black Suit", file: "materials/Black Suit.jpg", price: 239, originalPrice: 259, promo: true, color: "black", fabricNo: "SK-001", pattern: "Solid", composition: "Premium Cotton", season: "All Season" },
    { name: "Olive Suit", file: "materials/Olive Suit.jpg", price: 239, originalPrice: 259, promo: true, color: "olive", fabricNo: "3682-4", pattern: "Solid", composition: "Wool Blend", season: "Summer" },
    { name: "Dark Navy", file: "materials/Dark Navy.jpg", price: 259, color: "navy", fabricNo: "3799-2", pattern: "Solid", composition: "Wool Blend", season: "All Season" },
    { name: "Light Navy", file: "materials/Light Navy.jpg", price: 259, color: "blue", fabricNo: "4122-1", pattern: "Solid", composition: "Premium Cotton", season: "Summer" },
    { name: "Brown Suit", file: "materials/BROWN Suit.jpg", price: 259, color: "brown", fabricNo: "BR-552", pattern: "Solid", composition: "Wool Blend", season: "Winter" },
    { name: "Textured Light Gray", file: "materials/Textured Light Gray.jpg", price: 259, color: "gray", fabricNo: "GR-901", pattern: "Textured", composition: "Wool Blend", season: "Winter" },
    { name: "Textured Gray", file: "materials/Textured Grey.jpg", price: 259, color: "gray", fabricNo: "GR-902", pattern: "Textured", composition: "Wool Blend", season: "All Season" },
    { name: "Textured Medium Gray", file: "materials/Textured Medium Grey.jpg", price: 259, color: "gray", fabricNo: "GR-903", pattern: "Textured", composition: "Wool Blend", season: "All Season" }
];

let selectedMaterial = null;

document.addEventListener('DOMContentLoaded', () => {
    const resultImg = document.getElementById('finalGeneratedImage');
    const openModalBtn = document.getElementById('open-modal-btn');
    const tryMoreBtn = document.getElementById('change-fabric-btn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const materialModal = document.getElementById('materialModal');
    const materialGrid = document.getElementById('materialGrid');
    const modalLoader = document.getElementById('modalLoader');
    const shareLinkBtn = document.getElementById('shareLinkBtn');

    // Fabric Card Elements
    const swatchImg = document.getElementById('selectedSwatchImg');
    const fabricCodeEl = document.getElementById('fabricCode');
    const fabricNameEl = document.getElementById('fabricName');
    const fabricDetailEl = document.getElementById('fabricComposition');

    const generatedData = localStorage.getItem('generatedLook');
    if (generatedData) {
        resultImg.src = `data:image/png;base64,${generatedData}`;
    }

    // Initialize Fabric Card with current material
    function updateFabricCard(material) {
        if (!material) {
            const currentPath = localStorage.getItem('selectedMaterialPath') || "materials/Dark Navy.jpg";
            material = materials.find(m => m.file === currentPath) || materials[2];
        }
        swatchImg.src = material.file;
        fabricCodeEl.textContent = material.fabricNo;
        fabricNameEl.textContent = material.name.toUpperCase();
        fabricDetailEl.textContent = `${material.pattern}, ${material.composition}`;
    }

    updateFabricCard();

    let currentFilters = {
        color: 'all',
        search: '',
        pattern: 'all',
        season: 'all'
    };

    function renderMaterials() {
        materialGrid.innerHTML = '';
        const filtered = materials.filter(mat => {
            const matchesColor = currentFilters.color === 'all' || mat.color === currentFilters.color;
            const matchesSearch = mat.fabricNo.toLowerCase().includes(currentFilters.search.toLowerCase()) || 
                                mat.name.toLowerCase().includes(currentFilters.search.toLowerCase());
            const matchesPattern = currentFilters.pattern === 'all' || mat.pattern === currentFilters.pattern;
            const matchesSeason = currentFilters.season === 'all' || mat.season === currentFilters.season;
            
            return matchesColor && matchesSearch && matchesPattern && matchesSeason;
        });

        if (filtered.length === 0) {
            materialGrid.innerHTML = '<div class="no-results">No fabrics match your selection.</div>';
            return;
        }

        filtered.forEach(mat => {
            const card = document.createElement('div');
            card.className = `material-card ${selectedMaterial === mat ? 'selected' : ''}`;
            const promoHtml = mat.promo ? `<div class="promo-ribbon">PROMO</div>` : '';
            const priceHtml = mat.originalPrice 
                ? `<span class="original-price">$${mat.originalPrice}</span> <span class="current-price sale">$${mat.price}</span>`
                : `<span class="current-price">$${mat.price}</span>`;

            card.innerHTML = `
                <div class="material-thumb" style="background-image: url('${mat.file}')">
                    ${promoHtml}
                    <div class="material-info-overlay">
                        <div class="material-name-overlay">${mat.name}</div>
                        <div class="material-price-overlay">${priceHtml}</div>
                    </div>
                </div>
            `;
            card.onclick = () => {
                document.querySelectorAll('.material-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedMaterial = mat;
                confirmBtn.disabled = false;
            };
            materialGrid.appendChild(card);
        });
    }

    renderMaterials();

    document.querySelectorAll('.swatch').forEach(swatch => {
        swatch.onclick = () => {
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentFilters.color = swatch.dataset.color;
            renderMaterials();
        };
    });

    function initCustomSelect(selectId, filterKey) {
        const select = document.getElementById(selectId);
        const trigger = select.querySelector('.select-trigger');
        const triggerText = trigger.querySelector('span');
        const options = select.querySelectorAll('.option');

        trigger.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select').forEach(s => {
                if (s !== select) s.classList.remove('open');
            });
            select.classList.toggle('open');
        };

        options.forEach(opt => {
            opt.onclick = () => {
                const value = opt.dataset.value;
                const text = opt.innerText;
                
                triggerText.innerText = text;
                currentFilters[filterKey] = value;
                
                options.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                
                select.classList.remove('open');
                renderMaterials();
            };
        });
    }

    initCustomSelect('patternSelect', 'pattern');
    initCustomSelect('seasonSelect', 'season');

    window.addEventListener('click', () => {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    });

    document.getElementById('fabricSearch').oninput = (e) => {
        currentFilters.search = e.target.value;
        renderMaterials();
    };

    const advancedSearchToggle = document.getElementById('advancedSearchToggle');
    const filtersContainer = document.getElementById('filtersContainer');

    advancedSearchToggle.onclick = () => {
        const isActive = filtersContainer.classList.contains('active');
        if (isActive) {
            filtersContainer.classList.remove('active');
            advancedSearchToggle.classList.remove('active');
        } else {
            filtersContainer.classList.add('active');
            advancedSearchToggle.classList.add('active');
        }
    };

    const openModal = (e) => {
        e.preventDefault();
        materialModal.classList.add('active');
    };

    openModalBtn.onclick = () => {
        window.location.href = "https://www.itailor.com/custom-suits/?fabric=3799-20";
    };
    tryMoreBtn.onclick = openModal;

    const closePopup = () => {
        materialModal.classList.remove('active');
        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('selected'));
        selectedMaterial = null;
        confirmBtn.disabled = true;
        
        filtersContainer.classList.remove('active');
        advancedSearchToggle.classList.remove('active');
    };

    closeModalBtn.onclick = closePopup;
    cancelBtn.onclick = closePopup;

    confirmBtn.onclick = async () => {
        if (!selectedMaterial) return;
        
        modalLoader.classList.add('active');
        confirmBtn.disabled = true;

        try {
            await regenerateLook(selectedMaterial);
            updateFabricCard(selectedMaterial);
            localStorage.setItem('selectedMaterialPath', selectedMaterial.file);
            closePopup();
        } catch (error) {   
            console.error(error);
            alert("Regeneration failed. Check console.");
        } finally {
            modalLoader.classList.remove('active');
            confirmBtn.disabled = false;
        }
    };

    // --- Drawer Logic ---
    const fabricDrawer = document.getElementById('fabricDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const cancelDrawerBtn = document.getElementById('cancelDrawerBtn');
    const confirmDrawerBtn = document.getElementById('confirmDrawerBtn');
    const drawerMaterialGrid = document.getElementById('drawerMaterialGrid');
    const drawerLoader = document.getElementById('drawerLoader');
    const drawerAdvancedSearchToggle = document.getElementById('drawerAdvancedSearchToggle');
    const drawerFiltersContainer = document.querySelector('.drawer-filter-row-top');

    let drawerSelectedMaterial = null;
    let drawerFilters = {
        color: 'all',
        search: '',
        pattern: 'all',
        season: 'all'
    };

    function renderDrawerMaterials() {
        drawerMaterialGrid.innerHTML = '';
        const filtered = materials.filter(mat => {
            const matchesColor = drawerFilters.color === 'all' || mat.color === drawerFilters.color;
            const matchesSearch = mat.fabricNo.toLowerCase().includes(drawerFilters.search.toLowerCase()) || mat.name.toLowerCase().includes(drawerFilters.search.toLowerCase());
            const matchesPattern = drawerFilters.pattern === 'all' || mat.pattern === drawerFilters.pattern;
            const matchesSeason = drawerFilters.season === 'all' || mat.season === drawerFilters.season;
            return matchesColor && matchesSearch && matchesPattern && matchesSeason;
        });

        if (filtered.length === 0) {
            drawerMaterialGrid.innerHTML = '<div class="no-results">No fabrics match your selection.</div>';
            return;
        }

        filtered.forEach(mat => {
            const card = document.createElement('div');
            const isSelected = drawerSelectedMaterial === mat;
            card.className = `material-card ${isSelected ? 'selected' : ''}`;
            
            const promoHtml = mat.promo ? `<div class="promo-ribbon">PROMO</div>` : '';
            const selectedHtml = isSelected ? `<div class="grid-selected-badge">SELECTED FABRIC</div>` : '';
            const priceHtml = mat.originalPrice 
                ? `<span class="original-price">$${mat.originalPrice}</span> <span class="current-price sale">$${mat.price}</span>`
                : `<span class="current-price">$${mat.price}</span>`;

            card.innerHTML = `
                <div class="material-thumb" style="background-image: url('${mat.file}')"></div>
                ${promoHtml}
                ${selectedHtml}
                <div class="material-info-overlay">
                    <div class="material-name-overlay">${mat.name.toUpperCase()}</div>
                    <div class="material-price-overlay">${priceHtml}</div>
                </div>
            `;
            card.onclick = () => {
                drawerMaterialGrid.querySelectorAll('.material-card').forEach(c => c.classList.remove('selected'));
                drawerMaterialGrid.querySelectorAll('.grid-selected-badge').forEach(b => b.remove());
                
                card.classList.add('selected');
                const badge = document.createElement('div');
                badge.className = 'grid-selected-badge';
                badge.textContent = 'SELECTED FABRIC';
                card.appendChild(badge);
                
                drawerSelectedMaterial = mat;
                cancelDrawerBtn.disabled = false;
            };
            drawerMaterialGrid.appendChild(card);
        });
    }

    const drawerDrawerContainer = fabricDrawer.querySelector('.drawer-container');

    // Drawer Filters Logic
    fabricDrawer.querySelectorAll('.swatch').forEach(swatch => {
        swatch.onclick = () => {
            fabricDrawer.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            drawerFilters.color = swatch.dataset.color;
            renderDrawerMaterials();
        };
    });

    function initDrawerSelect(selectId, filterKey) {
        const select = document.getElementById(selectId);
        const trigger = select.querySelector('.select-trigger');
        const triggerText = trigger.querySelector('span');
        const options = select.querySelectorAll('.option');

        trigger.onclick = (e) => {
            e.stopPropagation();
            fabricDrawer.querySelectorAll('.custom-select').forEach(s => {
                if (s !== select) s.classList.remove('open');
            });
            select.classList.toggle('open');
        };

        options.forEach(opt => {
            opt.onclick = () => {
                triggerText.innerText = opt.innerText;
                drawerFilters[filterKey] = opt.dataset.value;
                options.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                select.classList.remove('open');
                renderDrawerMaterials();
            };
        });
    }

    initDrawerSelect('drawerPatternSelect', 'pattern');
    initDrawerSelect('drawerSeasonSelect', 'season');

    document.getElementById('drawerFabricSearch').oninput = (e) => {
        drawerFilters.search = e.target.value;
        renderDrawerMaterials();
    };

    drawerAdvancedSearchToggle.onclick = () => {
        const isActive = drawerFiltersContainer.classList.toggle('active');
        drawerAdvancedSearchToggle.classList.toggle('active');
        // drawerAdvancedSearchToggle.innerHTML = isActive ? 'ADVANCE SEARCH <<' : 'ADVANCE SEARCH >>';
    };

    const openDrawer = (e) => {
        e.preventDefault();
        fabricDrawer.classList.add('active');
        renderDrawerMaterials();
    };

    const closeDrawer = () => {
        fabricDrawer.classList.remove('active');
        drawerFiltersContainer.classList.remove('active');
        drawerAdvancedSearchToggle.classList.remove('active');
        drawerSelectedMaterial = null;
        cancelDrawerBtn.disabled = true;
    };

    tryMoreBtn.onclick = openDrawer;
    closeDrawerBtn.onclick = closeDrawer;
    confirmDrawerBtn.onclick = () => {
        // Shop Look button does nothing for now
        console.log("Shop look clicked - no action defined");
    };

    cancelDrawerBtn.onclick = async () => {
        if (!drawerSelectedMaterial) return;
        drawerLoader.classList.add('active');
        cancelDrawerBtn.disabled = true;

        try {
            await regenerateLook(drawerSelectedMaterial);
            updateFabricCard(drawerSelectedMaterial);
            localStorage.setItem('selectedMaterialPath', drawerSelectedMaterial.file);
            closeDrawer();
        } catch (error) {   
            console.error(error);
            alert("Regeneration failed.");
        } finally {
            drawerLoader.classList.remove('active');
            cancelDrawerBtn.disabled = false;
        }
    };

    // --- End Drawer Logic ---

    // --- Share Drawer Logic ---
    const shareDrawer = document.getElementById('shareDrawer');
    const shareContainer = document.getElementById('shareContainer');
    const closeShareDrawerBtn = document.getElementById('closeShareDrawer');
    const finalShareBtn = document.getElementById('finalShareBtn');
    const sharePreviewImg = document.getElementById('sharePreviewImg');

    shareLinkBtn.onclick = () => {
        // Sync preview with current result
        sharePreviewImg.src = resultImg.src;
        
        shareDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeShareDrawer = () => {
        shareDrawer.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeShareDrawerBtn.onclick = closeShareDrawer;

    finalShareBtn.onclick = async () => {
        try {
            // Construct the path to preview.html in the same directory
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            const shareUrl = baseUrl + 'preview.html';
            await navigator.clipboard.writeText(shareUrl);
            
            // Premium Toast
            const tempToast = document.createElement('div');
            tempToast.className = 'toast';
            tempToast.textContent = 'LINK COPIED TO CLIPBOARD';
            tempToast.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 20000;
                background: #00BAF2;
                color: white;
                padding: 12px 28px;
                border-radius: 4px;
                font-family: 'Outfit', sans-serif;
                font-weight: 800;
                letter-spacing: 1.5px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                animation: fadeInUp 0.4s ease forwards;
            `;
            document.body.appendChild(tempToast);
            
            setTimeout(() => {
                tempToast.style.animation = 'fadeOutDown 0.4s ease forwards';
                setTimeout(() => {
                    tempToast.remove();
                    closeShareDrawer();
                }, 400);
            }, 1800);
            
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert("Error copying link.");
        }
    };
    // --- End Share Drawer Logic ---

    async function getBase64FromUrl(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    }

    async function regenerateLook(material) {
        const capturedImage = localStorage.getItem('capturedImageBase64');
        
        if (!capturedImage) {
            throw new Error("Missing original capture data. Please recapture.");
        }

        const materialBase64 = await getBase64FromUrl(material.file);
        
        const finalPrompt = `
            Full-body studio portrait of a man wearing a perfectly tailored suit made from the uploaded fabric swatch, exact fabric texture, weave, color tone, and pattern must match the uploaded fabric reference precisely (no color shift, no reinterpretation). Suit constructed with sharp modern tailoring, structured shoulders, clean lapels, slim fit trousers, white dress shirt, black slim tie, black leather Oxford shoes.
            Replace the model’s face with the uploaded face image, maintain natural skin texture, correct facial proportions, realistic lighting match, seamless integration (no distortion, no blur, no morphing artifacts), preserve hairstyle if possible or adapt naturally to suit style.
            Hands in trouser pockets, standing straight and confident, neutral facial expression, seamless light grey studio background, soft high-key lighting, symmetrical composition, sharp tailoring details, realistic fabric texture visibility, luxury menswear editorial photography.
            Ultra-realistic, 85mm lens, f/2.8, shallow depth of field, professional fashion photography, sharp focus, high detail, visible fabric weave, accurate skin tone, photorealistic rendering.
        `.trim();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-image",
            // generationConfig: {
            //     imageConfig: {
            //         aspectRatio: "2:3",
            //     },
            // },
        });

        const parts = [
            { text: finalPrompt },
            { text: "IMAGE 1 (Person Identity):" },
            { inlineData: { mimeType: "image/jpeg", data: capturedImage } },
            { text: "IMAGE 2 (Fabric Material):" },
            { inlineData: { mimeType: "image/jpeg", data: materialBase64 } }
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        const candidate = response.candidates[0];
        const imagePart = candidate.content.parts.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData.data) {
            const newData = imagePart.inlineData.data;
            localStorage.setItem('generatedLook', newData);
            localStorage.setItem('materialBase64', materialBase64);
            resultImg.src = `data:image/png;base64,${newData}`;
        } else {
            throw new Error("AI tailoring failed to update the fabric.");
        }
    }
});