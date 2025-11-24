import { IApi } from '../types';
import { IApiProductList, IOrderRequest, IOrderResponse } from '../types';

export class CommunicationAPI {
	private api: IApi;

	constructor(api: IApi) {
		this.api = api;
	}

	// Получить каталог товаров
	public async getProducts(): Promise<IApiProductList> {
		return this.api.get('/product/');
	}

	// Отправить заказ
	public async postOrder(data: IOrderRequest): Promise<IOrderResponse> {
		return this.api.post('/order/', data);
	}
}
