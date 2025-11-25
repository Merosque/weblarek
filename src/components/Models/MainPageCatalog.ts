// src/Models/MainPageCatalog.ts
import { IProduct } from '../../types';

export class MainPageCatalog {
	private products: IProduct[] = [];
	private selectedProduct: IProduct | null = null;

	constructor() {}

	// сохранение массива товаров, полученного в параметрах метода
	public setProducts(products: IProduct[]): void {
		this.products = [...products];

		// если выбранного товара больше нет в массиве — сбрасываем выбор
	if (this.selectedProduct) {
		const selectedId = this.selectedProduct.id;

		if (!this.products.find((p) => p.id === selectedId)) {
			this.selectedProduct = null;
		}
	}
  }

	// получение массива товаров из модели
	public getProducts(): IProduct[] {
		return [...this.products];
	}

	// получение одного товара по его id
	public getProductById(id: string): IProduct | undefined {
		return this.products.find((product) => product.id === id);
	}

	// сохранение товара для подробного отображения (по id)
	public setSelectedProduct(productId: string | null): void {
		if (productId === null) {
			this.selectedProduct = null;
			return;
		}

		this.selectedProduct = this.getProductById(productId) ?? null;
	}

	// получение товара для подробного отображения
	public getSelectedProduct(): IProduct | null {
		return this.selectedProduct;
	}
}
