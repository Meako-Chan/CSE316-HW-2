import React, { Component } from 'react';

export default class DeleteModal extends Component {
    render() {
        const { listKeyPair, deleteSelectedList, hideDeleteListModalCallback, confirmDeleteListCallback} = this.props;
        let name = "";
        // console.log(this.props);
        // if (listKeyPair) {
        //     name = listKeyPair.name;
        // }
        if (deleteSelectedList){
            name = deleteSelectedList.name;
        }
        return (
            <div
                className="modal"
                id="delete-modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <header className="dialog-header">
                        Delete the Top 5 {name} List?
                    </header>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={confirmDeleteListCallback}
                        >Confirm</button>
                        <button
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={hideDeleteListModalCallback}
                        >Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}