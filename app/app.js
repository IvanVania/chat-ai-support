




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

    // Обновление блока подписки
    const subscriptionBlock = document.getElementById("subscription-block");

    if (subscriptionBlock) {
        if (userData.subscription_status && userData.subscription_name) {
            subscriptionBlock.textContent = `Subscription: ${userData.subscription_name}`;
            subscriptionBlock.style.display = "inline-block"; // Показываем блок
        } else {
            subscriptionBlock.style.display = "none"; // Скрываем блок, если подписки нет
        }
    }

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















































const state = {
    currentPage: 'home',
    tableData: []
};

function createSidebar() {
    const sidebar = createSidebarContainer();
    const navSection = createNavSection();
    const logoutSection = createLogoutSection();

    sidebar.appendChild(navSection); 
    sidebar.appendChild(logoutSection);
    return sidebar;
}

function createSidebarContainer() {
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
    return sidebar;
}

function createNavSection() {
    const navSection = document.createElement("div");
    navSection.style.display = "flex";
    navSection.style.flexDirection = "column";
    navSection.style.gap = "8px";
    navSection.style.padding = "0 8px";
    navSection.style.flex = "1";

    const homeIcon = createNavItem(getHomeSvg(), state.currentPage === 'home');
    const tableIcon = createNavItem(getTableSvg(), state.currentPage === 'table');
    const settingsIcon = createNavItem(getSettingsSvg(), state.currentPage === 'settings');

    homeIcon.onclick = () => { renderPage('home'); updateNavItems([homeIcon, tableIcon, settingsIcon]); };
    tableIcon.onclick = () => { renderPage('table'); updateNavItems([homeIcon, tableIcon, settingsIcon]); };
    settingsIcon.onclick = () => { renderPage('settings'); updateNavItems([homeIcon, tableIcon, settingsIcon]); };

    navSection.appendChild(homeIcon);
    navSection.appendChild(tableIcon);
    navSection.appendChild(settingsIcon);

    return navSection;
}

function createNavItem(svg, isActive) {
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
    item.querySelector("svg").style.stroke = "white";
    return item;
}

function updateNavItems(items) {
    items.forEach(item => {
        item.style.backgroundColor = state.currentPage === getItemPage(item) ? "rgba(255, 255, 255, 0.2)" : "transparent";
    });
}

function getItemPage(item) {
    const svg = item.innerHTML;
    if(svg.includes("M3 12l2-2m")) return 'home';
    if(svg.includes("M4 6h16M4 12h16")) return 'table';
    if(svg.includes("M10.325 4.317c")) return 'settings';
    return '';
}

function createLogoutSection() {
    const logoutSection = document.createElement("div");
    logoutSection.style.padding = "8px";
    logoutSection.style.paddingBottom = "16px";

    const logoutIcon = createNavItem(getLogoutSvg(), false);
    logoutIcon.onclick = () => {
        if (confirm('Are you sure you want to logout?')) {
            alert('Logged out successfully');
        }
    };

    logoutSection.appendChild(logoutIcon);
    return logoutSection;
}

function getHomeSvg() {
    return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>`;
}

function getTableSvg() {
    return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M4 6h16M4 12h16M4 18h16"/>
    </svg>`;
}

function getSettingsSvg() {
    return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>`;
}

function getLogoutSvg() {
    return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
    </svg>`;
}




































// Create main content area
function createMainContent() {
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
}























