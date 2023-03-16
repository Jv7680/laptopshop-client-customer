import React from "react";
import Modal from "react-modal";
import ChatAdmin from "./ChatAdmin";
import ChatGPT from "./ChatGPT";
import axios from "axios";
import PulseLoader from 'react-spinners/PulseLoader';
import { css } from '@emotion/core';

import './chat.css';
import { toast } from "react-toastify";

const cssPulseLoader = css`
    margin: auto;
    z-index: 9999;
    display: block;
`;

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        height: "80vh",
        maxHeight: "96vh",
        overflow: "auto",
    }
};

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            modalState: 1,
            chatContent: '',
            messageListAdmin: [{
                user: 'admin',
                content: 'Laptop PT xin chào quý khách! Chúng tôi có thể hỗ trợ gì cho bạn?'
            }],
            messageListChatGPT: [{
                user: 'chatGPT',
                content: 'Hello there! How can I assist you today?'
            }],
        };

        this.countDidUpdate = 0;
    }

    componentDidUpdate = () => {
        let { modalState } = this.state;
        setTimeout(() => {
            let modalchat1 = document.getElementsByClassName('left-col__chat-name1')[0];
            let modalchat2 = document.getElementsByClassName('left-col__chat-name2')[0];

            if (modalState === 1 && modalchat1) {
                modalchat1.classList.add('left-col__chat-name--active');
                modalchat2.classList.remove('left-col__chat-name--active');
            }
            else if (modalState === 2 && modalchat2) {
                modalchat1.classList.remove('left-col__chat-name--active');
                modalchat2.classList.add('left-col__chat-name--active');
            }

            let chatContentTextArea = document.getElementsByClassName("chat-content-textarea")[0];
            if (chatContentTextArea && chatContentTextArea.scrollHeight < 85) {
                chatContentTextArea.style.height = "";
                chatContentTextArea.style.height = (chatContentTextArea.scrollHeight) + "px";
            }

            // thêm event enter submit
            // chỉ thêm ở lần update đầu tiên
            // nếu không thì mỗi lần update sẽ bị lỗi thông báo submit
            console.log('vào ddidd');

            if (this.countDidUpdate === 0) {
                this.countDidUpdate++;
                console.log(this.countDidUpdate);
                let chatContentTextArea = document.getElementsByClassName("chat-content-textarea")[0];
                chatContentTextArea.addEventListener("keypress", (event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        document.getElementsByClassName("fa-paper-plane")[0].click();
                    }
                });
            }
        }, 150);

        // scroll contet area xuống cuối cùng mỗi khi update
        let chatContentArea = document.getElementsByClassName('chat-content-area')[0];
        if (chatContentArea) {
            chatContentArea.scrollTo(0, chatContentArea.scrollHeight);
        }
    }

    componentWillUnmount = () => {
        this.countDidUpdate = 0;
    }

    formatChatContent = (stringRes) => {
        // console.log('stringRes1', stringRes);
        // cắt 2 \n\n đầu tiên
        if (stringRes[0] === '\n' && stringRes[1] === '\n') {
            stringRes = stringRes.slice(2);
        }
        // console.log('stringRes2', stringRes);
        // console.log('stringRes3', stringRes.replaceAll('\n', '<br/>'));
        return stringRes.replaceAll('\n', '<br/>');
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = async () => {
        let { modalState, messageListAdmin, messageListChatGPT, chatContent } = this.state;
        if (chatContent.length === 0) {
            toast.error('Bạn chưa nhập nội dung chat!');
            return;
        }
        let messageItem = {
            user: 'user',
            content: this.formatChatContent(chatContent),
        };

        if (modalState === 1) {
            // thêm api để lưu chat các đoạn chat và database
            messageListAdmin.push(messageItem);

            this.setState({
                chatContent: '',
                messageListAdmin: messageListAdmin,
            });
        }
        else if (modalState === 2) {
            messageListChatGPT.push(messageItem);

            this.setState({
                chatContent: '',
                messageListChatGPT: messageListChatGPT,
            });

            // console.log('đang call api'); console.log('${process.env.API_KEY}', process.env);
            // khóa thanh input
            let inputChatContentLoading = document.getElementsByClassName('input-chat-content-loading')[0];
            inputChatContentLoading.classList.add('input-chat-content-loading--show');
            let handleChange = this.handleChange;
            this.handleChange = () => { };

            // call api đến openAI
            let messageItemChatGPT;
            try {
                await axios({
                    method: 'POST',
                    url: `https://api.openai.com/v1/chat/completions`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
                    },
                    data: {
                        "model": "gpt-3.5-turbo",
                        "messages": [{ "role": "user", "content": `${messageItem.content}` }],
                        "temperature": 0.7
                    }
                })
                    .then((res) => {
                        console.log('resChatGPT', res);
                        // console.log('res data', res.data.choices[0].message.content);

                        messageItemChatGPT = {
                            user: 'chatGPT',
                            content: this.formatChatContent(res.data.choices[0].message.content),
                        };
                        messageListChatGPT.push(messageItemChatGPT);

                    })
                    .catch((error) => {
                        // console.log('er', error);
                        messageItemChatGPT = {
                            user: 'chatGPT',
                            content: error.toString(),
                        };
                        messageListChatGPT.push(messageItemChatGPT);
                    });
            }
            catch (error) {
                console.log('error in chatGPT call API:', error);
            }
            finally {
                this.setState({
                    chatContent: '',
                    messageListChatGPT: messageListChatGPT,
                });
                // mở thanh input
                this.handleChange = handleChange;
                inputChatContentLoading.classList.remove('input-chat-content-loading--show');
            }
        }

        console.log('this.state.messageListAdmin', this.state.messageListAdmin);
        console.log('this.state.messageListChatGPT', this.state.messageListChatGPT);
    }

    handleOnInput = (event) => {
        if (event.target.scrollHeight >= 85) {
            return;
        }
        event.target.style.height = "";
        event.target.style.height = (event.target.scrollHeight) + "px";
    }

    openModal = (modalStateParam) => {
        const { modalState } = this.state;
        document.getElementsByTagName('body')[0].classList.add('prevent-scroll-body');
        this.setState({
            modalIsOpen: true,
            modalState: modalStateParam ? modalStateParam : modalState,
        });
    }

    closeModal = () => {
        document.getElementsByTagName('body')[0].classList.remove('prevent-scroll-body');
        this.setState({ modalIsOpen: false });
        setTimeout(() => {
            this.countDidUpdate = 0;
        }, 1000);
    }

    render() {
        const { modalIsOpen, modalState, chatContent, messageListAdmin, messageListChatGPT } = this.state;
        return (
            <div className="chat-area">
                <img
                    className="chat-img" src={process.env.PUBLIC_URL + '/images/chat/messenger-chat-img.png'}
                    alt="not found"
                    onClick={() => { this.openModal() }}
                />
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <div className="container-fluid" style={{ height: '100%' }}>
                        <div className="row modal-chat-area">
                            <div className="col-3 modal-chat-area__left-col">
                                <div className="left-col__chat-name1 left-col__chat-name--active" onClick={() => { this.openModal(1) }}>
                                    <img src={process.env.PUBLIC_URL + '/images/logo/logoPTCustomer1.png'} alt="not fount" />
                                    <span>Admin</span>
                                </div>
                                <div className="left-col__chat-name2" onClick={() => { this.openModal(2) }}>
                                    <img src={process.env.PUBLIC_URL + '/images/logo/logo_ChatGPT.png'} alt="not fount" />
                                    <span>ChatGPT</span>
                                </div>
                            </div>
                            <div className="col-9 modal-chat-area__right-col">
                                {/* row content chat */}
                                {
                                    modalState === 1 ?
                                        (
                                            <div className="chat-content-area">
                                                <ChatAdmin messageListAdmin={messageListAdmin}></ChatAdmin>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="chat-content-area">
                                                <ChatGPT messageListChatGPT={messageListChatGPT}></ChatGPT>
                                            </div>
                                        )
                                }
                                {/* row sent chat */}
                                <div className="chat-sent-area">
                                    <div className="col-12 input-chat-content">
                                        {/* <input type="text" placeholder="Nội dung" /> */}
                                        <textarea
                                            className="chat-content-textarea"
                                            autoFocus={true}
                                            name="chatContent"
                                            placeholder="Nội dung"
                                            rows="1"
                                            value={chatContent}
                                            onChange={(event) => { this.handleChange(event); this.handleOnInput(event); }}
                                        >
                                        </textarea>
                                        <i className="fa-regular fa-paper-plane" onClick={() => { this.handleSubmit() }}></i>
                                    </div>
                                    <div className="col-12 input-chat-content-loading">
                                        <PulseLoader
                                            css={cssPulseLoader}
                                            sizeUnit={"px"}
                                            size={10}
                                            color={'rgba(71, 74, 240, 0.8)'}
                                            loading={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <span className="btn-close-modal" onClick={() => { this.closeModal() }}><i className="fa-solid fa-xmark"></i></span>
                        </div>
                    </div>
                </Modal >
            </div >
        );
    }
}

export default Chat;