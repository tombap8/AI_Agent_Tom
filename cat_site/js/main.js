document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

let currentSlide = 0;
let totalSlides = 0;
let slideInterval;

async function fetchData() {
    try {
        const response = await fetch('data/main.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        renderGeneralInfo(data.general);
        renderBreeds(data.breeds);
        // 배너 이미지가 있는 고양이 중 처음 3개만 추출
        const bannerBreeds = data.breeds.filter(b => b.banner_image).slice(0, 3);
        setupBanner(bannerBreeds);
    } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다.', error);
        alert('데이터를 불러오는데 문제가 발생했습니다. 로컬 웹 서버 환경에서 실행해주세요.');
    }
}

function renderGeneralInfo(generalData) {
    const charList = document.getElementById('general-characteristics');
    const tipsList = document.getElementById('general-tips');

    generalData.characteristics.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        charList.appendChild(li);
    });

    generalData.care_tips.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        tipsList.appendChild(li);
    });
}

function renderBreeds(breedsData) {
    const container = document.getElementById('breeds-container');

    breedsData.forEach(breed => {
        const card = document.createElement('div');
        card.className = 'breed-card';

        card.innerHTML = `
            <img src="${breed.image}" alt="${breed.name}" class="breed-img">
            <div class="breed-info">
                <h3>${breed.name}</h3>
                <div class="info-section">
                    <h4>특징</h4>
                    <p>${breed.characteristics}</p>
                </div>
                <div class="info-section">
                    <h4>키우는 방법 및 팁</h4>
                    <p>${breed.care_tips}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupBanner(bannerBreeds) {
    const wrapper = document.getElementById('banner-wrapper');
    totalSlides = bannerBreeds.length;

    if (totalSlides === 0) return;

    bannerBreeds.forEach(breed => {
        const slide = document.createElement('div');
        slide.className = 'banner-slide';
        slide.style.backgroundImage = `url('${breed.banner_image}')`;
        slide.innerHTML = `<h2>${breed.name}</h2>`;
        wrapper.appendChild(slide);
    });

    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    startAutoSlide();
}

function updateSlidePosition() {
    const wrapper = document.getElementById('banner-wrapper');
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
    resetAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 3000); // 3초마다 슬라이드 넘어감
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}
