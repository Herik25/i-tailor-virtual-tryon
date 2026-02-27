document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('selectedMaterialPath', "materials/Dark Navy.jpg");
    localStorage.removeItem('generatedLook');
    localStorage.removeItem('capturedImageBase64');
    localStorage.removeItem('materialBase64');

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

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.opacity = '0';
            container.style.transform = 'scale(0.98)';
            setTimeout(() => {
                console.log('UI Closed');
            }, 500);
        });
    }

    const materialSelect = document.getElementById('material-select');
    if (materialSelect) {
        if (!localStorage.getItem('selectedMaterialPath')) {
            localStorage.setItem('selectedMaterialPath', materialSelect.value);
        }

        materialSelect.addEventListener('change', (e) => {
            const val = e.target.options[e.target.selectedIndex].value;
            localStorage.setItem('selectedMaterialPath', val);
            console.log("iTailor: Selection updated to", val);
        });
    }

    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (materialSelect) {
            const val = materialSelect.options[materialSelect.selectedIndex].value;
            localStorage.setItem('selectedMaterialPath', val);
        }
        
        localStorage.removeItem('generatedLook');
        
        console.log("iTailor: Navigating with material:", localStorage.getItem('selectedMaterialPath'));
        
        setTimeout(() => {
            window.location.href = 'capture.html';
        }, 50);
    });
});
