import {LightningElement, wire} from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

export default class SandboxComponent extends LightningElement {

    displayModal = false;

    lookupOptions = [
        {recordId: '1', iconName: 'standard:account', title: 'Burlington Textiles Corp of America', subtitle: 'Account• Burlington, NC'},
        {recordId: '2', iconName: 'standard:contact', title: 'Boston Textiles Corp of America', subtitle: 'Account• Boston, NC'},
        {recordId: '3', iconName: 'standard:case', title: 'Dallas Textiles Corp of America', subtitle: 'Account• Dallas, NC'}
    ];

    @wire(getObjectInfo, {objectApiName: CASE_OBJECT}) caseInfo;
    @wire(getPicklistValues, {recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD}) 
    statusOptions;

    handleChange(e) {
        console.log('@@@ selected: ', JSON.stringify(e.detail.selected));
    }

    handleSectionChange(e) {
        console.log('@@@ handleSectionChange() :', JSON.stringify(e.detail, null, 2));
    }

    showModal() {
        this.displayModal = true;
    }

    hideModal() {
        this.displayModal = false;
    }

    handleLookupSelect(event) {
        console.log(JSON.stringify(event.detail.selectedRecord));
    }
}