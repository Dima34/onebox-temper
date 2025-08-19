// ==UserScript==
// @name         BigMag CRM Helper
// @namespace    https://github.com/Dima34/onebox-temper/
// @version      1.7
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

    // Конфіг у новому форматі з підтримкою масиву для text і button
    const statusConfig = [
        {
            statuses: ["Отказ", "Первый контакт", "Новый ЗАКАЗ",
                "Крещатик 13/2 Самовывоз", "Львів Самовивіз", "Зв'язатися при наявності",
                "Перемещение", "Новая Почта", "Аладин Самовывоз", "НП самовывоз", "Успешно реализован"
            ],
            actions: [
                {
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"], text: [
                        "Уровень цен:",
                        "Кредитный брокер:",
                        "Коментар від менеджера в магазині:",
                        "E-mail:",
                        "Менеджер в магазине:",
                        "Источник:",
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
                    type: "button", container: ".ob-button-fixed input[type='submit']", value: [
                        "Заказ товара", "Успешно реализован", "Кредит", "Предоплата",
                        "Запрос поставщику", "Успешно партнер", "УкрПочта", "Сервис Бигмаг",
                        "Недозвон", "Выезд Эксперта", "Одесса самовывоз", "Без звонка Отказ",
                        "Заказ на Трейд", "Днепр самовывоз", "Харьков самовывоз", "Ремонт", "Смс рассылка",
                        "Тест НЕ НАЖИМАТЬ"
                    ]
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
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"], text: [
                        "Накладная доставки:",
                    ]
                },
            ]
        },
        {
            statuses: ["Новый ЗАКАЗ", "НП самовывоз"],
            actions: [
                {
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [
                        "Склад продажи:", "Адрес :", "Способ доставки :"
                    ]
                },
                {
                    type: "button", container: ".ob-button-fixed input[type='submit']",
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
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [
                        "Адрес :"
                    ]
                },
                {
                    type: "button", container: ".ob-button-fixed input[type='submit']",
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
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [

                    ]
                },
                {
                    type: "button", container: ".ob-button-fixed input[type='submit']",
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
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [

                    ]
                },
                {
                    type: "button", container: ".ob-button-fixed input[type='submit']",
                    value: [

                    ]
                }
            ]
        },
        // Шаблон
        {
            statuses: ["Новый ЗАКАЗ"],
            actions: [
                {
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"],
                    text: [

                    ]
                },
                {
                    type: "button", container: ".ob-button-fixed input[type='submit']",
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

    function disconnectFieldObservers() {
        fieldObservers.forEach(obs => obs.disconnect());
        fieldObservers = [];
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

        statusConfig.forEach(cfg => {
            if (!cfg.statuses.includes(status)) return;

            cfg.actions.forEach(rule => {
                if (rule.type === "text") {
                    const foundViews = findField(rule);
                    foundViews.forEach(view => view.style.display = "none");
                }
                else if (rule.type === "button") {
                    const values = Array.isArray(rule.value) ? rule.value : [rule.value];
                    document.querySelectorAll(rule.container).forEach(el => {
                        if (el.value && values.includes(el.value.trim())) {
                            el.style.display = "none";
                        }
                    });
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
                    console.log('Поточний статус:', status);
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

    let preView;
    let observer;

    function observePreview() {
        prepareObserver();
        observeObserver();
        update();
    }

    function prepareObserver() {
        preView = document.querySelector('#preView');
        if (!preView) return;

        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    update();
                }
            });
        });
    }

    function observeObserver() {
        if (observer && preView) {
            observer.observe(preView, { childList: true, subtree: true });
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

                const phone = rawPhone.replace(/[^\d+]/g, "");

                disconnectObserver();

                // Клонуємо caption, щоб прибрати старі слухачі
                const newPhoneLink = phoneLink.cloneNode(true);
                phoneLink.parentNode.replaceChild(newPhoneLink, phoneLink);

                // Навішуємо наш клік
                newPhoneLink.style.cursor = "pointer";
                newPhoneLink.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `callto:+${phone}`;
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
        if (document.querySelector('#preView')) {
            observePreview();
        } else {
            const waitForPreview = setInterval(function () {
                if (document.querySelector('#preView')) {
                    clearInterval(waitForPreview);
                    observePreview();
                }
            }, 500);
        }
    });
})();
