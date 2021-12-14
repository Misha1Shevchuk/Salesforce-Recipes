import { LightningElement, track, api } from 'lwc';

export default class MultiSelectPicklist extends LightningElement {

    @api options = [];
    @api label = '';
    @api hidePills = false;
    @api disabled = 'false';
    @api variant; // Available options are 'label-hidden', 'label-inline'
<<<<<<< HEAD
=======
    @api errorMessage = 'Enter a value.';
>>>>>>> c187fad94122613eca5cd1966a352bd236bdc09d

    @track selectedValues = [];

    showDropdown = false;
    _clickOutsideHandler;

    connectedCallback() {
        this.validateOptions();
        this.updateFormElementClassList();
        this.updateSelectedValues(this.options);
    }

    validateOptions() {
        if (!Array.isArray(this.options)) {
            console.error('options value is: ', JSON.stringify(this.options));
            throw new Error(`options type is "${typeof this.options}" but must be "array"`);
        }
        for (let option of this.options) {
            if (!option.hasOwnProperty('label') || !option.hasOwnProperty('value')) {
                throw new Error('Each option must have both "label" and "value" property');
            }
        }
    }

    updateFormElementClassList() {
        this.classList.add("slds-form-element");
        if (this.variant === 'label-inline') {
            this.classList.add('slds-form-element_horizontal');
        }
    }

    updateSelectedValues(options) {
        this.selectedValues = [];

        for (let option of options) {
            if (option.selected) {
                this.selectedValues.push(option.value);
            }
        }
    }

    fetchSelectedValues() {
        this.updateSelectedValues(this.template.querySelectorAll('c-picklist-value'));
        this.refreshOriginalList();
    }

    refreshOriginalList() {
        const picklistValues = JSON.parse(JSON.stringify(this.options));

        for (const picklistValue of picklistValues) {
            picklistValue.selected = this.selectedValues.includes(picklistValue.value);
        }

        this.options = picklistValues;
    }

    handleShowDropdown() {
        if (this.isDisabled) {
            return;
        }
        if (this.showDropdown) {
            this.fetchSelectedValues();
        }
        this.showDropdown = !this.showDropdown;

        this.addClickOutsideListener();
    }

    handleHideDropdown() {
        if (this.showDropdown) {
            this.showDropdown = false;
            this.fetchSelectedValues();
            this.notifyParent();

            this.removeClickOutsideListener();
        }
    }

    closePill(event) {
        const selection = event.target.dataset.value;
        const pillIndex = this.selectedValues.indexOf(selection);
        this.selectedValues.splice(pillIndex, 1);

        this.refreshOriginalList();
        this.notifyParent();
    }

    addClickOutsideListener() {
        this._clickOutsideHandler = this.handleHideDropdown.bind(this);
        setTimeout(() => window.addEventListener('click', this._clickOutsideHandler));
    }

    removeClickOutsideListener() {
        window.removeEventListener('click', this._clickOutsideHandler);
    }

    notifyParent() {
        this.dispatchEvent(new CustomEvent('change', { detail: { selected: this.selectedValues } }));
    }

    normalizeBoolean(value) {
        return String(value).toLowerCase() == 'true';
    }

    get selectedMessage() {
        return this.selectedValues.length + ' values are selected';
    }

    get showPillsSection() {
        return this.hidePills || this.selectedValues.length > 0;
    }

    get isLabelHidden() {
        return this.variant === 'label-hidden';
    }

    get isDisabled() {
        return this.normalizeBoolean(this.disabled);
    }
}