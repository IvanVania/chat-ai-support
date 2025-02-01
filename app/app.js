




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
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const jwtToken = localStorage.getItem('jwtToken');

    console.log("🔹 Код авторизации:", authorizationCode);
    console.log("🔹 JWT-токен из localStorage:", jwtToken);

    const payload = { code: authorizationCode || null };
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
            }

            // ✅ Теперь сохраняем `userData` в глобальную переменную
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
            // updateUI();
        }
    } catch (error) {
        console.error("⚠️ Ошибка выполнения запроса:", error);
        localStorage.removeItem('jwtToken');
        window.location.href = 'https://ivanvania.github.io/chat-ai-support/logIn';
    }
};

// ✅ Теперь updateUI использует глобальную `userData`
function updateUI() {
    if (!userData) return;
    
    console.log("🔄 Обновление UI...");

    document.getElementById('profile-pic').src = userData.profile_picture_url;
    document.getElementById('subscription-status').textContent = `Subscription: ${userData.subscription_status ? 'Active' : 'Inactive'}`;

    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';

    userData.client_data_ids.forEach((data_id, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Data ${index + 1}`;
        listItem.setAttribute('data-id', data_id);
        listItem.onclick = () => createBookWindow(data_id, `Data ${index + 1}`);
        chatList.appendChild(listItem);
    });

    console.log("✅ UI обновлен.");
}

// ✅ Доступ к userData в любой функции
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

    const logo = document.createElement("div");
    logo.textContent = "Dashboard";
    logo.style.fontSize = "1.5rem";
    logo.style.fontWeight = "bold";
    logo.style.color = "#1f2937";

    const pricingButton = document.createElement("button");
    pricingButton.textContent = "Pricing";
    pricingButton.style.padding = "0.5rem 1rem";
    pricingButton.style.backgroundColor = "transparent";
    pricingButton.style.border = "none";
    pricingButton.style.cursor = "pointer";
    pricingButton.style.fontSize = "1rem";
    pricingButton.style.color = "#4b5563";

    navbar.appendChild(logo);
    navbar.appendChild(pricingButton);

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

    // API Key Section
    const apiSection = document.createElement("div");
    apiSection.style.backgroundColor = "white";
    apiSection.style.padding = "2rem";
    apiSection.style.borderRadius = "0.5rem";
    apiSection.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    apiSection.style.marginBottom = "2rem";

    const apiTitle = document.createElement("h2");
    apiTitle.textContent = "API Key";
    apiTitle.style.fontSize = "1.5rem";
    apiTitle.style.marginBottom = "1rem";
    apiTitle.style.color = "#1f2937";

    const createKeyButton = document.createElement("button");
    createKeyButton.textContent = "Generate API Key";
    createKeyButton.style.padding = "0.75rem 1.5rem";
    createKeyButton.style.backgroundColor = "#4f46e5";
    createKeyButton.style.color = "white";
    createKeyButton.style.border = "none";
    createKeyButton.style.borderRadius = "0.375rem";
    createKeyButton.style.cursor = "pointer";
    createKeyButton.style.fontSize = "0.875rem";
    createKeyButton.style.fontWeight = "500";

    apiSection.appendChild(apiTitle);
    apiSection.appendChild(createKeyButton);

    // Code Snippet Section
    const snippetSection = document.createElement("div");
    snippetSection.style.backgroundColor = "white";
    snippetSection.style.padding = "2rem";
    snippetSection.style.borderRadius = "0.5rem";
    snippetSection.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

    const snippetTitle = document.createElement("h2");
    snippetTitle.textContent = "Installation Code";
    snippetTitle.style.fontSize = "1.5rem";
    snippetTitle.style.marginBottom = "1rem";
    snippetTitle.style.color = "#1f2937";

    const snippetContainer = document.createElement("div");
    snippetContainer.style.display = "none"; // Initially hidden
    snippetContainer.style.backgroundColor = "#f8fafc";
    snippetContainer.style.padding = "1rem";
    snippetContainer.style.borderRadius = "0.375rem";
    snippetContainer.style.position = "relative";

    const snippetCode = document.createElement("pre");
    snippetCode.style.margin = "0";
    snippetCode.style.fontSize = "0.875rem";
    snippetCode.style.color = "#334155";
    snippetCode.style.overflow = "auto";

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.style.position = "absolute";
    copyButton.style.right = "1rem";
    copyButton.style.top = "1rem";
    copyButton.style.padding = "0.5rem 1rem";
    copyButton.style.backgroundColor = "#4f46e5";
    copyButton.style.color = "white";
    copyButton.style.border = "none";
    copyButton.style.borderRadius = "0.375rem";
    copyButton.style.fontSize = "0.75rem";
    copyButton.style.cursor = "pointer";

    const getCodeButton = document.createElement("button");
    getCodeButton.textContent = "Get Installation Code";
    getCodeButton.style.padding = "0.75rem 1.5rem";
    getCodeButton.style.backgroundColor = "#4f46e5";
    getCodeButton.style.color = "white";
    getCodeButton.style.border = "none";
    getCodeButton.style.borderRadius = "0.375rem";
    getCodeButton.style.cursor = "pointer";
    getCodeButton.style.fontSize = "0.875rem";
    getCodeButton.style.fontWeight = "500";

    // Loading Indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.style.display = "none";
    loadingIndicator.style.padding = "1rem";
    loadingIndicator.style.textAlign = "center";
    loadingIndicator.style.color = "#6b7280";
    loadingIndicator.textContent = "Loading...";

    // Pricing Modal
    const createPricingModal = () => {
        const modal = document.createElement("div");
        modal.style.display = "none";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.zIndex = "1000";

        const modalContent = document.createElement("div");
        modalContent.style.position = "relative";
        modalContent.style.backgroundColor = "white";
        modalContent.style.margin = "4rem auto";
        modalContent.style.padding = "2rem";
        modalContent.style.maxWidth = "800px";
        modalContent.style.borderRadius = "0.5rem";
        modalContent.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.right = "1rem";
        closeButton.style.top = "1rem";
        closeButton.style.fontSize = "1.5rem";
        closeButton.style.border = "none";
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.cursor = "pointer";

        const modalTitle = document.createElement("h2");
        modalTitle.textContent = "Choose Your Plan";
        modalTitle.style.fontSize = "1.875rem";
        modalTitle.style.marginBottom = "2rem";
        modalTitle.style.textAlign = "center";

        const plansContainer = document.createElement("div");
        plansContainer.style.display = "grid";
        plansContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        plansContainer.style.gap = "2rem";

        const plans = [
            {
                name: "Basic",
                price: "$15/month",
                features: ["10,000 messages", "Basic support", "1 team member"]
            },
            {
                name: "Pro",
                price: "$29/month",
                features: ["50,000 messages", "Priority support", "5 team members"]
            }
        ];

        plans.forEach(plan => {
            const planCard = document.createElement("div");
            planCard.style.padding = "2rem";
            planCard.style.backgroundColor = "#f8fafc";
            planCard.style.borderRadius = "0.5rem";
            planCard.style.textAlign = "center";

            const planName = document.createElement("h3");
            planName.textContent = plan.name;
            planName.style.fontSize = "1.5rem";
            planName.style.marginBottom = "1rem";

            const planPrice = document.createElement("div");
            planPrice.textContent = plan.price;
            planPrice.style.fontSize = "2rem";
            planPrice.style.fontWeight = "bold";
            planPrice.style.marginBottom = "1.5rem";

            const featuresList = document.createElement("ul");
            featuresList.style.listStyle = "none";
            featuresList.style.padding = "0";
            featuresList.style.marginBottom = "1.5rem";

            plan.features.forEach(feature => {
                const featureItem = document.createElement("li");
                featureItem.textContent = feature;
                featureItem.style.marginBottom = "0.5rem";
                featuresList.appendChild(featureItem);
            });

            const selectButton = document.createElement("button");
            selectButton.textContent = "Select Plan";
            selectButton.style.padding = "0.75rem 1.5rem";
            selectButton.style.backgroundColor = "#4f46e5";
            selectButton.style.color = "white";
            selectButton.style.border = "none";
            selectButton.style.borderRadius = "0.375rem";
            selectButton.style.cursor = "pointer";
            selectButton.style.width = "100%";

            planCard.appendChild(planName);
            planCard.appendChild(planPrice);
            planCard.appendChild(featuresList);
            planCard.appendChild(selectButton);
            plansContainer.appendChild(planCard);
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(plansContainer);
        modal.appendChild(modalContent);

        closeButton.onclick = () => modal.style.display = "none";
        return modal;
    };

    // Event Handlers
    pricingButton.onclick = () => {
        const modal = createPricingModal();
        document.body.appendChild(modal);
        modal.style.display = "block";
    };

    createKeyButton.onclick = async () => {
        try {
            const response = await fetch("https://em7mzbs4ug.execute-api.us-east-2.amazonaws.com/default", {
                method: "POST"
            });
            const data = await response.json();
            if (response.ok) {
                apiTitle.textContent = `API Key: ${data.key}`;
                createKeyButton.style.display = "none";
            }
        } catch (error) {
            console.error("Error generating API key:", error);
        }
    };

    getCodeButton.onclick = async () => {
        loadingIndicator.style.display = "block";
        getCodeButton.style.display = "none";

        try {
            const response = await fetch("https://api.example.com/get-code");
            const data = await response.json();

            if (response.ok) {
                snippetContainer.style.display = "block";
                snippetCode.textContent = data.code;
                loadingIndicator.style.display = "none";
            } else if (response.status === 403) {
                // Show pricing modal if no subscription
                const modal = createPricingModal();
                document.body.appendChild(modal);
                modal.style.display = "block";
                loadingIndicator.style.display = "none";
                getCodeButton.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching code:", error);
            loadingIndicator.style.display = "none";
            getCodeButton.style.display = "block";
        }
    };

    copyButton.onclick = () => {
        navigator.clipboard.writeText(snippetCode.textContent);
        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 2000);
    };

    snippetContainer.appendChild(snippetCode);
    snippetContainer.appendChild(copyButton);

    snippetSection.appendChild(snippetTitle);
    snippetSection.appendChild(getCodeButton);
    snippetSection.appendChild(loadingIndicator);
    snippetSection.appendChild(snippetContainer);

    // Assembling the page
    content.appendChild(title);
    content.appendChild(apiSection);
    content.appendChild(snippetSection);

    home.appendChild(navbar);
    home.appendChild(content);

    return home;
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
                    ">
                        <td style="position: relative;">
                            <input type="text" 
                                value="${row}" 
                                oninput="updateRow(${index}, this.value)" 
                                style="
                                    width: 100%;
                                    padding: 8px 12px;
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

    // Loading Indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.textContent = "Saving changes...";
    loadingIndicator.style.display = "none";
    loadingIndicator.style.color = "#666";
    loadingIndicator.style.marginTop = "10px";
    loadingIndicator.style.fontSize = "14px";

    // Error Message
    const errorMessage = document.createElement("div");
    errorMessage.textContent = "Error saving changes. Please try again.";
    errorMessage.style.display = "none";
    errorMessage.style.color = "#d93025";
    errorMessage.style.marginTop = "10px";
    errorMessage.style.fontSize = "14px";

    // Save API Call
    saveButton.onclick = async () => {
        saveButton.style.display = "none";
        loadingIndicator.style.display = "block";
        errorMessage.style.display = "none";

        try {
            const response = await fetch("https://example.com/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: state.tableData })
            });

            if (!response.ok) throw new Error("API Error");

            loadingIndicator.style.display = "none";
            saveButton.style.display = "block";
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
const renderPage = (pageName) => {
    state.currentPage = pageName;
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    
    switch(pageName) {
        case 'home':
            mainContent.appendChild(createHomePage());
            break;
        case 'table':
            mainContent.appendChild(createTablePage());
            break;
        case 'settings':
            mainContent.appendChild(createSettingsPage());
            break;
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
};

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
