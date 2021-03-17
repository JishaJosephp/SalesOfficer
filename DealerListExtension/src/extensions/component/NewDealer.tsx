import * as React from 'react';
import { IDealerProps } from './IDealerProps';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, DialogFooter, Panel, Spinner, SpinnerType, PanelType, IPanelProps } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import * as moment from 'moment';
export interface IDealerState {

    dealername: any;
    contactnumber: any;
    contactnumbererrormsg: any;
    Address: any;
    Coordinates: any;
    location: any;
    district: any;

    locationoption: any[];
    permanentdealer:any;
    districtoption: any[];
    state: any;
    stateoption: any[];
    mandatory: boolean;
}

export default class NewDealer extends React.Component<IDealerProps, IDealerState> {
    public contactflag: any;
    public constructor(props: IDealerProps) {
        super(props);
        this.state = {

            dealername: "",
            contactnumber: null,
            contactnumbererrormsg: "",
            Address: "",
            Coordinates: "",
            location: null,
            permanentdealer:null,
            district: null,

            locationoption: [],

            districtoption: [],
            state: null,
            stateoption: [],
            mandatory: true

        };

        this._oncontactnumberchange = this._oncontactnumberchange.bind(this);
        this.locationChange = this.locationChange.bind(this);

        this.districtChange = this.districtChange.bind(this);
        this.stateChange = this.stateChange.bind(this);

    }
    private _onCancel = () => {
        this.props.onClose();
        this.setState({

            dealername: "",
            contactnumber: null,
            contactnumbererrormsg: "",
            Address: "",
            Coordinates: "",
            location: null,

            district: null,
            state: null,
            mandatory: true
        })
    }
    public dealerarray = [];
    public async componentDidMount() {

       
        let statearray = [];


        const stateitems: any[] = await sp.web.lists.getByTitle("States").items.select("Title,ID").getAll();
        console.log("stateitems" + stateitems);
        for (let i = 0; i < stateitems.length; i++) {

            let data = {
                key: stateitems[i].Id,
                text: stateitems[i].Title
            };

            statearray.push(data);
        }
        this.setState({
            stateoption: statearray
        });

    }


    public dealerChanged = (ev: React.FormEvent<HTMLInputElement>, name?: any) => {
        //console.log(option.key);

        this.setState({ dealername: name });

    }
    public async locationChange(option: { key: any; text: any }) {
        //console.log(option.key);
        this.setState({ location: option.key });
        console.log(this.state.location);
        const locationitems: any[] = await sp.web.lists.getByTitle("Location").items.select("Coordinates", "Title").filter("Title eq '" + option.text + "' ").get();
        this.setState({ Coordinates: locationitems[0].Coordinates });
    }
    public async stateChange(option: { key: any; }) {



        let districtarray = [];
        this.setState({ state: option.key });
        this.setState({ Coordinates: "" });
        this.setState({ district: null });
        this.setState({ location: null });
        const districtitems: any[] = await sp.web.lists.getByTitle("Districts").items.select("Title,ID").filter(" StateId eq " + option.key).getAll();
        console.log("district" + districtitems);
        for (let i = 0; i < districtitems.length; i++) {

            let data = {
                key: districtitems[i].Id,
                text: districtitems[i].Title
            };

            districtarray.push(data);
        }
        this.setState({
            districtoption: districtarray
        });
    }
    public async districtChange(option: { key: any; }) {



        let locationarray = [];
        this.setState({ district: option.key });
        this.setState({ Coordinates: "" });
        const locationitems: any[] = await sp.web.lists.getByTitle("Location").items.select("Title,ID").filter(" DistrictsId eq " + option.key).getAll();
        console.log("location" + locationitems);
        for (let i = 0; i < locationitems.length; i++) {

            let data = {
                key: locationitems[i].Id,
                text: locationitems[i].Title
            };

            locationarray.push(data);
        }
        this.setState({
            locationoption: locationarray
        });


    }
    public _oncontactnumberchange = (ev: React.FormEvent<HTMLInputElement>, mob?: any) => {
        this.setState({ contactnumber: mob });
        let mnum = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        let mnum2 = /^(\+\d{1,3}[- ]?)?\d{11}$/;
        //let mnum = /^(\+\d{1,3}[- ]?)$/;
        if (mob.match(mnum) || mob.match(mnum2) || mob == "" || mob == null) {
            this.setState({ contactnumbererrormsg: '' });
            this.contactflag = 1;

        }
        else {
            this.setState({ contactnumbererrormsg: 'Please enter a valid mobile number' });
            this.contactflag = 0;
        }
    }
    // public onplannedvisittimechange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

