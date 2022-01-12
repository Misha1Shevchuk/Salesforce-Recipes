import { LightningElement } from 'lwc';

export default class DemoLookup extends LightningElement {
    
    handleLookupChange(event) {
        console.log('@@@ new value', JSON.stringify(event.detail.selectedRecord));
    }
}