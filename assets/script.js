// إعداد IndexedDB لتخزين الحيوانات محلياً
let db;
const request = indexedDB.open('PetDB', 1);
request.onerror = (event) => console.error('Database error:', event.target.error);
request.onsuccess = (event) => { db = event.target.result; };
request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('pets', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('type', 'type', { unique: false });
};

// دالة تبني حيوان جديد
function adoptPet() {
    const type = document.getElementById('petType').value;
    const transaction = db.transaction(['pets'], 'readwrite');
    const objectStore = transaction.objectStore('pets');
    const newPet = { type: type, health: 100, actions: [] };
    objectStore.add(newPet);
    drawPet(type);
    document.getElementById('petStatus').innerText = `تم تبني ${type}! صحته: 100%`;
}

// دالة إحياء ذكرى (AI بسيط: تحليل الوصف)
function reviveMemory() {
    const desc = document.getElementById('memoryDesc').value;
    if (!desc) return alert('أدخل وصفاً!');
    let revivedType = 'حيوان مخصص';
    if (desc.includes('كلب')) revivedType = 'كلب مخصص';
    if (desc.includes('لعب')) revivedType += ' مرح'; // AI: إضافة حركة بناءً على كلمات
    const transaction = db.transaction(['pets'], 'readwrite');
    const objectStore = transaction.objectStore('pets');
    objectStore.add({ type: revivedType, health: 100, actions: [desc] });
    drawPet(revivedType, desc); // تمرير الوصف لتخصيص
    document.getElementById('petStatus').innerText = `تم إحياء الذكرى: ${revivedType}`;
}

// دالة رسم وتحريك الحيوان بـ Canvas (AI: حركة عشوائية أو مخصصة)
function drawPet(type, desc = '') {
    const canvas = document.getElementById('petCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم أساسي بناءً على النوع (مثال بسيط بأشكال)
    ctx.fillStyle = getColorForType(type); // دالة للون
    ctx.fillRect(100, 150, 200, 100); // جسم
    ctx.fillRect(300, 170, 50, 20); // ذيل
    
    // AI: حركة بناءً على وصف أو عشوائي
    let movement = 5; // حركة افتراضية
    if (desc && desc.includes('لعب')) movement = 15; // أسرع إذا لعب
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(100 + Math.random() * movement, 150, 200, 100);
        ctx.fillRect(300 + Math.random() * movement, 170, 50, 20);
    }, 500); // تحديث كل نصف ثانية
}

// دالة مساعدة للألوان بناءً على النوع
function getColorForType(type) {
    if (type.includes('بري')) return 'brown';
    if (type.includes('بحري')) return 'blue';
    if (type.includes('طائر')) return 'gray';
    if (type.includes('ديناصور')) return 'green';
    if (type.includes('تنين')) return 'red';
    return 'black';
}

// لتحميل الحيوانات السابقة (اختياري: أضف زراً لاحقاً)
