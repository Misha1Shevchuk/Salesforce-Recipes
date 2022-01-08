import { LightningElement } from 'lwc';

export default class ExpandableSection extends LightningElement {

    handleSectionChange(e) {
        console.log('@@@ handleSectionChange() :', JSON.stringify(e.detail, null, 2));
    }
}