import React from "react";
import ChangeItem_Transaction from "../db/ChangeItem_Transaction";
import ItemCard from "./ItemCard";


export default class Workspace extends React.Component {
    render() {
        console.log(this.props);
        const {
            currentList,
            currentItemKey,
            selectItemCallback,
            renameItemCallback,
            dropped,
            dropItemCallback,
            addChangeItemTransactionCallback,
            addMoveItemTransactionCallback
        } = this.props;
        if (currentList){
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                        {/*== <div className="top5-item">{currentList.items[0]}</div>
                        <div className="top5-item">{ currentList.items[1]}</div>
                        <div className="top5-item">{currentList.items[2]}</div>
                        <div className="top5-item">{currentList.items[3]}</div>
                        <div className="top5-item">{currentList.items[4]}</div> */}
                        {
                            currentList.items.map(function(item, index){
                                return (
                                        
                                <ItemCard
                                
                                    id={index}
                                    key={index}
                                    keyNamePair={item}
                                    selected={(currentItemKey !== null) && (currentItemKey === item.key)}
                                    selectItemCallback={selectItemCallback}
                                    renameItemCallback={renameItemCallback}
                                    dropItemCallback={dropItemCallback}
                                    addChangeItemTransactionCallback ={addChangeItemTransactionCallback}
                                    addMoveItemTransactionCallback = {addMoveItemTransactionCallback}
                                    dropped = {dropped}
                                   
                                    
                            />
                            //     <ChangeItem_Transaction
                            //         renameItemCallback={renameItemCallback}
                            // />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
        }
        else {
            return (
                <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                </div>
                </div>

            )
        }
    }
}