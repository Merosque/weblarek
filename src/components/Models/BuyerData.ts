import { IBuyer } from '../../types';

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerData {
	private payment: IBuyer['payment'] = 'online';
	private address = '';
	private email = '';
	private phone = '';

	constructor() {}

	// Сохранение данных в модели
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
	}

	// Получение всех данных покупателя
	public getData(): IBuyer {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	// Очистка данных покупателя
	public clear(): void {
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
	}

	// Валидация
	public validate(): BuyerValidationErrors {
		const errors: BuyerValidationErrors = {};

		if (!this.payment?.trim()) {
			errors.payment = 'Выберите способ оплаты: card или cash';
		}

		if (!this.address.trim()) {
			errors.address = 'Введите адрес доставки';
		}

		if (!this.email.trim()) {
			errors.email = 'Введите email';
		}

		if (!this.phone.trim()) {
			errors.phone = 'Введите телефон';
		}

		return errors;
	}
}
