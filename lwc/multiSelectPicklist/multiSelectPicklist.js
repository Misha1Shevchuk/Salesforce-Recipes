import {LightningElement, track, api} from 'lwc';

export default class MultiSelectPicklist extends LightningElement {

    @api options = [];
    @api label;
    @api hidePills = false;
    @api variant; // Use 'label-hidden' to hide label;

    @track selectedValues = [];
    showDropdown = false;
    _clickOutsideHandler;

    connectedCallback() {
        this.options.forEach(element => element.selected ? this.selectedValues.push(element.value) : '');
    }

    fetchSelectedValues() {
        this.selectedValues = [];

        this.template.querySelectorAll('c-picklist-value').forEach(picklistValue => {
            if (picklistValue.selected) {
                this.selectedValues.push(picklistValue.value);
            }
        });

        this.refreshOriginalList();
    }

    refreshOriginalList() {
        const picklistValues = this.options.map(eachvalue => ({...eachvalue}));

        picklistValues.forEach((element, index) => {
            picklistValues[index].selected = this.selectedValues.includes(element.value);
        });

        this.options = picklistValues;
    }

    handleShowDropdown() {
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
        const selectedPills = this.selectedValues;
        const pillIndex = selectedPills.indexOf(selection);
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
        this.dispatchEvent(new CustomEvent('change', {detail: {selected: this.selectedValues}}));
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
}