// ==UserScript==
// @name         BigMag CRM Helper
// @namespace    https://github.com/Dima34/onebox-temper/
// @version      1.9
// @description  Додає корисні функції для CRM BigMag (crm.bigmag.ua)
// @author       Dima Vavilov
// @match        https://crm.bigmag.ua/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @icon         https://crm.bigmag.ua/favicon.ico
// @updateURL    https://github.com/Dima34/onebox-temper/raw/refs/heads/main/onebox_tamper.user.js
// @downloadURL  https://github.com/Dima34/onebox-temper/raw/refs/heads/main/onebox_tamper.user.js
// ==/UserScript==


(function () {
    'use strict';
    console.log("BigMag CRM Helper loaded");

    const MANAGER_NAME = "Вавілов Дмитро"

    // Конфіг у новому форматі з підтримкою масиву для text і button
    const statusConfig = [
        {
            statuses: ["Отказ", "Первый контакт", "Новый ЗАКАЗ",
                "Крещатик 13/2 Самовывоз", "Львів Самовивіз", "Зв'язатися при наявності",
                "Перемещение", "Новая Почта", "Аладин Самовывоз", "НП самовывоз", "Успешно реализован",
                "ROZETKA Delivery"
            ],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"], text: [
                        "Уровень цен:",
                        "Кредитный брокер:",
                        "Коментар від менеджера в магазині:",
                        "E-mail:",
                        "Менеджер в магазине:",
                        "Способ связи:",
                        "Джерело реклами:",
                        "Ответственный:",
                        "Instagram Профиль:",
                        "Бизнес-процесс:",
                        "Область:",
                        "Обмен:",
                        "Способ оплаты:",
                        "Посилання на телеграм:"
                    ]
                },
                {
                    type: "remove-toolbar-button", container: ".ob-button-fixed input[type='submit']", value: [
                        "Заказ товара", "Кредит", "Предоплата",
                        "Запрос поставщику", "Успешно партнер", "УкрПочта", "Сервис Бигмаг",
                        "Недозвон", "Выезд Эксперта", "Одесса самовывоз", "Без звонка Отказ",
                        "Заказ на Трейд", "Днепр самовывоз", "Харьков самовывоз", "Ремонт", "Смс рассылка",
                        "Тест НЕ НАЖИМАТЬ"
                    ]
                },
                {
                    type: "condition",
                    watch: {
                        container: ".ob-data-element",
                        captionSelector: [".el-caption"],
                        text: ["Способ доставки :"]
                    },
                    expectedValue: ['ТЦ "Аладин"', "Самовивіз Львів", "Крещатик 13/2 Самовывоз"],
                    target: {
                        container: ".ob-data-element",
                        captionSelector: [".el-caption"],
                        text: ["Менеджер в магазине:"]
                    }
                },
                // Вмикаємо "Источник" тільки тоді, коли це розетка, щоб розуміти
                // Що замовлення з розетки
                {
                    type: "condition",
                    watch: {
                        container: ".ob-data-element",
                        captionSelector: [".el-caption"],
                        text: ["Источник:"]
                    },
                    expectedValue: ["Rozetka"],
                    target: {
                        container: ".ob-data-element",
                        captionSelector: [".el-caption"],
                        text: ["Источник:"]
                    }
                }
            ]
        },
        {
            statuses: ["Отказ", "Первый контакт", "Новый ЗАКАЗ",
                "Крещатик 13/2 Самовывоз", "Львів Самовивіз", "Зв'язатися при наявності",
                "Перемещение", "Новая Почта", "Аладин Самовывоз", "Успешно реализован"
            ],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"], text: [
                        "Накладная доставки:",
                    ]
                },
            ]
        },
        {
            statuses: ["Новый ЗАКАЗ"],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [
                        "Склад продажи:", "Адрес :", "Способ доставки :"
                    ]
                },
                {
                    type: "remove-toolbar-button", container: ".ob-button-fixed input[type='submit']",
                    value: [
                        "Ремонт завершен", "Черный список", "Ремонт завершен"
                    ]
                }
            ]
        },
        {
            statuses: ["Крещатик 13/2 Самовывоз", "Львів Самовивіз", "Аладин Самовывоз"],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [
                        "Адрес :"
                    ]
                },
                {
                    type: "remove-toolbar-button", container: ".ob-button-fixed input[type='submit']",
                    value: [
                        "Клиент в магазине", "Отказ в магазине"
                    ]
                }
            ]
        },
        {
            statuses: ["Перемещение"],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [

                    ]
                },
                {
                    type: "remove-toolbar-button", container: ".ob-button-fixed input[type='submit']",
                    value: [
                        "Крещатик 13/2 Самовывоз", "Партнер Самовывоз", "Аладин Самовывоз", "Львів Самовивіз"
                    ]
                }
            ]
        },
        // Вмикаємо "Адрес:" лиш коли НП або Уклон
        {
            statuses: ["Отказ", "Перемещение", "Первый контакт",
                "Зв'язатися при наявності",
                "Перемещение", "Новая Почта", "НП самовывоз",
                "ROZETKA Delivery", "Курьер", "Успешно реализован"],
            actions: [
                {
                    type: "condition",
                    watch: {
                        container: ".ob-data-element",
                        captionSelector: [".el-caption"],
                        text: ["Способ доставки :"]
                    },
                    expectedValue: ["Доставка Новой Почтой", "Uklon Delivery"],
                    target: {
                        container: ".ob-data-element",
                        captionSelector: [".el-caption"],
                        text: ["Адрес :"]
                    }
                }
            ]
        },
        {
            statuses: ["Новый ЗАКАЗ"],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [

                    ]
                },
                {
                    type: "remove-toolbar-button", container: ".ob-button-fixed input[type='submit']",
                    value: [

                    ]
                }
            ]
        },
        // Додаємо кастомні кнопки у новий заказ(поки тест на "Отказ")
        {
            statuses: ["Новый ЗАКАЗ"],
            actions: [
                // {
                //     type: "add-toolbar-button",
                //     name: "Підготувати",
                //     onClick: function (event, newButtonElement) {
                //         checkAndSetFieldValueIfEmpty("Город UA:", "Київ");
                //         checkAndSetFieldValueIfEmpty("Категория:", "Б/У техника");
                //         checkAndSetFieldValueIfEmpty("Менеджер:", MANAGER_NAME);
                //         checkAndSetFieldValueIfEmpty("Тип оплаты :", "Обычная оплата");


                //     }
                // },
                {
                    type: "upgrade-toolbar-button",
                    name: "Первый контакт",
                    onClick: function (event, starterClickHandler) {
                        checkAndSetFieldValueIfEmpty("Город UA:", "Київ");
                        checkAndSetFieldValueIfEmpty("Категория:", "Б/У техника");
                        checkAndSetFieldValueIfEmpty("Менеджер:", MANAGER_NAME);
                        checkAndSetFieldValueIfEmpty("Тип оплаты :", "Обычная оплата");

                        // виклик дефолтного (старого) коду кнопки
                        if (starterClickHandler) starterClickHandler();
                    }
                },
                {
                    type: "upgrade-toolbar-button",
                    name: "Отказ",
                    onClick: function (event, starterClickHandler) {
                        checkAndSetFieldValueIfEmpty("Город UA:", "Київ");
                        checkAndSetFieldValueIfEmpty("Категория:", "Б/У техника");
                        checkAndSetFieldValueIfEmpty("Менеджер:", MANAGER_NAME);
                        checkAndSetFieldValueIfEmpty("Тип оплаты :", "Обычная оплата");
                        checkAndSetFieldValueIfEmpty("Причина отказа:", "Уже не актуально");

                        // виклик дефолтного (старого) коду кнопки
                        if (starterClickHandler) starterClickHandler();
                    }
                },
                {
                    type: "upgrade-toolbar-button",
                    name: "Зв'язатися при наявності",
                    onClick: function (event, starterClickHandler) {
                        checkAndSetFieldValueIfEmpty("Город UA:", "Київ");
                        checkAndSetFieldValueIfEmpty("Категория:", "Б/У техника");
                        checkAndSetFieldValueIfEmpty("Менеджер:", MANAGER_NAME);
                        checkAndSetFieldValueIfEmpty("Тип оплаты :", "Обычная оплата");

                        // виклик дефолтного (старого) коду кнопки
                        if (starterClickHandler) starterClickHandler();
                    }
                },
            ]
        },
        // Шаблон
        {
            statuses: ["Новый ЗАКАЗ"],
            actions: [
                {
                    type: "hide-field", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [

                    ]
                },
                {
                    type: "remove-toolbar-button",
                    container: ".ob-button-fixed input[type='submit']",
                    value: [

                    ]
                }
            ]
        }
    ];

    // ==========================
    // Службові функції
    // ==========================

    let fieldObservers = []; // активні обсервери для condition
    let createdElements = []; // кастомно створені елементи для тегів

    function disconnectFieldObservers() {
        fieldObservers.forEach(obs => obs.disconnect());
        fieldObservers = [];
    }

    function deletePrevCreatedElements() {
        createdElements.forEach(el => {
            el.remove();
        })
    }

    function checkAndSetFieldValueIfEmpty(fieldName, value) {
        let fieldElement = getFieldElement(fieldName)

        console.log(fieldElement);
        console.log(isFieldEmpty(fieldElement));

        if (isFieldEmpty(fieldElement)) {
            setFieldElementValue(fieldElement, value)
        }
    }
    
    const FIELD_ELEMENT_SELECTOR = "[data-placeholder], input[placeholder]:not([role='combobox'])";

    function isFieldEmpty(fieldElement) {
        const fieldInput = fieldElement.querySelector(FIELD_ELEMENT_SELECTOR)
        return fieldInput.value.length == 0
    }

    function setFieldElementValue(fieldElement, value) {
        const fieldInput = fieldElement.querySelector(FIELD_ELEMENT_SELECTOR)
        fieldInput.removeAttribute("disabled")

        if (fieldInput.tagName.toLowerCase() === "input") {
            fieldInput.setAttribute("value", value)    
        } else if (fieldInput.tagName.toLowerCase() === "select") {
            let option = Array.from(fieldInput.options).find(opt => opt.value === value);

            if (option) {
                option.selected = true;
            } else {
                const tempOption = document.createElement("option");
                tempOption.value = value;
                tempOption.textContent = value;
                tempOption.selected = true;
                fieldInput.appendChild(tempOption);

                setTimeout(() => {
                    if (tempOption.parentNode) {
                        tempOption.remove();
                    }
                }, 1000);
            }
        }
    }


    function getFieldElement(name) {
        // Знаходимо всі обгортки
        const elements = document.querySelectorAll('.ob-data-element');

        for (const el of elements) {
            const captionEl = el.querySelector('.el-caption');
            if (!captionEl) continue;

            // Беремо текст і чистимо від пробілів/переносів
            const captionText = captionEl.textContent.trim();

            if (captionText === name.trim()) {
                return el;
            }
        }

        return null; // якщо не знайдено
    }


    // пошук елементів по правилу (container + captionSelector + text)
    function findField(rule) {
        const texts = Array.isArray(rule.text) ? rule.text : [rule.text];
        const selectors = Array.isArray(rule.captionSelector) ? rule.captionSelector : [rule.captionSelector];

        const foundViews = [];
        document.querySelectorAll(rule.container).forEach(container => {
            for (let sel of selectors) {
                const captionEl = container.querySelector(sel);
                if (captionEl && texts.includes(captionEl.innerText.trim())) {
                    foundViews.push(container);
                    break;
                }
            }
        });
        return foundViews;
    }

    // показати все перед повторним приховуванням
    function resetVisibility() {
        statusConfig.forEach(cfg => {
            cfg.actions.forEach(rule => {
                if (rule.container) {
                    document.querySelectorAll(rule.container).forEach(el => el.style.display = "");
                }
            });
        });
    }

    // застосувати правила для статусу
    function applyStatusRules(status) {
        resetVisibility();
        disconnectFieldObservers();
        deletePrevCreatedElements();

        statusConfig.forEach(cfg => {
            if (!cfg.statuses.includes(status)) return;

            cfg.actions.forEach(rule => {
                if (rule.type === "hide-field") {
                    const foundViews = findField(rule);
                    foundViews.forEach(view => view.style.display = "none");
                }
                else if (rule.type === "remove-toolbar-button") {
                    const values = Array.isArray(rule.value) ? rule.value : [rule.value];
                    document.querySelectorAll(rule.container).forEach(el => {
                        if (el.value && values.includes(el.value.trim())) {
                            el.style.display = "none";
                        }
                    });
                }
                else if (rule.type === "add-toolbar-button") {
                    disconnectObserver()
                    const container = document.querySelector(".ob-grid-default .ob-button-fixed.js-check-animation")
                    const name = rule.name;

                    const button = document.createElement("input");
                    button.type = "submit";
                    button.value = rule.name;
                    button.className = "ob-button js-change-order-status js-workflow-tooltip dark tooltipstered";
                    button.style.backgroundColor = "#ffd2fb";

                    // якщо rule.onClick – це функція
                    if (typeof rule.onClick === "function") {
                        button.addEventListener("click", rule.onClick);
                    }
                    // якщо rule.onClick – це текст коду
                    else if (typeof rule.onClick === "string") {
                        button.setAttribute("onclick", rule.onClick);
                    }

                    const insertBeforeElement = container.querySelector("input[type='submit'][value='Первый контакт")
                    container.insertBefore(button, insertBeforeElement);
                    createdElements.push(button)
                    observeObserver()
                }
                else if (rule.type === "upgrade-toolbar-button") {
                    disconnectObserver();

                    const name = rule.name;
                    const toolbarButton = document.querySelector(
                        `.ob-button-fixed input[type='submit'][value='${name}']`
                    );

                    if (toolbarButton) {
                        // 1. Дістаємо старий код із onclick або з data-onclick
                        let oldOnClickAttr = toolbarButton.getAttribute("onclick");
                        if (!oldOnClickAttr) {
                            oldOnClickAttr = toolbarButton.getAttribute("data-onclick") || "";
                        } else {
                            // Переносимо в data-onclick, щоб зберегти
                            toolbarButton.setAttribute("data-onclick", oldOnClickAttr);
                            toolbarButton.removeAttribute("onclick");
                        }

                        // 2. Розбиваємо по першому return
                        let [beforeReturn, afterReturn] = oldOnClickAttr.split(/return\s+/);
                        afterReturn = afterReturn || "";

                        // 3. Генеруємо новий код як рядок
                        const newCode = `
                            // --- Мій кастомний код ---
                            if (onClickHandler) {
                                onClickHandler.call(this, event);
                            }

                            // --- Частина старого коду до return ---
                            ${beforeReturn}

                            // --- Частина після return ---
                            let __res = (function(){ ${afterReturn} }).call(this);
                            if (__res !== false) {
                                const form = this.form || (event && event.target && event.target.form);
                                if (form) {
                                    if (typeof form.requestSubmit === "function") {
                                        form.requestSubmit(this);
                                    } else {
                                        form.submit();
                                    }
                                }
                            }
                        `;

                        // 4. Створюємо функцію з параметрами (event, onClickHandler)
                        const compiledFn = new Function("event", "onClickHandler", newCode).bind(toolbarButton);

                        // 5. Обгортаємо у функцію, щоб підставити rule.onClick
                        toolbarButton.onclick = function (event) {
                            return compiledFn.call(this, event, rule.onClick);
                        };
                    }

                    observeObserver();
                }

                else if (rule.type === "condition") {
                    const watchFields = findField(rule.watch);
                    const targetFields = findField(rule.target);
                    const expected = Array.isArray(rule.expectedValue) ? rule.expectedValue : [rule.expectedValue];

                    // спочатку ховаємо таргети
                    targetFields.forEach(target => target.style.display = "none");

                    watchFields.forEach(watchView => {
                        const valueEl = watchView.querySelector(".el-value");
                        if (!valueEl) return;

                        function updateVisibility() {
                            if (expected.includes(valueEl.innerText.trim())) {
                                targetFields.forEach(target => target.style.display = "");
                            } else {
                                targetFields.forEach(target => target.style.display = "none");
                            }
                        }

                        updateVisibility(); // перевірити одразу

                        const obs = new MutationObserver(updateVisibility);
                        obs.observe(valueEl, { childList: true, characterData: true, subtree: true });
                        fieldObservers.push(obs);
                    });
                }
            });
        });
    }

    // ==========================
    // Логіка статусів
    // ==========================

    function processStatus() {
        disconnectFieldObservers();

        const dataViews = document.querySelectorAll('.double .block-zone:nth-of-type(2) .data-view');

        for (const view of dataViews) {
            const caption = view.querySelector('.el-caption > .js-text');
            if (caption && caption.innerText.trim() === 'Статус:') {
                const valueElement = view.querySelector('.el-value');
                if (valueElement) {
                    const status = valueElement.innerText.trim();
                    applyStatusRules(status);
                    return status;
                }
            }
        }
        return null;
    }

    // ==========================
    // MutationObserver для #preView
    // ==========================

    const observedContainerSelector = '#preView'
    console.log(document.querySelector(observedContainerSelector));


    let preView;
    let observer;

    function observePreview() {
        prepareObserver();
        observeObserver();
        update();
    }

    let updateDebounce;
    const DEBOUNCE_TIME = 40

    function prepareObserver() {
        preView = document.querySelector(observedContainerSelector);
        if (!preView) return;

        observer = new MutationObserver(function (mutations) {
            if (mutations.some(m => m.type === 'childList')) {
                clearTimeout(updateDebounce);
                updateDebounce = setTimeout(() => {
                    update();
                }, DEBOUNCE_TIME); // викликається тільки раз після "затишшя"
            }
        });
    }

    function observeObserver() {
        if (observer && preView) {
            observer.observe(preView, {
                childList: true,
                characterData: true,
                subtree: true,
            });
        }
    }

    function disconnectObserver() {
        if (observer) observer.disconnect();
    }

    function update() {
        processStatus();
        handlePhoneNubmerUpgrade();
    }

    // ==========================
    // Обробка телефонів
    // ==========================

    function handlePhoneNubmerUpgrade() {
        document.querySelectorAll('.data-view').forEach(view => {
            if (view.dataset.calltoProcessed) return; // вже оброблено

            const caption = view.querySelector('.el-caption');
            if (!caption) return;

            if (caption.textContent.trim() === 'Телефон клиента:') {
                const phoneLink = view.querySelector('a[data-phone]');
                if (!phoneLink) return;

                const rawPhone = phoneLink.getAttribute('data-phone');
                if (!rawPhone) return;

                let phone = rawPhone.replace(/[^\d]/g, ""); // тільки цифри

                // Якщо не починається на 38 → додаємо
                if (!phone.startsWith("38")) {
                    phone = "38" + phone;
                }

                // Якщо після 38 немає 0 → додаємо
                if (phone.startsWith("38") && phone.length > 2 && phone[2] !== "0") {
                    phone = "380" + phone.slice(2);
                }

                // завжди додаємо +
                phone = "+" + phone;

                disconnectObserver();

                // Клонуємо caption, щоб прибрати старі слухачі
                const newPhoneLink = phoneLink.cloneNode(true);
                phoneLink.parentNode.replaceChild(newPhoneLink, phoneLink);

                // Навішуємо наш клік
                newPhoneLink.style.cursor = "pointer";
                newPhoneLink.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `callto:${phone}`;
                });

                view.dataset.calltoProcessed = "true";

                observeObserver();
            }
        });
    }


    // ==========================
    // Запуск
    // ==========================

    window.addEventListener('load', function () {
        if (document.querySelector(observedContainerSelector)) {
            observePreview();
        } else {
            const waitForPreview = setInterval(function () {
                if (document.querySelector(observedContainerSelector)) {
                    clearInterval(waitForPreview);
                    observePreview();
                }
            }, 500);
        }
    });
})();
