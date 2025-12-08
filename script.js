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

// --- GALERİ MODAL İŞLEMLERİ ---
function resmiAc(resim) {
    var modal = document.getElementById("resimModal");
    var buyukresim = document.getElementById("buyukResim");
    if(modal && buyukresim) {
        modal.style.display = "block";
        buyukresim.src = resim.src;
    }
}

function resmiKapat() {
    var modal = document.getElementById("resimModal");
    if(modal) {
        modal.style.display = "none";
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