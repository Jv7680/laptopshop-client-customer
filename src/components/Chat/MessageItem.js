import React from "react";
import Modal from "react-modal";

import './chat.css';

class MessageItem extends React.Component {
    render() {
        const { messageItem } = this.props;
        return (
            <>
                {
                    // là user thì tin nhắn nằm bên phải
                    messageItem.user === 'user' ?
                        (
                            <div className="chat-item-right">
                                <span dangerouslySetInnerHTML={{ __html: messageItem.content }}></span>
                            </div>
                        )
                        :
                        (
                            <>
                                {
                                    messageItem.user === 'admin' ?
                                        (
                                            <img className="chat-item-left-image" src={process.env.PUBLIC_URL + '/images/logo/logoPTCustomer1.png'} alt="not fount" />
                                        )
                                        :
                                        (
                                            <img className="chat-item-left-image" src={process.env.PUBLIC_URL + '/images/logo/logo_ChatGPT.png'} alt="not fount" />
                                        )
                                }
                                <div className="chat-item-left">
                                    <span dangerouslySetInnerHTML={{ __html: messageItem.content }}></span>
                                </div>
                            </>
                        )
                }
            </>
        );
    }
}

export default MessageItem;