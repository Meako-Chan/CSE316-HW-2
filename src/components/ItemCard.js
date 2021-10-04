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

    handleDragEnter = (event) => {
        event.preventDefault();
        let itemKey = event.target.className;
        let itemId = event.target.id;
        
        if (itemKey.startsWith("top5-item")) {
            event.target.className = "top5-item-dragged-to";
            
        }
        if (itemId.startsWith("item-card-text")){
            console.log(document.getElementById(itemId).parentElement.className);
            let x = document.getElementById(itemId).parentElement.className;
            if (x.startsWith("top5-item")){
                if (x.includes('top5-item-dragged-to')){

                }
                else {
                    event.target.parentElement.className += " top5-item-dragged-to";
                }
                
            }
        }
        console.log(itemKey);
        // add "hover" to id
        // event.target.className = "top5-item-dragged-to";

    }
    handleDragLeave = (event) =>{ //When move over another item WANT TO HIGHLIGHT
        // event.target.className = "top5-item";
        event.preventDefault();
        let itemKey = event.target.className;
        let itemId = event.target.id;
        
        if (itemKey.startsWith("top5-item-dragged-to")) {
            event.target.className = "top5-item";
            
        }
        if (itemId.startsWith("item-card-text")){
            let x = document.getElementById(itemId).parentElement.className;
            if (x.includes("top5-item-dragged-to")){
                event.target.parentElement.className = "top5-item";
                
            }
        }
        console.log(itemKey);
     }
    handleDrop = (event) =>{ //When Drag is let go
        // event.preventDefault();
        // event.stopPropagation();
        // event.target.className = "top5-item";
        console.log("soldiefhiouawsehfiukaewhy"+event.target.className);
        let itemKey = event.target.id;
        let itemClass = event.target.className;
        if (itemKey.startsWith("item-card-text-")) {
            itemKey = itemKey.substring("item-card-text-".length);
        }

        if (itemClass.startsWith("top5-item-dragged-to")) {
            event.target.className = "top5-item";
            
        }
        if (itemClass.startsWith("item-card-text")){
            event.target.parentElement.className = "top5-item";
                
            
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

            //  let selectClass = "unselected-item-card";
           
            // if (selected) {
            //      selectClass = "selected-item-card";
            //      selectClass = "";
            // }
            return (
                <div 
                draggable
                    id={id}
                    key={id}
                    onClick={this.handleClick}
                    onDragStart={this.handleDragStart}
                    onDragOver={this.handleDragOver}
                    onDragLeave ={this.handleDragLeave}
                    onDragEnter ={this.handleDragEnter}
                    onDrop = {this.handleDrop}
                    className={'top5-item'}>
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