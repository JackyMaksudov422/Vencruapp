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
                            <input id="ItemImportData" type='file'

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

{/* <a href="data:text/csv;charset=utf-8,'+escape(/static/media/itemss.csv)+'" download="/static/media/itemss.csv">download</a> */}

       
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
        if (prevProps.itemCreate.isFetching && !this.props.itemCreate.isFetching) {
            if (this.props.itemCreate.errorMessage) {
                this.props.showSnackbar(this.props.itemCreate.errorMessage, { variant: 'error' });
            }
            else {
                this.props.showSnackbar('New iteme created.', { variant: 'success' });
                this.props.history.goBack();
            }
        }
    }
    componentWillUnmount() {
        if (typeof this.props.setRef == 'function') {
            this.props.setRef(undefined);
        }
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
        isFetching: this.props.itemCreate.isFetching
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
    cancel() {

        this.props.history.goBack();
    }

    handlSubmit(data) {
        data.preventDefault();
        var propss = this.props;
        console.log(propss, "propssss");
        let business = this.currentBusiness();
        console.log('rrrrrrrrrrrrrrrrrrrrrrrr');
        var data_save = {};
        var input = document.getElementById('ItemImportData');
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
                        // {"productname":"1","stocknumber":"3","unitprice":"3","description":"2","businessid":35,"userid":"ff2d108a-63f0-49b0-b74a-ff005144647c"}
                        // {"CompanyName":"1","CompanyEmail":"2","City":"3","BusinessId":35,"userid":"ff2d108a-63f0-49b0-b74a-ff005144647c"}
                        //ff2d108a-63f0-49b0-b74a-ff005144647c

                        data_save.productname = res[1];
                        data_save.stocknumber = res[0];
                        data_save.unitprice = res[3];
                        data_save.description = res[2];
                        data_save.businessid = business && business.id || null
                        //                        data_save.userid = "ff2d108a-63f0-49b0-b74a-ff005144647c"

                        propss.doCreateItem(data_save);
                    }

                });

                localStorage['ItemsImportData'] = fr.result;

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

const mapStateToProps = ({ userInfo, itemCreate }) => ({
    userInfo,
    itemCreate
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    showAlertDialog: ActionCreators.showAlertDialog,
    showSnackbar: ActionCreators.showSnackbar,
    doCreateItem: ActionCreators.doCreateItem
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ImportClientCsv));