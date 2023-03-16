import React from 'react'

import './style.css';

class ButtonGoTop extends React.Component {
    handleOnClick = () => {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className='button-go-top' onClick={() => { this.handleOnClick() }}>
                <i class="fa-solid fa-angle-up"></i>
            </div>
        )
    }
}

export default ButtonGoTop;