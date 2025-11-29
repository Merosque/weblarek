import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';


export class Page extends Component<{}> {
	private _gallery: HTMLElement;
	private _basketButton: HTMLButtonElement;
	private _basketCounter: HTMLElement;

	private events: EventEmitter;

	constructor(events: EventEmitter) {
		// корневой контейнер страницы.
		// В разметке обычно есть <body class="page"> или <div class="page">
		const container = ensureElement<HTMLElement>('.page');
		super(container);

		this.events = events;

		this._gallery = ensureElement<HTMLElement>('.gallery', this.container);
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.container
		);
		this._basketCounter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.container
		);

		// клик по иконке корзины — генерируем событие,
		// презентер слушает его и открывает модалку
		this._basketButton.addEventListener('click', () => {
			this.events.emit('ui:basket-open', {});
		});
	}

	/** Перерисовать каталог на главной странице */
	public renderCatalog(cards: HTMLElement[]): void {
		this._gallery.replaceChildren(...cards);
	}

	/** Обновить счётчик товаров в корзине в шапке */
	public setBasketCount(count: number): void {
		this._basketCounter.textContent = String(count);
	}
}
/*
export class Page extends Component<{}> {
	private _gallery: HTMLElement;
	private _basketButton: HTMLButtonElement;
	private _basketCounter: HTMLElement;
	private _wrapper: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._gallery = container.querySelector('.gallery')!;
		this._basketButton = container.querySelector('.header__basket')!;
		this._basketCounter = container.querySelector('.header__basket-counter')!;
		this._wrapper = container.querySelector('.page')!;
	}

	setCatalogContent(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	setBasketCounter(count: number) {
		this._basketCounter.textContent = String(count);
	}

	setLocked(locked: boolean) {
		this._wrapper.classList.toggle('page_locked', locked);
	}

	get basketButton() {
		return this._basketButton;
	}
}
	*/