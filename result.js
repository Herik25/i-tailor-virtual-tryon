import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyDZiMhC7vJ6eD9N4e-7HAq5eanunxzafMY";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const materials = [
    { name: "Black Suit", file: "materials/Black Suit.jpg" },
    { name: "Olive Suit", file: "materials/Olive Suit.jpg" },
    { name: "Dark Navy", file: "materials/Dark Navy.jpg" },
    { name: "Light Navy", file: "materials/Light Navy.jpg" },
    { name: "Brown Suit", file: "materials/BROWN Suit.jpg" },
    { name: "Textured Light Gray", file: "materials/Textured Light Gray.jpg" },
    { name: "Textured Gray", file: "materials/Textured Grey.jpg" },
    { name: "Textured Medium Gray", file: "materials/Textured Medium Grey.jpg" }
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

    // Load initial image
    const generatedData = localStorage.getItem('generatedLook');
    if (generatedData) {
        resultImg.src = `data:image/png;base64,${generatedData}`;
    }

    // Inject materials
    materials.forEach(mat => {
        const card = document.createElement('div');
        card.className = 'material-card';
        card.innerHTML = `
            <div class="material-thumb" style="background-image: url('${mat.file}')"></div>
            <div class="material-name">${mat.name}</div>
        `;
        card.onclick = () => {
            document.querySelectorAll('.material-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedMaterial = mat;
            confirmBtn.disabled = false;
        };
        materialGrid.appendChild(card);
    });

    // Modal Controls
    openModalBtn.onclick = (e) => {
        e.preventDefault();
        materialModal.classList.add('active');
    };

    const closePopup = () => {
        materialModal.classList.remove('active');
        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('selected'));
        selectedMaterial = null;
        confirmBtn.disabled = true;
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
        const currentGeneratedLook = localStorage.getItem('generatedLook');

        if (!currentGeneratedLook) {
            throw new Error("No previous generation found.");
        }

        const materialBase64 = await getBase64FromUrl(material.file);
        // if only want to update the only suit jacket or lapels add this in first requriement first word "ONLY update the suit jacket and lapels."
        const finalPrompt = `
            This is a high-end luxury fashion portrait. 
            Instruction: CHANGE the current suit material of the person in the provided portrait to the specific fabric shown in the reference swatch.
            
            REFERENCE SWATCH: The material/fabric to apply.
            INPUT PORTRAIT: The person whose suit needs to be updated.
            
            CRITICAL REQUIREMENTS:
            - Match the texture, weave, and color of the REFERENCE SWATCH perfectly.
            - You MUST preserve the person's face, features, hair, identity, posture, and expression EXACTLY as they appear in the INPUT PORTRAIT.
            - KEEP the background, lighting, and overall composition identical to the INPUT PORTRAIT.
            - Focus on creating a realistic, high-quality fabric transition that follows the folds and lighting of the original suit.
            
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
            { text: "REFERENCE SWATCH:" },
            { 
                inlineData: { 
                    mimeType: "image/jpeg", 
                    data: materialBase64 
                } 
            },
            { text: "INPUT PORTRAIT:" },
            { 
                inlineData: { 
                    mimeType: "image/png", 
                    data: currentGeneratedLook 
                } 
            }
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