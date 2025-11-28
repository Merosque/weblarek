import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class SuccessView extends Component<{}> {
	private _description: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);

		this._description = this.container.querySelector('.order-success__description')!;
		this._button = this.container.querySelector('.order-success__close')!;

		this._button.addEventListener('click', () => {
			events.emit('success:close', {});
		});
	}

	public setTotal(total: number) {
		this._description.textContent = `Списано ${total} синапсов`;
	}
}
