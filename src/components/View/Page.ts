import { Component } from '../base/Component';

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