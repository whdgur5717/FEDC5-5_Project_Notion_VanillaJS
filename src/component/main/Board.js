import request from "../../api.js";

export default class Board {

    constructor({ rootElement, onChangeTitle }) {
        this.onChangeTitle = onChangeTitle.bind(this);
        this.boardElement = document.createElement('div');
        this.titleEditorElement = document.createElement('h1');
        this.titleEditorElement.placeholder = "제목 없음";
        this.editorElement = document.createElement('form');
        this.editorElement.className = "textEditor";
        this.titleEditorElement.setAttribute("contenteditable", "true");
        this.editorElement.setAttribute("contenteditable", "true");
        rootElement.appendChild(this.boardElement);
        this.boardElement.appendChild(this.titleEditorElement);
        this.boardElement.appendChild(this.editorElement);

        this.titleEditorElement.addEventListener("keyup", (e) => {
            const titleTextContent = e.target.textContent.length > 0 ? e.target.textContent : "제목 없음";
            this.updateDocument(titleTextContent, this.editorElement.textHTML);
        });

        this.editorElement.addEventListener("keyup", (e) => {
            const textHTML = e.target.innerHTML;
            const findDiv = this.editorElement.querySelector('div');

            if (findDiv) {
                e.preventDefault();
                const newLine = document.createElement('br');
                this.editorElement.removeChild(findDiv);
                this.editorElement.appendChild(newLine);
            }
            this.convertHeadingTag(textHTML, e);
            this.updateDocument(this.titleEditorElement.textContent, textHTML);
        });
    }
    setDocuments(id) {
        this.id = id;
        this.loadDocument();
    }

    async loadDocument() {
        const { title, content } = await request(`/documents/${this.id}`, { method: `GET` });
        this.titleEditorElement.textContent = title;
        this.editorElement.innerHTML = content;
    }

    convertHeadingTag(textHTML, e) {
        const findH1 = textHTML.split("#&nbsp;");
        const findH2 = textHTML.split("##&nbsp;");
        const findH3 = textHTML.split("###&nbsp;");
        const findH4 = textHTML.split("####&nbsp;");
        const findHeadingTagArr = [findH1, findH2, findH3, findH4];

        findHeadingTagArr.map((item, index) => {
            if (item.length > 1) {
                e.target.innerHTML = item[0] + `<h${index + 1} id="cur">&nbsp;</h${index + 1}>`;
                const selection = window.getSelection();
                const range = document.createRange();
                const HeadingTag = document.getElementById('cur');
                range.selectNode(HeadingTag);
                HeadingTag.id = "";
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
    async updateDocument(title, content) {
        await request(`/documents/${this.id}`, {
            method: `PUT`,
            body: JSON.stringify({
                "title": title,
                "content": content
            })
        });
        if (this.title !== title) {
            this.title = title;
            this.onChangeTitle(this.id, title);
        }
    }
}