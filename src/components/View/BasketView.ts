import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class BasketView extends Component<{}> {
	private _list: HTMLElement;
	private _total: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		const root = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
		super(root);

		this._list = root.querySelector('.basket__list') as HTMLElement;
		this._total = root.querySelector('.basket__price') as HTMLElement;
		this._button = root.querySelector('.basket__button') as HTMLButtonElement;

		this._button.addEventListener('click', () => {
			events.emit('basket:checkout', {});
		});
	}

	public setItems(items: HTMLElement[]): void {
		this._list.replaceChildren(...items);
	}

	public setTotal(total: number): void {
		this._total.textContent = `${total} синапсов`;
	}

	/**
	 * Переключает состояние пустой/непустой корзины.
	 * Когда пустая:
	 *  - список пуст,
	 *  - кнопка "Оформить" задизейблена.
	 */
	public setEmpty(isEmpty: boolean): void {
		if (isEmpty) {
			this._list.replaceChildren();
		}
		this._button.disabled = isEmpty;
	}
}
