import { LightningElement, api, wire } from 'lwc';
import findRecords from '@salesforce/apex/LookupController.findRecords';
import findDefaultRecord from '@salesforce/apex/LookupController.findDefaultRecord';

const CALLOUT_DELAY = 300;
const KEY_CODE_ARROW_DOWN = 40;
const KEY_CODE_ARROW_UP = 38;
const KEY_CODE_ESC = 27;
const KEY_CODE_ENTER = 13;

export default class Lookup extends LightningElement {

    @api label = 'Account';
    @api placeholder = 'Search...';
    @api iconName = 'standard:account';
    @api objectApiName = 'Account';
    @api fieldToQuery = 'Name';
    @api defaultRecordId = '';
    @api variant; // Available options are 'label-hidden'

    options = [];
    hasRecords = true;
    searchKey = '';
    showSpinner = false;
    selectedRecord = {};
    selectedOptionIndex;
    isDropdownVisible = false;

    _delayTimeout;
    _clickOutsideHandler;

    get isLabelHidden() {
        return this.variant === 'label-hidden';
    }

    connectedCallback() {
        this.addFormElementCssClass();
        this.fetchDefaultRecord();
    }

    disconnectedCallback() {
        this.removeClickOutsideListener();
    }

    @wire(findRecords, { searchKey: '$searchKey', sObjectApiName: '$objectApiName', fieldToQuery: '$fieldToQuery' })
    searchResult({ data, error }) {
        this.showSpinner = false;
        if (data) {
            this.options = JSON.parse(JSON.stringify(data));
            this.hasRecords = this.options.length > 0;
            this.selectedOptionIndex = null;
        } else if (error) {
            this.handleError(error);
        }
    }

    handleInputChange(event) {
        clearTimeout(this._delayTimeout);
        this.showSpinner = true;
        const searchKey = event.target.value;
        this._delayTimeout = setTimeout(() => this.searchKey = searchKey, CALLOUT_DELAY);
    }

    handleKeyDown(event) {
        const pressedKeyCode = event.keyCode;

        if (pressedKeyCode === KEY_CODE_ESC) {
            this.handleHideDropdown();
        } else if (pressedKeyCode === KEY_CODE_ARROW_DOWN) {
            this.selectNextItem();
        } else if (pressedKeyCode === KEY_CODE_ARROW_UP) {
            this.selectPrevItem();
        } else if (pressedKeyCode === KEY_CODE_ENTER && this.selectedOptionIndex != null) {
            this.selectedRecord = this.options[this.selectedOptionIndex];
            this.notifyParentAboutLookupUpdate(this.selectedRecord);
            this.handleHideDropdown();
        }
    }

    handleShowDropdown() {
        if (this.isDropdownVisible) return;
        this.addClickOutsideListener();
        this.isDropdownVisible = true;
    }

    handleHideDropdown() {
        if (!this.isDropdownVisible) return;
        this.removeClickOutsideListener();
        this.isDropdownVisible = false;
    }

    handleClearSelection() {
        this.searchKey = '';
        this.selectedRecord = {};
        this.notifyParentAboutLookupUpdate(null);
    }

    handleSelectedRecord(event) {
        const selectedRecordId = event.currentTarget.dataset.recordid;
        this.selectedRecord = this.options.find((data, index) => {
            const isCurrentRecordSelected = data.id === selectedRecordId;
            if (isCurrentRecordSelected) this.selectedOptionIndex = index;
            return isCurrentRecordSelected;
        });

        this.notifyParentAboutLookupUpdate(this.selectedRecord);
        this.handleHideDropdown();
    }

    addFormElementCssClass() {
        this.classList.add('slds-form-element');
    }

    async fetchDefaultRecord() {
        if (!this.defaultRecordId) return;
        try {
            const result = await findDefaultRecord({recordId: this.defaultRecordId, fieldToQuery: this.fieldToQuery});
            if (result) this.notifyParentAboutLookupUpdate(this.selectedRecord = result);
        } catch (error) {
           this.handleError(error);
        }
    }

    selectNextItem() {
        this.updateIndexOfNextAvailableSelection();
        this.selectNewOption();
    }

    selectPrevItem() {
        this.updateIndexOfPreviousAvailableSelection();
        this.selectNewOption();
    }

    updateIndexOfNextAvailableSelection() {
        const isNotLast = this.selectedOptionIndex != null && this.selectedOptionIndex < this.options.length - 1;
        this.selectedOptionIndex = isNotLast ? (this.selectedOptionIndex + 1) : 0;
    }

    updateIndexOfPreviousAvailableSelection() {
        this.selectedOptionIndex = (this.selectedOptionIndex || this.options.length) - 1;
    }

    selectNewOption() {
        const optionElements = this.template.querySelectorAll('[role="option"]');
        optionElements.forEach(elem => elem.classList.remove('slds-has-focus'));
        optionElements[this.selectedOptionIndex].classList.add('slds-has-focus');
    }

    notifyParentAboutLookupUpdate(selectedRecord) {
        this.dispatchEvent(new CustomEvent('change', { detail: { selectedRecord } }));
    }

    addClickOutsideListener() {
        this._clickOutsideHandler = this.handleHideDropdown.bind(this);
        setTimeout(() => window.addEventListener('click', this._clickOutsideHandler));
    }

    removeClickOutsideListener() {
        window.removeEventListener('click', this._clickOutsideHandler);
    }

    handleError(error) {
        console.error(error);
    }
}