import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormComponent from './FormComponent';
import * as Rules from '../../helpers/Rules';
import { isValidNumber } from 'libphonenumber-js';
import Input from '../presentation/Input';
import Button from '../presentation/Button';
import Typography from '../presentation/Typography';
import propTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../data/actionCreators';
import _ from 'lodash';
import find from 'lodash/find';
/**
 * component template
 */
let Template = ({ fn, form, disableSubmit, title, submitLabel, disabled }) => (
    <div className='vc-client-form'>
        <form id="UserSettings" method="post" onSubmit={(data) => fn.handlSubmit(data)}>
            {/* <form onSubmit={(ev) => fn.handlSubmit(ev)}> */}
            <h1 className='title'>
                {title}
            </h1>
            <div className='form-fields'>
                <div className='form-fields-inner'>
                    <div className='row mb20 fields-row'>
                        <div className='col-md-6'>
                            <input id="ClientImportData" type='file'

                            />
                        </div>

                    </div>



                </div>

            </div>
            <div className='spanned'>
                <div className='row'>
                    {typeof fn.handleCancelPress == 'function' &&
                        <div className='col-md-3 col-sm-3 text-left cancel-mobile'>
                            <Button
                                variant='link-primary'
                                type='button'
                                className='cancel-button'
                                onClick={() => fn.handleCancelPress()}
                            >
                                Cancel
                            </Button>
                        </div>

                    }

                     <div className={`${typeof fn.handleCancelPress == 'function' && 'col-md-6 col-sm-3 text-left save-mobile' || 'col-sm-12 text-center'}`}>
                        <Button variant='primary' className='submit-button'>Save</Button>
                    </div>
                </div>
            </div>
        </form>
    </div>
);

class ImportClientCsv extends FormComponent {

    static propTypes = {
        setRef: propTypes.func
    }

    constructor() {
        super(null, {
            form: {

            }
        });
    }

    componentDidMount() {


    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.clientCreate.isFetching && !this.props.clientCreate.isFetching) {
            if (this.props.clientCreate.errorMessage) {
                this.props.showSnackbar(this.props.clientCreate.errorMessage, { variant: 'error' });
            }
            else {
                this.props.showSnackbar('New client created.', { variant: 'success' });
                this.created();
            }
        }
    }
    componentWillUnmount() {
        if (typeof this.props.setRef == 'function') {
            this.props.setRef(undefined);
        }
    }
    cancel(){
    	//this.props.history.push('clients') ;
    	this.props.history.goBack();
    }
    renderMethod() {
        return <Template
            {...this.prps()}
            fn={this.fn()}
        />;
    }

    fn = () => ({
        handlSubmit: (data) => this.handlSubmit(data),       
        setForm: (form) => this.setForm(form),
        handleCancelPress: () => this.cancel()
    })

    prps = () => ({
        isFetching: this.props.clientCreate.isFetching
    })

    setForm(form) {
        this.form = form;
    }

    disableSubmit() {

        return true;
    }
    currentBusiness() {
        console.log(this.props.userInfo, "this.props.userInfo");
        const { data } = this.props.userInfo;
        if (data && data.business) {
            return find(data.business, item => item.id == data.currentbusinessid) || null;
        }
        return null;
    }
    handlSubmit(data) {
        data.preventDefault();
        var propss = this.props;
        //let business = this.currentBusiness();
        //data.BusinessId = business && business.id || null
        // this.props.doCreateClient(data);


        console.log('rrrrrrrrrrrrrrrrrrrrrrrr');
        var data_save = {};
        var input = document.getElementById('ClientImportData');
        var files = input.files;
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            console.log('*****************')
            console.log(this.props)
            fr.onload = function () {
                console.log(fr.result, 'fr.result');

                /*Result In Base-64 Format */
                var result = fr.result;

                /* Split Records Line By Line */
                var result_array = atob(result.split(',')[1]).split("\n");

                /* Mapping & Read Properities One By One */
                _.each(result_array, function (userObject, index) {
                    if (index > 0 && index <= result_array.length - 2) {
                        var res = userObject.split(',');
                        //console.log(JSON.parse(userObject));
                        console.log(res + '_' + index);
                        console.log(res[0] + '_Business Id' + index);
                        console.log(res[1] + '_City' + index);
                        console.log(res[2] + '_Company Email' + index);
                        console.log(res[3] + '_Company Name' + index);
                        console.log(res[4] + '_Country' + index);
                        //console.log(res[5] + '_Date Created' + index);
                        console.log(res[5] + '_First Name' + index);
                        //console.log(res[7] + '_Id' + index);
                        //console.log(res[6] + '_Is Deleted' + index);
                        console.log(res[6] + '_Last Name' + index);
                        console.log(res[7] + '_Phone Number' + index);
                        console.log(res[8] + '_Street' + index);
                        console.log(res[9] + '_UserId' + index);
                        console.log('-------------------------');

                        data_save.FirstName = res[5];
                        data_save.LastName = res[6];
                        data_save.CompanyName = res[3];
                        data_save.PhoneNumber = res[7];
                        data_save.CompanyEmail = res[2];
                        data_save.Street = res[8];
                        data_save.City = res[1];
                        data_save.Country = res[4];
                        data_save.BusinessId = 35;//res[0]
                        data_save.userid = res[9]

                        propss.doCreateClient(data_save);
                    }

                });

                localStorage['ClientImportData'] = fr.result;

            }
            fr.readAsDataURL(files[0]);

        }
        else {
            //NO FILE SELECTED
            //localStorage["UserImage"] = "";
        }


        //this.props.doCreateClient(JSON.stringify(data_save));
        //this.props.onSubmit(JSON.stringify(data_save));
        // let formData = this.state.form && { ...this.state.form } || {};
        // console.log(formData, "formDatatatatata");

        //let fields = Object.keys(formData);
        //this.props.onSubmit(formData);
        // if(fields.length < 1){
        //     return;
        // }
        // this.setState({
        //     touched: fields
        // }, () => {
        //         if(typeof this.props.onSubmit == 'function'){
        // this.props.onSubmit(formData);
        //      }

        // });
    }


}

//export default connect()(withRouter(ImportClientCsv));

const mapStateToProps = ({ userInfo, clientCreate }) => ({
    userInfo,
    clientCreate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doCreateClient: ActionCreators.doCreateClient
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ImportClientCsv));