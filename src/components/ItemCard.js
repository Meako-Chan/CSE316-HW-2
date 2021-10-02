import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            key: this.props.key,
            text: this.props.keyNamePair,
            editActive: false,
        }
    }
    handleClick = (event) => {
        if (event.detail === 1) {
            event.stopPropagation();
            this.handleLoadItem(event);
        }
        else if (event.detail === 2) {
            event.stopPropagation();
            this.handleToggleEdit(event);
        }
    }
    handleLoadItem = (event) => {
        event.stopPropagation();
        let itemKey = event.target.id;
        if (itemKey.startsWith("item-card-text-")) {
            itemKey = itemKey.substring("item-card-text-".length);
        }
        this.props.selectItemCallback(itemKey);
        //  this.props.loadItemCallback(itemKey);
    }

    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let id = this.props.id;
        console.log(id);
        let textValue = this.state.text;
        console.log("itemCard handleBlur: " + textValue);
        this.props.renameItemCallback(id, textValue);
        this.handleToggleEdit();
    }

    render() {
        const { keyNamePair, selected, id } = this.props;

         

        if (this.state.editActive) {
            return (
                <input
                    id={"item-" + keyNamePair}
                    className='item-card'
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={keyNamePair.name}
                />)
        }
        else {

            let selectClass = "unselected-item-card";
            if (selected) {
                selectClass = "selected-item-card";
            }
            // console.log("displaying itemCard");
            // console.log(keyNamePair);
            // console.log(id);
            return (
                <div
                    id={id}
                    key={id}
                    onClick={this.handleClick}
                    className={'top5-item ' + selectClass}>
                    <span
                        id={"item-card-text-" + id}
                        key={id}
                        className="item-card-text">
                        {keyNamePair}
                    </span>
                </div>
            );
        }
    }
}