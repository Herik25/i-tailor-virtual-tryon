import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyB_l3qOaLPV6E-xwEHgK9_4nvvZwzsYHx0";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const materials = [
    { name: "Black Suit", file: "materials/Black Suit.jpg", price: 239, originalPrice: 259, promo: true, color: "black", fabricNo: "BK-001", pattern: "Solid", season: "All Season" },
    { name: "Olive Suit", file: "materials/Olive Suit.jpg", price: 239, originalPrice: 259, promo: true, color: "olive", fabricNo: "OL-002", pattern: "Solid", season: "Summer" },
    { name: "Dark Navy", file: "materials/Dark Navy.jpg", price: 259, color: "navy", fabricNo: "NV-003", pattern: "Solid", season: "All Season" },
    { name: "Light Navy", file: "materials/Light Navy.jpg", price: 259, color: "blue", fabricNo: "LB-004", pattern: "Solid", season: "Summer" },
    { name: "Brown Suit", file: "materials/BROWN Suit.jpg", price: 259, color: "brown", fabricNo: "BR-005", pattern: "Solid", season: "Winter" },
    { name: "Textured Light Gray", file: "materials/Textured Light Gray.jpg", price: 259, color: "gray", fabricNo: "GR-006", pattern: "Textured", season: "Winter" },
    { name: "Textured Gray", file: "materials/Textured Grey.jpg", price: 259, color: "gray", fabricNo: "GR-007", pattern: "Textured", season: "All Season" },
    { name: "Textured Medium Gray", file: "materials/Textured Medium Grey.jpg", price: 259, color: "gray", fabricNo: "GR-008", pattern: "Textured", season: "All Season" }
];

let selectedMaterial = null;

document.addEventListener('DOMContentLoaded', () => {
    const resultImg = document.getElementById('finalGeneratedImage');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const materialModal = document.getElementById('materialModal');
    const materialGrid = document.getElementById('materialGrid');
    const modalLoader = document.getElementById('modalLoader');
    const shareLinkBtn = document.getElementById('shareLinkBtn');

    const generatedData = localStorage.getItem('generatedLook');
    if (generatedData) {
        resultImg.src = `data:image/png;base64,${generatedData}`;
    }

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

    openModalBtn.onclick = (e) => {
        e.preventDefault();
        materialModal.classList.add('active');
    };

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
            closePopup();
        } catch (error) {   
            console.error(error);
            alert("Regeneration failed. Check console.");
        } finally {
            modalLoader.classList.remove('active');
            confirmBtn.disabled = false;
        }
    };

    shareLinkBtn.onclick = async () => {
        try {
            const shareUrl = `${window.location.origin}/preview.html`;
            await navigator.clipboard.writeText(shareUrl);
            
            const toast = document.getElementById('toast');
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

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
        const suitBase = localStorage.getItem('suitBaseBase64');
        const metadataString = localStorage.getItem('metadata');
        
        if (!capturedImage || !suitBase) {
            throw new Error("Missing original capture data. Please recapture.");
        }

        const metadata = JSON.parse(metadataString || '{}');
        const materialBase64 = await getBase64FromUrl(material.file);
        
        // Format metadata for the prompt
        const formatVal = (val) => {
            if (typeof val === 'object' && val !== null) {
                return Object.entries(val).map(([k, v]) => `${k}: ${v}`).join(", ");
            }
            return val || "Not specified";
        };

        const finalPrompt = `
            Ultra realistic 8k portrait for a luxury virtual try-on.
            
            Inputs:
            - IMAGE 1 (Base Template): A professional male model in a suit.
            - IMAGE 2 (Identity): The target user's face and head.
            - IMAGE 3 (Material Swatch): The fabric to be applied to the suit.
            
            Instructions:
            1. Replace the model's head in IMAGE 1 with the head from IMAGE 2. Preserve identity exactly.
            2. Apply the specific fabric from IMAGE 3 to the suit in IMAGE 1.
            3. Match the texture and lighting perfectly.
            4. Keep the background and pose from IMAGE 1.
            
            Technical metadata for face matching:
            Skin/Model: ${formatVal(metadata.MODEL)}
            Face: ${formatVal(metadata.FACE)}
            Hair: ${formatVal(metadata.DETAILS)}
            Grooming: ${formatVal(metadata.FACIAL_HAIR)}
            
            Return only the updated photographic result.
        `.trim();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-image",
            generationConfig: {
                imageConfig: {
                    aspectRatio: "2:3",
                },
            },
        });

        const parts = [
            { text: finalPrompt },
            { text: "IMAGE 1 (Base Template):" },
            { inlineData: { mimeType: "image/png", data: suitBase } },
            { text: "IMAGE 2 (Identity):" },
            { inlineData: { mimeType: "image/jpeg", data: capturedImage } },
            { text: "IMAGE 3 (Material Swatch):" },
            { inlineData: { mimeType: "image/jpeg", data: materialBase64 } }
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        const candidate = response.candidates[0];
        const imagePart = candidate.content.parts.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData.data) {
            const newData = imagePart.inlineData.data;
            localStorage.setItem('generatedLook', newData);
            resultImg.src = `data:image/png;base64,${newData}`;
        } else {
            throw new Error("AI tailoring failed to update the fabric.");
        }
    }
});