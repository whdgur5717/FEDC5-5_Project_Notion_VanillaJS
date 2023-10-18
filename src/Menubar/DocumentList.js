import List from './List/List.js'

export default function DocumentList({ target, state, onEvent }) {

  /* 보유한 문서들 리스트 */
  const docListElement = document.createElement('ul')
  docListElement.setAttribute('class', 'menubar_docList')
  target.appendChild(docListElement)

  /* 초기값 */
  this.state = state

  this.setState = (newState) => {
    this.state = newState
    docListElement.replaceChildren()
    this.render()
  }

  /* list 렌더링 */
  this.render = () => {
    this.state.forEach((list) => {
      const listElemet = new List({
        target: docListElement,
        state: list
      })
    })
  }
  this.render()

  /* Event */
  docListElement.addEventListener('click', (e) => {
    const targetElement = e.target.closest('li[data-id]')
    const { id } = targetElement.dataset
    const eventName = e.target.className


    /* Delete Event */
    if (eventName === 'menubar_docList_list_info_deleteButton') {
      onEvent({ id, delete: true })
    }

    /* insert Event */
    if (eventName === 'menubar_docList_list_info_insertButton') {
      onEvent({ id, insert: true })
    }

    /* Toggle Event */
    if (eventName === 'menubar_docList_list_info_checkbox') {
      const checkBoxElement = targetElement.querySelector('input')
      const display = targetElement.querySelector('ul')

      if (checkBoxElement.checked) {
        display.classList.add('toggleChecked')
      }

      if (!checkBoxElement.checked) {
        display.classList.remove('toggleChecked')
      }
      console.log(display)
    }
  })

}
