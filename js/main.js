/* =========================================================
   스마트도시분석포털 메인 스크립트
   - 모바일 메뉴
   - Leaflet 지도
   - 공지사항 자동 전환
   - 배너모음 반응형 슬라이더
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initMap();
  initNoticeSlider();
  initBannerSlider();
});

/* =========================================================
   1. 모바일 메뉴
========================================================= */
function initMobileMenu() {
  const menuButton = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");

  if (!menuButton || !mobileNav) return;

  menuButton.addEventListener("click", function () {
    const isOpen = menuButton.classList.toggle("is-open");

    mobileNav.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuButton.setAttribute("aria-label", isOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuButton.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "모바일 메뉴 열기");
    });
  });
}

/* =========================================================
   2. Leaflet 지도
   - OpenStreetMap은 별도 앱키 없이 사용 가능
   - 실제 항공사진 레이어는 보통 별도 서비스/키가 필요하므로
     여기서는 기본지도와 밝은지도 레이어 토글로 구성
========================================================= */
function initMap() {
  if (!window.L || !document.getElementById("map")) return;

  const gwangjuCenter = [35.1595, 126.8526];

  const map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true
  }).setView(gwangjuCenter, 14);

  const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  });

  const lightLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CARTO"
  });

  baseLayer.addTo(map);

  const marker = L.marker(gwangjuCenter)
    .addTo(map)
    .bindPopup("광주광역시청")
    .openPopup();

  const locations = {
    buk: {
      name: "광주광역시 북구",
      latlng: [35.1743, 126.9112],
      zoom: 14
    },
    dong: {
      name: "광주광역시 동구",
      latlng: [35.1461, 126.9237],
      zoom: 14
    },
    seo: {
      name: "광주광역시 서구",
      latlng: [35.1518, 126.8902],
      zoom: 14
    },
    nam: {
      name: "광주광역시 남구",
      latlng: [35.1330, 126.9024],
      zoom: 14
    },
    gwangsan: {
      name: "광주광역시 광산구",
      latlng: [35.1395, 126.7937],
      zoom: 14
    },
    "운암동": {
      name: "운암동",
      latlng: [35.1764, 126.8788],
      zoom: 16
    },
    "문흥동": {
      name: "문흥동",
      latlng: [35.1859, 126.9307],
      zoom: 16
    },
    "양산동": {
      name: "양산동",
      latlng: [35.2036, 126.8848],
      zoom: 16
    },
    "치평동": {
      name: "치평동",
      latlng: [35.1521, 126.8484],
      zoom: 16
    },
    "쌍촌동": {
      name: "쌍촌동",
      latlng: [35.1510, 126.8698],
      zoom: 16
    }
  };

  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const layerToggleBtn = document.getElementById("layerToggleBtn");
  const searchBtn = document.getElementById("mapSearchBtn");

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", function () {
      map.zoomIn();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", function () {
      map.zoomOut();
    });
  }

  let isLightLayer = false;

  if (layerToggleBtn) {
    layerToggleBtn.addEventListener("click", function () {
      if (isLightLayer) {
        map.removeLayer(lightLayer);
        baseLayer.addTo(map);
        layerToggleBtn.textContent = "항공뷰";
      } else {
        map.removeLayer(baseLayer);
        lightLayer.addTo(map);
        layerToggleBtn.textContent = "일반뷰";
      }

      isLightLayer = !isLightLayer;
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      const districtValue = document.getElementById("districtSelect")?.value || "";
      const dongValue = document.getElementById("dongSelect")?.value || "";

      const target = locations[dongValue] || locations[districtValue] || {
        name: "광주광역시",
        latlng: gwangjuCenter,
        zoom: 14
      };

      map.flyTo(target.latlng, target.zoom, {
        duration: 1.1
      });

      marker
        .setLatLng(target.latlng)
        .bindPopup(target.name)
        .openPopup();
    });
  }

  window.addEventListener("resize", function () {
    window.setTimeout(function () {
      map.invalidateSize();
    }, 200);
  });
}

/* =========================================================
   3. 공지사항 자동 전환
========================================================= */
function initNoticeSlider() {
  const items = Array.from(document.querySelectorAll(".notice-slider__item"));
  const dateElement = document.getElementById("noticeDate");

  if (items.length === 0 || !dateElement) return;

  let currentIndex = 0;

  function activateNotice(nextIndex) {
    items.forEach(function (item, index) {
      item.classList.toggle("is-active", index === nextIndex);
    });

    const activeItem = items[nextIndex];
    const date = activeItem.dataset.date || "";

    dateElement.textContent = date;
    dateElement.setAttribute("datetime", date);

    currentIndex = nextIndex;
  }

  window.setInterval(function () {
    const nextIndex = (currentIndex + 1) % items.length;
    activateNotice(nextIndex);
  }, 3500);
}

/* =========================================================
   4. 배너모음 반응형 슬라이더
   - 화면 크기에 따라 노출 개수 변경
   - 화살표 클릭 시 좌우 이동
========================================================= */
function initBannerSlider() {
  const slider = document.querySelector(".banner-slider");
  const track = document.getElementById("bannerTrack");
  const items = Array.from(document.querySelectorAll(".banner-item"));
  const prevButton = document.querySelector(".banner-arrow--prev");
  const nextButton = document.querySelector(".banner-arrow--next");

  if (!slider || !track || items.length === 0 || !prevButton || !nextButton) return;

  let currentIndex = 0;
  let visibleCount = 5;
  let itemWidth = 0;
  let maxIndex = 0;

  function updateSliderSize() {
    visibleCount = getVisibleCount();
    itemWidth = slider.clientWidth / visibleCount;
    maxIndex = Math.max(0, items.length - visibleCount);

    items.forEach(function (item) {
      item.style.width = itemWidth + "px";
    });

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    moveSlider();
  }

  function moveSlider() {
    track.style.transform = "translateX(-" + currentIndex * itemWidth + "px)";
  }

  prevButton.addEventListener("click", function () {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    moveSlider();
  });

  nextButton.addEventListener("click", function () {
    currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    moveSlider();
  });

  window.addEventListener("resize", updateSliderSize);
  updateSliderSize();
}
