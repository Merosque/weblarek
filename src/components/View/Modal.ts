import { Component } from '../base/Component';

export class Modal extends Component<{}> {
	private _content: HTMLElement;
	private _close: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this._content = container.querySelector('.modal__content')!;
		this._close = container.querySelector('.modal__close')!;

		this._close.addEventListener('click', () => this.close());
		container.addEventListener('mousedown', (e) => {
			if (e.target === container) this.close();
		});
	}

	open(content: HTMLElement) {
		this.setContent(content);
		this.container.classList.add('modal_active');
		document.body.classList.add('locked');
	}

	close() {
		this.container.classList.remove('modal_active');
		document.body.classList.remove('locked');
	}

	setContent(content: HTMLElement) {
		this._content.replaceChildren(content);
	}
}
