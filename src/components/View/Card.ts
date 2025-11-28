import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';

export class Card<T = unknown> extends Component<T> {
	protected _element: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		// клонируем содержимое шаблона
		const root = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
		super(root);

		this._element = root;
		this._title = this._element.querySelector('.card__title')!;
		this._price = this._element.querySelector('.card__price')!;
		this._image = this._element.querySelector('.card__image')!;
		this._category = this._element.querySelector('.card__category')!;
		this._button = this._element.querySelector('.card__button') || undefined;
	}

	// Корневой DOM-элемент карточки
	public getElement(): HTMLElement {
		return this._element;
	}

	public setTitle(title: string): void {
		this._title.textContent = title;
	}

	public setPrice(price: number | null): void {
		this._price.textContent =
			price === null ? 'Бесценно' : `${price} синапсов`;
	}

	// Не переопределяем Component.setImage,
	// а делаем свой удобный метод-обёртку
	public setCardImage(src: string, alt = ''): void {
		this.setImage(this._image, src, alt); // вызываем protected метод базового класса
	}

	public setCategory(category: keyof typeof categoryMap): void {
	this._category.textContent = category;

	const modifier = categoryMap[category];
	if (modifier) {
		this._category.className = `card__category ${modifier}`;
	}
}

	public setButtonText(text: string): void {
		if (this._button) {
			this._button.textContent = text;
		}
	}

	public setButtonDisabled(disabled: boolean): void {
		if (this._button) {
			this._button.disabled = disabled;
		}
	}
}
