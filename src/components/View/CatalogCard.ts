import { Card } from './Card';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends Card {
	constructor(template: HTMLTemplateElement, events: EventEmitter, productId: string) {
		super(template);

		this._element.addEventListener('click', () => {
			events.emit('card:select', { id: productId });
		});
	}

	setInBasket(inBasket: boolean) {
		// Каталог НЕ содержит кнопки, но может визуально подсвечивать товар
		this._element.classList.toggle('card_in-basket', inBasket);
	}
}
