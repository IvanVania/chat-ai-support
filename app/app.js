




class UserData {
    constructor(client_id, name, email, profile_picture_url, subscription_status, subscription_name, data_document_url, client_data_ids, client_chats_ids) {
        this.client_id = client_id;
        this.name = name;
        this.email = email; 
        this.profile_picture_url = profile_picture_url;
        this.subscription_status = subscription_status;
        this.subscription_name = subscription_name;
        this.data_document_url = data_document_url;
        this.client_data_ids = client_data_ids;
        this.client_chats_ids = client_chats_ids;
    }
}

let userData = null;  // Глобальная переменная

window.onload = async function () {
    showLoadingModal(); // Показываем модальное окно загрузки сразу при загрузке страницы

    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const jwtToken = localStorage.getItem('jwtToken');

    console.log("🔹 Код авторизации:", authorizationCode);
    console.log("🔹 JWT-токен из localStorage:", jwtToken);

    const payload = {};
    if (authorizationCode) {
        payload.code = authorizationCode;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    try {
        console.log("📡 Отправка запроса в API...");
        const response = await fetch('https://r1h30g86v3.execute-api.us-east-2.amazonaws.com/default', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        console.log("✅ Ответ API:", response);

        if (response.status === 401) {
            console.warn("⛔ Неавторизован! Удаление токена и редирект на логин.");
            localStorage.removeItem('jwtToken');
            window.location.href = 'https://ivanvania.github.io/chat-ai-support/logIn';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🔹 Полученные данные:", data);

        if (data.error) {
            console.error("❌ Ошибка аутентификации:", data.error);
            if (data.error === 'Authentication failed') {
                window.location.href = 'https://ivanvania.github.io/chat-ai-support/logIn';
            }
        } else {
            if (data.access_token) {
                console.log("🔑 Новый access_token сохранен!");
                localStorage.setItem('jwtToken', data.access_token);
                urlParams.delete('code');
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // Сохраняем userData в глобальную переменную
            userData = new UserData(
                data.user.client_id,
                data.user.name,
                data.user.email,
                data.user.profile_picture_url,
                data.user.subscription_status,
                data.user.subscription_name,
                data.user.data_document_url,
                data.user.client_data_ids,
                data.user.client_chats_ids
            );

            console.log("👤 Пользователь загружен:", userData);
            updateUI(); // Вызываем обновление UI
        }
    } catch (error) {
        console.error("⚠️ Ошибка выполнения запроса:", error);
        localStorage.removeItem('jwtToken');
        window.location.href = 'https://ivanvania.github.io/chat-ai-support/logIn';
    }

    hideLoadingModal(); // Скрываем модальное окно после загрузки
};


// Функция обновления интерфейса (пример)
// Функция обновления интерфейса (пример)
function updateUI() {
    if (!userData) return;
    
    console.log("🔄 Обновление UI...");

    // Обновление аватара и email
    const profilePic = document.getElementById("profile-pic");
    const userEmail = document.getElementById("user-email");

    if (profilePic && userData.profile_picture_url) {
        profilePic.style.backgroundImage = `url(${userData.profile_picture_url})`;
        profilePic.style.backgroundSize = "cover";
        profilePic.style.backgroundPosition = "center";
        profilePic.style.backgroundColor = "transparent"; // Убираем серый фон
    }

    if (userEmail && userData.email) {
        userEmail.textContent = userData.email;
    }

    // Обновление 


    // Обновление таблицы URL
    if (userData.data_document_url) {
        state.tableData = Array.isArray(userData.data_document_url) 
            ? userData.data_document_url 
            : [userData.data_document_url];
        
        if (typeof updateTable === "function") {
            updateTable(); // Обновляем таблицу
        }
    }



    console.log("✅ UI обновлен.");
}


// Функция для получения имени пользователя (пример)
function getUserName() {
    return userData ? userData.name : "Guest";
}
















































// Components and state management in one file
const state = {
    currentPage: 'home',
    tableData: []
};

// Utility to create navigation item
const createNavItem = (icon, isActive = false) => {
    const navItem = document.createElement("a");
    navItem.style.width = "48px";
    navItem.style.height = "48px";
    navItem.style.display = "flex";
    navItem.style.alignItems = "center";
    navItem.style.justifyContent = "center";
    navItem.style.color = "white";
    navItem.style.borderRadius = "8px";
    navItem.style.cursor = "pointer";
    navItem.style.backgroundColor = isActive ? "rgba(255, 255, 255, 0.2)" : "transparent";
    navItem.innerHTML = icon;
    
    navItem.addEventListener("mouseover", () => {
        if (!isActive) navItem.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });
    
    navItem.addEventListener("mouseout", () => {
        if (!isActive) navItem.style.backgroundColor = "transparent";
    });
    
    return navItem;
};































// Create sidebar with navigation
const createSidebar = () => {
    const sidebar = document.createElement("div");
    sidebar.style.width = "64px";
    sidebar.style.backgroundColor = "#1a1f2b";
    sidebar.style.height = "100vh";
    sidebar.style.position = "fixed";
    sidebar.style.left = "0";
    sidebar.style.top = "0";
    sidebar.style.display = "flex";
    sidebar.style.flexDirection = "column";
    sidebar.style.padding = "16px 0";
    sidebar.style.zIndex = "1000";

    const navSection = document.createElement("div");
    navSection.style.display = "flex";
    navSection.style.flexDirection = "column";
    navSection.style.gap = "8px";
    navSection.style.padding = "0 8px";
    navSection.style.flex = "1";

    const createNavItem = (svg, isActive) => {
        const item = document.createElement("div");
        item.innerHTML = svg;
        item.style.display = "flex";
        item.style.justifyContent = "center";
        item.style.alignItems = "center";
        item.style.width = "48px";
        item.style.height = "48px";
        item.style.borderRadius = "8px";
        item.style.cursor = "pointer";
        item.style.backgroundColor = isActive ? "rgba(255, 255, 255, 0.2)" : "transparent";
        item.querySelector("svg").style.stroke = "white"; // Белый цвет иконок
        return item;
    };

    const updateNavItems = () => {
        homeIcon.style.backgroundColor = state.currentPage === 'home' ? "rgba(255, 255, 255, 0.2)" : "transparent";
        tableIcon.style.backgroundColor = state.currentPage === 'table' ? "rgba(255, 255, 255, 0.2)" : "transparent";
        settingsIcon.style.backgroundColor = state.currentPage === 'settings' ? "rgba(255, 255, 255, 0.2)" : "transparent";
    };

    const homeIcon = createNavItem(`
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
    `, state.currentPage === 'home');
    homeIcon.onclick = () => { renderPage('home'); updateNavItems(); };

    const tableIcon = createNavItem(`
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
    `, state.currentPage === 'table');
    tableIcon.onclick = () => { renderPage('table'); updateNavItems(); };

    const settingsIcon = createNavItem(`
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
    `, state.currentPage === 'settings');
    settingsIcon.onclick = () => { renderPage('settings'); updateNavItems(); };





    const logoutSection = document.createElement("div");
    logoutSection.style.padding = "8px";
    logoutSection.style.paddingBottom = "16px";

    const logoutIcon = createNavItem(`
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
    `, false);
    logoutIcon.onclick = () => {
        if (confirm('Are you sure you want to logout?')) {
            alert('Logged out successfully');
        }
    };




    navSection.appendChild(homeIcon);
    navSection.appendChild(tableIcon);
    navSection.appendChild(settingsIcon);
    logoutSection.appendChild(logoutIcon);

    sidebar.appendChild(navSection);
    sidebar.appendChild(logoutSection);
    return sidebar;
};








































// Create main content area
const createMainContent = () => {
    const mainContent = document.createElement("div");
    mainContent.id = "main-content";
    mainContent.style.marginLeft = "64px";
    mainContent.style.height = "100vh";  // Фикс высоты
    mainContent.style.flex = "1";  // Позволяет заполнять всю доступную высоту
    mainContent.style.display = "flex"; 
    mainContent.style.flexDirection = "column"; 
    mainContent.style.backgroundColor = "#ffffff";
    mainContent.style.padding = "24px 32px";
    return mainContent;
};
























// Создание модального окна загрузки (ГЛОБАЛЬНО, ДОБАВЛЯТЬ ОДИН РАЗ)
const loadingModal = document.createElement("div");
loadingModal.id = "loading-modal";
loadingModal.style.display = "none";
loadingModal.style.position = "fixed";
loadingModal.style.top = "0";
loadingModal.style.left = "0";
loadingModal.style.width = "100%";
loadingModal.style.height = "100%";
loadingModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
loadingModal.style.zIndex = "2000";
loadingModal.style.display = "flex";
loadingModal.style.justifyContent = "center";
loadingModal.style.alignItems = "center";

// Внутренний контейнер с анимацией загрузки
const loadingContainer = document.createElement("div");
loadingContainer.style.width = "80px";
loadingContainer.style.height = "80px";
loadingContainer.style.borderRadius = "50%";
loadingContainer.style.border = "6px solid rgba(255, 255, 255, 0.3)";
loadingContainer.style.borderTop = "6px solid white";
loadingContainer.style.animation = "spin 1s linear infinite";

// Добавляем контейнер внутрь модального окна
loadingModal.appendChild(loadingContainer);
document.body.appendChild(loadingModal);

// CSS-анимация кручения (добавить в <style> или через JS)
const styleTag = document.createElement("style");
styleTag.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleTag);

// Функции управления модальным окном загрузки
const showLoadingModal = () => {
    loadingModal.style.display = "flex";
};

const hideLoadingModal = () => {
    loadingModal.style.display = "none";
};






















// HOME PAGE
// HOME PAGE
const createHomePage = () => {
    // Main container
    const home = document.createElement("div");
    home.style.minHeight = "100vh";
    home.style.backgroundColor = "#f3f4f6";

    // Navigation Bar
    const navbar = document.createElement("nav");
    navbar.style.padding = "1rem 2rem";
    navbar.style.backgroundColor = "white";
    navbar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    navbar.style.display = "flex";
    navbar.style.justifyContent = "space-between";
    navbar.style.alignItems = "center";

    // Левая часть: логотип
    const logo = document.createElement("div");
    logo.textContent = "Dashboard";
    logo.style.fontSize = "1.5rem";
    logo.style.fontWeight = "bold";
    logo.style.color = "#1f2937";

    // Правая часть: контейнер для кнопки Pricing и секции профиля пользователя
    const rightContainer = document.createElement("div");
    rightContainer.style.display = "flex";
    rightContainer.style.alignItems = "center";
    rightContainer.style.gap = "1rem";

    // Кнопка Pricing (открывает модальное окно с ценами)
    const pricingButton = document.createElement("button");
    pricingButton.textContent = "Pricing";
    pricingButton.style.padding = "0.5rem 1rem";
    pricingButton.style.backgroundColor = "transparent";
    pricingButton.style.border = "none";
    pricingButton.style.cursor = "pointer";
    pricingButton.style.fontSize = "1rem";
    pricingButton.style.color = "#4b5563";
    pricingButton.onclick = () => {
        // Предполагается, что функция createPricingModal() определена в вашем проекте
        const modal = createPricingModal();
        document.body.appendChild(modal);
        modal.style.display = "block";
    };

    // User Profile Section (аватар и email)
    const userSection = document.createElement("div");
    userSection.style.display = "flex";
    userSection.style.alignItems = "center";
    userSection.style.gap = "0.75rem";

    const userAvatar = document.createElement("div");
    userAvatar.id = "profile-pic";
    userAvatar.style.width = "40px";
    userAvatar.style.height = "40px";
    userAvatar.style.borderRadius = "50%";
    userAvatar.style.backgroundColor = "#d1d5db";
    userAvatar.style.display = "flex";
    userAvatar.style.justifyContent = "center";
    userAvatar.style.alignItems = "center";

    const userEmail = document.createElement("span");
    userEmail.id = "user-email";
    userEmail.textContent = ""; // Значение обновится через updateUI() после получения данных от API
    userEmail.style.fontSize = "1rem";
    userEmail.style.color = "#4b5563";
    userEmail.style.minWidth = "150px";

    // Собираем правую часть навбара
    userSection.appendChild(userAvatar);
    userSection.appendChild(userEmail);
    rightContainer.appendChild(pricingButton);
    rightContainer.appendChild(userSection);

    // Собираем навигационную панель
    navbar.appendChild(logo);
    navbar.appendChild(rightContainer);

    // Content Container
    const content = document.createElement("div");
    content.style.padding = "2rem";
    content.style.maxWidth = "1200px";
    content.style.margin = "0 auto";

    // Title
    const title = document.createElement("h1");
    title.textContent = "Welcome to Dashboard";
    title.style.margin = "0 0 2rem 0";
    title.style.fontSize = "2rem";
    title.style.color = "#1f2937";

    // Code Snippet Section with improved styling
    const snippetSection = document.createElement("div");
    snippetSection.style.backgroundColor = "white";
    snippetSection.style.padding = "2rem";
    snippetSection.style.borderRadius = "0.75rem";
    snippetSection.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    snippetSection.style.marginTop = "2rem";

    const snippetTitle = document.createElement("h2");
    snippetTitle.textContent = "Installation Code";
    snippetTitle.style.fontSize = "1.5rem";
    snippetTitle.style.marginBottom = "1.5rem";
    snippetTitle.style.color = "#1f2937";
    snippetTitle.style.fontWeight = "600";

    const getCodeButton = document.createElement("button");
    getCodeButton.textContent = "Get Installation Code";
    getCodeButton.style.padding = "0.75rem 1.5rem";
    getCodeButton.style.backgroundColor = "#4f46e5";
    getCodeButton.style.color = "white";
    getCodeButton.style.border = "none";
    getCodeButton.style.borderRadius = "0.5rem";
    getCodeButton.style.cursor = "pointer";
    getCodeButton.style.fontSize = "0.875rem";
    getCodeButton.style.fontWeight = "500";
    getCodeButton.style.transition = "background-color 0.2s";
    getCodeButton.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";

    getCodeButton.onmouseover = () => {
        getCodeButton.style.backgroundColor = "#4338ca";
    };
    getCodeButton.onmouseout = () => {
        getCodeButton.style.backgroundColor = "#4f46e5";
    };

    const snippetContainer = document.createElement("div");
    // Изначально контейнер скрыт
    snippetContainer.style.display = "none";
    snippetContainer.style.marginTop = "1.5rem";
    snippetContainer.style.backgroundColor = "#1e1e1e";
    snippetContainer.style.padding = "1.5rem";
    snippetContainer.style.borderRadius = "0.5rem";
    snippetContainer.style.position = "relative";
    snippetContainer.style.alignItems = "center";
    snippetContainer.style.justifyContent = "space-between";
    snippetContainer.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.1)";

    const snippetCode = document.createElement("pre");
    snippetCode.style.margin = "0";
    snippetCode.style.fontSize = "0.875rem";
    snippetCode.style.color = "#e4e4e7";
    snippetCode.style.overflow = "auto";
    snippetCode.style.flexGrow = "1";
    snippetCode.style.padding = "0.5rem";
    snippetCode.style.fontFamily = "monospace";

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.style.padding = "0.5rem 1rem";
    copyButton.style.backgroundColor = "#4f46e5";
    copyButton.style.color = "white";
    copyButton.style.border = "none";
    copyButton.style.borderRadius = "0.375rem";
    copyButton.style.fontSize = "0.75rem";
    copyButton.style.cursor = "pointer";
    copyButton.style.marginLeft = "1rem";
    copyButton.style.transition = "all 0.2s";
    copyButton.style.flexShrink = "0";

    const loadingIndicator = document.createElement("div");
    loadingIndicator.style.display = "none";
    loadingIndicator.style.color = "#6b7280";
    loadingIndicator.style.marginTop = "1rem";
    loadingIndicator.textContent = "Loading...";

    // Event Handlers для получения кода установки
    getCodeButton.onclick = async () => {
        loadingIndicator.style.display = "block";
        getCodeButton.style.display = "none";

        const jwtToken = localStorage.getItem('jwtToken');

        try {
            const response = await fetch("https://em7mzbs4ug.execute-api.us-east-2.amazonaws.com/default/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error("Failed to parse JSON:", jsonError);
                data = {};
            }

            if (response.ok) {
                if (data.client_api_key && data.client_api_key !== "empty") {
                    snippetCode.textContent = data.user_service_link;
                    // Показываем контейнер после получения данных
                    snippetContainer.style.display = "flex";
                } else {
                    snippetCode.textContent = "API key not available. Please check your subscription.";
                    snippetContainer.style.display = "flex";
                }
            } else if (response.status === 403) {
                const modal = createPricingModal();
                document.body.appendChild(modal);
                modal.style.display = "block";
            } else {
                snippetCode.textContent = `Error: ${data.message || "Unknown error occurred."}`;
                snippetContainer.style.display = "flex";
            }
        } catch (error) {
            console.error("Network or fetch error:", error);
            snippetCode.textContent = "Error: Failed to connect to the server. Please try again.";
            snippetContainer.style.display = "flex";
        }

        loadingIndicator.style.display = "none";
        getCodeButton.style.display = "block";
    };

    copyButton.onclick = () => {
        navigator.clipboard.writeText(snippetCode.textContent);
        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 2000);
    };

    // Собираем секцию с кодом
    snippetContainer.appendChild(snippetCode);
    snippetContainer.appendChild(copyButton);

    snippetSection.appendChild(snippetTitle);
    snippetSection.appendChild(getCodeButton);
    snippetSection.appendChild(loadingIndicator);
    snippetSection.appendChild(snippetContainer);

    // Собираем контент страницы
    content.appendChild(title);
    content.appendChild(snippetSection);

    // Собираем основную страницу
    home.appendChild(navbar);
    home.appendChild(content);

    return home;
};











//screen price
function createPricingModal() {
    const modal = document.createElement("div");
    modal.id = "pricing-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100vh"; // Changed to vh unit
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "10000";

    const modalContent = document.createElement("div");
    modalContent.style.background = "white";
    modalContent.style.padding = "24px";
    modalContent.style.borderRadius = "12px";
    modalContent.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.2)";
    modalContent.style.width = "90%";
    modalContent.style.maxWidth = "400px";
    modalContent.style.minHeight = "200px"; // Added min-height
    modalContent.style.margin = "auto";
    modalContent.style.position = "relative";
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.alignItems = "center";
    modalContent.style.justifyContent = "center"; // Added justify-content
    modalContent.style.transform = "translateY(-5%)"; // Slight upward offset for visual balance

    // Кнопка закрытия (крестик)
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.position = "absolute";
    closeButton.style.top = "12px";
    closeButton.style.right = "16px";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#555";

    closeButton.onclick = () => {
        document.body.removeChild(modal);
    };

    // Контейнер для подписок
    const plansContainer = document.createElement("div");
    plansContainer.style.width = "100%";
    plansContainer.style.display = "flex";
    plansContainer.style.flexDirection = "column";
    plansContainer.style.gap = "16px";

    // Функция для создания карточек подписки
    function createPlan(name, price) {
        const plan = document.createElement("div");
        plan.style.background = "#f8f9fa";
        plan.style.padding = "16px";
        plan.style.borderRadius = "8px";
        plan.style.textAlign = "center";
        plan.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
        
        const planTitle = document.createElement("h3");
        planTitle.textContent = name;
        planTitle.style.margin = "0 0 8px";
        planTitle.style.fontSize = "18px";
        planTitle.style.color = "#333";

        const planPrice = document.createElement("p");
        planPrice.textContent = price;
        planPrice.style.margin = "0 0 12px";
        planPrice.style.fontSize = "16px";
        planPrice.style.color = "#666";

        const subscribeButton = document.createElement("button");
        subscribeButton.textContent = "Subscribe";
        subscribeButton.style.width = "100%";
        subscribeButton.style.padding = "10px";
        subscribeButton.style.backgroundColor = "#1d4ed8";
        subscribeButton.style.color = "white";
        subscribeButton.style.border = "none";
        subscribeButton.style.borderRadius = "6px";
        subscribeButton.style.cursor = "pointer";
        subscribeButton.style.fontSize = "14px";
        subscribeButton.style.fontWeight = "500";

        subscribeButton.onmouseover = () => subscribeButton.style.backgroundColor = "#1e40af";
        subscribeButton.onmouseout = () => subscribeButton.style.backgroundColor = "#1d4ed8";

        plan.appendChild(planTitle);
        plan.appendChild(planPrice);
        plan.appendChild(subscribeButton);

        return plan;
    }

    // Добавляем карточки подписок
    plansContainer.appendChild(createPlan("Start", "$14.99"));
    plansContainer.appendChild(createPlan("Enterprise", "Custom"));

    modalContent.appendChild(closeButton);
    modalContent.appendChild(plansContainer);
    modal.appendChild(modalContent);

    return modal;
}






























