import React from 'react';
import Button from './Button';


export default class AppbarNotification extends React.Component {
    state = {
        focused: false
    }
    render() {
        const { focused } = this.state;
        return (
            <span 
                className='vc-appbar-notification'
                onFocus={() => this.setState({focused: true})}
                onBlur={() => this.handleBlur()}
            >
                <Button
                    variant='link-gray'
                    className='trigger-button'
                    size='sm'
                >
                    <i className='material-icons'>notifications</i>
                </Button>
                { focused && 
                    <div className='notifications-list-container'>
                        <ul className='notifications-list'>
                            <li className='notification-item button unseen'>
                                <button type='button'>
                                    Notification 1
                                </button>
                            </li>
                            <li className='notification-item payment-unseen'>
                                <button type='button'>
                                    Notification 2
                                </button>
                            </li>
                            <li className='notification-item invoice-unseen'>
                                <button type='button'>
                                    Notification 3
                                </button>
                            </li>
                            <li className='notification-item unseen'>
                                <button type='button'>
                                    Notification 4
                                </button>
                            </li>
                            <li className='notification-item campaign-unseen'>
                                <button type='button'>
                                    Notification 5
                                </button>
                            </li>
                            <li className='notification-item unseen'>
                                <button type='button'>
                                    Notification 6
                                </button>
                            </li>
                            <li className='notification-item'>
                                <button type='button'>
                                    Notification 1
                                </button>
                            </li>
                        </ul>
                    </div>
                }
            </span>
        )
    }

    handleBlur(){
        setTimeout(() => {
            this.setState({
                focused: false
            });
        }, 100);
    }
}