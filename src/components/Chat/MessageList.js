import React from "react";
import MessageItem from "./MessageItem";

import './chat.css';

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            massageList: [],
        };
    }

    componentDidUpdate = () => {
        let { modalState } = this.state;
    }

    render() {
        const { massageList } = this.state;
        return (
            <>
                <div className="row">
{
    massageList.length>0?
    (
        massageList.map((item)=>{
            return(
                <MessageItem key={item.id}></MessageItem>
            );
        })
    )
    :
    (
        null
    )
}
                </div>
            </>
        );
    }
}

export default MessageList;