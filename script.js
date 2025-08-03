// 1. ดึงองค์ประกอบที่จำเป็นจาก HTML
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDisplay = document.getElementById('results-display');
const initialMessage = document.querySelector('.initial-message'); // ข้อความเริ่มต้น

// 2. ข้อมูลขยะ (นี่คือ "ฐานข้อมูล" ของเราในตอนนี้)
// คุณต้องเพิ่มข้อมูลขยะที่คุณรวบรวมได้ที่นี่
const wasteData = [
    { name: "ขวดพลาสติก PET", keywords: ["ขวดน้ำ", "ขวดใส", "ขวดโค้ก", "PET"], bin: "เหลือง", tip: "ล้างให้สะอาด บีบแบน", image: "bin-yellow-category.png" },
    { name: "กล่องนม", keywords: ["กล่องนม", "กล่องน้ำผลไม้", "UHT"], bin: "เหลือง", tip: "ล้างให้สะอาด กดให้แบน", image: "bin-yellow-category.png" },
    { name: "กระดาษหนังสือพิมพ์", keywords: ["หนังสือพิมพ์", "กระดาษ"], bin: "เหลือง", tip: "มัดรวมกัน ไม่ต้องล้าง", image: "bin-yellow-category.png" },
    { name: "เศษผัก", keywords: ["เศษอาหาร", "ผัก", "ผลไม้", "เปลือก", "อาหาร"], bin: "เขียว", tip: "นำไปทำปุ๋ยหมัก หรือทิ้งลงถังขยะเปียก", image: "bin-green-category.png" },
    { name: "ถ่านไฟฉาย", keywords: ["ถ่าน", "แบตเตอรี่", "ถ่าน AA", "ถ่าน AAA"], bin: "แดง", tip: "ทิ้งในจุดรับขยะอันตราย", image: "bin-red-category.png" },
    { name: "หลอดไฟ", keywords: ["หลอดไฟ", "นีออน"], bin: "แดง", tip: "ทิ้งในจุดรับขยะอันตราย", image: "bin-red-category.png" },
    { name: "ถุงพลาสติก", keywords: ["ถุงก๊อบแก๊บ", "ถุงพลาสติกเปื้อน"], bin: "ฟ้า", tip: "ล้างไม่สะอาด หรือปนเปื้อนแล้วให้ทิ้งขยะทั่วไป", image: "bin-blue-category.png" },
    { name: "โฟม", keywords: ["กล่องโฟม", "ถาดโฟม", "บรรจุภัณฑ์โฟม"], bin: "ฟ้า", tip: "ไม่สามารถรีไซเคิลได้ ทิ้งขยะทั่วไป", image: "bin-blue-category.png" },
    { name: "กระป๋องอลูมิเนียม", keywords: ["กระป๋องน้ำอัดลม", "กระป๋องเบียร์"], bin: "เหลือง", tip: "บีบแบน ไม่ต้องล้างก็ได้", image: "bin-yellow-category.png" },
    { name: "ขวดแก้ว", keywords: ["ขวดแก้ว", "ขวดเบียร์", "ขวดน้ำปลา", "ขวดไวน์"], bin: "เหลือง", tip: "ล้างให้สะอาด ระวังแตก (หรือทิ้งในถังแยกแก้วถ้ามี)", image: "bin-yellow-category.png" },
    { name: "เสื้อผ้าเก่า", keywords: ["เสื้อ", "ผ้า", "กางเกง", "ชุด", "เสื้อผ้า"], bin: "ฟ้า", tip: "บริจาคถ้ายังใช้ได้ ถ้าขาดแล้วทิ้งขยะทั่วไป", image: "bin-blue-category.png" },
    { name: "กระป๋องสเปรย์", keywords: ["สเปรย์", "กระป๋องฉีด"], bin: "แดง", tip: "ใช้จนหมด ทิ้งในจุดรับขยะอันตราย", image: "bin-red-category.png" },
    // **คุณส้มสามารถเพิ่มข้อมูลขยะและ keywords ได้อีกมากมายที่นี่**
];

