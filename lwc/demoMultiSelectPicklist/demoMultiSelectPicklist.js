import {LightningElement, wire} from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

export default class DemoMultiSelectPicklist extends LightningElement {

    @wire(getObjectInfo, {objectApiName: CASE_OBJECT}) caseInfo;
    @wire(getPicklistValues, {recordTypeId: '$caseInfo.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD}) 
    statusOptions;

    handleChange(e) {
        console.log('@@@ selected: ', JSON.stringify(e.detail.selected));
    }
}