    //     //alert(newValue);
    //     this.setState({ plannedvisittime: newValue });


    // }
    public Addresschange = (ev: React.FormEvent<HTMLInputElement>, Address?: any) => {

        this.setState({ Address: Address });

    }
    private permanentdealerChange(e) {
        let isChecked = e.target.checked;
        console.log(isChecked);
     
        this.setState({ permanentdealer: isChecked });
        

    }
    public update = async () => {
        let status;
        console.log(this.state.permanentdealer);
        if(this.state.permanentdealer==true){
            status="Approved";
        }
        else{
            status="Pending";
        }
        let siteUrl = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication";
        let web = Web(siteUrl);
        if (this.state.dealername == "" || this.state.dealername == undefined 
        || this.state.Address == "" || this.state.Address == undefined 
        || this.state.contactnumber == null || this.state.contactnumber == "" || this.state.contactnumber == undefined 
        || this.state.state == null || this.state.state == undefined
         || this.state.district == null || this.state.district == undefined
         || this.state.location == null || this.state.location == undefined) {
            this.setState({ mandatory: false });
        }
        else if (this.contactflag == 0) {
            this.setState({ contactnumbererrormsg: 'Please enter a valid mobile number' });
            this.setState({ mandatory: true });
        }
        else {
            let conf = confirm("Do you want to submit?");
            if (conf == true) {

                sp.web.lists.getByTitle("Dealer List").items.add({

                    Title: this.state.dealername,
                    StateId: this.state.state,

                    DistrictId: this.state.district,

                    ContactNumber: this.state.contactnumber,
                    City_x002f_LocationId: this.state.location,
                    Status:status,
                    Address1: this.state.Address,
                    Coordinates: this.state.Coordinates


                }).then(i => {
                    this._onCancel();
                })
            }

        }



    }
    public render(): React.ReactElement<IDealerProps> {

        let { isOpen } = this.props;
        return (

            <Panel isOpen={isOpen} type={PanelType.custom}
                customWidth={'800px'} onDismiss={this._onCancel}>
                <h3>New Dealer</h3>
                <Label >Dealer Name</Label>  <TextField id="dept"
                    placeholder="Enter Name"
                    value={this.state.dealername}

                    onChange={this.dealerChanged}
                    required={true}
                //onChange={this.deptChanged}
                />
                <p><Label >Address</Label>
                    < TextField value={this.state.Address} onChange={this.Addresschange} multiline required={true} ></TextField></p>
                <p><Label >State</Label>  <Dropdown id="dept"
                    placeholder="Select an option"
                    selectedKey={this.state.state}
                    options={this.state.stateoption}
                    //onChanged={this.dChanged}
                    onChanged={this.stateChange}
                    required={true}
                /></p>

                <p><Label >District</Label>  <Dropdown id="dept"
                    placeholder="Select an option"
                    selectedKey={this.state.district}
                    options={this.state.districtoption}
                    //onChanged={this.dChanged}
                    onChanged={this.districtChange}
                    required={true}
                /></p>
                <p><Label >City/Location</Label>  <Dropdown id="dept"
                    placeholder="Select an option"
                    selectedKey={this.state.location}
                    options={this.state.locationoption}
                    //onChanged={this.dChanged}
                    onChanged={this.locationChange}
                    required={true}

                /></p>

                <p><Label >Contact Number </Label>
                    < TextField value={this.state.contactnumber} onChange={this._oncontactnumberchange} errorMessage={this.state.contactnumbererrormsg} required={true}   ></TextField></p>
                <p><Label >Coordinates </Label>
                    <TextField

                        //defaultValue="07:30"
                        value={this.state.Coordinates}
                        disabled={true}
                    //onChange={this.onplannedvisittimechange}
                    //required={true}

                    /></p>
                <p><Checkbox label="Permanent Dealer?" checked={this.state.permanentdealer} onChange={e => this.permanentdealerChange(e)} /></p>
                <div hidden={this.state.mandatory}><Label style={{ color: "red" }}>Please fill all mandatory fields</Label></div>
                <DialogFooter>
                    <PrimaryButton text="Save" onClick={this.update} />
                    <PrimaryButton text="Cancel" onClick={this._onCancel} />
                </DialogFooter>
            </Panel>

        );
    }



}