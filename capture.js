import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyBJfElFwmkySfGIwL7HxhzTAsPeJTIqd8U"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const state = {
    capturedImageBase64: null,
    materialBase64: null
};

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const container = document.querySelector('.container');
    const processingOverlay = document.getElementById('processingOverlay');
    const loadingMsg = document.getElementById('loadingMsg');
    const galleryInput = document.getElementById('gallery-input');
    const galleryLink = document.getElementById('gallery-link');
    const galleryPreview = document.getElementById('gallery-preview');
    const slideshowImages = processingOverlay.querySelectorAll('.loader-img');
    let slideshowInterval;
    let materialLoadedPromise = null;

    function startLoaderSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        
        let currentIndex = 0;
        
        // Reset all images and set first one active
        slideshowImages.forEach(img => img.classList.remove('active'));
        if (slideshowImages.length > 0) {
            slideshowImages[0].classList.add('active');
            loadingMsg.textContent = "Crafting Your Bespoke Look";
        }

        slideshowInterval = setInterval(() => {
            if (slideshowImages.length === 0) return;
            
            slideshowImages[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slideshowImages.length;
            slideshowImages[currentIndex].classList.add('active');
            
            const msgs = ["Crafting Your Bespoke Look", "Tailoring to Precision", "Perfecting Every Detail"];
            loadingMsg.textContent = msgs[currentIndex % msgs.length];
            
            console.log(`Slideshow: Switched to image ${currentIndex}`);
        }, 3000); 
    }

    function stopLoaderSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        slideshowImages.forEach(img => img.classList.remove('active'));
        if (slideshowImages.length > 0) {
            slideshowImages[0].classList.add('active');
        }
    }

    function loadDefaultMaterial() {
        materialLoadedPromise = new Promise(async (resolve, reject) => {
            try {
                const selectedPath = localStorage.getItem('selectedMaterialPath') || "materials/Dark Navy.jpg";
                
                const response = await fetch(encodeURI(selectedPath));
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const blob = await response.blob();
    
                const reader = new FileReader();
                reader.onloadend = () => {
                    state.materialBase64 = reader.result.split(",")[1];
                    console.log("iTailor: Material base64 ready");
                    resolve();
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error("iTailor: Material load failed", err);
                reject(err);
            }
        });
    
        return materialLoadedPromise;
    }

    async function initWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }, 
                audio: false 
            });
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                const cameraLoading = document.querySelector('.camera-loading');
                if (cameraLoading) {
                    cameraLoading.style.opacity = '0';
                    setTimeout(() => cameraLoading.style.display = 'none', 300);
                }
            };
        } catch (err) {
            console.error('Error accessing webcam:', err);
            alert('Unable to access camera.');
        }
    }

    loadDefaultMaterial();
    initWebcam();

    galleryLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (galleryPreview.style.display === 'block') {
            galleryPreview.style.display = 'none';
            galleryPreview.src = '';
            video.style.display = 'block';
            video.play();
            state.capturedImageBase64 = null;
            galleryLink.textContent = 'Upload from Gallery';
            galleryInput.value = '';
        } else {
            galleryInput.click();
        }
    });

    galleryInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                galleryPreview.src = event.target.result;
                galleryPreview.style.display = 'block';
                video.style.display = 'none';
                video.pause();
                
                galleryLink.textContent = 'Return to Camera';
                
                state.capturedImageBase64 = event.target.result.replace(
                    /^data:image\/(png|jpeg|jpg);base64,/,
                    ""
                );
            };
            reader.readAsDataURL(file);
        }
    });

    async function generateFinalLook() {
        if (!state.materialBase64) throw new Error("Material missing");

        const finalPrompt = `
            Full-body studio portrait of a man wearing a perfectly tailored suit made from the uploaded fabric swatch, exact fabric texture, weave, color tone, and pattern must match the uploaded fabric reference precisely (no color shift, no reinterpretation). Suit constructed with sharp modern tailoring, structured shoulders, clean lapels, slim fit trousers, white dress shirt, black slim tie, black leather Oxford shoes.
            Replace the model’s face with the uploaded face image, maintain natural skin texture, correct facial proportions, realistic lighting match, seamless integration (no distortion, no blur, no morphing artifacts), preserve hairstyle if possible or adapt naturally to suit style.
            Hands in trouser pockets, standing straight and confident, neutral facial expression, seamless light grey studio background, soft high-key lighting, symmetrical composition, sharp tailoring details, realistic fabric texture visibility, luxury menswear editorial photography.
            Ultra-realistic, 85mm lens, f/2.8, shallow depth of field, professional fashion photography, sharp focus, high detail, visible fabric weave, accurate skin tone, photorealistic rendering.
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
            { text: "IMAGE 1 (Person Identity):" },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: state.capturedImageBase64,
                },
            },
            { text: "IMAGE 2 (Fabric Material):" },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: state.materialBase64,
                },
            },
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        const candidate = response.candidates[0];
        const imagePart = candidate.content.parts.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData.data) {
            localStorage.setItem('generatedLook', imagePart.inlineData.data);
            localStorage.setItem('capturedImageBase64', state.capturedImageBase64);
            localStorage.setItem('materialBase64', state.materialBase64);
            window.location.href = 'result.html';
        } else {
            throw new Error("AI tailoring failed to return image.");
        }
    }

    captureBtn.addEventListener('click', async () => {
        if (!video.videoWidth && !state.capturedImageBase64) return;

        const context = canvas.getContext('2d');
        if (!state.capturedImageBase64) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const flash = document.createElement('div');
            flash.setAttribute('style', 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999;opacity:0.8;transition:opacity 0.3s');
            document.body.appendChild(flash);
            setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => document.body.removeChild(flash), 300); }, 50);
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            state.capturedImageBase64 = imageData.replace(
                /^data:image\/jpeg;base64,/,
                "",
            );
            video.pause();
        }
        
        processingOverlay.classList.remove('hidden');
        startLoaderSlideshow();
        
        captureBtn.style.pointerEvents = 'none';
        captureBtn.style.opacity = '0.5';

        try {
            await materialLoadedPromise;
            await generateFinalLook();
        } catch (error) {
            console.error(error);
            alert("AI generation failed. Check console.");
            processingOverlay.classList.add('hidden');
            stopLoaderSlideshow();
            captureBtn.style.pointerEvents = 'all';
            captureBtn.style.opacity = '1';
        }
    });

    if (!processingOverlay.classList.contains('hidden')) {
        startLoaderSlideshow();
    }
});
