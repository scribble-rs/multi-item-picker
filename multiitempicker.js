class MultiItemPicker extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.classList.add('multi-item-picker');

        const style = document.createElement("style")
        style.textContent = `
        .multi-item-picker {
            -moz-appearance: textfield;
            -webkit-appearance: textfield;
            display: flex;
            flex-direction: row;
            padding: 5px 0 5px 0;
        }

        .multi-item-picker-input {
            border: none;
            flex: 1;
        }

        .multi-item-picker-selected-items {
            display: flex;
            flex-direction: row;
            flex: 0;
        }

        .multi-item-picker-selected-item {
            background-color: lightgray;
            padding: 2px 10px 2px 10px;
            /* We don't want the items growing inside of the parent, as the text input should be the only growing components.*/
            flex: 0;
            /** Since each item has a button to unselect it, each item needs a horizontal layout (Text X-Button). */
            display: flex;
            flex-direction: row;
        }

        .multi-item-picker-selected-item + .multi-item-picker-selected-item {
            margin-left: 10px;
        }

        .multi-item-picker-selected-item-delete-button {
            margin-left: 5px;
            padding: 0;
        }
        `
        shadow.appendChild(style);

        const wrapper = document.createElement('div');
        wrapper.classList.add('multi-item-picker');
        shadow.appendChild(wrapper)

        const selectedItemsWrapper = document.createElement('div');
        selectedItemsWrapper.classList.add('multi-item-picker-selected-items');
        wrapper.appendChild(selectedItemsWrapper);

        const input = document.createElement('input');
        input.type = "text";
        input.classList.add('multi-item-picker-input');
        input.value = "test";

        const demoValues = ["abc", "def", "ghi"]

        input.addEventListener("input", function () {
            for (let i = 0; i < demoValues.length; i++) {
                let demoValue = demoValues[i];
                if (input.value === demoValue) {
                    const newSelectedItem = document.createElement("span");
                    newSelectedItem.classList.add("multi-item-picker-selected-item");
                    newSelectedItem.innerText = demoValue;
                    selectedItemsWrapper.appendChild(newSelectedItem);
                    input.value = "";
                    break;
                }
            }
        }, false)

        input.addEventListener("keydown", function (event) {
            if (input.value === "" && event.code === "Backspace" && selectedItemsWrapper.childElementCount >= 1) {
                input.value = selectedItemsWrapper.lastChild.textContent;
                selectedItemsWrapper.removeChild(selectedItemsWrapper.lastChild);
            }
        }, false);

        wrapper.appendChild(input);
    }
}

customElements.define('multi-item-picker', MultiItemPicker);