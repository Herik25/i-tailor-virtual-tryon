const headerHTML = `
    <!-- Fullscreen Dynamic Background -->
    <div id="app-bg" class="app-bg"></div>
    
    <!-- Sidebar Dimmer Overlay -->
    <div id="overlay" class="overlay"></div>

    <div id="itailor-header">
        <div class="header-announcement-bar">
            <span>Worldwide Shipping • <strong>24/7</strong> Customer Support • Tailored for <strong>300,000+</strong> Customers</span>
        </div>

        <nav class="header-main">
            <div class="header-container">
                <div class="header-left">
                    <button id="menu-toggle" class="menu-toggle_btn" aria-label="Menu">
                        <div class="menu-icon-grid">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M4 12H20M4 18H20" stroke="#FFF8EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </button>
                </div>

                <div class="header-center">
                    <a href="index.html" class="header-logo">
                        <img src="./logo.png" alt="iTailor Logo">
                    </a>
                </div>

                <div class="header-right">
                    <div class="header-actions">
                        <a href="#" class="header-action-item">
                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 0C5.60712 0 0 5.38284 0 12C0 18.6172 5.60712 24 12.5 24C19.3929 24 25 18.6172 25 12C25 5.38284 19.3929 0 12.5 0ZM12.5 22.7997C6.2869 22.7997 1.25036 17.9646 1.25036 12C1.25036 6.03542 6.2869 1.20035 12.5 1.20035C18.7131 1.20035 23.7496 6.03542 23.7496 12C23.7496 17.9646 18.7131 22.7997 12.5 22.7997ZM15.883 6.87808C14.8823 6.87808 13.9389 7.2527 13.2323 7.93331L12.4999 8.63641L11.7675 7.93331C11.0585 7.2527 10.1176 6.87808 9.11683 6.87808C8.11492 6.87808 7.17274 7.2527 6.46497 7.93331C5.00252 9.33727 5.00252 11.621 6.46497 13.025L12.4999 18.8185L18.5348 13.025C19.9972 11.621 19.9972 9.33727 18.5348 7.93331C17.827 7.2527 16.8849 6.87808 15.883 6.87808ZM17.6513 12.1757L16.0353 13.727L12.4999 17.1221L7.34851 12.1767C6.37237 11.2396 6.37237 9.72096 7.34851 8.78277C7.83716 8.31366 8.47581 8.07967 9.11563 8.07967C9.75545 8.07967 10.3953 8.31366 10.8828 8.78277L12.4999 10.333L14.1158 8.78164C14.6045 8.31254 15.2431 8.07854 15.883 8.07854C16.5228 8.07854 17.1626 8.31254 17.6501 8.78164C18.6274 9.71874 18.6274 11.2386 17.6513 12.1757Z" fill="white"/>
                            </svg>
                            <span class="action-label">Wishlist</span>
                        </a>
                        <a href="#" class="header-action-item">
                            <div class="cart-icon-wrapper">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.4429 5.71429L19.1857 16.5714H5.07143L1.81429 5.71429L1 3M10.5 20.3714C10.5 20.8034 10.3284 21.2176 10.023 21.523C9.71759 21.8284 9.30335 22 8.87143 22C8.4395 22 8.02527 21.8284 7.71985 21.523C7.41444 21.2176 7.24286 20.8034 7.24286 20.3714M17.0143 20.3714C17.0143 20.8034 16.8427 21.2176 16.5373 21.523C16.2319 21.8284 15.8176 22 15.3857 22C14.9538 22 14.5396 21.8284 14.2341 21.523C13.9287 21.2176 13.7571 20.8034 13.7571 20.3714" stroke="#FFF8EA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M11.9197 12.1392C11.2071 12.1392 10.5774 12.0166 10.0305 11.7713C9.48698 11.526 9.06108 11.188 8.75284 10.7571C8.4446 10.3262 8.29214 9.8357 8.29545 9.28551C8.29214 8.85464 8.37997 8.45857 8.55895 8.0973C8.74124 7.73272 8.98816 7.42945 9.29972 7.1875C9.61127 6.94223 9.95928 6.78646 10.3438 6.72017V6.66051C9.83665 6.53788 9.43063 6.2661 9.12571 5.84517C8.82079 5.42424 8.66998 4.94034 8.6733 4.39347C8.66998 3.87311 8.80753 3.40909 9.08594 3.00142C9.36766 2.59044 9.75379 2.26728 10.2443 2.03196C10.7348 1.79664 11.2933 1.67898 11.9197 1.67898C12.5395 1.67898 13.093 1.7983 13.5803 2.03693C14.0708 2.27225 14.4569 2.59541 14.7386 3.00639C15.0204 3.41406 15.1629 3.87642 15.1662 4.39347C15.1629 4.94034 15.0071 5.42424 14.6989 5.84517C14.3906 6.2661 13.9896 6.53788 13.4957 6.66051V6.72017C13.8769 6.78646 14.2199 6.94223 14.5249 7.1875C14.8331 7.42945 15.0784 7.73272 15.2607 8.0973C15.4463 8.45857 15.5407 8.85464 15.544 9.28551C15.5407 9.8357 15.3849 10.3262 15.0767 10.7571C14.7685 11.188 14.3409 11.526 13.794 11.7713C13.2505 12.0166 12.6257 12.1392 11.9197 12.1392ZM11.9197 10.8814C12.3407 10.8814 12.7053 10.8118 13.0135 10.6726C13.3217 10.5301 13.5604 10.3329 13.7294 10.081C13.8984 9.82576 13.9846 9.52746 13.9879 9.18608C13.9846 8.83144 13.8918 8.51823 13.7095 8.24645C13.5305 7.97467 13.2869 7.76089 12.9787 7.60511C12.6705 7.44934 12.3175 7.37145 11.9197 7.37145C11.5187 7.37145 11.1624 7.44934 10.8509 7.60511C10.5393 7.76089 10.294 7.97467 10.1151 8.24645C9.93608 8.51823 9.84825 8.83144 9.85156 9.18608C9.84825 9.52746 9.92945 9.82576 10.0952 10.081C10.2642 10.3329 10.5045 10.5301 10.8161 10.6726C11.1276 10.8118 11.4955 10.8814 11.9197 10.8814ZM11.9197 6.14347C12.2578 6.14347 12.5578 6.07552 12.8196 5.93963C13.0814 5.80374 13.2869 5.61482 13.4361 5.37287C13.5885 5.13092 13.6664 4.84754 13.6697 4.52273C13.6664 4.20455 13.5902 3.92614 13.4411 3.6875C13.2952 3.44886 13.0914 3.26491 12.8295 3.13565C12.5677 3.00308 12.2644 2.93679 11.9197 2.93679C11.5684 2.93679 11.2602 3.00308 10.995 3.13565C10.7332 3.26491 10.5294 3.44886 10.3835 3.6875C10.2377 3.92614 10.1664 4.20455 10.1697 4.52273C10.1664 4.84754 10.2393 5.13092 10.3885 5.37287C10.5376 5.61482 10.7431 5.80374 11.005 5.93963C11.2701 6.07552 11.575 6.14347 11.9197 6.14347Z" fill="white"/>
                                </svg>
                            </div>
                            <span class="action-label">Cart</span>
                        </a>
                        <a href="#" class="header-action-item">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.55078 4.5158H6.70078M6.70078 4.5158H8.80078M6.70078 4.5158V3.5498M10.5508 4.5158H8.80078M8.80078 4.5158C8.43078 5.8358 7.65878 7.0838 6.77578 8.1808M6.77578 8.1808C6.04578 9.0898 5.23878 9.8938 4.52578 10.5498M6.77578 8.1808C6.32578 7.6528 5.69578 6.7998 5.51578 6.4138M6.77578 8.1808L8.12578 9.58381" stroke="white" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.57278 15.5278C5.62778 17.2478 5.81478 18.3028 6.45878 19.0878C6.62487 19.2902 6.81043 19.4757 7.01278 19.6418C8.12078 20.5498 9.76278 20.5498 13.0508 20.5498C16.3388 20.5498 17.9818 20.5498 19.0888 19.6418C19.2914 19.4751 19.4761 19.2905 19.6428 19.0878C20.5508 17.9798 20.5508 16.3378 20.5508 13.0498C20.5508 9.7628 20.5508 8.1188 19.6428 7.0118C19.4767 6.80945 19.2911 6.6239 19.0888 6.4578C18.3068 5.8168 17.2578 5.6278 15.5508 5.5728M5.57278 15.5278C3.85278 15.4728 2.79778 15.2858 2.01278 14.6418C1.81043 14.4757 1.62487 14.2902 1.45878 14.0878C0.550781 12.9798 0.550781 11.3378 0.550781 8.0498C0.550781 4.7628 0.550781 3.1188 1.45878 2.0118C1.62487 1.80945 1.81043 1.6239 2.01278 1.4578C3.12078 0.549805 4.76278 0.549805 8.05078 0.549805C11.3378 0.549805 12.9818 0.549805 14.0888 1.4578C14.2911 1.6239 14.4767 1.80945 14.6428 2.0118C15.2868 2.7968 15.4738 3.8518 15.5288 5.5718L15.5508 5.5728M5.57278 15.5278L15.5508 5.5728" stroke="white" stroke-width="1.1"/>
                                <path d="M11.5508 17.5498L12.3838 15.5498M12.3838 15.5498L14.0508 11.5498L15.7178 15.5498M12.3838 15.5498H15.7178M16.5508 17.5498L15.7178 15.5498" stroke="white" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                            <span class="action-label">Eng.</span>
                        </a>
                        <a href="#" class="header-action-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_318_3785)">
                                <path d="M11.9995 12.9795C15.1641 12.9795 17.7295 10.4141 17.7295 7.24953C17.7295 4.08494 15.1641 1.51953 11.9995 1.51953C8.83494 1.51953 6.26953 4.08494 6.26953 7.24953C6.26953 10.4141 8.83494 12.9795 11.9995 12.9795Z" stroke="#FFF8EA" stroke-width="1.5" stroke-miterlimit="10"/>
                                <path d="M1.5 23.48L1.87 21.43C2.3071 19.0625 3.55974 16.9229 5.41031 15.3828C7.26088 13.8428 9.59246 12.9997 12 13C14.4104 13.0006 16.7443 13.8465 18.5952 15.3905C20.4462 16.9345 21.6971 19.0788 22.13 21.45L22.5 23.5" stroke="#FFF8EA" stroke-width="1.5" stroke-miterlimit="10"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_318_3785">
                                <rect width="24" height="24" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span class="action-label">Login</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <div id="sidebar" class="sidebar">
            <div class="sidebar-main">
                <div class="sidebar-header">
                    <button id="close-btn" class="close-btn">
                        <div class="close-icon">
                            <span></span>
                            <span></span>
                        </div>
                        <span class="close-text">CLOSE</span>
                    </button>
                </div>
                
                <div class="sidebar-content">
                    <ul id="nav-list" class="nav-list">
                        <!-- Dynamic Content -->
                    </ul>
                    <ul id="secondary-nav-list" class="secondary-nav-list">
                        <!-- Dynamic Content -->
                    </ul>
                </div>

                <div class="sidebar-footer">
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-pinterest-p"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                        <div class="social-hidden-div"></div>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#"><i class="fab fa-google-plus-g"></i></a>
                    </div>
                    <div class="shipping-info">
                        <img src="https://www.itailor.com/landing/assets/iTailor/images/iTailor-Exchange.png" alt="world wide shipping">
                    </div>
                </div>
            </div>

            <div id="submenu-panel" class="submenu-panel">
                <!-- Dynamic Content -->
            </div>
        </div>
    </div>
`;

