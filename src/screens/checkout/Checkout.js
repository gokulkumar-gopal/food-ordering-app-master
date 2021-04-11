import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import { FormControl, InputLabel, StepContent, StepLabel, Tabs } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { AppBar } from '@material-ui/core';
import { Tab } from '@material-ui/core';
import { Step } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { Select } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import './Checkout.css'
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

const styles = {
    tilebar: {
        background: "white"
    },
    button: {
        marginTop: '2%',
        marginRight: '2%'
    },
    gridtile: {
        border: '1px solid red'
    },
    formControl: {
        minWidth: 120
    },
    helptext: {
        color: "red"
    }
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currtab: 'one',
            addresses: {},
            base_url: "address/customer",
            states_array: "",
            paymentMethods: "",
            state_id: "",
            state_selected: false,
            state_open: false,
            order_address_id: "",
            address_selected: false,
            delivery_completed: false,
            payment_completed: false,
            payment_method: "",
            step: 0,
            new_flat_number: "",
            new_locality: "",
            new_city: "",
            new_pincode: 0
        }
    }

    componentWillMount() {
        // Get upcoming movies
        let varAddresses = "";
        let that = this;
        let data = null;
        let xhr = new XMLHttpRequest();
        this.setState({ loading: true });
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                varAddresses = JSON.parse(this.responseText);
                that.setState({ addresses: varAddresses, loading: false });
            }
        });
        xhr.open("GET", this.props.baseUrl + this.state.base_url);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Authorization", "Bearer eyJraWQiOiIzMzMzN2MxNi0zOTcxLTQzZjMtYmZiOS1kNmQ4YjA0Mjk5Y2IiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJmNjQ3YTAxNy1hMTM3LTQ1OGUtYWY1ZC04MGZkMTZjNDliNzgiLCJpc3MiOiJodHRwczovL0Zvb2RPcmRlcmluZ0FwcC5pbyIsImV4cCI6MTYxODExMSwiaWF0IjoxNjE4MDgyfQ.bOEzMiK5aFGRXC4h_w3GbYhIjTky75cn7tPyLRgq1MOC70sG2OZdr0-NZ3heqV0fhKzkPMGN2eIov5sEwI21dQ");
        xhr.send(data);
    }

    componentDidMount() {
        console.log(this.props.location.state.cartitems);
        console.log(this.props.location.state.restaurant_name);
    }

    a11yProps(index) {
        return {
            id: `wrapped-tab-${index}`,
            'aria-controls': `wrapped-tabpanel-${index}`,
        };
    }

    handleChange = (event, newValue) => {
        this.setState({ currtab: newValue });
    };

    handleStateChange = (event) => {
        this.setState({ state_open: false, state_id: event.target.value });
    }

    captureaddress = (addressid) => {
        this.setState({ order_address_id: addressid });
    }

    capturePaymentMethod = (e) => {
        this.setState({ payment_method: e.target.value });
    }

    captureFlatNumber = (e) => {
        this.setState({ new_flat_number: e.target.value });
    }

    captureLocality = (e) => {
        this.setState({ new_locality: e.target.value });
    }

    captureCity = (e) => {
        this.setState({ new_city: e.target.value });
    }

    capturePincode = (e) => {
        this.setState({ new_pincode: e.target.value });
    }

    completeDelivery = () => {
        if (this.state.order_address_id !== "") {
            this.setState({ step: 1, delivery_completed: true });
            this.fetchPayment();
        }
    }

    completePayment = () => {
        if (this.state.payment_method !== "") {
            this.setState({ payment_completed: true, step: -1 });
        }
    }

    redoSelection = () => {
        this.setState({ step: 0, delivery_completed: false, payment_completed: false });
        console.log(this.state.payment_method);
        console.log(this.state.order_address_id);
    }

    fetchStates = () => {
        let varStates = "";
        let xhr = new XMLHttpRequest();
        let data = null;
        let that = this;
        this.setState({ loading: true });
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                varStates = JSON.parse(this.responseText);
                that.setState({ states_array: varStates, loading: false, state_selected: true, state_open: true });
            }
        });
        xhr.open("GET", this.props.baseUrl + "states");
        xhr.send(data);
    }

    fetchPayment = () => {
        let varPayment = "";
        let xhr = new XMLHttpRequest();
        let data = null;
        let that = this;
        this.setState({ loading: true });
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                varPayment = JSON.parse(this.responseText);
                that.setState({ paymentMethods: varPayment, loading: false });
            }
        });
        xhr.open("GET", this.props.baseUrl + "payment");
        xhr.send(data);
    }

    render() {
        const { classes } = this.props;

        if (this.state.loading) {
            return (<div>Loading....</div>)
        }

        return (
            <div className="checkoutpage">
                <Stepper orientation="vertical" className="stepper" activeStep={this.state.step}>
                    <Step completed={this.state.delivery_completed}>
                        <StepLabel>Delivery</StepLabel>
                        <StepContent>
                            <div>
                                <AppBar position="static">
                                    <Tabs value={this.state.currtab} onChange={this.handleChange} aria-label="Addresses">
                                        <Tab value="one" label="EXISTING ADDRESS"  {...this.a11yProps('one')} />
                                        <Tab value="two" label="NEW ADDRESS" {...this.a11yProps('two')} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={this.state.currtab} index='one' className="tabpanel">
                                    <GridList className="gridlist" cols={3} cellHeight={250}>
                                        {this.state.addresses.addresses.map((address) => (
                                            <GridListTile classes={{ root: this.state.order_address_id === address.id && classes.gridtile }} key={address.id} >
                                                <Typography>{address.flat_building_name}</Typography>
                                                <Typography>{address.locality}</Typography>
                                                <Typography>{address.city}</Typography>
                                                <Typography>{address.state.state_name}</Typography>
                                                <Typography>{address.pincode}</Typography>
                                                <GridListTileBar classes={{ root: classes.tilebar, titlePositionBottom: classes.tilebar }}
                                                    actionIcon={
                                                        <IconButton onClick={(e) => this.captureaddress(address.id)}>
                                                            <CheckCircleIcon className={this.state.order_address_id === address.id ? "iconcolor" : ""} />
                                                        </IconButton>
                                                    }
                                                />
                                            </GridListTile>
                                        ))}
                                    </GridList>
                                </TabPanel>
                                <TabPanel value={this.state.currtab} index='two'>
                                    <FormControl className={classes.formControl} required>
                                        <InputLabel htmlFor="flat_building_number" >Flat / Building No.</InputLabel>
                                        <Input id="flat_building_number" flat_building_number={this.state.new_flat_number} onChange={this.captureFlatNumber} />
                                        <FormHelperText classes={{ root: classes.helptext }}>required</FormHelperText>
                                    </FormControl><br /><br />
                                    <FormControl className={classes.formControl} required>
                                        <InputLabel htmlFor="locality" >Locality</InputLabel>
                                        <Input id="locality" locality={this.state.new_locality} onChange={this.captureLocality} />
                                        <FormHelperText classes={{ root: classes.helptext }}>required</FormHelperText>
                                    </FormControl><br /><br />
                                    <FormControl className={classes.formControl} required>
                                        <InputLabel htmlFor="city" >City</InputLabel>
                                        <Input id="city" city={this.state.new_city} onChange={this.captureCity} />
                                        <FormHelperText classes={{ root: classes.helptext }}>required</FormHelperText>
                                    </FormControl><br /><br />
                                    <FormControl className={classes.formControl} required>
                                        <InputLabel htmlFor="state" >State</InputLabel>
                                        <Select open={this.state.state_open}
                                            value={this.state.state_id}
                                            onOpen={this.fetchStates}
                                            onChange={this.handleStateChange}
                                            className={classes.formControl}
                                        >
                                            {this.state.state_selected && this.state.states_array.states.map((state_i) => (
                                                <MenuItem id={state_i.id} value={state_i.state_name}>{state_i.state_name}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText classes={{ root: classes.helptext }}>required</FormHelperText>
                                    </FormControl><br /><br />
                                    <FormControl required>
                                        <InputLabel htmlFor="pincode" >Pincode</InputLabel>
                                        <Input id="pincode" pincode={this.state.new_pincode} onChange={this.capturePincode} />
                                        <FormHelperText classes={{ root: classes.helptext }}>required</FormHelperText>
                                    </FormControl><br /><br />
                                    <div>
                                        <Button variant="contained" color="secondary">
                                            Save Address
                                        </Button>
                                    </div>
                                </TabPanel>
                            </div>
                            <div >
                                <div>
                                    <Button
                                        disabled={false}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.completeDelivery}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                    <Step className="payment" completed={this.state.payment_completed}>
                        <StepLabel>Payment</StepLabel>
                        <StepContent className="payment">
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Select Mode of Payment</FormLabel>
                                <RadioGroup aria-label="paymentmodes" name="paymentmode" value={this.state.payment_method} onChange={this.capturePaymentMethod}>
                                    {this.state.delivery_completed && this.state.paymentMethods.paymentMethods.map((payment) => (
                                        <FormControlLabel key={payment.id} value={payment.id} control={<Radio />} label={payment.payment_name} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <div >
                                <div>
                                    <Button
                                        disabled={false}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.completePayment}
                                    >
                                        Finish
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
                {this.state.payment_completed &&
                    <div className="summarytext">
                        <Typography variant="h5">View the summary & place your order now !</Typography><br />
                        <Button variant="contained" onClick={this.redoSelection}>Change</Button>
                    </div>
                }
            </div>
        )
    }

}

export default withStyles(styles)(Checkout);