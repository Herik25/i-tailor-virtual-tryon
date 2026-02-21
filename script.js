document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-btn');
    const createBtn = document.getElementById('create-btn');
    const container = document.querySelector('.container');

    // Smooth entry animation
    container.style.opacity = '0';
    container.style.transition = 'opacity 1s ease-out, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    container.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 100);

    // Close button interaction
    closeBtn.addEventListener('click', () => {
        container.style.opacity = '0';
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
            console.log('UI Closed');
            // In a real app, this might redirect or close a modal
        }, 500);
    });

    // Create button interaction
    createBtn.addEventListener('click', () => {
        container.style.opacity = '0';
        container.style.transform = 'scale(1.05)';
        setTimeout(() => {
            window.location.href = 'capture.html';
        }, 500);
    });
});
