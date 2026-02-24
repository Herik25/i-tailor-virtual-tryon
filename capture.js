import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyB_l3qOaLPV6E-xwEHgK9_4nvvZwzsYHx0"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const state = {
    capturedImageBase64: null,
    suitBaseBase64: null,
    metadata: null
};

const cleanJSON = (rawString) => {
  return rawString.replace(/```json|```/g, "").trim();
};

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const container = document.querySelector('.container');
    const processingOverlay = document.getElementById('processingOverlay');
    const progressPercent = document.getElementById('progressPercent');
    const loadingMsg = document.getElementById('loadingMsg');
    const fgCircle = processingOverlay.querySelector('.fg');
    const galleryInput = document.getElementById('gallery-input');
    const galleryLink = document.getElementById('gallery-link');
    const galleryPreview = document.getElementById('gallery-preview');
    let suitLoadedPromise = null;

    function setProgress(percent) {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        if (fgCircle) {
            fgCircle.style.strokeDashoffset = offset;
        }
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(percent)}%`;
        }
    }

    function loadSuitBase() {
        suitLoadedPromise = new Promise(async (resolve, reject) => {
            try {
                const response = await fetch("/suit-base.png");
                const blob = await response.blob();
    
                const reader = new FileReader();
                reader.onloadend = () => {
                    state.suitBaseBase64 = reader.result.split(",")[1];
                    // console.log("Suit base ready");
                    resolve();
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error("Suit load failed", err);
                reject(err);
            }
        });
    
        return suitLoadedPromise;
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

    loadSuitBase();
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

    async function decodeFace(base64Image) {
        const prompt = `Analyze this image and return a JSON object with strictly these 4 keys: 
        - MODEL (Ethnicity, Skin Tone, Age Estimate)
        - FACE (Face Shape, Jawline, Eye Color)
        - FACIAL_HAIR (Beard style, Mustache, or Clean Shaven)
        - DETAILS (Hair style, Glasses, distinctive features)
        
        Do not add any other text. Return only valid JSON.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                }
            }
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();
        const cleanText = cleanJSON(text);
        
        try {
            const json = JSON.parse(cleanText);
            state.metadata = json;
        } catch (e) {
            console.error("JSON Parse Error:", text);
            throw new Error("Failed to parse AI response");
        }
    }

    async function generateSuitPreview(metadata, suitType) {
        if (!state.suitBaseBase64) throw new Error("Suit base missing");

        const formatVal = (val) => {
            if (typeof val === 'object' && val !== null) {
                return Object.entries(val).map(([k, v]) => `${k}: ${v}`).join(", ");
            }
            return val || "Not specified";
        };

        const faceInfo = formatVal(metadata?.FACE);
        const modelInfo = formatVal(metadata?.MODEL);
        const hairInfo = formatVal(metadata?.DETAILS);
        const facialHairInfo = formatVal(metadata?.FACIAL_HAIR);

        const finalPrompt = `
            Ultra realistic 8k portrait for a luxury virtual try-on.
            
            I have provided two images:
            IMAGE 1: A base image showing a man in a ${suitType}.
            IMAGE 2: A source portrait of a person (the target face identity).
            
            Instructions: 
            - REPLACE the head, hair, and facial features of the man in IMAGE 1 with the head and features from IMAGE 2.
            - KEEP everything else from IMAGE 1: the ${suitType}, background, lighting, and pose must be EXACTLY the same.
            - Ensure skin tone and features match: ${faceInfo}, ${modelInfo}.
            - Matching hair style: ${hairInfo}.
            - Matching grooming: ${facialHairInfo}.
            
            Generate a high-end, photorealistic result.
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
            { text: "IMAGE 1 (Base/Background):" },
            {
                inlineData: {
                    mimeType: "image/png",
                    data: state.suitBaseBase64,
                },
            },
            { text: "IMAGE 2 (Face Identity):" },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: state.capturedImageBase64,
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
            localStorage.setItem('suitBaseBase64', state.suitBaseBase64);
            localStorage.setItem('metadata', JSON.stringify(state.metadata));
            window.location.href = 'result.html';
        } else {
            throw new Error("AI tailoring failed to return image.");
        }
    }

    captureBtn.addEventListener('click', async () => {
        if (!video.videoWidth) return;

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const flash = document.createElement('div');
        flash.setAttribute('style', 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999;opacity:0.8;transition:opacity 0.3s');
        document.body.appendChild(flash);
        setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => document.body.removeChild(flash), 300); }, 50);
        if (!state.capturedImageBase64) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            state.capturedImageBase64 = imageData.replace(
                /^data:image\/jpeg;base64,/,
                "",
            );
        }
        video.pause();
        
        processingOverlay.classList.remove('hidden');
        setProgress(10);
        loadingMsg.textContent = "Analyzing facial features...";
        
        captureBtn.style.pointerEvents = 'none';
        captureBtn.style.opacity = '0.5';

        try {
            await decodeFace(state.capturedImageBase64);
            setProgress(40);
            await suitLoadedPromise;
            loadingMsg.textContent = "Generating your look...";
            await generateSuitPreview(state.metadata, "standard charcoal slim-fit");
            setProgress(100);
            
        } catch (error) {
            console.error(error);
            alert("AI processing failed. Check console.");
            processingOverlay.classList.add('hidden');
            captureBtn.style.pointerEvents = 'all';
            captureBtn.style.opacity = '1';
        }
    });
});
