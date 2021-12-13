import {LightningElement, api} from 'lwc';

export default class PicklistValue extends LightningElement {

    @api selected = false;
    @api label;
    @api value;

    handleSelect(event) {
        event.stopPropagation();
        this.selected = !this.selected;
    }
}