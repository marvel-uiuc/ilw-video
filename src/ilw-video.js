import { LitElement, html } from 'lit';
import styles from './ilw-video.styles'
import './ilw-video.css';

class Video extends LitElement {
    static get properties() {
        return {
            aspectRatio: { type: String, attribute: true }
        };
    }

    static get styles() {
        return styles;
    }

    constructor() {
        super();
        this.aspectRatio = '';
    }

    render() {
        return html`
            <div class="video">
                <div class="aspectRatio" ${this.aspectRatio ? 'style="--ilw-video--aspect-ratio(' + this.aspectRatio + ')"' : ''}>
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('ilw-video', Video);