function initHeader() {
    // Inject Font Awesome dynamically
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fa);
    }

    const placeholder = document.getElementById('header-placeholder');
    if (placeholder) {
        placeholder.innerHTML = headerHTML;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}


const menuItems = [
    { 
        name: "Home", 
        link: "#",
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_01.jpg",
        largeImage: " https://www.itailor.com/landing/assets/iTailor/images/menu/home/Home.jpg",
        submenu: [] 
    },
    { 
        name: "Men's Clothing", 
        link: "#",
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_02.jpg",
        largeImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/men-clothing/custom-shirt.jpg", 
        submenu: ["Suits", "Shirts", "Pants", "Jackets", "Coats"]
    },
    { 
        name: "Women's Clothing", 
        link: "#", 
        active: true,
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_03.jpg",
        largeImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/women-clothing/women-suits.jpg",
        submenu: ["Tailored Women Suits", "Women Coats", "Custom Blouses", "Custom Blazers/Jackets", "Custom Pants"]
    },
    { 
        name: "Collection", 
        link: "#",
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_04.jpg",
        largeImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/collection/Shirt-Collection.jpg",
        submenu: ["New Arrivals", "Best Sellers", "Limited Edition"]
    },
    { 
        name: "Accessories", 
        link: "#",
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_05.jpg",
        largeImage: "",
        submenu: ["Neckties", "Cufflinks", "Pocket Squares"]
    },
    { 
        name: "Shoes", 
        link: "#",
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_06.jpg",
        largeImage: "",
        submenu: ["Formal Shoes", "Loafers", "Boots"]
    },
    { 
        name: "Style of the Week", 
        link: "#",
        bgImage: "https://www.itailor.com/landing/assets/iTailor/images/menu/Menu_07.jpg",
        largeImage: "",
        submenu: []
    }
];

