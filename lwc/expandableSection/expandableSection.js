import { LightningElement, api } from 'lwc';

export default class ExpandableSection extends LightningElement {

    @api title;
    @api closed = false;

    connectedCallback() {
        this.classList.add('slds-section');
        if (!this.closed) {
            this.openSection();
        }
    }

    handleClick() {
        if (this.closed) {
            this.openSection();
        } else {
            this.closeSection();
        }
        this.dispatchEvent(new CustomEvent('change', {detail: {isClosed: this.closed}}));
    }

    openSection() {
        this.classList.add('slds-is-open');
        this.closed = false;
    }

    closeSection() {
        this.classList.remove('slds-is-open');
        this.closed = true;
    }

    get iconName() {
        return this.closed ? 'utility:chevronright' : 'utility:chevrondown';
    }
}