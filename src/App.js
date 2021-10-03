import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            deleteSelectedList : null,
            currentItemKey : null,
            sessionData : loadedSessionData,
            dropped: null
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    sortItemsByName = (items) =>{
        items.sort((item1,item2) => {
            return item1.localeCompare(item2);
        });
    }
    // sortDrag = (items) => {
    //     items.slice(5)-1,items.id.slice(5)-1;
    // }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
        
    }
    dropItem = (e) =>{
        let items = this.state.currentList.items;
        
        let index1 = this.state.currentItemKey;
        let index2 = e;
        let item1 = this.state.currentList.items[index1];
        items.splice(index1, 1);
        items.splice(index2,0, item1);
        

        let tempList = this.state.currentList;
        let tempItems = tempList.items;
        tempItems = items;
     
        this.setState(prevState => ({
            currentList: tempList
        }), () => {
            // ANY AFTER EFFECTS?
            console.log(this.state.currentList.items);
         
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
      
        
       
    }
    renameItem = (id, newName) => {
        let items = this.state.currentList.items;
        console.log(this.state.sessionData);
        console.log(this.state.currentList);
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < items.length; i++) {
            let tempItem = items[i];
            if (i === id) {
                items[i] = newName;
            }
        }
        console.log(items);
        //  this.sortItemsByName(items);

        let tempList = this.state.currentList;
        let tempItems = tempList.items;
        tempItems = items;
        console.log(tempList);
        this.setState({currentList: tempList});
        console.log(this.state);
        this.db.mutationUpdateList(tempList);
    
        
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    deleteList = (e) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        console.log(e);
        this.setState({deleteSelectedList : e});
        console.log(this.state.sessionData);

        this.showDeleteListModal();
        

    }

    selectItem = (e) => {
        // changed the currentItem to e
        // Note: e is the id/position of the item
        // console.log(e);
        // let tempItem = this.state.currentList.items[e]
        // console.log(tempItem);
        this.setState({currentItemKey: e});
        console.log(this.state.currentItemKey);
    }
  
    confirmDeleteList = (e) => {
        let x = this.state.sessionData;
        let newKeyNamePairs = x.keyNamePairs;

        var newSessionData = this.state.sessionData.keyNamePairs.filter(pair => pair.key !== this.state.deleteSelectedList.key);
        newKeyNamePairs = newSessionData;
        x.keyNamePairs = newKeyNamePairs;
        this.setState({x});
        let updatedPairs = newKeyNamePairs;
        for(let i=0; i< updatedPairs.length;i++){
            updatedPairs[i].key = i;
        }
        console.log(updatedPairs);
        this.setState(prevState => ({
            currentList: null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey - 1,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            let CurrentDeleteList = this.db.queryGetList(this.state.deleteSelectedList.key);
        // CurrentDeleteList = null;
        console.log(CurrentDeleteList);
        // this.db.mutationUpdateList(CurrentDeleteList);
        this.db.queryDeleteList(this.state.deleteSelectedList.key);
        this.db.mutationUpdateSessionData(this.state.sessionData);

        this.hideDeleteListModal(); // hide after deleting
    
        });
    
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList} currentItemKey={this.state.currentItemKey} selectItemCallback={this.selectItem} renameItemCallback={this.renameItem} dropItemCallback={this.dropItem} dropped ={this.state.dropped}/>
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.state.currentList}
                    deleteSelectedList={this.state.deleteSelectedList}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    confirmDeleteListCallback={this.confirmDeleteList}
                />
            </div>
        );
    }
}

export default App;
