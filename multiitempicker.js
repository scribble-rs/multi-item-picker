class MultiItemPicker extends HTMLElement {
    shadow
    selectedItemsWrapper
    input

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
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
        this.shadow.appendChild(style);

        const wrapper = document.createElement('div');
        wrapper.classList.add('multi-item-picker');
        this.shadow.appendChild(wrapper)

        this.selectedItemsWrapper = document.createElement('div');
        this.selectedItemsWrapper.classList.add('multi-item-picker-selected-items');
        wrapper.appendChild(this.selectedItemsWrapper);

        this.input = document.createElement('input');
        this.input.type = "text";
        this.input.classList.add('multi-item-picker-input');
        this.input.value = "ab";

        //If the current input matches any of the unselected items, we
        //select that item and clear the input.
        this.input.addEventListener("input", () => {
            let match = this.getItem(this.input.value);
            if (match !== null) {
                let selectedAttribute = match.getAttribute("selected");
                if (selectedAttribute !== "") {
                    this.addNode(match, match.innerText);

                    this.input.value = "";
                }
            }
        }, false)

        //This will delete the last item if backspace is hit when there's no text content.
        //The content of the last item will then be moved to the input field. It's basically
        //"edit the last item".
        this.input.addEventListener("keydown", (event) => {
            if (this.input.value === "" && event.code === "Backspace" && this.selectedItemsWrapper.childElementCount >= 1) {
                let textNode = this.selectedItemsWrapper.lastChild.firstChild;
                this.input.value = textNode.textContent;
                let match = this.getItem(textNode.textContent);
                if (match !== null) {
                    match.removeAttribute("selected");
                }
                this.selectedItemsWrapper.removeChild(this.selectedItemsWrapper.lastChild);
            }
        }, false);

        wrapper.appendChild(this.input);

        //Add initial elements for pre-selected item nodes
        for (let i = 0; i < this.childNodes.length; i++) {
            let item = this.childNodes.item(i);
            //Since any node type could be inserted by the user, we only look for "item" nodes
            if (item.nodeName !== "ITEM") {
                continue;
            }

            let selectedAttribute = item.getAttribute("selected");
            if (selectedAttribute != null) {
                this.addNode(item, item.innerText);
            }
        }
    }

    getItem(itemText) {
        for (let i = 0; i < this.childNodes.length; i++) {
            let item = this.childNodes.item(i);
            //Since any node type could be inserted by the user, we only look for "item" nodes
            if (item.nodeName !== "ITEM") {
                continue;
            }

            if (item.innerText === itemText) {
                return item;
            }
        }

        return null;
    }

    addNode(item, itemText) {
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
        deleteButton.addEventListener("click", () => {
            let match = this.getItem(itemText);
            if (match !== null) {
                match.removeAttribute("selected");
            }
            this.selectedItemsWrapper.removeChild(this.shadow.getElementById(itemText));

            //Since not having focus is useless, we focus the input again.
            this.input.focus();
        }, true);
        newSelectedItem.appendChild(deleteButton);

        this.selectedItemsWrapper.appendChild(newSelectedItem);
    }
}

customElements.define('multi-item-picker', MultiItemPicker);