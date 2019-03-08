const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    height: 100%;
    width: 100%;
    max-width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 30px 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen-Sans',
      'Ubuntu', 'Cantarell', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  }

  .img {
    width: 100%;
    margin-bottom: 15px;
  }

  .text-container {
    text-align: center;
    width: 100%
    padding: 0 20px;
    font-size: 30px;
  }

  .buttons-block {
    display: flex;
    justify-content: space-between;
  }

  .button {
    flex: 0.5;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="container">
  <img src="./assets/chuck-0.jpg" class="img" />
  <div class="text-container"></div>
  <div class="buttons-block">
    <div class="button refresh">
      refresh
    </div>
    <div class="button clipboard">
      to clipboard
    </div>
  </div>
</div>
`;

class RitChuck extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.joke = '';
    this.textContainer = this.shadowRoot.querySelector('.text-container');
    this.refreshButton = this.shadowRoot.querySelector('.refresh');
    this.clipboardButton = this.shadowRoot.querySelector('.clipboard');
    this.imageElement = this.shadowRoot.querySelector('.img');

    this.updateView();
    this.refreshButton.addEventListener('click', this.updateView.bind(this));
    this.clipboardButton.addEventListener(
      'click',
      this.copyTextToClipboard.bind(this)
    );
  }

  disconnectedCallback() {
    this.refreshButton.removeEventListener('click', this.updateView);
    this.clipboardButton.removeEventListener('click', this.copyTextToClipboard);
  }

  updateView() {
    this.getData().then(
      res => {
        this.joke = res.value.joke;
        this.textContainer.innerHTML = this.joke;
        this.imageElement.setAttribute(
          'src',
          `./assets/chuck-${Math.floor(Math.random() * 3)}.jpg`
        );
      },
      err => console.log(err)
    );
  }

  async getData() {
    const response = await fetch(
      'https://api.icndb.com/jokes/random?limitTo=[nerdy]'
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }

  copyTextToClipboard() {
    var textArea = document.createElement('textarea');
    textArea.value = this.joke;
    this.shadowRoot.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    this.shadowRoot.removeChild(textArea);
  }
}

customElements.define('web-chuck', RitChuck);
