import { jsTPS_Transaction } from "./jsTPS";
import App from "../App";
/**

 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(app, initOld, initNew) {
        super();
        this.App = app;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        this.App.dropItem(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.App.dropItem(this.newItemIndex, this.oldItemIndex);
    }
    redoTransaction() {
        this.App.dropItem(this.newItemIndex, this.oldItemIndex);
    }
}