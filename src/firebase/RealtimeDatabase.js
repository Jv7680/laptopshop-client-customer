import { realtimeDB } from "./firebaseConfig";
import { ref, set, onValue, get, child } from "firebase/database";

let objSent = {
    role: 'user',
    contentChat: 'Xin Chào!'
};

// write chat into database
export async function writeUserChatData(userId, messageItem) {
    let newChatIndex = 0;
    await onValue(ref(realtimeDB, 'userChat/' + `${userId}`), (snapshot) => {
        // If exist data
        if (snapshot.size != 0) {
            newChatIndex = snapshot.val().length;
            console.log('newChatIndex', newChatIndex);
            console.log('snap', snapshot);
            console.log('snapshot.val()', snapshot.val());
        }
    });

    // get new index
    const dbRef = ref(realtimeDB);
    await get(child(dbRef, `userChat/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            newChatIndex = snapshot.val().length;
            console.log('newChatIndex', newChatIndex);
            console.log('snap', snapshot);
            console.log('snapshot.val()', snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((e) => {
        console.log('error in writeUserChatData:', e);
    });

    // write chat
    let newChat = {
        user: messageItem.user,
        content: messageItem.content
    }
    await set(ref(realtimeDB, 'userChat/' + `${userId}/` + newChatIndex), messageItem)
        .then(() => {
            console.log('writeUserChatData success');
        });
}

// read user chat from database
// return chat array
export async function readUserChatData(userId) {
    let messageList = [];
    const dbRef = ref(realtimeDB);
    await get(child(dbRef, `userChat/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            messageList = snapshot.val();
            console.log('snap', snapshot);
            console.log('snapshot.val()', snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((e) => {
        console.log('error in readUserChatData:', e);
    });

    return messageList;
}