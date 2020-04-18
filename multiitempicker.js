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
            padding: 3px 0 3px 0;
        }
        
        .multi-item-picker-input {
            border: none;
            flex: 1;
            padding: 2px 0 2px 0;
        }
        
        /** Since we can't use the default border, we have a focus alternative.
         While this sin't perfect, as it disturbs the default look and feel, I've
         sadly not found any better way. */
        .multi-item-picker-input:focus {
            border-width: 0 0 2px 0;
            border-style: solid;
            border-color: #2196F3;
            padding: 2px 0 0 0;
        }

        .multi-item-picker-selected-items {
            display: flex;
            flex-direction: row;
            flex: 0;
        }

        .multi-item-picker-selected-item {
            background-color: #e3e5e8;
            padding: 0.1rem 0.3rem 0.1rem 0.3rem;
            /* We don't want the items growing inside of the parent, as the text input should be the only growing components.*/
            flex: 0;
            /** Since each item has a button to unselect it, each item needs a horizontal layout (Text X-Button). */
            display: flex;
            flex-direction: row;
        }

        .multi-item-picker-selected-item {
            margin-right: 10px;
        }

        .multi-item-picker-selected-item-delete-button {
            margin-left: 0.1rem;
            padding: 0 0.2rem 0 0.2rem;
            vertical-align: center;
            text-align: center;
            font-family: Arial;
            cursor: pointer;
        }
        
        .multi-item-picker-selected-item-delete-button:hover {
            background-color: lightgray;
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