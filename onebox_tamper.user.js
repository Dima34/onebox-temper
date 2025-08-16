// ==UserScript==
// @name         BigMag CRM Helper
// @namespace    https://github.com/Dima34/onebox-temper/
// @version      1.0
// @description  Додає корисні функції для CRM BigMag (crm.bigmag.ua)
// @author       Dima Vavilov
// @match        https://crm.bigmag.ua/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @icon         https://crm.bigmag.ua/favicon.ico
// @updateURL    https://raw.githubusercontent.com/ваш-нікнейм/bigmag-crm-tools/main/bigmag_crm_helper.user.js
// @downloadURL  https://raw.githubusercontent.com/ваш-нікнейм/bigmag-crm-tools/main/bigmag_crm_helper.user.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Стилі для додаткових елементів ---
    GM_addStyle(`
        .bigmag-helper-btn {
            background: #4CAF50;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
        }
        .bigmag-helper-btn:hover {
            background: #45a049;
        }
    `);

    // --- Додаємо кнопку в інтерфейс CRM ---
    function addHelperButton() {
        const toolbar = document.querySelector('.header') || document.body;
        if (!toolbar) return;

        const btn = document.createElement('button');
        btn.className = 'bigmag-helper-btn';
        btn.textContent = '📊 Експорт даних';
        btn.onclick = exportData;

        toolbar.prepend(btn);
    }

    // --- Експорт даних (приклад функції) ---
    function exportData() {
        const orders = [];
        // Приклад: збираємо всі замовлення зі сторінки
        document.querySelectorAll('.order-row').forEach(row => {
            const id = row.querySelector('.order-id').innerText;
            const sum = row.querySelector('.order-sum').innerText;
            orders.push({ id, sum });
        });

        const csv = orders.map(o => `${o.id},${o.sum}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `bigmag_orders_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();

        GM_notification({
            title: 'Експорт завершено',
            text: `Експортовано ${orders.length} замовлень`,
            timeout: 3000
        });
    }

    // --- Ініціалізація при завантаженні сторінки ---
    setTimeout(() => {
        addHelperButton();
        console.log('BigMag CRM Helper активовано!');
    }, 2000);

})();
