import { jsTPS_Transaction } from "./jsTPS";
import App from "../App";
/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(app, initId, initOldText, initNewText) {
        super();
        this.App = app;
        this.id = initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.App.renameItem(this.id, this.newText);
    }
    
    undoTransaction() {
        this.App.renameItem(this.id, this.oldText);
    }
    redoTransaction() {
        this.App.renameItem(this.id, this.oldText);
    }
}