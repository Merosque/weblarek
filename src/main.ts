// src/main.ts
import './scss/styles.scss';

import { MainPageCatalog } from './components/Models/MainPageCatalog';
import { Basket } from './components/Models/Basket';
import { BuyerData } from './components/Models/BuyerData';
import { CommunicationAPI } from './components/Models/CommunicationAPI';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';

// создаём единый брокер событий
const events = new EventEmitter();

// создаём модели данных с этим брокером
const catalog = new MainPageCatalog(events);
const basket = new Basket(events);
const buyer = new BuyerData(events);

// создаём коммуникационный слой
const server = new CommunicationAPI(
	new Api(API_URL, {
		headers: { 'Content-Type': 'application/json' },
	})
);

// получаем каталог товаров с сервера и сохраняем в модель
server
	.getProducts()
	.then((data) => {
		catalog.setProducts(data.items);
	})
	.catch((err) => {
		console.error('Ошибка при запросе каталога:', err);
	});
