import { Form } from './Form';
import { EventEmitter } from '../base/Events';

interface IContactsFormState {
	email: string;
	phone: string;
}

export class ContactsForm extends Form<IContactsFormState> {
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		const form = template.content
			.querySelector('form')!
			.cloneNode(true) as HTMLFormElement;

		super(form, events);

		this._emailInput = this.container.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;

		this._phoneInput = this.container.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;

		const onChange = () => {
			this.events.emit('contacts:change', {
				email: this._emailInput.value,
				phone: this._phoneInput.value,
			});
		};

		this._emailInput.addEventListener('input', onChange);
		this._phoneInput.addEventListener('input', onChange);
	}

	protected onSubmit(): void {
		this.events.emit('order:submit-step2', {
			email: this._emailInput.value,
			phone: this._phoneInput.value,
		});
	}

	public setEmail(email: string): void {
		this._emailInput.value = email;
	}

	public setPhone(phone: string): void {
		this._phoneInput.value = phone;
	}
}
