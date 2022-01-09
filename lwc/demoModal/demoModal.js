import { LightningElement } from 'lwc';

export default class DemoModal extends LightningElement {

    displayModal = false;

    showModal() {
        this.displayModal = true;
    }

    hideModal() {
        this.displayModal = false;
    }
}