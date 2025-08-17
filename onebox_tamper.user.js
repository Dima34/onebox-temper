// ==UserScript==
// @name         BigMag CRM Helper
// @namespace    https://github.com/Dima34/onebox-temper/
// @version      1.6
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
            statuses: ["Отказ"],
            actions: [
                {
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"], text: [
                        "Уровень цен:",
                        "Кредитный брокер:",
                        "Коментар від менеджера в магазині:",
                        "Накладная доставки:",
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
                        "Посилання на телеграм:",
                        "Способ оплаты:"
                    ]
                },
                { type: "button", container: ".ob-button-fixed input[type='submit']", value: ["Тест НЕ НАЖИМАТЬ"] }
            ]
        },
        {
            statuses: ["Первый контакт", "Новый ЗАКАЗ"],
            actions: [
                {
                    type: "text", container: ".ob-data-element", captionSelector: [".el-caption"], text: [
                        "Уровень цен:",
                        "Кредитный брокер:",
                        "Коментар від менеджера в магазині:",
                        "Накладная доставки:",
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
                        "Заказ на Трейд", "Днепр самовывоз", "Харьков самовывоз"
                    ]
                }
            ]
        },
        {
            statuses: ["Новый ЗАКАЗ"],
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

    // Показати все перед повторним приховуванням
    function resetVisibility() {
        statusConfig.forEach(cfg => {
            cfg.actions.forEach(rule => {
                document.querySelectorAll(rule.container).forEach(el => el.style.display = "");
            });
        });
    }

    // Застосувати правила для статусу
    function applyStatusRules(status) {
        resetVisibility();

        statusConfig.forEach(cfg => {
            if (!cfg.statuses.includes(status)) return;

            cfg.actions.forEach(rule => {
                if (rule.type === "text") {
                    const texts = Array.isArray(rule.text) ? rule.text : [rule.text];
                    const selectors = Array.isArray(rule.captionSelector) ? rule.captionSelector : [rule.captionSelector];

                    document.querySelectorAll(rule.container).forEach(container => {
                        for (let sel of selectors) {
                            const captionEl = container.querySelector(sel);
                            if (captionEl && texts.includes(captionEl.innerText.trim())) {
                                container.style.display = "none";
                                break;
                            }
                        }
                    });

                } else if (rule.type === "button") {
                    const values = Array.isArray(rule.value) ? rule.value : [rule.value];
                    document.querySelectorAll(rule.container).forEach(el => {
                        if (el.value && values.includes(el.value.trim())) {
                            el.style.display = "none";
                        }
                    });
                }
            });
        });
    }

    // Функція для перевірки статусу
    function checkStatus() {
        const dataViews = document.querySelectorAll('.data-view');

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

    // Спостереження за #preView
    function observePreview() {
        const preView = document.querySelector('#preView');
        if (!preView) return;

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    checkStatus();
                }
            });
        });

        observer.observe(preView, { childList: true, subtree: true });
        checkStatus();
    }

    // Запускаємо при завантаженні
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
