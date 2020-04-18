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
            white-space:nowrap;
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
        input.value = "ab";

        //This is an array function so that we can access the enclosing class state.
        input.addEventListener("input", () => {
            for (let i = 0; i < this.childNodes.length; i++) {
                let item = this.childNodes.item(i);
                //Since any node type could be inserted by the user, we only look for "item" nodes
                if (item.nodeName !== "ITEM") {
                    continue;
                }

                let itemText = item.innerText;
                if (input.value === itemText) {
                    this.addNode(selectedItemsWrapper, shadow, item, itemText);

                    input.value = "";
                    break;
                }

                //TODO Popup
            }
        }, false)

        input.addEventListener("keydown", function (event) {
            if (input.value === "" && event.code === "Backspace" && selectedItemsWrapper.childElementCount >= 1) {
                //FIXME Get by ID instead?
                //TODO Remove "selected" attribute of corresponding item.
                input.value = selectedItemsWrapper.lastChild.firstChild.textContent;
                selectedItemsWrapper.removeChild(selectedItemsWrapper.lastChild);
            }
        }, false);

        wrapper.appendChild(input);

        //Add initial elements for pre-selected item nodes
        for (let i = 0; i < this.childNodes.length; i++) {
            let item = this.childNodes.item(i);
            //Since any node type could be inserted by the user, we only look for "item" nodes
            if (item.nodeName !== "ITEM") {
                continue;
            }

            let selectedAttribute = item.getAttribute("selected");
            if (selectedAttribute != null) {
                this.addNode(selectedItemsWrapper, shadow, item, item.innerText);
            }
        }
    }

    addNode(selectedItemsWrapper, shadow, item, itemText) {
        item.setAttribute("selected", "");
        const newSelectedItem = document.createElement("div");
        newSelectedItem.classList.add("multi-item-picker-selected-item");
        newSelectedItem.id = itemText;

        const text = document.createElement("span");
        text.innerText = itemText;
        newSelectedItem.appendChild(text);

        const deleteButton = document.createElement("span")
        deleteButton.innerText = "x";
        //FIXME Can't get tooltip to work, not sure why.
        deleteButton.classList.add("multi-item-picker-selected-item-delete-button")
        deleteButton.addEventListener("click", function () {
            //TODO Remove "selected" attribute of corresponding item.
            selectedItemsWrapper.removeChild(shadow.getElementById(itemText));
        }, true);
        newSelectedItem.appendChild(deleteButton);

        selectedItemsWrapper.appendChild(newSelectedItem);
    }
}

customElements.define('multi-item-picker', MultiItemPicker);