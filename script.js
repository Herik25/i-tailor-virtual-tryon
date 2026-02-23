document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-btn');
    const createBtn = document.getElementById('create-btn');
    const container = document.querySelector('.container');

    container.style.opacity = '0';
    container.style.transition = 'opacity 1s ease-out, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    container.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 100);

    closeBtn.addEventListener('click', () => {
        container.style.opacity = '0';
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
            console.log('UI Closed');
        }, 500);
    });

    createBtn.addEventListener('click', () => {
        window.location.href = 'capture.html';
    });
});
