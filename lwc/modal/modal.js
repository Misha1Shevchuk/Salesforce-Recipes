import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {

    @api hideHeader = false;
    @api hideFooter = false;
    @api hideCrossButton = false;
    @api crossButtonInside = false;

    @api
    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    get buttonCssClass() {
        const defaultClass = 'slds-button slds-button_icon slds-modal__close slds-button_icon-inverse';
        return this.crossButtonInside ? `${defaultClass} close-button` : defaultClass;
    }
}