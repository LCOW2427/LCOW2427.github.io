const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('open');
    // Change the button's content based on whether the menu is open or closed
    if (navLinks.classList.contains('open')) {
        hamburger.innerHTML = '&times;'; // Cross icon
    } else {
        hamburger.innerHTML = '&#9776;'; // Hamburger icon
    }
});