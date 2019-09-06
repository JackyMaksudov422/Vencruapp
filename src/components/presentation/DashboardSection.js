import React from 'react';

const DashboardSection = ({ children, rightContent, title, classes,cls }) => {
    return (
        <div className={`vc-dashboard-section ${classes && classes.container ? classes.container : ''}`}>
            <div className={'vc-dashboard-section-heading ' +cls}>
                <div id="row2" className="row">
                { title && 
                    <div
                    	className={`vc-dashboard-section-title col-md-6 col-12 ${classes && classes.title ? classes.title : '' }`}
                    >
                        { title }
                    </div>
                }
                {rightContent &&
                    <div className={`vc-dashboard-section-filter float-md-right col-md-6 col-12 ${classes && classes.rightContent ? classes.rightContent : '' }`}>
                        {rightContent}
                    </div>
                }
                </div>
            </div>
            <div className='vc-dashboard-section-body'>
                {children}
            </div>
        </div>
    )
}

export default DashboardSection;