//TABLES DATA PAGE
const createTablePage = () => {
    const tableContainer = document.createElement("div");
    tableContainer.style.display = "flex";
    tableContainer.style.flexDirection = "column";
    tableContainer.style.width = "100%";
    tableContainer.style.height = "100vh";
    tableContainer.style.padding = "20px";
    tableContainer.style.boxSizing = "border-box";
    tableContainer.style.alignItems = "center";
    tableContainer.style.justifyContent = "center";
    tableContainer.style.backgroundColor = "#f8f9fa";

    // Title
    const title = document.createElement("h1");
    title.textContent = "Table Management";
    title.style.marginBottom = "20px";
    title.style.fontSize = "24px";
    title.style.color = "#333";
    title.style.fontFamily = "'Segoe UI', Arial, sans-serif";

    // Table Wrapper
    const tableWrapper = document.createElement("div");
    tableWrapper.style.width = "90%";
    tableWrapper.style.height = "70vh";
    tableWrapper.style.overflowY = "auto";
    tableWrapper.style.backgroundColor = "white";
    tableWrapper.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    tableWrapper.style.borderRadius = "8px";

    // Initialize table data from userData if available
    if (!state.tableData) {
        state.tableData = [];
        if (userData && userData.data_document_url) {
            state.tableData = Array.isArray(userData.data_document_url) 
                ? userData.data_document_url 
                : [userData.data_document_url];
        }
    }

    // Table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    table.style.fontSize = "14px";

    const updateTable = () => {
        table.innerHTML = `
            <thead>
                <tr>
                    <th style="
                        position: sticky;
                        top: 0;
                        background-color: #f1f3f4;
                        color: #333;
                        font-weight: 500;
                        text-align: left;
                        padding: 12px;
                        border-bottom: 2px solid #ddd;
                        white-space: nowrap;
                    ">URL</th>
                    <th style="
                        position: sticky;
                        top: 0;
                        background-color: #f1f3f4;
                        color: #333;
                        font-weight: 500;
                        padding: 12px;
                        border-bottom: 2px solid #ddd;
                        width: 100px;
                        text-align: center;
                    ">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${state.tableData.map((row, index) => `
                    <tr style="
                        background-color: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};
                        transition: background-color 0.2s;
                        border-bottom: 1px solid #e0e0e0;
                    "
                    onmouseover="this.style.backgroundColor='#f5f5f5'"
                    onmouseout="this.style.backgroundColor='${index % 2 === 0 ? '#ffffff' : '#f8f9fa'}'">
                        <td style="position: relative; border-right: 1px solid #e0e0e0;">
                            <input type="text" 
                                value="${row}" 
                                oninput="updateRow(${index}, this.value)" 
                                style="
                                    width: 100%;
                                    padding: 12px;
                                    border: none;
                                    outline: none;
                                    font-size: 14px;
                                    background: transparent;
                                    font-family: inherit;
                                "
                                onfocus="this.parentElement.style.boxShadow='inset 0 0 0 2px #1a73e8'"
                                onblur="this.parentElement.style.boxShadow='none'"
                            >
                        </td>
                        <td style="padding: 8px; text-align: center;">
                            <button onclick="removeRow(${index})" style="
                                background-color: transparent;
                                color: #666;
                                border: 1px solid #ddd;
                                padding: 6px 12px;
                                cursor: pointer;
                                font-size: 13px;
                                border-radius: 4px;
                                transition: all 0.2s;
                                width: 80px;
                            "
                            onmouseover="this.style.backgroundColor='#dc3545'; this.style.color='white'; this.style.borderColor='#dc3545'"
                            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#666'; this.style.borderColor='#ddd'"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    };

    // State functions
    window.updateRow = (index, value) => {
        state.tableData[index] = value;
    };

    window.removeRow = (index) => {
        state.tableData.splice(index, 1);
        updateTable();
    };

    // Add Row Button
    const addRowButton = document.createElement("button");
    addRowButton.textContent = "+ Add Row";
    addRowButton.style.marginTop = "20px";
    addRowButton.style.padding = "10px 20px";
    addRowButton.style.backgroundColor = "#fff";
    addRowButton.style.color = "#1a73e8";
    addRowButton.style.border = "1px solid #1a73e8";
    addRowButton.style.borderRadius = "4px";
    addRowButton.style.cursor = "pointer";
    addRowButton.style.fontSize = "14px";
    addRowButton.style.fontWeight = "500";
    addRowButton.style.transition = "all 0.2s";

    addRowButton.onmouseover = () => {
        addRowButton.style.backgroundColor = "#1a73e8";
        addRowButton.style.color = "#fff";
    };

    addRowButton.onmouseout = () => {
        addRowButton.style.backgroundColor = "#fff";
        addRowButton.style.color = "#1a73e8";
    };

    addRowButton.onclick = () => {
        state.tableData.push("");
        updateTable();
    };

    // Save Button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Changes";
    saveButton.style.marginTop = "10px";
    saveButton.style.marginLeft = "10px";
    saveButton.style.padding = "10px 20px";
    saveButton.style.backgroundColor = "#1a73e8";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "4px";
    saveButton.style.cursor = "pointer";
    saveButton.style.fontSize = "14px";
    saveButton.style.fontWeight = "500";
    saveButton.style.transition = "background-color 0.2s";

    saveButton.onmouseover = () => {
        saveButton.style.backgroundColor = "#1557b0";
    };

    saveButton.onmouseout = () => {
        saveButton.style.backgroundColor = "#1a73e8";
    };

    // Status Messages
    const createStatusMessage = (text, color) => {
        const message = document.createElement("div");
        message.textContent = text;
        message.style.display = "none";
        message.style.color = color;
        message.style.marginTop = "10px";
        message.style.fontSize = "14px";
        message.style.padding = "10px";
        message.style.borderRadius = "4px";
        message.style.backgroundColor = `${color}15`;
        return message;
    };

    const loadingIndicator = createStatusMessage("Saving changes...", "#1a73e8");
    const successMessage = createStatusMessage("Changes saved successfully!", "#28a745");
    const errorMessage = createStatusMessage("Error saving changes. Please try again.", "#d93025");

    // Save API Call
    saveButton.onclick = async () => {
        saveButton.style.display = "none";
        loadingIndicator.style.display = "block";
        successMessage.style.display = "none";
        errorMessage.style.display = "none";

        const jwtToken = localStorage.getItem('jwtToken');
        
        try {
            const response = await fetch("https://rn39s8o0ua.execute-api.us-east-2.amazonaws.com/default/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ urls: state.tableData })
            });

            if (!response.ok) throw new Error("API Error");

            loadingIndicator.style.display = "none";
            successMessage.style.display = "block";
            saveButton.style.display = "block";
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 3000);
        } catch (error) {
            loadingIndicator.style.display = "none";
            saveButton.style.display = "block";
            errorMessage.style.display = "block";
        }
    };

    // Button Container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginTop = "20px";

    updateTable();
    tableWrapper.appendChild(table);
    
    buttonContainer.appendChild(addRowButton);
    buttonContainer.appendChild(saveButton);
    
    tableContainer.appendChild(title);
    tableContainer.appendChild(tableWrapper);
    tableContainer.appendChild(buttonContainer);
    tableContainer.appendChild(loadingIndicator);
    tableContainer.appendChild(successMessage);
    tableContainer.appendChild(errorMessage);

    return tableContainer;
};






























