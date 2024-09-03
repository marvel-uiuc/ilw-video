import { LitElement, html } from 'lit';
import styles from './ilw-video.styles'
import './ilw-video.css';
import UrlItem from './legacy/urlitem';

class Video extends LitElement {
    static get properties() {
        return {
            aspectratio: { type: String, attribute: true },
            height: { type: String, attribute: true },
            src: { type: String, attribute: true },
            title: { type: String, attribute: true },
            width: { type: String, attribute: true }
        };
    }

    static get styles() {
        return styles;
    }

    constructor() {
        super();
        this.aspectratio = '';
        this.height = '';
        this.src = undefined;
        this.title = '';
        this.width = '';
    }

    render() {
        const aspectOverride = this.aspectratio ? `--ilw-video--aspect-ratio: ${this.aspectratio}` : '';

        // check slot vs. src
        // if slot
        // get dimensions
        // override aspect, dimensions
        // return html
        // else if src
        // get src, title
        // generate embed
        // return html

        const dimensions = this.getIframeDimensions();
        this.height = this.height ? this.height : dimensions.height;
        this.width = this.width ? this.width : dimensions.width;

        return html`
            <div class="video">
                <div class="aspectratio" style="${aspectOverride} max-height: ${this.pixelate(this.height)}; max-width: ${this.pixelate(this.width)};">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    generateIframe(url, title, view) {
        console.warn(`Generating iframe for ${title}`);
        let urlHelper = new UrlItem.UrlItem(url, view);
        if (urlHelper.videoType == "youtube") {
            return html`<iframe title='${title} (video)' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${urlHelper.videoUrl}' frameborder='0' allowfullscreen></iframe>`;
        } else if (urlHelper.videoType == "mediaspace") {
            return html`<iframe title='${title} (video)' id='kaltura_player_${urlHelper.videoId}' class='kmsembed' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${urlHelper.videoUrl}' style='float: left; margin: 10px 10px 10px 0;' allowfullscreen webkitallowfullscreen mozAllowFullScreen allow='autoplay *; fullscreen *; encrypted-media *' frameborder='0'></iframe>`;
        } else if (urlHelper.videoType == "vimeo") {
            return html`<iframe title='${title} (video)' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${urlHelper.videoUrl}' frameborder='0' allowfullscreen></iframe>`;
        } else if (urlHelper.videoType == "blank") {
            return html`<div style='position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; color: white; display: flex; justify-content: center; align-items: center; font-weight: bold;'>${title}</div>`;
        } else {
            return '';
        }
    }

    getIframeDimensions() {
        const element = this.querySelector('iframe, embed, object');
        if (element === null) {
            throw 'ilw-video component missing iframe.'
        }

        const height = element?.getAttribute('height') ?? '100%';
        const width = element?.getAttribute('width') ?? '100%';

        const dimensions = {
            height: height,
            width: width,
        };

        return dimensions;
    }

    pixelate(dimension) {
        const pixelated = isNaN(dimension) ? dimension : dimension + 'px';
        return pixelated;
    }
}

customElements.define('ilw-video', Video);