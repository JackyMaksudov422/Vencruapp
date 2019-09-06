import React from 'react';
import propTypes from 'prop-types';
const defaultImage = require('../../assets/dropzone1x1.png');
const defaultImage4x3 = require('../../assets/dropzone4x3.png');
const defaultImage16x9 = require('../../assets/dropzone16x9.png');

export default class Dropzone extends React.Component {
	static propTypes = {
		selected: propTypes.string,
		cancelable: propTypes.bool,
		onChange: propTypes.func.isRequired,
		onCancel: propTypes.func.isRequired,
		dimension: propTypes.oneOf(['1:1', '16:9', '4:3'])
	};

	static defaultProps = {
	  cancelable: false,
	  dimension: '1:1'
	}

	render(){
		const { 
			selected, 
			cancelable, 
			classes,
			image
		} = this.props;

		return (
			<div className={`vc-dropzone ${classes ? classes.container : ''}`}>
				<img src={this.props.imagespath || this.getDefaultImage()}
					className={`default-image ${selected ? 'has-selected' : ''}`}
					alt='default'
				/>

        		{ selected && 
        			<React.Fragment>
        				<div className='image-preview'>
        					<div>
        						{ cancelable &&
	        						<button
										className='cancel-select'
										onClick={() => this.handleCancel()}
										type='button'
									>&times;</button>
        							
        						}
        						<img src={selected} alt='selected' />
        						<div className='change-image-message'>
			        				<span>
			        					Select new
			        				</span>
        						</div>
		        				<input 
									// ref={ref => this.field = ref}
									type='file'
									onChange={(event) => this.handleFileSelected(event)}
								/>
        					</div>
        				</div>
        			</React.Fragment> 
        		}

        		{ !selected &&
					<input 
						// ref={ref => this.field = ref}
						type='file'
						onChange={(event) => this.handleFileSelected(event)}
					/>
        		}
			</div>
		)
	}

	getDefaultImage(){
		const { dimension } = this.props;
		switch( dimension ){ 
			case '16:9':
				return defaultImage16x9;
			case '4:3':
				return defaultImage4x3;
			case '1:1':
			default:
				return defaultImage;
		}
	}

	handleFileSelected(event){
		if(typeof this.props.onChange == 'function'){
			this.props.onChange(event);
		}
		// this.clearField();
	}

	// clearField(){
	// 	if(this.field){
    // 		this.field.value = '';
    // 	}
	// }

	handleCancel(){
		if(typeof this.props.onCancel == 'function'){
			this.props.onCancel();
		}
	}
}