const createSettingsPage = () => {
    const settings = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Settings";
    title.style.margin = "0 0 20px 0";
    title.style.fontSize = "30px";
    title.style.color = "#1f2937";
    settings.appendChild(title);
    return settings;
};



















// Page renderer
// const renderPage = (pageName) => {
//     state.currentPage = pageName;
//     const mainContent = document.getElementById('main-content');
//     mainContent.innerHTML = '';
    
//     switch(pageName) {
//         case 'home':
//             mainContent.appendChild(createHomePage());
//             break;
//         case 'table':
//             mainContent.appendChild(createTablePage());
//             break;
//         case 'settings':
//             mainContent.appendChild(createSettingsPage());
//             break;
//     }
// };
const renderPage = (pageName) => {
    state.currentPage = pageName;
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    let newPage;
    
    switch(pageName) {
        case 'home':
            newPage = createHomePage();
            break;
        case 'table':
            newPage = createTablePage();
            break;
        case 'settings':
            newPage = createSettingsPage();
            break;
    }

    if (newPage) {
        mainContent.appendChild(newPage);
        updateUI(); // Обновляем UI после рендера
    }
};
























// Initialize app
const initializeApp = () => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    
    const sidebar = createSidebar();
    const mainContent = createMainContent();
    
    document.body.appendChild(sidebar);
    document.body.appendChild(mainContent);
    
    // Render initial page
    renderPage('home');

    setTimeout(updateUI, 0);
};

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);











