import React from "react";
import Modal from "react-modal";
import MessageItem from "./MessageItem";

import './chat.css';

class ChatGPT extends React.Component {
    render() {
        const { messageListChatGPT } = this.props;
        return (
            <>
                {
                    messageListChatGPT.map((item, index) => {
                        return (
                            <div className="chat-row" key={index}>
                                <MessageItem messageItem={item}></MessageItem>
                            </div>

                        );
                    })
                }
            </>
        );
    }
}

export default ChatGPT;