const socialLinks = [
    { icon: "fab fa-facebook-f", link: "#" },
    { icon: "fab fa-twitter", link: "#" },
    { icon: "fab fa-pinterest-p", link: "#" },
    { icon: "fab fa-youtube", link: "#" },
    { icon: "fab fa-linkedin-in", link: "#" },
    { icon: "fab fa-google-plus-g", link: "#" }
];

let navList, menuToggle, sidebar, closeBtn, overlay, appBg, submenuPanel;

let activeIndex = 2; // Default to Women's clothing per example

function renderMenu() {
    navList.innerHTML = ''; // Clear existing
    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('menu-item');
        if (item.submenu && item.submenu.length > 0) {
            li.classList.add('has-submenu');
        }
        
        // Background Strip Image
        const bgImg = document.createElement('img');
        bgImg.src = item.bgImage;
        bgImg.classList.add('nav-bg-strip');
        li.appendChild(bgImg);

        const linkWrapper = document.createElement('div');
        linkWrapper.classList.add('menu-link-wrapper');

        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.name;
        linkWrapper.appendChild(a);
        
        li.appendChild(linkWrapper);

        // Mobile Submenu (Rendered inline)
        if (item.submenu && item.submenu.length > 0) {
            const mobileSubUl = document.createElement('ul');
            mobileSubUl.classList.add('mobile-submenu');
            item.submenu.forEach(subItem => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.href = "#";
                subA.textContent = subItem;
                subLi.appendChild(subA);
                mobileSubUl.appendChild(subLi);
            });
            li.appendChild(mobileSubUl);
        }

        // Hover Event (Desktop)
        li.addEventListener('mouseenter', () => {
             if (window.innerWidth > 1024) {
                updateActiveState(index);
             }
        });

        // Click Event (Mobile Accordion)
        linkWrapper.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && item.submenu && item.submenu.length > 0) {
                e.preventDefault();
                // Toggle Active Class
                const isActive = li.classList.contains('mobile-active');
                
                // Close siblings
                const siblings = navList.querySelectorAll('li.menu-item');
                siblings.forEach(sib => {
                    if (sib !== li) {
                        sib.classList.remove('mobile-active');
                        const sub = sib.querySelector('.mobile-submenu');
                        if (sub) sub.style.maxHeight = null;
                    }
                });

                if (!isActive) {
                    li.classList.add('mobile-active');
                    const sub = li.querySelector('.mobile-submenu');
                    if (sub) sub.style.maxHeight = sub.scrollHeight + "px";
                } else {
                    li.classList.remove('mobile-active');
                    const sub = li.querySelector('.mobile-submenu');
                    if (sub) sub.style.maxHeight = null;
                }
            }
        });


        // Add stagger effect
        li.style.transitionDelay = `${index * 0.05 + 0.2}s`; 

        navList.appendChild(li);
    });

    // Initialize (Desktop)
    if (window.innerWidth > 1024) {
        updateActiveState(activeIndex);
    }
}

