import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

export default class PageLoader extends React.Component{
    render(){
        return (
            <div className='vc-page-loader'>
                <CircularProgress color='primary' size={50}/>
            </div>
        );
    }
}