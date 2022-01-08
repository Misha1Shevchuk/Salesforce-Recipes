import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {

    @api hideHeader = false;
    @api hideFooter = false;
    @api hideCrossButton = false;

    @api
    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}