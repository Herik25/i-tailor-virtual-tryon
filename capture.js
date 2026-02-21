// import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// const GEMINI_API_KEY = "AIzaSyB-BUuv6N2OQYUrztz4fAKMLBOFdEWZ4mg"; 

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// const state = {
//     capturedImageBase64: null,
//     suitBaseBase64: null,
//     metadata: {
//         MODEL: "",
//         FACE: "",
//         FACIAL_HAIR: "",
//         DETAILS: ""
//     }
// };

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const container = document.querySelector('.container');
    const loadingOverlay = document.querySelector('.camera-loading');
    const processingOverlay = document.getElementById('processingOverlay');
    const progressPercent = document.getElementById('progressPercent');
    const fgCircle = processingOverlay.querySelector('.fg');

    // Smooth entry animation
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.8s ease-out, transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    container.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 100);

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

    // Initialize Webcam
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
                loadingOverlay.style.opacity = '0';
                setTimeout(() => loadingOverlay.style.display = 'none', 300);
            };
        } catch (err) {
            console.error('Error accessing webcam:', err);
            alert('Unable to access camera. Please ensure you have granted permission.');
        }
    }

    initWebcam();

    // Capture functionality
    captureBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.zIndex = '1000';
        flash.style.opacity = '0.8';
        flash.style.transition = 'opacity 0.3s ease-out';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => document.body.removeChild(flash), 300);
        }, 50);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/png');
        console.log('Image Captured:', imageData.substring(0, 50) + '...');
        
        // Show Processing Loader
        processingOverlay.classList.remove('hidden');
        setProgress(0);
        
        captureBtn.style.pointerEvents = 'none';
        captureBtn.style.opacity = '0.5';

        // 2-second loading imitation
        let progress = 0;
        const startTime = Date.now();
        const duration = 2000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);
            
            setProgress(progress);

            if (elapsed >= duration) {
                clearInterval(interval);
                setTimeout(() => {
                    window.location.href = 'result.html';
                }, 300);
            }
        }, 30);
    });
});
