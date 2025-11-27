// src/components/Models/MainPageCatalog.ts
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class MainPageCatalog {
	private products: IProduct[] = [];
	private selectedProduct: IProduct | null = null;

	constructor(private events: IEvents) {}

	// сохранение массива товаров, полученного в параметрах метода
	public setProducts(products: IProduct[]): void {
		this.products = [...products];

		// если выбранного товара больше нет в массиве — сбрасываем выбор
		if (
			this.selectedProduct &&
			!this.products.find((p) => p.id === this.selectedProduct!.id)
		) {
			this.selectedProduct = null;
			this.emitSelectedChanged();
		}

		this.events.emit('catalog:changed', {
			products: this.getProducts(),
		});
	}

	// получение массива товаров из модели
	public getProducts(): IProduct[] {
		return [...this.products];
	}

	// получение одного товара по его id
	public getProductById(id: string): IProduct | undefined {
		return this.products.find((p) => p.id === id);
	}

	// сохранение товара для подробного отображения
	public setSelectedProduct(productId: string | null): void {
		if (productId === null) {
			this.selectedProduct = null;
			this.emitSelectedChanged();
			return;
		}

		const product = this.getProductById(productId) ?? null;

		// если выбор не изменился — лишний раз событие не шлём
		if (this.selectedProduct?.id === product?.id) {
			return;
		}

		this.selectedProduct = product;
		this.emitSelectedChanged();
	}

	// получение товара для подробного отображения
	public getSelectedProduct(): IProduct | null {
		return this.selectedProduct;
	}

	// ------- служебное --------
	private emitSelectedChanged(): void {
		this.events.emit('preview:changed', {
			product: this.selectedProduct,
		});
	}
}
