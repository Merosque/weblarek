import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerData {
	private payment: IBuyer['payment'] = ''; // изначально способ оплаты не выбран
	private address = '';
	private email = '';
	private phone = '';

	constructor(private events: IEvents) {}

	// Сохранение данных в модели (частичное обновление)
	public setData(data: Partial<IBuyer>): void {
		if (data.payment !== undefined) {
			this.payment = data.payment;
		}
		if (data.address !== undefined) {
			this.address = data.address;
		}
		if (data.email !== undefined) {
			this.email = data.email;
		}
		if (data.phone !== undefined) {
			this.phone = data.phone;
		}

		this.emitChanged();
	}

	// получение всех данных покупателя
	public getData(): IBuyer {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	// очистка данных покупателя
	public clear(): void {
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.emitChanged();
	}

	// валидация данных (режим all: возвращаем объект ошибок)
	public validate(): BuyerValidationErrors {
		const errors: BuyerValidationErrors = {};

		if (!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.address?.trim()) {
			errors.address = 'Введите адрес доставки';
		}

		if (!this.email?.trim()) {
			errors.email = 'Введите email';
		}

		if (!this.phone?.trim()) {
			errors.phone = 'Введите телефон';
		}

		return errors;
	}

	// ------- служебное --------
	private emitChanged(): void {
		this.events.emit('buyer:changed', this.getData());
	}
}
