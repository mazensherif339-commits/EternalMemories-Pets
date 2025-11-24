// قاعدة بيانات محلية (IndexedDB) عشان البيانات تفضل محفوظة حتى لو قفلت المتصفح
let db;
const request = indexedDB.open('EternalPetsDB', 3);

request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('pets')) {
        db.createObjectStore('pets', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = e => {
    db = e.target.result;
    loadLastPet(); // يعرض آخر حيوان تم تبنيه أو إحياؤه لما تفتح الموقع تاني
};

request.onerror = () => console.error("خطأ في قاعدة البيانات");

// عناصر الـ Canvas
const canvas = document.getElementById('petCanvas');
const ctx = canvas.getContext('2d');
let animationId;
let petX = canvas.width / 2;
let petY = canvas.height / 2;
let speedX = 2;
let speedY = 2;

// تبني حيوان جديد
function adoptPet() {
    const type = document.getElementById('petType').value;
    const pet = { type, health: 100, mood: 'سعيد جدًا', created: Date.now() };

    const tx = db.transaction('pets', 'readwrite');
    tx.objectStore('pets').add(pet).onsuccess = () => {
        document.getElementById('petStatus').innerHTML = `تم تبني <strong>${type}</strong> بنجاح!`;
        drawAndAnimate(type);
    };
}

// إحياء ذكرى حيوان متوفى (ذكاء اصطناعي بسيط)
function reviveMemory() {
    const desc = document.getElementById('memoryDesc').value.trim();
    if (!desc) {
        alert('اكتب وصف حيوانك المتوفى أولاً');
        return;
    }

    let revivedType = 'حيوانك المحبوب';
    if (desc.includes('كلب') || desc.includes('جرو')) revivedType = 'كلبك المحبوب';
    if (desc.includes('قطة') || desc.includes('قط')) revivedType = 'قطتك المحبوبة';
    if (desc.includes('طائر') || desc.includes('عصافير')) revivedType = 'طائرك المحبوب';
    if (desc.includes('سمك')) revivedType = 'سمكتك الذهبية';

    const pet = { type: revivedType + ' (ذكرى)', description: desc, health: 100, mood: 'حنين', created: Date.now() };

    const tx = db.transaction('pets', 'readwrite');
    tx.objectStore('pets').add(pet).onsuccess = () => {
        document.getElementById('petStatus').innerHTML = `تم إحياء ذكرى <strong>${revivedType}</strong> بنجاح`;
        drawAndAnimate(revivedType, desc);
    };
}

// رسم وتحريك الحيوان
function drawAndAnimate(type, description = '') {
    cancelAnimationFrame(animationId);
    petX = canvas.width / 2;
    petY = canvas.height /
