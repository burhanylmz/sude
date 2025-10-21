document.addEventListener('DOMContentLoaded', () => {
    // 🔥 ÖNEMLİ: İLİŞKİNİZİN BAŞLANGIÇ TARİHİNİ BURAYA GİRİN (Yıl, Ay-1, Gün, Saat, Dakika, Saniye) 🔥
    const startDate = new Date('2025-07-14T00:00:00'); // Örnek olarak 15 Mayıs 2024, 18:30:00

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const diff = now - startDate; 

        if (diff < 0) { 
            daysSpan.textContent = '0';
            hoursSpan.textContent = '00';
            minutesSpan.textContent = '00';
            secondsSpan.textContent = '00';
            return;
        }

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        daysSpan.textContent = days;
        hoursSpan.textContent = hours.toString().padStart(2, '0');
        minutesSpan.textContent = minutes.toString().padStart(2, '0');
        secondsSpan.textContent = seconds.toString().padStart(2, '0');
    }

    // Sayaçı her saniye güncelle
    setInterval(updateCountdown, 1000);
    updateCountdown(); 

    // --- Loading Ekranı ve İçerik Geçişi ---
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    const flickerDuration = 4500; // 4.5 saniye yanıp sönme

    // --- Fotoğraf Değiştirme Mantığı ---
    const mainBackground = document.getElementById('main-background');
    const thumbnails = document.querySelectorAll('.thumbnail');

    // Başlangıç arka planını 'photos/main_bg.jpg' olarak ayarla
    const initialBackground = 'photos/main_bg.jpg';
    mainBackground.style.backgroundImage = `url(${initialBackground})`;

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Tıklanan thumbnail'ın data-bg özelliğindeki resmi al (thumbX.jpg)
            const newBgUrl = this.getAttribute('data-bg');
            
            // Arka planı değiştir
            mainBackground.style.backgroundImage = `url(${newBgUrl})`;
            
            // Tüm thumbnail'ların border'ını sıfırla
            thumbnails.forEach(t => t.style.borderColor = 'transparent');
            
            // Tıklanan thumbnail'ın border'ını vurgula
            this.style.borderColor = '#FFEDB0';
        });
    });

    // Açılış animasyonu bittikten sonra ana içeriği göster
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        content.classList.remove('hidden');    

        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.remove();
        });

    }, flickerDuration);
});