function updateActiveState(index) {
    if (index >= 0 && index < menuItems.length) {
        activeIndex = index;
        
        // Update List Items Style
        const lis = navList.querySelectorAll('li.menu-item');
        lis.forEach((li, i) => {
            if (i === index) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });

        // Update Fullscreen Background
        if (sidebar.classList.contains('active')) {
            if (menuItems[index].largeImage) {
                appBg.style.backgroundImage = `url('${menuItems[index].largeImage}')`;
                appBg.style.backgroundColor = 'transparent';
            } else {
                appBg.style.backgroundImage = 'none';
                appBg.style.backgroundColor = '#000';
            }
        }

        updateSubmenu(menuItems[index].submenu);
        
        // Position submenu panel vertically aligned with active item
        setTimeout(() => {
             const activeLi = lis[index];
             if (activeLi) {
                 const rect = activeLi.getBoundingClientRect();
                 const submenuList = document.querySelector('.submenu-list');
                 if (submenuList) {
                     // Simple alignment logic
                     let top = rect.top;
                     // Adjust if too low? 
                     if (top > window.innerHeight - 300) top = window.innerHeight - 300;
                     submenuList.style.marginTop = `${top}px`;
                 }
             }
        }, 50);
    } else {
        // Clear if invalid index
         submenuPanel.classList.remove('active');
    }
}

