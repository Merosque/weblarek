// src/components/View/OrderForm.ts
import { Form } from './Form';
import { EventEmitter } from '../base/Events';
import { TPayment } from '../../types';

export class OrderForm extends Form {
	private _paymentButtons: NodeListOf<HTMLButtonElement>;
	private _addressInput: HTMLInputElement;
	private _events: EventEmitter;
	private _payment: TPayment = '';

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template);
		this._events = events;

		this._paymentButtons = this.container.querySelectorAll(
			'.order__buttons .button'
		) as NodeListOf<HTMLButtonElement>;

		this._addressInput = this.container.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;

		// выбор оплаты
		this._paymentButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.handlePaymentClick(btn);
			});
		});

		// ввод адреса
		this._addressInput.addEventListener('input', () => {
			this._events.emit('order:change', {
				payment: this._payment,
				address: this._addressInput.value,
			});
		});

		// отправка формы — переход ко второму шагу
		this._form.addEventListener('submit', (event) => {
			event.preventDefault();
			this._events.emit('order:submit-step1', {
				payment: this._payment,
				address: this._addressInput.value,
			});
		});
	}

	private handlePaymentClick(btn: HTMLButtonElement): void {
		// В вёрстке name="card" / "cash", а в типе TPayment 'online' | 'cash' | ''
		const name = btn.getAttribute('name');
		this._payment = (name === 'card' ? 'online' : 'cash') as TPayment;

		this._paymentButtons.forEach((b) =>
			b.classList.toggle('button_alt-active', b === btn)
		);

		this._events.emit('order:change', {
			payment: this._payment,
			address: this._addressInput.value,
		});
	}

	public setPayment(payment: TPayment): void {
		this._payment = payment;
		this._paymentButtons.forEach((btn) => {
			const name = btn.getAttribute('name');
			const btnPayment = (name === 'card' ? 'online' : 'cash') as TPayment;
			btn.classList.toggle('button_alt-active', btnPayment === payment);
		});
	}

	public setAddress(address: string): void {
		this._addressInput.value = address;
	}
}
