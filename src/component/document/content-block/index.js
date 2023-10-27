import { createElementWithClass } from '@util/dom';
import { parsedTagType } from '@util/tag';
import './style.scss';

const TYPE_CHANGE_CHARACTER = 'Space';
const PLACEHOLDER_NODE = '글자를 입력해주세요.';
const DELETE_CHARACTER = 'Backspace';
const ENTER_CHARACTER = 'Enter';

export default function ContentBlock({ $target, initialState }) {
	const $content = createElementWithClass(initialState.tagName ?? 'div', 'content-block');
	$content.setAttribute('contenteditable', true);
	$content.setAttribute('placeholder', PLACEHOLDER_NODE);
	$target.appendChild($content);
	this.getElement = () => $content;

	this.state = initialState;
	this.setState = (nextState) => {
		this.state = nextState;
		this.render();
	};

	this.render = () => {
		$content.innerHTML = `${this.state.innerText}`;

		$content.addEventListener('keyup', (e) => {
			this.handleKeyUpContentBlock(e);
		});
	};

	this.handleKeyUpContentBlock = (e) => {
		if (DELETE_CHARACTER === e.code && $content.innerHTML === PLACEHOLDER_NODE) {
			$target.removeChild($content);
			return;
		}

		if (ENTER_CHARACTER === e.code) {
			const text = e.target.innerHTML;
			const [previousText, nextText] = text.split('<div>');
			e.target.innerHTML = previousText;
			const init = {
				tagName: 'div',
				innerText: nextText.slice(0, -6),
			};
			const $newElement = new ContentBlock({ $target, initialState: init });
			$target.insertBefore($newElement.getElement(), $content.nextSibling);
			return;
		}

		if (TYPE_CHANGE_CHARACTER === e.code) {
			const tag = $content.innerHTML.split(' ')[0];
			const isParsedTag = tag in parsedTagType;
			const init = { tagName: parsedTagType[tag], innerText: $content.innerHTML.slice(tag.length).trim() };
			if (isParsedTag) {
				const $newContent = new ContentBlock({ $target, initialState: init });
				$target.replaceChild($newContent.getElement(), $content);
			}
		}
	};

	this.render();
}