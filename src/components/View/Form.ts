// src/components/View/Form.ts
import { Component } from '../base/Component';

export class Form<T = unknown> extends Component<T> {
	protected _form: HTMLFormElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		const root = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
		super(root);

		this._form = root;
		this._submitButton = this._form.querySelector(
			'.button'
		) as HTMLButtonElement;
		this._errors = this._form.querySelector(
			'.form__errors'
		) as HTMLElement;
	}

	public setButtonDisabled(disabled: boolean): void {
		this._submitButton.disabled = disabled;
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
