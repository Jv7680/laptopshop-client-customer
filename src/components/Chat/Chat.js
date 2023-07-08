import React from "react";
import Modal from "react-modal";
import ChatAdmin from "./ChatAdmin";
import ChatGPT from "./ChatGPT";
import axios from "axios";
import PulseLoader from 'react-spinners/PulseLoader';
import ChatNotice from "./ChatNotice";
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { readUserChatData, writeUserChatData, updateSeenStatus } from "../../firebase/RealtimeDatabase";
import { realtimeDB } from "../../firebase/firebaseConfig";
import { ref, onValue, off } from "firebase/database";

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
            showChatNotice: false,
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

        this.currentModalIsOpen = false;
        this.lastIndexOfChatAdminList = 0;
        this.countDidUpdate = 0;
        this.userId = this.props.user.accountId;
    }

    getDatamessageListAdmin = async () => {
        let initMessageListAdmin = [{
            user: 'admin',
            content: 'Laptop PT xin chào quý khách! Chúng tôi có thể hỗ trợ gì cho bạn?'
        }];
        // get user id
        let userId = parseInt(localStorage.getItem('_idaccount'));
        // get list user chat with admin
        let messageList = await readUserChatData(userId);
        console.log('messageList:', messageList, userId);

        // update messageListAdmin state
        let newMessageListAdmin = initMessageListAdmin.concat(messageList);
        console.log('newMessageListAdmin:', newMessageListAdmin);
        this.setState({
            chatContent: '',
            messageListAdmin: newMessageListAdmin,
        });
    }

    componentDidUpdate = async () => {
        console.log('vào did update chat', this.userId, this.props.user.accountId);
        // update state when logout
        if (this.userId && !this.props.user.accountId) {
            // unsubcribe listener onValue
            off(ref(realtimeDB, 'userChat/' + `${this.userId}`));

            this.userId = this.props.user.accountId;
            this.setState({
                showChatNotice: false,
                chatContent: '',
                messageListAdmin: [{
                    user: 'admin',
                    content: 'Laptop PT xin chào quý khách! Chúng tôi có thể hỗ trợ gì cho bạn?'
                }],
                messageListChatGPT: [{
                    user: 'chatGPT',
                    content: 'Hello there! How can I assist you today?'
                }],
            });
        }
        // update state when login
        else if (!this.userId && this.props.user.accountId) {
            this.userId = this.props.user.accountId;
            await this.getDatamessageListAdmin();

            // trigger onValue here to listening value change
            onValue(ref(realtimeDB, 'userChat/' + `${this.props.user.accountId}`), (snapshot) => {
                console.log('trigged onValue(), listening');
                console.log('snap', snapshot);
                console.log('snapshot.val()', snapshot.val());
                let initMessageListAdmin = [{
                    user: 'admin',
                    content: 'Laptop PT xin chào quý khách! Chúng tôi có thể hỗ trợ gì cho bạn?'
                }];
                if (snapshot.val()) {
                    this.lastIndexOfChatAdminList = --snapshot.val().length;
                    // update messageListAdmin state
                    let newMessageListAdmin = initMessageListAdmin.concat(snapshot.val());
                    console.log('newMessageListAdmin snapshot:', newMessageListAdmin);
                    this.setState({
                        messageListAdmin: newMessageListAdmin,
                    });

                    // show chat notice
                    if (snapshot.val()[snapshot.val().length - 1].user === 'admin') {
                        console.log('vào show chat notice:', snapshot.val()[snapshot.val().length - 1]);
                        // user hasn't seen admin message
                        if (!snapshot.val()[snapshot.val().length - 1].userHasSeen) {
                            if (this.state.modalIsOpen && this.state.modalState === 1) {
                                console.log('updateSeenStatus hide chat notice:');
                                updateSeenStatus(this.userId, this.lastIndexOfChatAdminList, true);
                            }
                            else {
                                // show notice
                                console.log('show chat notice:');
                                this.setState({
                                    showChatNotice: true,
                                });
                            }
                        }
                        else {
                            // hide notice
                            console.log('hide chat notice:');
                            this.setState({
                                showChatNotice: false,
                            });
                        }

                    }
                }
                else {
                    console.log('newMessageListAdmin snapshot2:', this.state.messageListAdmin);
                    this.setState({
                        messageListAdmin: initMessageListAdmin,
                    });
                }
            });
        }

        // scroll content area xuống cuối cùng mỗi khi update
        let chatContentArea = document.getElementsByClassName('chat-content-area')[0];
        if (chatContentArea) {
            chatContentArea.scrollTo(0, chatContentArea.scrollHeight);
        }
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
        let chatContentTextArea = document.getElementsByClassName("chat-content-textarea")[0];
        chatContentTextArea.style.height = "21px";

        let { modalState, messageListAdmin, messageListChatGPT, chatContent } = this.state;
        let { user } = this.props;
        if (chatContent.length === 0) {
            toast.error('Bạn chưa nhập nội dung chat!');
            return;
        }
        let messageItem = {
            user: 'user',
            userName: `${user.lastname} ${user.firstname}`,
            content: this.formatChatContent(chatContent),
            adminHasSeen: false,
        };

        if (modalState === 1) {
            let handleChange = this.handleChange;
            let inputChatContentLoading = document.getElementsByClassName('input-chat-content-loading')[0];
            try {
                // khóa thanh input
                inputChatContentLoading.classList.add('input-chat-content-loading--show');
                this.handleChange = () => { };

                // write user chat into firebase database
                // messageListAdmin.push(messageItem);
                await writeUserChatData(this.userId, messageItem);

                // get data again
                await this.getDatamessageListAdmin();
            }
            finally {
                // mở thanh input
                this.handleChange = handleChange;
                inputChatContentLoading.classList.remove('input-chat-content-loading--show');
            }
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

        // console.log('this.state.messageListAdmin', this.state.messageListAdmin);
        // console.log('this.state.messageListChatGPT', this.state.messageListChatGPT);
    }

    handleOnInput = (event) => {
        if (event.target.scrollHeight >= 85) {
            return;
        }
        event.target.style.height = "";
        event.target.style.height = (event.target.scrollHeight) + "px";
    }

    openModal = async (modalStateParam) => {
        const { modalState } = this.state;
        document.getElementsByTagName('body')[0].classList.add('prevent-scroll-body');
        this.setState({
            modalIsOpen: true,
            modalState: modalStateParam ? modalStateParam : modalState,
            chatContent: '',
            messageListAdmin: [{
                user: 'admin',
                content: 'Laptop PT xin chào quý khách! Chúng tôi có thể hỗ trợ gì cho bạn?'
            }],
        },
            async () => {
                await this.getDatamessageListAdmin();

                if (this.userId) {
                    // if delete node user id, don't forget reload page to restore lastIndexOfChatAdminList back to 0,
                    // so the updateSeenStatus will not be call => no error throw 
                    if (this.state.modalState != 2 && this.lastIndexOfChatAdminList != 0) {
                        // console.log('xxx', this.state.modalState)
                        await updateSeenStatus(this.userId, this.lastIndexOfChatAdminList, true);
                    }
                }

                let modalchat1 = document.getElementsByClassName('left-col__chat-name1')[0];
                let modalchat2 = document.getElementsByClassName('left-col__chat-name2')[0];

                if (this.state.modalState === 1 && modalchat1) {
                    modalchat1.classList.add('left-col__chat-name--active');
                    modalchat2.classList.remove('left-col__chat-name--active');
                }
                else if (this.state.modalState === 2 && modalchat2) {
                    modalchat1.classList.remove('left-col__chat-name--active');
                    modalchat2.classList.add('left-col__chat-name--active');
                }

                let chatContentTextArea = document.getElementsByClassName("chat-content-textarea")[0];
                if (chatContentTextArea && chatContentTextArea.scrollHeight < 85) {
                    chatContentTextArea.style.height = "";
                    chatContentTextArea.style.height = (chatContentTextArea.scrollHeight) + "px";
                }
            });


    }

    closeModal = () => {
        document.getElementsByTagName('body')[0].classList.remove('prevent-scroll-body');
        this.setState({ modalIsOpen: false });
    }

    onAfterOpenModal = () => {
        // add envent enter 
        let chatContentTextArea = document.getElementsByClassName("chat-content-textarea")[0];
        chatContentTextArea.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                document.getElementsByClassName("fa-paper-plane")[0].click();
            }
        });
    }

    render() {
        const { showChatNotice, modalIsOpen, modalState, chatContent, messageListAdmin, messageListChatGPT } = this.state;
        const { user } = this.props;
        return (
            <div className="chat-area">
                <ChatNotice isShow={showChatNotice}></ChatNotice>
                <img
                    className="chat-img" src={process.env.PUBLIC_URL + '/images/chat/messenger-chat-img.png'}
                    alt="not found"
                    onClick={() => { this.openModal() }}
                />
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={this.closeModal}
                    onAfterOpen={this.onAfterOpenModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <div className="container-fluid" style={{ height: '100%' }}>
                        <div className="row modal-chat-area">
                            <div className="col-3 modal-chat-area__left-col">
                                <div className="left-col__chat-name1 left-col__chat-name--active" onClick={() => { this.openModal(1) }}>
                                    <ChatNotice isShow={showChatNotice}></ChatNotice>
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
                                    {
                                        user.accountId ?
                                            (
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
                                            )
                                            :
                                            (
                                                <div className="col-12 input-chat-content" style={{ justifyContent: 'center' }}>
                                                    Bạn cần đăng nhập để có thể chat!
                                                </div>
                                            )
                                    }
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

// export default Chat;

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Chat);