// Создание модального окна загрузки (ГЛОБАЛЬНО, ДОБАВЛЯТЬ ОДИН РАЗ)
function createLoadingModal() {
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

    const loadingContainer = document.createElement("div");
    loadingContainer.style.width = "80px";
    loadingContainer.style.height = "80px";
    loadingContainer.style.borderRadius = "50%";
    loadingContainer.style.border = "6px solid rgba(255, 255, 255, 0.3)";
    loadingContainer.style.borderTop = "6px solid white";
    loadingContainer.style.animation = "spin 1s linear infinite";

    loadingModal.appendChild(loadingContainer);
    document.body.appendChild(loadingModal);

    const styleTag = document.createElement("style");
    styleTag.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`;
    document.head.appendChild(styleTag);

    function showLoadingModal() {
        loadingModal.style.display = "flex";
    }

    function hideLoadingModal() {
        loadingModal.style.display = "none";
    }

    return {
        show: showLoadingModal,
        hide: hideLoadingModal
    };
}






















// HOME PAGE
function createNavbar() {
    const navbar = document.createElement("nav");
    navbar.style.padding = "1rem 2rem";
    navbar.style.backgroundColor = "white";
    navbar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    navbar.style.display = "flex";
    navbar.style.justifyContent = "space-between";
    navbar.style.alignItems = "center";

    const logoContainer = createLogoSection();
    const rightContainer = createRightContainer();

    navbar.appendChild(logoContainer);
    navbar.appendChild(rightContainer);

    return navbar;
}

function createLogoSection() {
    const logoContainer = document.createElement("div");
    logoContainer.style.display = "flex";
    logoContainer.style.alignItems = "center";
    logoContainer.style.gap = "0.75rem";

    const logo = document.createElement("div");
    logo.textContent = "Dashboard";
    logo.style.fontSize = "1.5rem";
    logo.style.fontWeight = "bold";
    logo.style.color = "#1f2937";

    const subscriptionBlock = createSubscriptionBlock();

    logoContainer.appendChild(logo);
    logoContainer.appendChild(subscriptionBlock);

    return logoContainer;
}

function createSubscriptionBlock() {
    const subscriptionBlock = document.createElement("div");
    subscriptionBlock.id = "subscription-block";
    subscriptionBlock.style.fontSize = "0.875rem";
    subscriptionBlock.style.fontWeight = "500";
    subscriptionBlock.style.color = "white";
    subscriptionBlock.style.backgroundColor = "#4f46e5";
    subscriptionBlock.style.padding = "4px 12px";
    subscriptionBlock.style.borderRadius = "8px";
    subscriptionBlock.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
    subscriptionBlock.style.display = "none";
    return subscriptionBlock;
}

function createRightContainer() {
    const rightContainer = document.createElement("div");
    rightContainer.style.display = "flex";
    rightContainer.style.alignItems = "center";
    rightContainer.style.gap = "1rem";

    const pricingButton = createPricingButton();
    const userSection = createUserSection();

    rightContainer.appendChild(pricingButton);
    rightContainer.appendChild(userSection);

    return rightContainer;
}

function createPricingButton() {
    const pricingButton = document.createElement("button");
    pricingButton.textContent = "Subscription management";
    pricingButton.style.padding = "0.5rem 1rem";
    pricingButton.style.backgroundColor = "transparent";
    pricingButton.style.border = "none";
    pricingButton.style.cursor = "pointer";
    pricingButton.style.fontSize = "1rem";
    pricingButton.style.color = "#4b5563";
    pricingButton.onclick = () => {
        const modal = createPricingModal();
        document.body.appendChild(modal);
        modal.style.display = "block";
    };
    return pricingButton;
}

function createUserSection() {
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
    userEmail.textContent = "";
    userEmail.style.fontSize = "1rem";
    userEmail.style.color = "#4b5563";
    userEmail.style.minWidth = "150px";

    userSection.appendChild(userAvatar);
    userSection.appendChild(userEmail);

    return userSection;
}



















// Создание основной секции контента
const createContent = () => {
    const content = document.createElement("div");
    content.style.padding = "2rem";
    content.style.maxWidth = "1200px";
    content.style.margin = "0 auto";

    const title = document.createElement("h1");
    title.textContent = "Welcome to Dashboard";
    title.style.margin = "0 0 2rem 0";
    title.style.fontSize = "2rem";
    title.style.color = "#1f2937";

    content.appendChild(title);
    content.appendChild(createSnippetSection());

    return content;
};

// Создание секции с установочным кодом
const createSnippetSection = () => {
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

    const snippetContainer = document.createElement("div");
    snippetContainer.style.display = "none";
    snippetContainer.style.marginTop = "1.5rem";
    snippetContainer.style.backgroundColor = "#1e1e1e";
    snippetContainer.style.padding = "1.5rem";
    snippetContainer.style.borderRadius = "0.5rem";

    const snippetCode = document.createElement("pre");
    snippetCode.style.color = "#e4e4e7";
    snippetCode.style.overflow = "auto";
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

    copyButton.onclick = () => {
        navigator.clipboard.writeText(snippetCode.textContent);
        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 2000);
    };

    getCodeButton.onclick = async () => {
        snippetContainer.style.display = "flex";

        try {
            const response = await fetch("https://em7mzbs4ug.execute-api.us-east-2.amazonaws.com/default/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            const data = await response.json();
            snippetCode.textContent = data.client_api_key && data.client_api_key !== "empty"
                ? data.user_service_link
                : "API key not available.";
        } catch (error) {
            snippetCode.textContent = "Error: Failed to connect.";
        }
    };

    snippetContainer.appendChild(snippetCode);
    snippetContainer.appendChild(copyButton);

    snippetSection.appendChild(snippetTitle);
    snippetSection.appendChild(getCodeButton);
    snippetSection.appendChild(snippetContainer);

    return snippetSection;
};

// Создание главной страницы
const createHomePage = () => {
    const home = document.createElement("div");
    home.style.minHeight = "100vh";
    home.style.backgroundColor = "#f3f4f6";

    home.appendChild(createNavbar());
    home.appendChild(createContent());

    return home;
};
















const createPricingModal = () => {
    if (!userData) return;

    // Основное затемненное покрытие
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "pricing-modal";
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100vh";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "10000";

    // Внутреннее окно (контейнер)
    const modalContent = document.createElement("div");
    modalContent.style.background = "#1e293b";
    modalContent.style.padding = "32px";
    modalContent.style.borderRadius = "16px";
    modalContent.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.3)";
    modalContent.style.width = "90%";
    modalContent.style.maxWidth = "800px";
    modalContent.style.position = "absolute";
    modalContent.style.top = "50%";
    modalContent.style.left = "50%";
    modalContent.style.transform = "translate(-50%, -50%)";
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.alignItems = "center";
    modalContent.style.color = "#ffffff";

    // Заголовок модального окна
    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Choose Your Plan";
    modalTitle.style.fontSize = "1.8rem";
    modalTitle.style.marginBottom = "24px";
    modalTitle.style.fontWeight = "bold";

    // Контейнер карточек подписок
    const plansContainer = document.createElement("div");
    plansContainer.style.display = "flex";
    plansContainer.style.gap = "24px";
    plansContainer.style.justifyContent = "center";
    plansContainer.style.width = "100%";
    plansContainer.style.flexWrap = "wrap"; // Для адаптивности на мобильных устройствах

    // Определяем текущий план пользователя
    const currentPlan = userData.subscription_name || null;

    // Карточки подписок
    const startPlan = createPlanCard("Start", "$14.99/month", [
        "Up to 100 conversations per month",
        "Standard features",
        "Basic support",
    ], currentPlan === "Start", currentPlan);

    const enterprisePlan = createPlanCard("Enterprise", "Custom", [
        "For large businesses with high data volume",
        "Advanced features & integrations",
        "Dedicated support & account management",
    ], currentPlan === "Enterprise", currentPlan);

    plansContainer.appendChild(startPlan);
    plansContainer.appendChild(enterprisePlan);

    // Кнопка закрытия (крестик)
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.position = "absolute";
    closeButton.style.top = "12px";
    closeButton.style.right = "16px";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#ffffff";
    closeButton.onclick = () => {
        document.body.removeChild(modalOverlay);
    };

    // Добавляем элементы в модальное окно
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(plansContainer);
    modalOverlay.appendChild(modalContent);

    return modalOverlay;
};

// Функция создания карточки подписки
const createPlanCard = (name, price, features, isActive, activePlan) => {
    const planCard = document.createElement("div");
    planCard.style.background = "#334155";
    planCard.style.padding = "24px";
    planCard.style.borderRadius = "12px";
    planCard.style.textAlign = "center";
    planCard.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    planCard.style.width = "100%";
    planCard.style.maxWidth = "320px";
    planCard.style.display = "flex";
    planCard.style.flexDirection = "column";
    planCard.style.alignItems = "center";

    // Если текущий план активен, добавляем красную рамку
    if (isActive) {
        planCard.style.border = "5px solid #ff4d4d";
    }

    const planTitle = document.createElement("h3");
    planTitle.textContent = name;
    planTitle.style.margin = "0 0 12px";
    planTitle.style.fontSize = "1.4rem";
    planTitle.style.fontWeight = "bold";
    planTitle.style.color = "#ffffff";

    const planPrice = document.createElement("p");
    planPrice.textContent = price;
    planPrice.style.margin = "0 0 8px";
    planPrice.style.fontSize = "2rem";
    planPrice.style.fontWeight = "bold";
    planPrice.style.color = "#ffffff";

    const featuresList = document.createElement("ul");
    featuresList.style.listStyle = "none";
    featuresList.style.padding = "0";
    featuresList.style.textAlign = "left";
    featuresList.style.width = "100%";
    featuresList.style.maxWidth = "240px";
    featuresList.style.marginBottom = "16px";

    features.forEach((feature) => {
        const listItem = document.createElement("li");
        listItem.textContent = `✔ ${feature}`;
        listItem.style.fontSize = "1rem";
        listItem.style.marginBottom = "6px";
        listItem.style.color = "#b4b4b8";
        featuresList.appendChild(listItem);
    });

    // Кнопка отмены подписки (если это активный план)
    if (isActive) {
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Subscription";
        cancelButton.style.width = "100%";
        cancelButton.style.padding = "12px";
        cancelButton.style.background = "#ff4d4d";
        cancelButton.style.color = "white";
        cancelButton.style.border = "none";
        cancelButton.style.borderRadius = "8px";
        cancelButton.style.cursor = "pointer";
        cancelButton.style.fontSize = "1rem";
        cancelButton.style.fontWeight = "600";
        cancelButton.style.transition = "all 0.3s ease-in-out";

        cancelButton.onmouseover = () => (cancelButton.style.opacity = "0.9");
        cancelButton.onmouseout = () => (cancelButton.style.opacity = "1");

        cancelButton.onclick = () => {
            alert("Your subscription will be canceled.");
        };

        planCard.appendChild(planTitle);
        planCard.appendChild(planPrice);
        planCard.appendChild(featuresList);
        planCard.appendChild(cancelButton);
    } 
    // Кнопка подписки (если подписка отсутствует, но НЕ у активного плана)
    else if (!isActive && !activePlan) {
        const subscribeButton = document.createElement("button");
        subscribeButton.textContent = "Get Started";
        subscribeButton.style.width = "100%";
        subscribeButton.style.padding = "12px";
        subscribeButton.style.background = "linear-gradient(90deg, #8b5cf6, #ec4899)";
        subscribeButton.style.color = "white";
        subscribeButton.style.border = "none";
        subscribeButton.style.borderRadius = "8px";
        subscribeButton.style.cursor = "pointer";
        subscribeButton.style.fontSize = "1rem";
        subscribeButton.style.fontWeight = "600";
        subscribeButton.style.transition = "all 0.3s ease-in-out";

        subscribeButton.onmouseover = () => (subscribeButton.style.opacity = "0.9");
        subscribeButton.onmouseout = () => (subscribeButton.style.opacity = "1");

        planCard.appendChild(planTitle);
        planCard.appendChild(planPrice);
        planCard.appendChild(featuresList);
        planCard.appendChild(subscribeButton);
    } else {
        planCard.appendChild(planTitle);
        planCard.appendChild(planPrice);
        planCard.appendChild(featuresList);
    }

    return planCard;
};

































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
