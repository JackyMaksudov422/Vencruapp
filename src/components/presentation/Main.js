import React from 'react';
import { connect } from 'react-redux';

let Main = ({ children, blur, appbar}) => (
    <main 
        className={`app-body${blur && ' vc-blur-it' || ''}${appbar.visible && ' appbar-visible' || ''}`} id='app-body'>
        { children }
    </main>
);

const mapStateToProps = ({ appbar, page }) => ({
    appbar, page
});
export default connect(mapStateToProps)(Main);