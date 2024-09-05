import { LitElement, html } from 'lit';
import styles from './ilw-video.styles'
import './ilw-video.css';
import UrlItem from './utilities/urlitem';
import AttributeUtils from './utilities/attribute-utils';

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
        const inlineAspect = this.aspectratio ? `--ilw-video--aspect-ratio: ${this.convertAspectRatio(this.aspectratio)}` : '';

        const embed = this.querySelector('iframe, embed, object');

        const dimensions = this.getIframeDimensions(embed);
        this.height = this.height ? this.height : dimensions.height;
        this.width = this.width ? this.width : dimensions.width;

        if (embed === null) {
            const iframe = this.generateIframe(this.src, this.title, this.view);

            return html`
                <div class="video">
                    <div class="aspectratio" style="${inlineAspect} max-height: ${AttributeUtils.pixelate(this.height)}; max-width: ${AttributeUtils.pixelate(this.width)};">
                        ${iframe}
                    </div>
                </div>
            `;
        }

        return html`
            <div class="video">
                <div class="aspectratio" style="${inlineAspect} max-height: ${AttributeUtils.pixelate(this.height)}; max-width: ${AttributeUtils.pixelate(this.width)};">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    convertAspectRatio(aspect) {
        switch (aspect) {
            case aspect === 'tv':
                console.warn('Legacy aspect ratio "tv" is deprecated. Converting to 16/9.');
                return '16/9';
            case aspect === 'vertical':
                console.warn('Legacy aspect ratio "vertical" is deprecated. Converting to 9/16.');
                return '9/16';
            default:
                return aspect;
        }
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

    getIframeDimensions(element) {
        const height = element?.getAttribute('height') ?? '100%';
        const width = element?.getAttribute('width') ?? '100%';

        const dimensions = {
            height: height,
            width: width,
        };

        return dimensions;
    }
}

customElements.define('ilw-video', Video);