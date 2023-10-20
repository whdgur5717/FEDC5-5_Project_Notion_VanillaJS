export default function DocumentList({ $target, initialState }) {
	const $nav = document.createElement('nav');
	const $ul = document.createElement('ul');

	$target.appendChild($nav);

	this.state = initialState;

	this.setState = (nextState) => {
		this.state = nextState;
		this.render();
	};

	this.stateRecursion = (documentsArray, $parentElement) => {
		const $ul = document.createElement('ul');
		documentsArray.sort((a, b) => {
			a.createdAt - b.createdAt;
		});

		documentsArray.forEach(({ id, title, documents }) => {
			const $li = document.createElement('li');

			$li.setAttribute('data-id', id);
			$li.innerHTML = `
			<span>${title ? title : EMPTY_TITLE}<span>
			`;

			if (documents.length) this.stateRecursion(documents, $li);
			$ul.appendChild($li);
		});
		$parentElement.appendChild($ul);
	};

	this.render = () => {
		this.stateRecursion(this.state, $ul);
		$nav.appendChild($ul);
	};
	this.render();
}