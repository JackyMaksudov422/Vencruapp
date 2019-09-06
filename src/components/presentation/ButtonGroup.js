import React from 'react';
import propTypes from 'prop-types';
import Button from './Button';
import Dropdown from './Dropdown';

export default class ButtonGroup extends React.Component{

    static propTypes = {
        size: propTypes.oneOf(['md', 'sm', 'lg'])
    }

    static defaultProps = {
        size: 'md'
    }

    state = {
        focused: false
    };

    render(){
        return(
            <div 
                className={`vc-button-group ${this.state.focused ? 'focused' : ''} ${this.getSizeclass()}`}
                onFocus={() => this.setState({focused: true})}
                onBlur={() => this.setState({focused: false})}
            >
                { this.children() }
            </div>
        )
    }

    getSizeclass(){
        switch(this.props.size){
            case'sm':
                return 'vc-button-group-small';
            case'lg':
                return 'vc-button-group-large';
            break;
            default:
                return '';
        }
    }

    children(){
        let children = React.Children.map(this.props.children, (child) => {
            if(child){
                if(child.type !== Button && child.type !== Dropdown){
                    throw new Error(
                        `Button Group children must belong to type of Button or Dropdown, child node with type of ${child.type} passed.`
                    );
                }
                return React.cloneElement(<GroupItem/>, {
                    children: child
                });
            }
        });

        return children;
    }
}

const GroupItem = ({children}) => {
    return <span className='vc-button-group-item'>
        {children}
    </span>
}