function updateSubmenu(items) {
    submenuPanel.innerHTML = ''; 
    if (items && items.length > 0) {
        submenuPanel.classList.add('active');
        const ul = document.createElement('ul');
        ul.classList.add('submenu-list');
        
        items.forEach((subItem, idx) => {
            const li = document.createElement('li');
            li.style.animation = `fadeInRight 0.3s ease forwards ${idx * 0.1}s`;
            li.style.opacity = '0';
            if (idx === 0) li.classList.add('header-item');

            const a = document.createElement('a');
            a.href = "#";
            a.innerHTML = idx === 0 ? `${subItem} <i class="fas fa-caret-right"></i>` : subItem;
            
            li.appendChild(a);
            ul.appendChild(li);
        });
        submenuPanel.appendChild(ul);
    } else {
        submenuPanel.classList.remove('active');
    }
}

// Secondary Navigation
const secondaryLinks = [
    { text: "About iTailor", isItalic: true },
    { text: "About Us", isItalic: false },
    { text: "Contact Us", isItalic: false },
    { text: "FAQ", isItalic: false },
    { text: "Why iTailor", isItalic: true },
    { text: "Reviews", isItalic: false },
    { text: "How It Works", isItalic: false },
    { text: "Quality", isItalic: false },
    { text: "Fit-Guarantee", isItalic: false },
    { text: "More", isItalic: true }
];

function renderSecondaryMenu() {
    const secList = document.getElementById('secondary-nav-list');
    secList.innerHTML = '';
    
    secondaryLinks.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = item.text;
        if (item.isItalic) {
            a.style.fontStyle = 'italic';
            a.style.opacity = '0.9'; 
        }
        li.appendChild(a);
        secList.appendChild(li);
    });
}

// Function to toggle sidebar
function toggleMenu() {
    if (!sidebar) return;
    sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    
    // Animate items on open
    if (sidebar.classList.contains('active')) {
        const lis = navList.querySelectorAll('li');
        lis.forEach((li, index) => {
             li.style.opacity = '0';
             li.style.transform = 'translateY(10px)';
             void li.offsetWidth; // Trigger reflow
             li.style.opacity = '1';
             li.style.transform = 'translateY(0)';
        });
        
        // Trigger initial active state render
        if (window.innerWidth > 1024) {
            updateActiveState(activeIndex);
        }
    } else {
        // Reset sub panel when closing main menu
        if (submenuPanel) submenuPanel.classList.remove('active');
        if (appBg) {
            appBg.style.backgroundImage = 'none';
            appBg.style.backgroundColor = 'transparent';
        }
    }
}

// Function to close sidebar
function closeMenu() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (submenuPanel) submenuPanel.classList.remove('active');
    if (appBg) {
        appBg.style.backgroundImage = 'none';
        appBg.style.backgroundColor = 'transparent';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initializing selections here ensures they are found in the DOM
    navList = document.getElementById('nav-list');
    menuToggle = document.getElementById('menu-toggle');
    sidebar = document.getElementById('sidebar');
    closeBtn = document.getElementById('close-btn');
    overlay = document.getElementById('overlay'); 
    appBg = document.getElementById('app-bg');
    submenuPanel = document.getElementById('submenu-panel');

    if (!menuToggle || !sidebar) {
        console.error('Sidebar elements not found. Ensure header.html has #menu-toggle and #sidebar');
        return;
    }
    // Inject keyframes for submenu if not in CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(styleSheet);

    renderMenu();
    renderSecondaryMenu();

    menuToggle.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMenu();
        }
    });
});
