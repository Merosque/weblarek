// src/components/Models/Basket.ts
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
	private items: IProduct[] = [];

	constructor(private events: IEvents) {}

	// получение массива товаров в корзине
	public getItems(): IProduct[] {
		return [...this.items];
	}

	// добавление товара, который был получен в параметре, в массив корзины
	public add(product: IProduct): void {
		this.items.push(product);
		this.emitChanged();
	}

	// удаление товара, полученного в параметре, из массива корзины
	public remove(product: IProduct): void {
		this.items = this.items.filter((item) => item.id !== product.id);
		this.emitChanged();
	}

	// очистка корзины
	public clear(): void {
		if (this.items.length === 0) return;
		this.items = [];
		this.emitChanged();
	}

	// получение стоимости всех товаров в корзине
	public getTotalPrice(): number {
		return this.items.reduce(
			(sum, item) => sum + (item.price ?? 0),
			0
		);
	}

	// получение количества товаров в корзине
	public getCount(): number {
		return this.items.length;
	}

	// проверка наличия товара в корзине по его id
	public hasProduct(productId: string): boolean {
		return this.items.some((item) => item.id === productId);
	}

	// вспомогательный метод: ids товаров (для /order)
	public getItemIds(): string[] {
		return this.items.map((item) => item.id);
	}

	// ------- служебное --------
	private emitChanged(): void {
		this.events.emit('basket:changed', {
			items: this.getItems(),
			total: this.getTotalPrice(),
			count: this.getCount(),
		});
	}
}
