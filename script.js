// Firebase Kütüphanelerini İçe Aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FIREBASE YAPILANDIRMASI ---
const firebaseConfig = {
    apiKey: "AIzaSyACNUqRsvO1yy7mJzIPXQUhZsk2LSV_VOU",
    authDomain: "sude-love.firebaseapp.com",
    projectId: "sude-love",
    storageBucket: "sude-love.firebasestorage.app",
    messagingSenderId: "254862857032",
    appId: "1:254862857032:web:eb4aa1eb9bd5fd65dcd97d",
    measurementId: "G-Y62P5C60XW"
};

// Firebase'i Başlat
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase Hatası:", error);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MÜZİK AYARLARI (MANUEL KONTROL) ---
    const music = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');
    const musicIcon = document.getElementById('music-icon');
    
    // Müzik sesi seviyesi
    music.volume = 0.5;

    // Dosya hatası kontrolü
    music.addEventListener('error', function(e) {
        console.error("Müzik dosyası hatası:", music.error);
        alert("⚠️ MÜZİK DOSYASI BULUNAMADI!\n\nLütfen proje klasörüne 'music.mp3' adında bir dosya eklediğinden emin ol.\n(Hata kodu: 404 Not Found)");
    });

    // Müzik Çalma/Durdurma Fonksiyonu
    function toggleMusic() {
        if (music.paused) {
            music.play().then(() => {
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-pause');
            }).catch(error => {
                console.error("Oynatma hatası:", error);
                alert("Müzik başlatılamadı. Dosya 'music.mp3' adıyla klasörde mi?");
            });
        } else {
            music.pause();
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-music');
        }
    }

    // Butona tıklama
    musicControl.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });

    // --- 2. SAYAÇ AYARLARI ---
    const startDate = new Date('2025-07-14T00:00:00'); 

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const diff = now - startDate; 
        if (diff < 0) return;
        
        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        daysSpan.textContent = days;
        hoursSpan.textContent = hours.toString().padStart(2, '0');
        minutesSpan.textContent = minutes.toString().padStart(2, '0');
        secondsSpan.textContent = seconds.toString().padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown(); 

    // --- 3. RESİM DEĞİŞTİRME ---
    const mainBackground = document.getElementById('main-background');
    const thumbnails = document.querySelectorAll('.thumbnail');
    mainBackground.style.backgroundImage = "url('photos/thumb1.jpg')"; 

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const newBgUrl = this.getAttribute('data-bg');
            mainBackground.style.backgroundImage = `url(${newBgUrl})`;
            thumbnails.forEach(t => { t.style.borderColor = 'transparent'; t.style.transform = 'scale(1)'; });
            this.style.borderColor = '#FFEDB0';
            this.style.transform = 'scale(1.1)';
        });
    });

    // --- 4. LOADING VE AŞK NOTLARI ---
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        content.classList.remove('hidden');    
        loadingScreen.addEventListener('transitionend', () => loadingScreen.remove());
        createHearts(); 
    }, 3500);

    // Aşk Notu Butonu
    const loveBtn = document.getElementById('love-btn');
    const loveNotes = [
        "Ben sana göz koydum yüregi yeten varsa gelsin iş koysun.",
        "Seni çok seviyorummm.",
        "Ankara'nın en güzel kızı.",
        "HÜLYA BALKAN'A SAYGILARIMLA..."
    ];

    loveBtn.addEventListener('click', () => {
        const noteElement = document.getElementById('random-love-note');
        const randomIndex = Math.floor(Math.random() * loveNotes.length);
        noteElement.style.opacity = 0;
        setTimeout(() => {
            noteElement.textContent = `"${loveNotes[randomIndex]}"`;
            noteElement.style.opacity = 1;
        }, 300);
    });

    // --- 5. ZİYARETÇİ DEFTERİ  ---
    const msgInput = document.getElementById('guest-msg');
    const nameInput = document.getElementById('guest-name');
    const sendBtn = document.getElementById('send-msg-btn');
    const messagesList = document.getElementById('messages-list');

    sendBtn.addEventListener('click', async () => {
        // Trim ile baştaki ve sondaki boşlukları temizliyoruz
        const text = msgInput.value.trim();
        const name = nameInput.value.trim(); 

        // İki alanın da dolu olup olmadığını kontrol et
        if (text === "" || name === "") { 
            alert("Lütfen hem adınızı hem de mesajınızı yazın! 📝"); 
            return; 
        }

        try {
            await addDoc(collection(db, "messages"), {
                name: name,
                text: text,
                timestamp: serverTimestamp()
            });
            // Gönderim başarılı olunca kutuları temizle
            msgInput.value = "";
            nameInput.value = "";
        } catch (e) {
            console.error("Hata:", e);
            alert("Mesaj gönderilemedi. İnternet bağlantınızı kontrol edin.");
        }
    });

    if (db) {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            messagesList.innerHTML = "";
            snapshot.forEach((doc) => {
                const data = doc.data();
                const msgDiv = document.createElement("div");
                msgDiv.classList.add("msg-item");
                
                let dateStr = "";
                if(data.timestamp) {
                    const date = data.timestamp.toDate();
                    dateStr = date.toLocaleDateString("tr-TR") + " " + date.toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'});
                }

                msgDiv.innerHTML = `
                    <div class="msg-header">
                        <strong>${sanitize(data.name)}</strong>
                        <span>${dateStr}</span>
                    </div>
                    <div class="msg-content">${sanitize(data.text)}</div>
                `;
                messagesList.appendChild(msgDiv);
            });
            if(snapshot.empty) messagesList.innerHTML = "<div style='text-align:center; color:#ccc; font-size:0.8em;'>İlk notu sen bırak!</div>";
        });
    }

    function sanitize(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    function createHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤';
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDuration = Math.random() * 3 + 2 + "s";
            heart.style.fontSize = Math.random() * 20 + 10 + "px";
            document.body.appendChild(heart);
            setTimeout(() => { heart.remove(); }, 5000);
        }, 500);
    }
});