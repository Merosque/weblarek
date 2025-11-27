// src/components/View/BasketItemCard.ts
import { Card } from './Card';
import { EventEmitter } from '../base/Events';

export class BasketItemCard extends Card {
	private _index: HTMLElement;
	private _events: EventEmitter;
	private _id: string;

	constructor(
		template: HTMLTemplateElement,
		events: EventEmitter,
		productId: string
	) {
		super(template);

		this._events = events;
		this._id = productId;

		this._index = this.getElement().querySelector(
			'.basket__item-index'
		) as HTMLElement;

		const button = this._button;
		if (!button) {
			throw new Error(
				'BasketItemCard template must contain .card__button element'
			);
		}

		button.addEventListener('click', () => {
			this._events.emit('basket:remove-item', { id: this._id });
		});
	}

	public setIndex(index: number): void {
		this._index.textContent = String(index);
	}
}
