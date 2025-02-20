setTimeout(() => {
    const introScreen = document.querySelector('.intro-screen');
    const contentSection = document.querySelector('.content-section');
    const footer = document.querySelector('footer');

    introScreen.style.opacity = '0'; 
    introScreen.style.transition = 'opacity 1s ease-in-out'; 
    setTimeout(() => {
        introScreen.style.display = 'none'; 
        contentSection.classList.remove('hidden'); 
        footer.classList.remove('hidden'); 
    }, 1000); 
}, 3000); 