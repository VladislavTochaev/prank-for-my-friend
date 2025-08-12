class DragAndDrop {
  selectors = {
    root: '[data-js-dnd]',
    cat: '[data-js-dnd-cat]',
    modal: '[data-js-dnd-modal]',
  }

  stateClasses = {
    idDragging: 'is-dragging',
    isVisible: 'is-visible',
  }

  initialState = {
    offsetX: null,
    offsetY: null,
    isDragging: false,
    currentDraggingElement: null,
  }

  constructor() {
    this.catElement = document.querySelector(this.selectors.cat)
    this.modalElement = document.querySelector(this.selectors.modal)
    this.state = { ...this.initialState }
    this.bindEvents()
  }

  resetState() {
    this.state = { ...this.initialState }
  }

  onPointerDown(event) {
    const { target, x, y } = event
    const isDraggable = target.matches(this.selectors.root)

    if (!isDraggable) {
      return
    }

    target.classList.add(this.stateClasses.idDragging)

    const { left, top } = target.getBoundingClientRect()

    this.state = {
      offsetX: x - left,
      offsetY: y - top,
      isDragging: true,
      currentDraggingElement: target,
      checkStateModalElement: false,
    }
  }

  showModal() {
    this.modalElement.classList.add(this.stateClasses.isVisible)
  }

  hideModalOnSetTimeOut(ms = 2) {
    const second = ms * 1000

    setTimeout(() => {
        this.hideModal()
      }, second)
  }

  hideModal() {
    this.modalElement.classList.remove(this.stateClasses.isVisible)
  }

  checkCat(pageX, pageY) {
    if (!this.state.isDragging) {
      return
    }

    const { left, top } = this.catElement.getBoundingClientRect()
    const draggingElementOnStaticElement = pageX >= left && pageY >= top

    if (draggingElementOnStaticElement) {
      console.log('Yes')
      this.state.checkStateModalElement = true
      this.modalElement.textContent = 'Алес кайфует 😏'
      this.showModal()
      this.hideModalOnSetTimeOut()
    }

    if (this.state.checkStateModalElement) {
      if(!draggingElementOnStaticElement) {
        console.log('ahhh')
        this.modalElement.textContent = 'Алес расстроен 😭'
        this.showModal()
        this.hideModalOnSetTimeOut()
        this.state.checkStateModalElement = false
      }
    }
  }

  onPointerMove(event) {
    if (!this.state.isDragging) {
      return
    }

    const x = event.pageX - this.state.offsetX
    const y = event.pageY - this.state.offsetY

    this.state.currentDraggingElement.style.left = `${x}px`
    this.state.currentDraggingElement.style.top = `${y}px`

    this.checkCat(event.pageX, event.pageY)    
  }

  onPointerUp() {
    if (!this.state.isDragging) {
      return
    }

    this.state.currentDraggingElement.classList.remove(this.stateClasses.idDragging)
    this.resetState()
  }

  bindEvents() {
    document.addEventListener('pointerdown', (event) => this.onPointerDown(event))
    document.addEventListener('pointermove', (event) => this.onPointerMove(event))
    document.addEventListener('pointerup', () => this.onPointerUp())
  }
}

new DragAndDrop()