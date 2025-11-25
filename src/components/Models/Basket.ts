import { IProduct } from '../../types';

export class Basket {
	private items: IProduct[] = [];

	constructor() {}

	// получение массива товаров в корзине
	public getItems(): IProduct[] {
		return [...this.items];
	}

	// добавление товара, который был получен в параметре, в массив корзины
	public add(product: IProduct): void {
		this.items.push(product);
	}

	// удаление товара, полученного в параметре, из массива корзины
	public remove(product: IProduct): void {
		this.items = this.items.filter((item) => item.id !== product.id);
	}

	// очистка корзины
	public clear(): void {
		this.items = [];
	}

	// получение стоимости всех товаров в корзине
	public getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
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
}
