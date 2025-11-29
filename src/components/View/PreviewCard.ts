import { Card } from './Card';
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class PreviewCard extends Card {
	private _description: HTMLElement;
	declare _button: HTMLButtonElement;
	private _events: EventEmitter;
	private _id: string | null = null;

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		// клонируем корень из шаблона
		super(template);

		this._events = events;

		this._description = this.container.querySelector('.card__text') as HTMLElement;
		this._button = this.container.querySelector('.card__button') as HTMLButtonElement;

		// Один раз вешаем обработчик на кнопку
		this._button.addEventListener('click', () => {
			if (!this._id) return;

			if (this._button.classList.contains('remove')) {
				this._events.emit('preview:remove-from-basket', { id: this._id });
			} else {
				this._events.emit('preview:add-to-basket', { id: this._id });
			}
		});
	}

	public setDescription(text: string): void {
		this._description.textContent = text;
	}

	/**
	 * Заполнить карточку данными товара и обновить состояние кнопки
	 */
	public setProduct(product: IProduct, inBasket: boolean, available: boolean): void {
		this._id = product.id;

		this.setTitle(product.title);
		this.setCategory(product.category as keyof typeof categoryMap);
		this.setDescription(product.description);
		this.setPrice(product.price);
		this.setCardImage(`${CDN_URL}${product.image}`, product.title);

		this.setInBasket(inBasket, available);
	}

	/**
	 * Обновляет кнопку в предпросмотре в зависимости от того,
	 * доступен ли товар и находится ли он в корзине
	 */
	public setInBasket(inBasket: boolean, available: boolean): void {
		if (!available) {
			this.setButtonDisabled(true);
			this.setButtonText('Недоступно');
			this._button.classList.remove('remove');
			return;
		}

		this.setButtonDisabled(false);

		if (inBasket) {
			this.setButtonText('Удалить из корзины');
			this._button.classList.add('remove');
		} else {
			this.setButtonText('В корзину');
			this._button.classList.remove('remove');
		}
	}
}