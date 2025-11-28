import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class Form<T> extends Component<T> {
	protected _form: HTMLFormElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLFormElement, protected readonly events: EventEmitter) {
		super(container);

		this._form = container;
		this._submitButton = this._form.querySelector('button[type="submit"]') as HTMLButtonElement;
		this._errors = this._form.querySelector('.form__errors') as HTMLElement;

		this._form.addEventListener('submit', (event) => {
			event.preventDefault();
			this.onSubmit(); // ❗ наследники решают, какое событие сгенерировать
		});
	}

	// Наследники обязаны реализовать логику сабмита (через events.emit)
	protected abstract onSubmit(): void;

	public setButtonDisabled(disabled: boolean): void {
		this._submitButton.disabled = disabled;
	}

	public setValid(isValid: boolean): void {
		this.setButtonDisabled(!isValid);
	}

	public setErrors(errors: Partial<Record<string, string>>): void {
		const messages = Object.values(errors).filter(Boolean);
		this._errors.textContent = messages.join(', ');
	}

	public clear(): void {
		this._form.reset();
		this._errors.textContent = '';
		this.setButtonDisabled(true);
	}
}
