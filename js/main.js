/* ============================================================
   KULTURA360 – main.js
   Pràctica 2: Desenvolupament i rendiment

/* ============================================================
   1. MODAL DE BENVINGUDA
   Mostra el modal només el primer cop que l'usuari visita la web.
   Es guarda a localStorage per no tornar-lo a mostrar.
   ============================================================ */
(function initWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (!modal) return; // Només existeix a index.html

    // Comprova si ja ha visitat la web
    if (!localStorage.getItem('kultura360_visited')) {
        modal.style.display = 'flex'; // Mostra el modal

        // Botó de tancar
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
                localStorage.setItem('kultura360_visited', 'true'); // Marca la visita
            });
        }
    }
})();


/* ============================================================
   2. MENÚ HAMBURGER (mòbil)
   Afegeix/elimina la classe 'open' al nav i al botó hamburger.
   ============================================================ */
(function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
        // Alternar classe 'open' per mostrar/ocultar el menú
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('open'); // Animació X
    });

    // Tancar el menú en fer clic a un enllaç (mòbil)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });
})();


/* ============================================================
   3. SLIDER D'IMATGES 
   ============================================================ */
(function initSlider() {
    const track = document.getElementById('slider-track');
    if (!track) return; // Només existeix a galeria.html

    const slides = track.querySelectorAll('.slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;
    const total = slides.length;

    // Funció per moure el slider a la diapositiva indicada
    function goToSlide(index) {
        // Assegura que l'índex és dins del rang
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        currentIndex = index;

        // Mou el track horitzontalment
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

        // Actualitza els dots indicadors
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Botons anterior i següent
    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentIndex + 1); });

    // Dots clicables
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(dot.getAttribute('data-index')));
        });
    });

    // Autoplay cada 4 segons
    setInterval(function () { goToSlide(currentIndex + 1); }, 4000);
})();


/* ============================================================
   4. LIGHTBOX – Ampliar imatge en fer clic (galeria.html)
   En fer clic a una imatge de la graella, s'obre en gran.
   ============================================================ */
(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; // Només existeix a galeria.html

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxOverlay = document.getElementById('lightbox-overlay');

    // Afegir event de clic a totes les imatges de la graella
    const galleryImages = document.querySelectorAll('.gallery-img');
    galleryImages.forEach(function (img) {
        img.addEventListener('click', function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex'; // Mostra el lightbox
        });
    });

    // Tancar lightbox amb el botó de tancar
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function () {
            lightbox.style.display = 'none';
        });
    }

    // Tancar lightbox fent clic a l'overlay fosc
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', function () {
            lightbox.style.display = 'none';
        });
    }

    // Tancar lightbox amb la tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') lightbox.style.display = 'none';
    });
})();


/* ============================================================
   5. VALIDACIÓ D'EMAIL
   Comprova que el camp email contingui una @ entre el nom d'usuari
   i el domini, i que el domini tingui format "domini.ext".
   S'aplica al formulari de contacte i al de registre.
   ============================================================ */

// Funció reutilitzable de validació d'email
function validateEmail(value) {
    // Comprova que hi ha una @ separant nom i domini, i que el domini té format "xxx.xxx"
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(value);
}

// Formulari de CONTACTE
(function initContactValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const emailInput = document.getElementById('contact-email');
    const emailError = document.getElementById('contact-email-error');

    form.addEventListener('submit', function (e) {
        let valid = true;

        // Validació email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'El correu electrònic no és vàlid. Exemple: nom@domini.cat';
            valid = false;
        } else {
            emailError.textContent = '';
        }

        // Si hi ha errors, no enviar el formulari
        if (!valid) e.preventDefault();
    });

    // Validació en temps real mentre escriu
    emailInput.addEventListener('input', function () {
        if (validateEmail(emailInput.value)) {
            emailError.textContent = '';
        }
    });
})();


/* ============================================================
   6. VALIDACIÓ REGISTRE
   - Email vàlid (mateixa lògica que contacte)
   - Contrasenya i confirmació han de coincidir
   ============================================================ */
(function initRegisterValidation() {
    const form = document.getElementById('register-form');
    if (!form) return;

    const emailInput = document.getElementById('reg-email');
    const emailError = document.getElementById('reg-email-error');
    const passInput  = document.getElementById('reg-pass');
    const pass2Input = document.getElementById('reg-pass2');
    const passError  = document.getElementById('reg-pass-error');

    form.addEventListener('submit', function (e) {
        let valid = true;

        // Validació email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'El correu electrònic no és vàlid. Exemple: nom@domini.cat';
            valid = false;
        } else {
            emailError.textContent = '';
        }

        // Validació contrasenyes coincidents
        if (passInput.value !== pass2Input.value) {
            passError.textContent = 'Les contrasenyes no coincideixen.';
            valid = false;
        } else if (passInput.value.length < 6) {
            passError.textContent = 'La contrasenya ha de tenir mínim 6 caràcters.';
            valid = false;
        } else {
            passError.textContent = '';
        }

        // Si hi ha errors, no enviar el formulari
        if (!valid) e.preventDefault();
    });

    // Validació en temps real
    emailInput.addEventListener('input', function () {
        if (validateEmail(emailInput.value)) emailError.textContent = '';
    });

    pass2Input.addEventListener('input', function () {
        if (passInput.value === pass2Input.value) passError.textContent = '';
    });
})();

/* ============================================================
   7. TÀCTIL A LES FLIPCARDS (x Mòbil)
   ============================================================ */
(function initMobileFlipcards() {
    // Busca les targetes del CSS
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(function (card) {
        card.addEventListener('click', function () {
            // Afegeix o treu la classe .flipped en fer-hi toc
            this.classList.toggle('flipped');
        });
    });
})();
