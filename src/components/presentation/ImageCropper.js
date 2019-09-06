import React from 'react';
import Slider from '@material-ui/lab/Slider/Slider';
import AvatarEditor from 'react-avatar-editor'
import CropIcon from '@material-ui/icons/Crop';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton/IconButton';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PageDialogs from './PageDialogs';

class ImageCropper extends React.Component{

	static propTypes = {
	  image: propTypes.string,
	  onCancelCrop: propTypes.func.isRequired,
	  onCrop: propTypes.func.isRequired,
	  dimension: propTypes.oneOf(['1:1', '16:9', '9:16', '4:3', '3:4']),
	  width: propTypes.number,
	  title: propTypes.string
	};

	static defaultProps = {
	  width: 285,
	  dimension: '1:1'
	};

	state = {
		cropSize: 1.2
	};

	render(){
		const {
			image,
			classes,
			width,
			dimension,
			title
		} = this.props;

		const { 
			cropSize
		} = this.state;

		return(
			<PageDialogs
				className='vc-image-cropper'
				backdropClose={false}
        		escClose={false} 
        		show={image ? true : false}
			>
				{title && <h3 className='title'> {title} </h3>}
				<div 
					className={`${classes.imageEditor}`}
				>

	                <AvatarEditor 
	                	ref={ref => this.cropper = ref}
	                	image={image} 
	                    width={width} 
	                    height={this.getDimensionHeight(width, dimension)}  
	                    scale={cropSize}
	                    border={0}
	                />

	                <div
	                	className='slider-container'
	                >
	                    <div>
	                        <Slider 
	                        	value={cropSize} 
	                        	min={1} 
	                        	max={5} 
	                        	onChange={this.handleCropScale}
	                        />

	                        <IconButton 
	                        	className={classes.buttonSm} 
	                        	onClick={(event) => this.handleCropButtonclick(event, 'crop')} 
	                            style={{
	                            	width: 36, 
	                            	height: 36
	                            }}
	                            aria-label="Crop Image"
	                           >
	                            <CropIcon 
	                            	style={{
	                            		width: 18, 
	                            		height: 18
	                            	}} 
	                            	color='primary'
	                            />
	                        </IconButton>

	                        <IconButton
	                        	className={classes.buttonSm}
	                        	onClick={(event) => this.handleCropButtonclick(event, 'cancel')}
	                            style={{width: 36, height: 36}}
	                            aria-label="Cancel Image Crop"
	                        >
	                            <DeleteIcon 
	                            	style={{width: 18, height: 18}}
	                            />
	                        </IconButton>
	                    </div>
	                </div>
	            </div>
            </PageDialogs>
		);
	}

	getDimensionHeight = (width, dimension) => {
		//  return zero if no dimension was specified
		if(typeof dimension != 'string'){
			return 0;
		}

		// get dimension sides
		let dimensionSides = dimension.split(':');

		// stop if no sides where returned
		if(!dimensionSides && dimensionSides.length !== 2){
			return 0;
		}

		// get denominator
		let denominator = dimensionSides[1] / dimensionSides[0];

		// return height
		return width * denominator;
	};

	handleCropButtonclick = (event, action) => {
        switch(action){
            case 'cancel':
            	if(typeof this.props.onCancelCrop == 'function'){
            		this.props.onCancelCrop();
            	}
            break;
            case 'crop':
                this.crop();
			break;
			default:
				// do nothing
			break;
        }
    };

	handleCropScale = (events, value) => {
        this.setState({cropSize: value});
    };

    crop = () => {
        if( this.cropper ){
            const canvas = this.cropper.getImageScaledToCanvas();
            let image = canvas.toDataURL();
            if(typeof this.props.onCrop == 'function'){
            	this.props.onCrop(image);
            }
        }
    }
}

const styles = theme => ({
    buttonSm: {
        margin: theme.spacing.unit / 2,
    },
    imageEditor: {
        position: 'relative',
        float: 'left'
    },
    imageEditorSliderContainer:{
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        display: 'flex'
    }
});

export default withStyles(styles)(ImageCropper);