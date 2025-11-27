import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class SuccessView extends Component<{}> {
	private _description: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: EventEmitter) {
		super(template.content.firstElementChild!.cloneNode(true) as HTMLElement);

		this._description = this.container.querySelector('.success__description')!;
		this._button = this.container.querySelector('.success__button')!;

		this._button.addEventListener('click', () => {
			events.emit('success:close', {});
		});
	}

	setTotal(total: number) {
		this._description.textContent = `Списано ${total} синапсов`;
	}
}
