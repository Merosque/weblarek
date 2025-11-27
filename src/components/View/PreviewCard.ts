// src/components/View/PreviewCard.ts
import { Card } from './Card';
import { EventEmitter } from '../base/Events';

export class PreviewCard extends Card {
	private _description: HTMLElement;
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

		this._description = this.getElement().querySelector(
			'.card__text'
		) as HTMLElement;

		// Кнопка в шаблоне предпросмотра обязательно должна быть, сохраним её в локальную константу button
		const button = this._button;
		if (!button) {
			throw new Error(
				'PreviewCard template must contain .card__button element'
			);
		}

		button.addEventListener('click', () => {
			if (button.classList.contains('remove')) {
				this._events.emit('preview:remove-from-basket', {
					id: this._id,
				});
			} else {
				this._events.emit('preview:add-to-basket', {
					id: this._id,
				});
			}
		});
	}

	public setDescription(text: string): void {
		this._description.textContent = text;
	}

	/**
	 * Обновляет кнопку в предпросмотре в зависимости
	 * от того, доступен товар и находится ли он в корзине
	 */
	public setInBasket(inBasket: boolean, available: boolean): void {
		const button = this._button;
		if (!button) {
			return;
		}

		if (!available) {
			this.setButtonDisabled(true);
			this.setButtonText('Недоступно');
			button.classList.remove('remove');
			return;
		}

		this.setButtonDisabled(false);

		if (inBasket) {
			this.setButtonText('Удалить из корзины');
			button.classList.add('remove');
		} else {
			this.setButtonText('Купить');
			button.classList.remove('remove');
		}
	}
}
