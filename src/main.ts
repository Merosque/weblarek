import './scss/styles.scss';

import { MainPageCatalog } from './components/Models/MainPageCatalog';
import { Basket } from './components/Models/Basket';
import { BuyerData } from './components/Models/BuyerData';
import { CommunicationAPI } from './components/Models/CommunicationAPI';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { API_URL, categoryMap, CDN_URL } from './utils/constants';
import { IProduct } from './types';

// ===== View-компоненты =====

import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketItemCard } from './components/View/BasketItemCard';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { SuccessView } from './components/View/SuccessView';
import { Modal } from './components/View/Modal';

// Хелпер для получения шаблонов

function getTemplate(selector: string): HTMLTemplateElement {
	const template = document.querySelector<HTMLTemplateElement>(selector);
	if (!template) {
		throw new Error(`Template not found: ${selector}`);
	}
	return template;
}

// ===== Инициализация DOM-узлов =====

const gallery = document.querySelector<HTMLElement>('.gallery');
const headerBasketButton = document.querySelector<HTMLButtonElement>('.header__basket');
const headerBasketCounter = document.querySelector<HTMLElement>('.header__basket-counter');
const modalContainer = document.querySelector<HTMLElement>('#modal-container');

const catalogTemplate = getTemplate('#card-catalog');
const previewTemplate = getTemplate('#card-preview');
const basketItemTemplate = getTemplate('#card-basket');
const basketTemplate = getTemplate('#basket');
const orderTemplate = getTemplate('#order');
const contactsTemplate = getTemplate('#contacts');
const successTemplate = getTemplate('#success');

if (
	!gallery ||
	!headerBasketButton ||
	!headerBasketCounter ||
	!modalContainer ||
	!catalogTemplate ||
	!previewTemplate ||
	!basketItemTemplate ||
	!basketTemplate ||
	!orderTemplate ||
	!contactsTemplate ||
	!successTemplate
) {
	throw new Error('Не удалось найти один или несколько DOM-элементов для инициализации приложения');
}

// ===== Ядро событий и моделей =====

const events = new EventEmitter();

// модели данных
const catalog = new MainPageCatalog(events);
const basket = new Basket(events);
const buyer = new BuyerData(events);

// API и слой коммуникации
const apiClient = new Api(API_URL, {
	headers: { 'Content-Type': 'application/json' },
});

const server = new CommunicationAPI(apiClient);

// ===== View-компоненты =====

const modal = new Modal(modalContainer);
const basketView = new BasketView(basketTemplate, events);
const orderForm = new OrderForm(orderTemplate, events);
const contactsForm = new ContactsForm(contactsTemplate, events);
const successView = new SuccessView(successTemplate, events);

// ===== Вспомогательные функции =====

/**
 * Создать карточку каталога по товару
 */
function createCatalogCard(product: IProduct): HTMLElement {
	const card = new CatalogCard(catalogTemplate, events, product.id);

	card.setTitle(product.title);
	card.setCategory(product.category as keyof typeof categoryMap);
	card.setPrice(product.price);
	card.setCardImage(`${CDN_URL}${product.image}`, product.title);

	return card.render();
}

/**
 * Создать карточку строки корзины
 */
function createBasketItem(product: IProduct, index: number): HTMLElement {
	const item = new BasketItemCard(basketItemTemplate, events, product.id);

	item.setIndex(index + 1);
	item.setTitle(product.title);
	item.setPrice(product.price);

	return item.render();
}

/**
 * Перерисовать корзину (короткий хелпер, вызывается при изменении модели)
 */
function renderBasket() {
	const items = basket.getItems();
	const total = basket.getTotalPrice();
	const count = basket.getCount();

	// список элементов
	const itemViews = items.map((product, index) => createBasketItem(product, index));
	basketView.setItems(itemViews);
	basketView.setTotal(total);
	basketView.setEmpty(count === 0);

	// счётчик на иконке корзины
	if (headerBasketCounter) {
			headerBasketCounter.textContent = String(count);
	}
}

/**
 * Открыть модальное окно с корзиной
 */
function openBasketModal() {
	renderBasket();
	modal.open(basketView.render());
}

/**
 * Открыть модальное окно с первым шагом оформления
 */
function openOrderStep1() {
	// подставим уже введённые ранее данные (если есть)
	const data = buyer.getData();
	orderForm.setPayment(data.payment);
	orderForm.setAddress(data.address);

	// ошибки и валидность
	const errors = buyer.validate();
	orderForm.setErrors({
		payment: errors.payment,
		address: errors.address,
	});
	orderForm.setValid(!errors.payment && !errors.address);

	modal.open(orderForm.render());
}

/**
 * Открыть второй шаг оформления заказа
 */
function openOrderStep2() {
	const data = buyer.getData();
	contactsForm.setEmail(data.email);
	contactsForm.setPhone(data.phone);

	const errors = buyer.validate();
	contactsForm.setErrors({
		email: errors.email,
		phone: errors.phone,
	});
	contactsForm.setValid(!errors.email && !errors.phone);

	modal.open(contactsForm.render());
}

/**
 * Открыть окно успешной оплаты
 */
function openSuccessModal(total: number) {
	successView.setTotal(total);
	modal.open(successView.render());
}

// ===== Обработка событий моделей =====

// 1. Каталог товаров изменился
events.on<{ products: IProduct[] }>('catalog:changed', ({ products }) => {
	const cards = products.map(createCatalogCard);
	gallery.replaceChildren(...cards);
});

