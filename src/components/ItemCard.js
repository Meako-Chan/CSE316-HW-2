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
    handleDragStart = (event) =>{ //When an item has begun to be dragged
        let itemKey = event.target.id;
        if (itemKey.startsWith("item-card-text-")) {
            itemKey = itemKey.substring("item-card-text-".length);
        }
        this.props.selectItemCallback(itemKey);
       
    }
    handleDragOver = (event) => { //When dragging
        event.stopPropagation();
        event.preventDefault();
    }
    handleDragLeave = (event) =>{ //When move over another item WANT TO HIGHLIGHT
        event.preventDefault();
        let text = this.state.text;
        // console.log(text);
     
    }
    handleDrop = (event) =>{ //When Drag is let go
        // event.preventDefault();
        // event.stopPropagation();
       
        console.log("hello");
        let itemKey = event.target.id;
        if (itemKey.startsWith("item-card-text-")) {
            itemKey = itemKey.substring("item-card-text-".length);
        }
         this.props.dropItemCallback(itemKey);
        


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
            return (
                <div 
                draggable
                    id={id}
                    key={id}
                    onClick={this.handleClick}
                    onDragStart={this.handleDragStart}
                    onDragOver={this.handleDragOver}
                    onDragLeave ={this.handleDragLeave}
                    onDrop = {this.handleDrop}
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