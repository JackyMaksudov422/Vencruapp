import React from 'react';
import propTypes from 'prop-types';

export default class PlainCard extends React.Component{

    static propTypes = {
        onCollapse: propTypes.func
    }
    
    state = {
        show: true
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.show && !this.state.show){
            if(this.props.onCollapse){
                this.props.onCollapse();
            }
        }
    }

    render(){
        const { className, transparent, vAlign, hAlign, collapsable, style, close } = this.props;
        if(!this.state.show){
            return null;
        }
        return(
            <div 
                className={`vc-plain-card ${className || '' } ${transparent ? 'transparent' : ''} ${vAlign ? 'v-align-'+vAlign : ''} ${hAlign ? 'h-align-'+hAlign : ''}`}
                style={style}
            >
                {/* { collapsable && 
                    <button className='vc-plain-card-collapse-button' onClick={() => this.setState({show: false})}>
                        <i className='material-icons'>close</i>
                    </button>
                } */}
                { this.props.children }
            </div>
        );
    }
}