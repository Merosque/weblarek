// src/components/View/ContactsForm.ts
import { Form } from './Form';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends Form {
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;
	private _events: EventEmitter;

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template);
		this._events = events;

		this._emailInput = this.container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;

		this._phoneInput = this.container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		// любое изменение полей
		const onChange = () => {
			this._events.emit('contacts:change', {
				email: this._emailInput.value,
				phone: this._phoneInput.value,
			});
		};

		this._emailInput.addEventListener('input', onChange);
		this._phoneInput.addEventListener('input', onChange);

		// отправка формы — шаг 2 оформления
		this._form.addEventListener('submit', (event) => {
			event.preventDefault();
			this._events.emit('order:submit-step2', {
				email: this._emailInput.value,
				phone: this._phoneInput.value,
			});
		});
	}

	public setEmail(email: string): void {
		this._emailInput.value = email;
	}

	public setPhone(phone: string): void {
		this._phoneInput.value = phone;
	}
}