// 3. ฟังก์ชันสำหรับแสดงผลลัพธ์
function displayResult(item) {
    let binColorClass = '';
    switch (item.bin) {
        case 'เหลือง': binColorClass = 'bin-color-yellow'; break;
        case 'เขียว': binColorClass = 'bin-color-green'; break;
        case 'ฟ้า': binColorClass = 'bin-color-blue'; break;
        case 'แดง': binColorClass = 'bin-color-red'; break;
        default: binColorClass = '';
    }

    // สร้าง HTML สำหรับรูปภาพ 4 รูป (ตามที่คุณต้องการ)
    const imagesHtml = `
        <div class="search-result-images">
            <img src="images/bin-green-category.png" alt="ขยะเปียก" class="bin-result-image">
            <img src="images/bin-yellow-category.png" alt="ขยะรีไซเคิล" class="bin-result-image">
            <img src="images/bin-blue-category.png" alt="ขยะทั่วไป" class="bin-result-image">
            <img src="images/bin-red-category.png" alt="ขยะอันตราย" class="bin-result-image">
        </div>
    `;

    resultsDisplay.innerHTML = `
        <h3>${item.name}</h3>
        <p><strong>ประเภท:</strong> ${item.category || item.bin} </p>
        <p><strong>ควรทิ้งในถัง:</strong> <span class="bin-color-display ${binColorClass}">${item.bin}</span></p>
        <p><strong>คำแนะนำ:</strong> ${item.tip}</p>
        <img src="images/${item.image}" alt="${item.name}" width="150px" style="margin-top: 15px; border-radius: 8px;">
        ${imagesHtml}
    `;
    initialMessage.style.display = 'none';
}


// 4. ฟังก์ชันสำหรับแสดงข้อความไม่พบ
function displayNotFound(searchTerm) {
    resultsDisplay.innerHTML = `
        <p class="not-found-message">ขออภัยค่ะ ไม่พบข้อมูลสำหรับ <strong>"${searchTerm}"</strong><br>
        กรุณาลองพิมพ์คำที่เกี่ยวข้อง หรือเป็นชื่อสิ่งของที่เฉพาะเจาะจงมากขึ้นนะคะ</p>
    `;
    initialMessage.style.display = 'none'; // ซ่อนข้อความเริ่มต้น
}

// 5. ฟังก์ชันสำหรับจัดการการค้นหา
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim(); // รับค่าที่พิมพ์มา และตัดช่องว่างหน้าหลัง
    if (searchTerm === '') {
        resultsDisplay.innerHTML = `<p class="initial-message">กรุณาพิมพ์ชื่อสิ่งของที่คุณต้องการค้นหาค่ะ</p>`;
        return;
    }

    // ค้นหาขยะ
    // เราจะใช้ .some() เพื่อตรวจสอบ keyword ที่หลากหลาย
    const foundItem = wasteData.find(item =>
        item.keywords.some(keyword => searchTerm.includes(keyword.toLowerCase())) ||
        item.name.toLowerCase().includes(searchTerm)
    );

    if (foundItem) {
        displayResult(foundItem);
    } else {
        displayNotFound(searchTerm);
    }
}

// 6. เพิ่ม Event Listeners
searchButton.addEventListener('click', handleSearch);

// ให้ค้นหาได้เมื่อกด Enter ในช่อง input ด้วย
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// 7. ซ่อนข้อความเริ่มต้นเมื่อเริ่มพิมพ์
searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '' && resultsDisplay.innerHTML.includes('initial-message')) {
        resultsDisplay.innerHTML = `<p class="initial-message">ลองพิมพ์ชื่อสิ่งของแล้วกดค้นหาดูสิ!</p>`;
    }
});


// 1. ดึง Header ของแต่ละ Bin Item
const toggleHeaders = document.querySelectorAll('.toggle-header');

// 2. วนลูปเพื่อเพิ่ม Event Listener ให้กับแต่ละ Header
toggleHeaders.forEach(header => {
    header.addEventListener('click', () => {
        // หา toggle-content ที่อยู่ใต้ header นี้
        const toggleContent = header.nextElementSibling; // nextElementSibling คือองค์ประกอบถัดไปใน HTML

        // สลับ Class 'active' บน header (เพื่อเปลี่ยนลูกศร)
        header.classList.toggle('active');

        // สลับ Class 'active' บน toggle-content (เพื่อแสดง/ซ่อนเนื้อหาแบบสไลด์)
        toggleContent.classList.toggle('active');

        /*
        toggleHeaders.forEach(otherHeader => {
            if (otherHeader !== header && otherHeader.classList.contains('active')) {
                otherHeader.classList.remove('active');
                otherHeader.nextElementSibling.classList.remove('active');
            }
        });
        */
    });
});