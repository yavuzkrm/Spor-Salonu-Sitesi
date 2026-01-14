// --- MENÜ İŞLEMLERİ ---
var navLinks = document.getElementById("navLinks");

function showMenu() {
    navLinks.style.right = "0";
}

function hideMenu() {
    navLinks.style.right = "-200px";
}

// --- BMI HESAPLAMA ---
function calculateBMI() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const resultDiv = document.getElementById('bmiResult');

    if (height === "" || weight === "") {
        resultDiv.innerHTML = "<span style='color:red'>Lütfen değerleri giriniz!</span>";
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    let status = "";
    let color = "";

    if (bmi < 18.5) { status = "Zayıf"; color = "#eec60a"; }
    else if (bmi >= 18.5 && bmi < 24.9) { status = "İdeal Kilo"; color = "#2ecc71"; }
    else if (bmi >= 25 && bmi < 29.9) { status = "Fazla Kilo"; color = "#e67e22"; }
    else { status = "Obezite"; color = "#c0392b"; }

    resultDiv.innerHTML = `<br>BMI Değerin: <span style="color:${color}; font-size:24px;">${bmi}</span><br>Durum: <span style="color:${color}">${status}</span>`;
}

// --- GALERİ MODAL İŞLEMLERİ (MOBİL UYUMLU) ---
function resmiAc(resim) {
    var modal = document.getElementById("resimModal");
    var buyukresim = document.getElementById("buyukResim");
    var caption = document.getElementById("caption");
    if (!modal || !buyukresim) return;

    // Reset any previous state
    buyukresim.style.transform = '';
    buyukresim.classList.remove('zoomed');
    buyukresim._scale = 1;
    buyukresim._translateX = 0;
    buyukresim._translateY = 0;

    // Show modal and lock background scroll
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    buyukresim.src = resim.src;
    caption.textContent = resim.alt || '';

    // Overlay click (only when clicking the overlay, not the image)
    function overlayHandler(e) {
        if (e.target === modal) resmiKapat();
    }
    modal.addEventListener('click', overlayHandler);

    // Escape key closes modal
    function escHandler(e) { if (e.key === 'Escape') resmiKapat(); }
    document.addEventListener('keydown', escHandler);

    // Touch/gesture handlers
    attachGalleryTouchHandlers(modal, buyukresim);

    // Double-tap to zoom (mobile) / double-click (desktop)
    var lastTap = 0;
    function tapHandler(e) {
        var now = Date.now();
        var delta = now - lastTap;
        lastTap = now;
        if (delta < 300 && delta > 0) {
            // double tap
            toggleZoom(buyukresim, e.touches ? e.touches[0] : e);
        }
    }

    // Click/dblclick fallback for desktop
    function dblClickHandler(e) { toggleZoom(buyukresim, e); }

    buyukresim.addEventListener('touchend', tapHandler);
    buyukresim.addEventListener('dblclick', dblClickHandler);

    // store handlers for cleanup
    modal._galleryHandlers = { overlayHandler: overlayHandler, escHandler: escHandler, tapHandler: tapHandler, dblClickHandler: dblClickHandler };
}

function resmiKapat() {
    var modal = document.getElementById("resimModal");
    var buyukresim = document.getElementById("buyukResim");
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';

    if (buyukresim) {
        buyukresim.style.transform = '';
        buyukresim.classList.remove('zoomed');
        buyukresim._scale = 1;
        buyukresim._translateX = 0;
        buyukresim._translateY = 0;
        // remove dbl/tap handlers
        if (modal._galleryHandlers) {
            buyukresim.removeEventListener('touchend', modal._galleryHandlers.tapHandler);
            buyukresim.removeEventListener('dblclick', modal._galleryHandlers.dblClickHandler);
        }
    }

    // remove overlay and key handlers
    if (modal._galleryHandlers) {
        modal.removeEventListener('click', modal._galleryHandlers.overlayHandler);
        document.removeEventListener('keydown', modal._galleryHandlers.escHandler);
        delete modal._galleryHandlers;
    }

    // remove touch handlers if attached
    if (modal._touchHandlers) {
        modal.removeEventListener('touchstart', modal._touchHandlers.start);
        modal.removeEventListener('touchmove', modal._touchHandlers.move);
        modal.removeEventListener('touchend', modal._touchHandlers.end);
        delete modal._touchHandlers;
    }
}

// --- İLETİŞİM FORMU (E-POSTA GÖNDERME) ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        // 1. Sayfanın yenilenmesini durdur (AJAX ile göndermek için)
        e.preventDefault();

        const submitBtn = contactForm.querySelector('input[type="submit"]');
        const originalBtnText = submitBtn.value;
        
        // Butonu "Gönderiliyor..." yap ve devre dışı bırak
        submitBtn.value = "Gönderiliyor...";
        submitBtn.disabled = true;

        // Form verilerini al
        const data = new FormData(e.target);

        // SENİN FORMSPREE LİNKİN BURAYA EKLENDİ
        const formAction = "https://formspree.io/f/mvgebqar";
        
        try {
            const response = await fetch(formAction, {
                method: "POST",
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert("Mesajınız başarıyla gönderildi! Teşekkürler.");
                contactForm.reset(); // Formu temizle
            } else {
                // Sunucu hatası dönerse
                const jsonData = await response.json();
                if(jsonData.errors) {
                     alert("Hata: " + jsonData.errors.map(error => error.message).join(", "));
                } else {
                     alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
                }
            }
        } catch (error) {
            // İnternet yoksa veya ağ hatası varsa
            alert("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
            console.error(error);
        } finally {
            // İşlem bitince butonu eski haline getir
            submitBtn.value = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

