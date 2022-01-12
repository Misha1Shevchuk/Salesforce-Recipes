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

    options = [];
    hasRecords = true;
    searchKey = '';
    showSpinner = false;
    selectedRecord = {};
    selectedOptionIndex;
    isDropdownVisible = false;

    _delayTimeout;
    _clickOutsideHandler;

    connectedCallback() {
        this.classList.add('slds-form-element');
        if (this.defaultRecordId) {
            this.fetchRecordById(this.defaultRecordId);
        }
    }

    @wire(findRecords, { searchKey: '$searchKey', sObjectApiName: '$objectApiName', fieldToQuery: '$fieldToQuery' })
    searchResult({ data, error }) {
        this.showSpinner = false;
        if (data) {
            this.options = JSON.parse(JSON.stringify(data));
            this.hasRecords = this.options.length > 0;
            this.selectedOptionIndex = null;
        } else if (error) {
            console.error(error);
        }
    };

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
        if (!this.isDropdownVisible) {
            this.isDropdownVisible = true;
            this.addClickOutsideListener();
        }
    }

    handleHideDropdown() {
        if (this.isDropdownVisible) {
            this.isDropdownVisible = false;
            this.removeClickOutsideListener();
        }
    }

    handleRemove() {
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

    async fetchRecordById(recordId) {
        try {
            const result = await findDefaultRecord({recordId, fieldToQuery: this.fieldToQuery});
            if (result) this.notifyParentAboutLookupUpdate(this.selectedRecord = result);
        } catch (error) {
            console.error(error);
        }
    }

    selectNextItem() {
        this.template.querySelector('[role="option"]').focus();
        const optionElements = this.template.querySelectorAll('[role="option"]');
        if (optionElements.length) {
            optionElements.forEach(elem => elem.classList.remove('slds-has-focus'));

            let indexToSelect = 0;
            if (this.selectedOptionIndex != null && this.selectedOptionIndex < optionElements.length - 1) {
                indexToSelect = this.selectedOptionIndex + 1;
            }
    
            optionElements[indexToSelect].classList.add('slds-has-focus');
            this.selectedOptionIndex = indexToSelect;
        }
    }

    selectPrevItem() {
        const optionElements = this.template.querySelectorAll('[role="option"]');
        if (optionElements.length) {
            optionElements.forEach(elem => elem.classList.remove('slds-has-focus'));

            this.selectedOptionIndex = (this.selectedOptionIndex || optionElements.length) - 1;
            optionElements[this.selectedOptionIndex].classList.add('slds-has-focus');
        }
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
}