// 2. Выбранный товар для предпросмотра изменился
events.on<{ product: IProduct | null }>('preview:changed', ({ product }) => {
	if (!product) {
		modal.close();
		return;
	}

	const preview = new PreviewCard(previewTemplate, events, product.id);
	preview.setTitle(product.title);
	preview.setCategory(product.category as keyof typeof categoryMap);
	preview.setDescription(product.description);
	preview.setPrice(product.price);
	preview.setCardImage(`${CDN_URL}${product.image}`, product.title);

	// кнопка "В корзину"/"Удалить из корзины"
	const inBasket = basket.hasProduct(product.id);
	// товар считается доступным, если у него есть цена
  const available = product.price !== null;

	preview.setInBasket(inBasket, available);

	modal.open(preview.render());
});

// 3. Корзина изменилась
events.on('basket:changed', () => {
	renderBasket();
});

// 4. Данные покупателя изменились (для живой валидации форм можно будет использовать)
events.on('buyer:changed', () => {
	// пока ничего не делаем, всё обновляется при открытии форм
});

// ===== Обработка событий View =====

// Клик по карточке в каталоге -> выбираем товар для предпросмотра
events.on<{ id: string }>('card:select', ({ id }) => {
	catalog.setSelectedProduct(id);
});

// Кнопка "В корзину" в предпросмотре
events.on<{ id: string }>('preview:add-to-basket', ({ id }) => {
	const product = catalog.getProductById(id);
	if (product) {
		basket.add(product);
	}
	modal.close();
});

// Кнопка "Удалить из корзины" в предпросмотре
events.on<{ id: string }>('preview:remove-from-basket', ({ id }) => {
	const product = catalog.getProductById(id);
	if (product) {
		basket.remove(product);
	}
	modal.close();
});

// Кнопка удаления строки в корзине
events.on<{ id: string }>('basket:remove-item', ({ id }) => {
	const product = basket.getItems().find((p) => p.id === id);
	if (product) {
		basket.remove(product);
	}
});

// Кнопка "Оформить" в корзине
events.on('basket:checkout', () => {
	if (basket.getCount() === 0) {
		return;
	}
	openOrderStep1();
});

// Сабмит первой формы (оплата + адрес)
events.on<{ payment: string; address: string }>('order:submit-step1', (data) => {
	// сохраняем в модель
	buyer.setData({
		payment: data.payment as 'online' | 'cash' | '',
		address: data.address,
	});

	// валидируем все данные
	const errors = buyer.validate();

	orderForm.setErrors({
		payment: errors.payment,
		address: errors.address,
	});

	// форма валидна, если нет ошибок по оплате и адресу
	orderForm.setValid(!errors.payment && !errors.address);
	
	openOrderStep2();
});

// Живая валидация первой формы (оплата + адрес)
events.on<{ payment: string; address: string }>('order:change', (data) => {
	// сохраняем в модель только то, что относится к шагу 1
	buyer.setData({
		payment: data.payment  as 'online' | 'cash' | '',
		address: data.address,
	});

	// валидируем все данные
	const errors = buyer.validate();

	// ошибки только для этой формы
	orderForm.setErrors({
		payment: errors.payment,
		address: errors.address,
	});

	// форма валидна, если нет ошибок по оплате и адресу
	orderForm.setValid(!errors.payment && !errors.address);
});


// Сабмит второй формы (email + телефон)
events.on<{ email: string; phone: string }>('order:submit-step2', (data) => {
	buyer.setData({
		email: data.email,
		phone: data.phone,
	});

	const errors = buyer.validate();

	if (errors.email || errors.phone) {
		contactsForm.setErrors({
			email: errors.email,
			phone: errors.phone,
		});
		contactsForm.setValid(false);
		return;
	}

	// Собираем данные заказа
	const orderRequest = {
		...buyer.getData(),
		total: basket.getTotalPrice(),
		items: basket.getItemIds(),
	};

	// Отправляем заказ на сервер
	server
		.postOrder(orderRequest)
		.then((response) => {
			// успешная оплата
			openSuccessModal(response.total);

			// очищаем корзину и данные покупателя
			basket.clear();
			buyer.clear();
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});
});

// Живая валидация второй формы (email + телефон)
events.on<{ email: string; phone: string }>('contacts:change', (data) => {
	// сохраняем в модель только то, что относится к шагу 2
	buyer.setData({
		email: data.email,
		phone: data.phone,
	});

	// валидируем все данные
	const errors = buyer.validate();

	// ПЕРЕДАЁМ ИМЕННО ОШИБКИ!
	contactsForm.setErrors({
		email: errors.email,
		phone: errors.phone,
	});

	contactsForm.setValid(!errors.email && !errors.phone);
});


// Закрытие "успешной оплаты"
events.on('success:close', () => {
	modal.close();
});

// Клик по иконке корзины в шапке
headerBasketButton.addEventListener('click', () => {
	openBasketModal();
});

// ===== Старт приложения: получаем каталог с сервера =====

server
	.getProducts()
	.then((data) => {
		catalog.setProducts(data.items);
	})
	.catch((err) => {
		console.error('Ошибка при запросе каталога:', err);
	});


	// ТЕСТЫ

	server
	.getProducts()
	.then((data) => {
		// временная проверка: рисуем каталог без MVP-событий
		const cards = data.items.map((product) => createCatalogCard(product));
		gallery.replaceChildren(...cards);

		catalog.setProducts(data.items);
	})
	.catch((err) => {
		console.error('Ошибка при запросе каталога:', err);
	});
