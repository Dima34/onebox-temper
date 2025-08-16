// ==UserScript==
// @name         BigMag CRM Helper
// @namespace    https://github.com/Dima34/onebox-temper/
// @version      1.3
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

(function() {
    'use strict';
    console.log("BigMag CRM Helper loaded");

    // JSON-конфіг: ключ = статус
    // значення = масив правил (рядки = селектори, об’єкти = пошук по caption)
    const statusConfig = {
        "Нове": [".some-class-1", ".some-class-2"],
        "В роботі": [".other-class"],
        "Отказ": [
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Уровень цен:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Кредитный брокер:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Коментар від менеджера в магазині:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Накладная доставки:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "E-mail:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Менеджер в магазине:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Источник:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Способ связи:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Джерело реклами:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Ответственный:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Instagram Профиль:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Бизнес-процесс:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Область:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Обмен:"
            }
        ],
        "Первый контакт": [
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Уровень цен:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Кредитный брокер:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Коментар від менеджера в магазині:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Накладная доставки:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "E-mail:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Менеджер в магазине:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Источник:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Способ связи:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Джерело реклами:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Ответственный:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Instagram Профиль:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Бизнес-процесс:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Область:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Обмен:"
            }
        ],
        "Новый ЗАКАЗ": [
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Уровень цен:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Кредитный брокер:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Коментар від менеджера в магазині:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Накладная доставки:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "E-mail:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Менеджер в магазине:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Источник:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Способ связи:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Джерело реклами:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Ответственный:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Instagram Профиль:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Бизнес-процесс:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Область:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Город UA:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Склад продажи:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Адрес:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Способ доставки:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Причина отказа:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Посилання на телеграм:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Отчество:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Дата покупки:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Способ оплаты:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Способ доставки:"
            },
            {
                type: "caption",
                container: ".ob-data-element",
                captionSelector: ".el-caption",
                text: "Обмен:"
            }

        ]
    };

    // Показати все перед повторним приховуванням
    function resetVisibility() {
        for (const key in statusConfig) {
            statusConfig[key].forEach(rule => {
                if (typeof rule === "string") {
                    document.querySelectorAll(rule).forEach(el => {
                        el.style.display = "";
                    });
                } else if (rule.type === "caption") {
                    document.querySelectorAll(rule.container).forEach(el => {
                        el.style.display = "";
                    });
                }
            });
        }
    }

    // Застосувати правила для статусу
    function applyStatusRules(status) {
        resetVisibility();

        if (!statusConfig[status]) return;

        statusConfig[status].forEach(rule => {
            if (typeof rule === "string") {
                // Простий селектор
                document.querySelectorAll(rule).forEach(el => {
                    el.style.display = "none";
                });
            } else if (rule.type === "caption") {
                // Пошук по caption
                document.querySelectorAll(rule.container).forEach(container => {
                    const captionEl = container.querySelector(rule.captionSelector);
                    if (captionEl && captionEl.innerText.trim() === rule.text.trim()) {
                        container.style.display = "none";
                    }
                });
            }
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

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    checkStatus();
                }
            });
        });

        observer.observe(preView, {
            childList: true,
            subtree: true
        });

        checkStatus();
    }

    // Запускаємо при завантаженні
    window.addEventListener('load', function() {
        if (document.querySelector('#preView')) {
            observePreview();
        } else {
            const waitForPreview = setInterval(function() {
                if (document.querySelector('#preView')) {
                    clearInterval(waitForPreview);
                    observePreview();
                }
            }, 500);
        }
    });

})();
