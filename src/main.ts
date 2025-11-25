import './scss/styles.scss';

import { MainPageCatalog } from './components/Models/MainPageCatalog';
import { Basket } from './components/Models/Basket';
import { BuyerData } from './components/Models/BuyerData';
import { CommunicationAPI } from './components/Models/CommunicationAPI';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// тестовые данные
import { apiProducts } from './utils/data';

// ----------------------------
// ТЕСТ КАТАЛОГА ТОВАРОВ
// ----------------------------

console.log('=== ТЕСТ: КАТАЛОГ ТОВАРОВ ===');

const catalog = new MainPageCatalog();

// сохраняем товары в модель
catalog.setProducts(apiProducts.items);

console.log('Массив товаров из каталога:', catalog.getProducts());

// выбираем первый товар
const firstId = apiProducts.items[0].id;

// сохраняем выбранный товар
catalog.setSelectedProduct(firstId);

console.log('Выбранный товар:', catalog.getSelectedProduct());
console.log('Получение товара по id:', catalog.getProductById(firstId));

// ----------------------------
// ТЕСТ КОРЗИНЫ
// ----------------------------

console.log('=== ТЕСТ: КОРЗИНА ===');

const basket = new Basket();

basket.add(apiProducts.items[0]);
basket.add(apiProducts.items[1]);

console.log('Товары в корзине:', basket.getItems());
console.log('Стоимость корзины:', basket.getTotalPrice());
console.log('Количество товаров:', basket.getCount());

basket.remove(apiProducts.items[0]);

console.log('Корзина после удаления:', basket.getItems());

basket.clear();

console.log('Корзина после очистки:', basket.getItems());

// ----------------------------
// ТЕСТ ПОКУПАТЕЛЯ
// ----------------------------

console.log('=== ТЕСТ: ПОКУПАТЕЛЬ ===');

const buyer = new BuyerData();

// вводим часть данных покупателя, чтобы получить ошибки по валидации
buyer.setData({ payment: 'cash' });
buyer.setData({ address: 'Москва, ул. Петровка, 38' });

console.log('Данные покупателя:', buyer.getData());

// Проверяем валидацию (должны быть ошибки по payment и email)
console.log('Результат валидации:', buyer.validate());

buyer.clear();

console.log('После очистки:', buyer.getData());

// ----------------------------
// ЗАПРОС К СЕРВЕРУ
// ----------------------------

console.log('=== ЗАПРОС К СЕРВЕРУ ===');

const server = new CommunicationAPI(
	new Api(API_URL, {
		headers: { 'Content-Type': 'application/json' },
	})
);

server
	.getProducts()
	.then((data) => {
		console.log('Каталог с сервера:', data.items);

		// используем существующий catalog
		catalog.setProducts(data.items);

		console.log('Каталог в модели:', catalog.getProducts());
	})
	.catch((err) => {
		console.error('Ошибка при запросе каталога:', err);
	});
