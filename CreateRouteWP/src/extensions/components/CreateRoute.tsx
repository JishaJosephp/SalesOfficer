import * as React from 'react';
import { IRouteProps } from './IRouteProps';
// import styles from './CreateRoute.module.scss';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import {
    TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton,  Panel, Spinner, SpinnerType, PanelType, IPanelProps,
     Button, ButtonType
} from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { sp } from "@pnp/sp";
import "@pnp/sp/site-groups";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import * as moment from 'moment';
import * as _ from 'lodash';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import { useMediaQuery } from 'react-responsive';
import { confirmAlert } from 'react-confirm-alert'; // Import
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog'
import 'react-select-plus/dist/react-select-plus.css';
import Select from 'react-select';

export interface IRouteindex {
    Id: any;
    index: any;
}
export interface IRouteState {
    firstDayOfWeek?: DayOfWeek;
    planneddate: any;
    dealername: any;
    contactnumber: any;
    contactnumbererrormsg: any;
    remarks: any;
    plannedvisittime: any;
    location: any;
    district: any[];
    assignto: any;
    dealeroption: any[];
    locationoption: any[];
    assigntooption: any[];
    districtoption: any[];
    state: any[];
    selectedstate: any;
    selecteddistrict: any;
    selectedhour: any;
    selectedmin: any;
    mandatory: boolean;
    locationid: any;
    hideapprover: boolean;
    currentuser: any;
    dealertitle: any;
    currentuserid: any;
    assign: any;
    dealerbusy: boolean;
    nouser: boolean;
    nodealer: boolean;
    nouserdealer: boolean;
    routedatalist: any[];
    assignname: any;
    // datedisable: boolean;
    routeindex: IRouteindex;
    pincode: any;
    pinerrormsg: any;
    nopin: boolean;
    dontknowpin: boolean;
    pin: boolean;
    assignbusy: boolean;
    adddisable: boolean;
    updatedisable: boolean;
    siteurl: string;
    isOpenDialog: boolean;
    message: string;
    dialogButton: string;
    itemId: any;
    deleteData: any[];
    userdataidState: any;
    dealerdataarray: any[];
    multiselected: any[];
    dealerkey: any[];
    multidealer: boolean;
    isOpen:boolean;
    DialogeAlertContent:any;

}
const DayPickerStrings: IDatePickerStrings = {
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',
};
const controlClass = mergeStyleSets({
    control: {
        margin: '0 0 15px 0',
        width: ''

    },
});

export default class CreateRoute extends React.Component<IRouteProps, IRouteState> {
    public contactflag: any;
    public multiarray = [];
    public arr = [];
    public data: any = [];
    public dealerarray = [];
    public salesuseritems: any[];
    private addroute = [];
    public constructor(props: IRouteProps) {
        super(props);
        this.state = {
            planneddate: null,
            dealername: null,
            contactnumber: null,
            contactnumbererrormsg: "",
            remarks: "",
            plannedvisittime: "",
            location: "",
            assignto: null,
            //district: null,
            dealeroption: [],
            locationoption: [],
            assigntooption: [],
            districtoption: [],
            state: [],
            pincode: "",
            district: [],
            selectedstate: "",
            selecteddistrict: "",
            selectedhour: "",
            selectedmin: "",
            mandatory: true,
            locationid: "",
            hideapprover: false,
            currentuser: "",
            dealertitle: "",
            currentuserid: "",
            assign: "",
            dealerbusy: true,
            nouser: true,
            nodealer: true,
            nouserdealer: true,
            routedatalist: [],
            assignname: "",
            // datedisable: false,
            routeindex: {
                Id: null,
                index: null
            },
            pinerrormsg: "",
            nopin: true,
            dontknowpin: true,
            pin: false,
            assignbusy: true,
            adddisable: false,
            updatedisable: false,
            siteurl: '',
            isOpenDialog: false,
            message: '',
            dialogButton: "Ok",
            itemId: '',
            deleteData: [],
            userdataidState: '',
            dealerdataarray: [],
            multiselected: [],
            dealerkey: [],
            multidealer: true,
            isOpen:false,
            DialogeAlertContent:'',

        };
        this.dealerChanged = this.dealerChanged.bind(this);
        this._oncontactnumberchange = this._oncontactnumberchange.bind(this);
        // this.locationChange = this.locationChange.bind(this);
        this.assigntoChange = this.assigntoChange.bind(this);
        this.districtChange = this.districtChange.bind(this);
        this.stateChanged = this.stateChanged.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this.Addroute = this.Addroute.bind(this);
        this.UpdateRoutedatalist = this.UpdateRoutedatalist.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.close = this.close.bind(this);
    }

    //Intialize click
    public async componentDidMount() {
        //Get User
        try {
            let user = await sp.web.currentUser();
            this.setState({
                currentuser: user.Title,
                currentuserid: user.Id,

            });
        }
        catch { }
        //User in HO Group
        try {
            let grp1: any[] = await sp.web.siteGroups.getByName("HOAdmin").users();
            for (let i = 0; i < grp1.length; i++) {
                if (this.state.currentuserid == grp1[i].Id) {
                    this.setState({
                        hideapprover: false
                    });
                }

            }
        }
        catch { }
        //User in SO Group
        try {
            let grp2: any[] = await sp.web.siteGroups.getByName("SalesOfficer").users();
            for (let i = 0; i < grp2.length; i++) {
                if (this.state.currentuserid == grp2[i].Id) {
                    this.setState({
                        hideapprover: true
                    });
                }

            }
        }
        catch { }
        let locationarray = [];
        let assigntoarray = [];
        //States Array
        const stateitems: any[] = await sp.web.lists.getByTitle("StateData").items.select("ID,website_id,state").getAll();
        let statearray = [];
        let sorted_State = [];
        for (let i = 0; i < stateitems.length; i++) {

            let statedata = {
                key: stateitems[i].website_id,
                text: stateitems[i].state
            };
            statearray.push(statedata);

        }
        sorted_State = _.orderBy(statearray, 'text', ['asc']);
        this.setState({
            state: sorted_State
        });
        //Get currentsite url
        const rootwebData = await sp.site.rootWeb();
        console.log(rootwebData);
        var webValue = rootwebData.ResourcePath.DecodedUrl;
        //alert(webValue);
        this.setState({
            siteurl: webValue
        });


    }
    // Date Changed
    public _onplanneddateChange = (date?: Date): void => {
        this.setState({
            planneddate: date,
            dealerbusy: true,
            assignbusy: true
        });

        console.log(this.state.planneddate);
    }
    //State Changed
    public async stateChanged(option: { key: any; text: any }) {
        console.log(option.key);
        this.setState({ selectedstate: option.key });
        const items: any[] = await sp.web.lists.getByTitle("DistrictData").items.select("ID,district,website_id").filter(" state_id eq " + option.key).getAll(5000);
        console.log(items);

        let sorted_District = [];
        let filtereddistrict = [];
        for (let i = 0; i < items.length; i++) {
            let districtdata = {
                key: items[i].website_id,
                text: items[i].district
            };


            filtereddistrict.push(districtdata);
        }
        sorted_District = _.orderBy(filtereddistrict, 'text', ['asc']);
        this.setState({
            district: sorted_District,
            pincode: ""
        });

    }
    //District Changed
    public async districtChange(option: { key: any; }) {
        let user1 = await sp.web.currentUser();
        this.setState({
            currentuser: user1.Title,
            currentuserid: user1.Id,

        });
        let dealerarray = [];
        let assigntoarray = [];
        let userid;
        let assign;
        let user;
        let username;
        this.setState({
            nodealer: true,
            nouser: true,
            nouserdealer: true
        });
        this.setState({ selecteddistrict: option.key });
        // Filter Dealer based on district
        let sorted_Dealer = [];
        const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.select("ID,dealer_name,website_id").filter(" district eq " + option.key).getAll(5000);

        for (let i = 0; i < dealeritems.length; i++) {


            let dealer = {
                value: dealeritems[i].ID,
                label: dealeritems[i].dealer_name
            };
            dealerarray.push(dealer);
        }
        sorted_Dealer = _.orderBy(dealerarray, 'text', ['asc']);
        this.setState({
            dealeroption: sorted_Dealer
        });
        const useritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" UserType eq 'Sales'").getAll(5000);
        console.log(useritems);
        //Filter Assign based on district
        this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").getAll(5000);
        console.log("salesusers" + this.salesuseritems);

        let sorted_Assign = [];
        for (let i = 0; i < this.salesuseritems.length; i++) {
            if (this.salesuseritems[i].DistrictId == option.key) {
                user = {
                    key: this.salesuseritems[i].Id,
                    text: this.salesuseritems[i].Title
                };

                assigntoarray.push(user);
                sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);
            }

            if (this.state.hideapprover == true) {
                if (this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                    user = {
                        key: this.salesuseritems[i].Id,
                        text: this.salesuseritems[i].Title
                    };
                    assign = this.salesuseritems[i].UserNameId;
                    userid = user.key;
                    username = user.text;
                    assigntoarray.push(user);
                    sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);
                }
            }

        }
        this.setState({
            assigntooption: sorted_Assign,
            assignto: userid,
            assign: assign,
            assignname: username

        });
        //Validation
        if (this.state.dealeroption.length == 0 && this.state.assigntooption.length == 0) {
            this.setState({
                nouserdealer: false

            });
        }
        else if (this.state.dealeroption.length == 0) {
            this.setState({
                nodealer: false

            });
        }
        else if (this.state.assigntooption.length == 0) {
            this.setState({
                nouser: false

            });
        }
        else { }

    }
    public async dealerChanged(dealerkey) {

        this.setState({ dealerkey });

        console.log(dealerkey.length);
        console.log(dealerkey);


    }
    //On Contact Number changed
    public _oncontactnumberchange = (ev: React.FormEvent<HTMLInputElement>, mob?: any) => {
        this.setState({ contactnumber: mob });
        let mnum = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        let mnum2 = /^(\+\d{1,3}[- ]?)?\d{11}$/;

        if (mob.match(mnum) || mob.match(mnum2) || mob == null) {
            this.setState({ contactnumbererrormsg: '' });
            this.contactflag = 1;

        }
        else {
            this.setState({ contactnumbererrormsg: 'Please enter a valid mobile number' });
            this.contactflag = 0;
        }
    }
    //On Remarks changed 
    public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {

        this.setState({ remarks: remarks });

    }
    //On Assigned to Changed
    public assigntoChange(option: { key: any; text: any }) {
        console.log(option);
        let assign;
        for (let i = 0; i < this.salesuseritems.length; i++) {
            if (option.key == this.salesuseritems[i].Id) {
                assign = this.salesuseritems[i].UserNameId;
            }
        }
        this.setState({
            assignto: option.key,
            assign: assign,
            assignname: option.text

        });
    }
    //On hour Changed
    public hour(option: { key: any; }) {
        console.log(option.key);
        this.setState({
            selectedhour: option.key,


        });

    }
    //On min Changed
    public min(option: { key: any; }) {
        console.log(option.key);
        this.setState({
            selectedmin: option.key,


        });
    }
    //On update to cancel
    public update = async () => {
        this._onCancel();
    }
    //On grid edit
    public EditRoutedatalist = async (item) => {
        console.log(item);
        console.log(this.state.routedatalist);
        this.setState({
            updatedisable: false,
            multidealer: false
        });
        let dealerarray = [];
        let assigntoarray = [];
        let multidealeredit = [];
        let userid;
        let assign;
        let user;
        let username;
        let locpin;
        let districtitem;
        let sorted_Assign = [];
        let sorted_Dealer = [];
        var index = this.state.routedatalist.indexOf(item);
        //No Pincode
        if (item.Pincode == "" || item.Pincode == undefined) {
            this.setState({
                dontknowpin: false,
                pin: true,

            });

            //Filter dealer
            const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.select("ID,dealer_name,website_id").filter(" district eq " + item.DistrictId).getAll(5000);

            for (let i = 0; i < dealeritems.length; i++) {


                let dealer = {
                    value: dealeritems[i].ID,
                    label: dealeritems[i].dealer_name
                };
                dealerarray.push(dealer);
            }
            sorted_Dealer = _.orderBy(dealerarray, 'text', ['asc']);
            this.setState({
                dealeroption: sorted_Dealer
            });
            //Filter Assign
            const useritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" UserType eq 'Sales'").getAll(5000);
            console.log(useritems);

            this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").getAll(5000);
            console.log("salesusers" + this.salesuseritems);


            for (let i = 0; i < this.salesuseritems.length; i++) {
                if (this.salesuseritems[i].DistrictId == item.DistrictId || this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                    user = {
                        key: this.salesuseritems[i].Id,
                        text: this.salesuseritems[i].Title
                    };

                    assigntoarray.push(user);
                    sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);
                }

                if (this.state.hideapprover == true) {
                    if (this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                        user = {
                            key: this.salesuseritems[i].Id,
                            text: this.salesuseritems[i].Title
                        };
                        assign = this.salesuseritems[i].UserNameId;
                        userid = user.key;
                        username = user.text;
                        assigntoarray.push(user);
                        sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);

                    }
                }

            }
            this.setState({
                assigntooption: sorted_Assign,
                assignto: userid,
                assign: assign,
                assignname: username

            });

        }
        else {
            this.setState({
                dontknowpin: true,
                pin: false,

            });
            //With Pincode
            locpin = item.Pincode;
            //Filter Dealer
            const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.filter(" pin eq " + locpin).getAll(5000);
            console.log(dealeritems);

            for (let i = 0; i < dealeritems.length; i++) {


                let dealer = {
                    value: dealeritems[i].ID,
                    label: dealeritems[i].dealer_name
                };
                districtitem = dealeritems[i].district;

                dealerarray.push(dealer);
                sorted_Dealer = _.orderBy(dealerarray, 'text', ['asc']);
            }

            this.setState({
                dealeroption: sorted_Dealer
            });

            //Filter Assign
            this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").getAll(5000);
            for (let i = 0; i < this.salesuseritems.length; i++) {
                if (this.salesuseritems[i].DistrictId == districtitem || this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                    user = {
                        key: this.salesuseritems[i].Id,
                        text: this.salesuseritems[i].Title
                    };

                    if (assigntoarray.indexOf(user) == -1) {
                        assigntoarray.push(user);
                        sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);
                    }
                }
                if (this.state.hideapprover == true) {
                    if (this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                        user = {
                            key: this.salesuseritems[i].Id,
                            text: this.salesuseritems[i].Title
                        };
                        assign = this.salesuseritems[i].UserNameId;
                        userid = user.key;
                        username = user.text;
                        assigntoarray.push(user);
                        sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);

                    }
                }


                this.setState({
                    assigntooption: sorted_Assign,
                    assignto: userid,
                    assign: assign,
                    assignname: username

                });
            }

        }
        //Get Index
        let routeindex: IRouteindex;
        routeindex = {
            Id: item.ID,
            index: index
        };
        multidealeredit[0] = {
            value: item.DealerNameId,
            label: item.ViewDealerName
        };

        this.setState({ routeindex: routeindex });
        this.setState({

            selectedstate: item.StateId,
            selecteddistrict: item.DistrictId,
            dealerkey: multidealeredit,
            contactnumber: item.ContactNumber,
            location: item.Location,
            assignto: item.AssignToId,
            remarks: item.Remarks,
            selectedhour: item.Hour,
            selectedmin: item.Minute,
            locationid: item.LocationsId,
            pincode: item.Pincode
        });
    }
    //On grid delete
    public DeleteRoutedatalist = async (data) => {

        console.log(data);


        this.setState({
            dialogButton: "Delete",
            isOpenDialog: true,
            message: "Are you sure you want to delete the data?",
            itemId: data.ID,
            deleteData: data
        });


    }
    //On add route
    private Addroute = async (e) => {
        console.log(this.state.assign);
        console.log(this.state.assignto);
        console.log(this.state.dealerkey);
        console.log(this.state.pincode);
        this.setState({ mandatory: true, dealerbusy: true, assignbusy: true, adddisable: true });
        let itemId;
        let route;
        let assignbusy;
        let aprvday;
        let addaprv;
        let userdataid;
        let loc = "";
        let ph = "";
        let locid;
        let pin;
        let dealname = "";
        this.addroute = this.state.routedatalist;
        let newitemid;
        this.data = [];
        var currentdate = new Date();
        let today = moment(currentdate).format('YYYY-MM-DDTHH:mm:00');
        let currentMonth = moment(today).format("MM");
        let currentDay = moment(today).format("DD");
        let planneddate = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        let planneddateformat = moment(this.state.planneddate).format('DD-MMM-YYYY');
        let date = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        let plannedday = moment(this.state.planneddate).format('DD');
        let plannedMonth = moment(this.state.planneddate).format('MM');
        //Select Dealers
        for (let j = 0; j < this.state.dealerkey.length; j++) {
            const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.filter(" ID eq " + this.state.dealerkey[j].value).getAll(5000);
            console.log(dealeritems);

            ph = dealeritems[0].phone;
            loc = dealeritems[0].street;
            dealname = dealeritems[0].dealer_name;

            if (this.state.pin == false) {
                pin = dealeritems[0].pin;

            }
            console.log("Phone:" + ph + "loc:" + loc);

            this.data[this.data.length] = {
                "phonenumber": ph,
                "location": loc,
                "dealname": dealname,
                "pincode": pin,
                "dealername": this.state.dealerkey[j].value
            };
        }

        this.setState({
            contactnumber: ph,
            location: loc,
            dealertitle: dealname,
            pincode: pin,
            dealerdataarray: this.data
        });
        //Check Route List
        const routeData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
                + this.state.dealername + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
                + date + "</Value></Eq></And><And><Eq><FieldRef Name='Hours' /> <Value Type='Text'>"
                + this.state.selectedhour + "</Value></Eq><Eq><FieldRef Name='Minutes' /> <Value Type='Text'>"
                + this.state.selectedmin + "</Value></Eq></And></And></Where></Query></View>",
        });
        console.log(routeData);
        if (routeData.length == 0) {
            route = "True";
        }
        else {
            route = "False";
        }
        //Check Assign 
        const assignData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='AssignTo' LookupId='TRUE' /><Value Type='Lookup'>"
                + this.state.assignto + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
                + date + "</Value></Eq></And><And><Eq><FieldRef Name='Hours' /> <Value Type='Text'>"
                + this.state.selectedhour + "</Value></Eq><Eq><FieldRef Name='Minutes' /> <Value Type='Text'>"
                + this.state.selectedmin + "</Value></Eq></And></And></Where></Query></View>",
        });
        if (assignData.length == 0) {
            assignbusy = "True";
        }
        else {
            assignbusy = "False";
        }
        //Only if Sales Officer
        if (this.state.hideapprover == true) {
            //Same month
            if (currentMonth == plannedMonth) {
                //Settings List
                const settingday = await sp.web.lists.getByTitle("Settings List").select("Title").getItemsByCAMLQuery({
                    ViewXml: "<View><Query><Where><Eq><FieldRef Name='ValueType' /><Value Type='Choice'>Days</Value></Eq></Where></Query></View>",
                });
                console.log(settingday);
                for (let i = 0; i < settingday.length; i++) {
                    console.log(settingday[i].Title);
                    if (settingday[i].Title < 10) {
                        aprvday = "0" + settingday[i].Title;
                    }
                    else {
                        aprvday = settingday[i].Title;
                    }
                    //Day checking
                    if (aprvday >= currentDay) {
                        addaprv = "add";
                    }
                    else {
                        const userData = await sp.web.lists.getByTitle("Users").getItemsByCAMLQuery({
                            ViewXml: "<View><Query><Where><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
                                + this.state.currentuser + "</Value></Eq></Where></Query></View>",
                        });
                        console.log(userData);
                        for (let i = 0; i < userData.length; i++) {
                            userdataid = userData[i].ID;
                            let extdate = userData[i].ExtendedDate;
                            console.log(extdate);
                            //Compare Today and extended date
                            if (moment(today).isSameOrBefore(extdate)) {
                                addaprv = "add";
                            }
                            else {
                                addaprv = "approve";
                            }
                        }

                    }
                    console.log(addaprv);
                }
            }
            else {
                addaprv = "add";
            }
        }
        //Validation
        if (addaprv == "approve") {

            // this.setState({
            //     dialogButton: "Confirm",
            //     isOpenDialog: true,
            //     message: "You need approval to create route",
            //     userdataidState: parseInt(userdataid)

            // });
            this.setState({dialogButton: "Confirm",userdataidState: parseInt(userdataid), isOpen: true ,message:"You need approval to create route"}); 
        }
        //Validation
        else if (assignbusy == "False") {
            this.setState({ assignbusy: false, adddisable: false, multidealer: false });
        }
        else if (route == "False") {
            this.setState({ dealerbusy: false, adddisable: false, multidealer: false });
        }
        else if (this.state.nouserdealer == false) {
            this.setState({ nouserdealer: false, adddisable: false, multidealer: false });
        }
        else if (this.state.nodealer == false) {
            this.setState({ nodealer: false, adddisable: false, multidealer: false });
        }
        else if (this.state.nouser == false) {
            this.setState({ nouser: false, adddisable: false, multidealer: false });
        }

        else {
            //No pincode
            if (this.state.pin == true) {
                if (planneddate == "" || this.state.selectedhour == "" || this.state.selectedmin == ""
                    || this.state.dealername == "" || this.state.contactnumber == "" || this.contactflag == 0
                    || this.state.location == "" || this.state.assignto == "" || this.state.assignto == undefined
                    || this.state.selectedstate == "" && this.state.selecteddistrict == "") {
                    this.setState({ mandatory: false, adddisable: false });
                }
                else {
                    const stateId: any[] = await sp.web.lists.getByTitle("StateData").items.select("ID").filter(" website_id eq " + this.state.selectedstate).getAll(5000);
                    console.log(stateId);

                    const districtId: any[] = await sp.web.lists.getByTitle("DistrictData").items.select("ID").filter(" website_id eq " + this.state.selecteddistrict).getAll(5000);
                    console.log(districtId);
                    let hrcount = 0;
                    let addhour;
                    if (this.state.dealerdataarray.length == 0) { }
                    else {
                        {
                            this.state.dealerdataarray.map(async (items) => {
                                //Increment time on selecting multiple dealers
                                let inthour = parseInt(this.state.selectedhour) + hrcount;
                                let inchr = inthour + "";

                                if (inthour < 10) {
                                    addhour = '0' + inchr;
                                }
                                else {
                                    addhour = inchr;
                                }
                                hrcount = hrcount + 1;
                                let pdt = moment(this.state.planneddate).format('YYYY-MM-DD' + 'T' + addhour + ':' + this.state.selectedmin + ':00');
                                let notification = this.state.currentuser + " created a route to visit " +  items.dealname + " on "
                                    + planneddateformat + " at " + addhour + ":" + this.state.selectedmin;
                                let plannedtime = addhour + ":" + this.state.selectedmin;
                                //Add item
                                let a = await sp.web.lists.getByTitle("Route List").items.add({
                                    Title: this.state.plannedvisittime,
                                    PlannedDate: planneddate,
                                    StateId: stateId[0].ID,
                                    DistrictId: districtId[0].ID,
                                    DealerNameId: items.dealername,
                                    ContactNumber: items.phonenumber,
                                    Location: items.location,
                                    AssignToId: this.state.assignto,
                                    Remarks: this.state.remarks,
                                    Hours: addhour,
                                    Minutes: this.state.selectedmin,
                                    PlannedDateTime: pdt,
                                    // LocationsId: this.state.locationid,
                                    AssignId: this.state.assign,
                                    Pincode: items.pincode,
                                    Checkin: "1"
                                }).then(async i => {
                                    newitemid = i.data.ID;
                                    if (newitemid != undefined) {
                                        this.addroute.push({
                                            ViewPlannedDate: planneddateformat,
                                            ViewPlannedTime: plannedtime,
                                            ViewDealerName: items.dealname,
                                            ViewAssign: this.state.assignname,
                                            ID: newitemid,
                                            PlannedDate: planneddate,
                                            StateId: this.state.selectedstate,
                                            DistrictId: this.state.selecteddistrict,
                                            DealerNameId: items.dealername,
                                            ContactNumber: items.phonenumber,
                                            Location: items.location,
                                            AssignToId: i.data.AssignToId,
                                            Remarks: i.data.Remarks,
                                            Hour: i.data.Hours,
                                            Minute: i.data.Minutes,
                                            LocationsId: this.state.locationid,
                                            Pincode: items.pincode,
                                            AssignId: i.data.AssignId,
                                        });
                                        this.setState({
                                            routedatalist: this.addroute,

                                        });
                                    }
                                });
                                if (this.state.hideapprover == true) {
                                    //Add notification on salesofficer
                                    await sp.web.lists.getByTitle("Notification").items.add({
                                        DashboardType: "Admin",
                                        Notification: notification,
                                        RouteId: newitemid
                                    });
                                    this.setState({
                                        hideapprover: true

                                    });
                                }
                                if (this.state.hideapprover == false) {

                                    this.setState({
                                        assignto: null,
                                        assign: "",
                                        assignname: "",
                                    });
                                }
                                this.setState({

                                    selectedstate: "",
                                    selecteddistrict: "",
                                    selectedhour: "",
                                    selectedmin: "",
                                    mandatory: true,
                                    planneddate: this.state.planneddate,
                                    dealername: null,
                                    contactnumber: null,
                                    contactnumbererrormsg: "",
                                    remarks: "",
                                    plannedvisittime: "",
                                    location: "",

                                    locationid: "",
                                    currentuser: "",
                                    dealertitle: "",
                                    pin: false,
                                    dontknowpin: true,

                                    nouser: true,
                                    nodealer: true,
                                    nouserdealer: true,

                                    adddisable: false,
                                    dealerkey: [],

                                });


                                this.setState({

                                    message: "Saved successfully",
                                    isOpenDialog: true

                                });

                            });
                        }

                    }

                }
            }
            //With Pincode
            else if (this.state.pin == false) {
                if (planneddate == "" || this.state.selectedhour == "" || this.state.selectedmin == ""
                    || this.state.dealername == "" || this.state.contactnumber == "" || this.contactflag == 0
                    || this.state.location == "" || this.state.assignto == "" || this.state.assignto == undefined || this.state.pincode == "") {
                    this.setState({ mandatory: false, adddisable: false });
                }
                else {
                    let hrcount = 0;
                    let addhour;
                    if (this.state.dealerdataarray.length == 0) { }
                    else {
                        {
                            this.state.dealerdataarray.map(async (items) => {
                                // Increment hour on multiple dealer
                                let inthour = parseInt(this.state.selectedhour) + hrcount;
                                let inchr = inthour + "";

                                if (inthour < 10) {
                                    addhour = '0' + inchr;
                                }
                                else {
                                    addhour = inchr;
                                }
                                hrcount = hrcount + 1;
                                let pdt = moment(this.state.planneddate).format('YYYY-MM-DD' + 'T' + addhour + ':' + this.state.selectedmin + ':00');
                                let notification = this.state.currentuser + " created a route to visit " +  items.dealname + " on "
                                    + planneddateformat + " at " + addhour + ":" + this.state.selectedmin;
                                let plannedtime = addhour + ":" + this.state.selectedmin;
                                //Add Route
                                let a = await sp.web.lists.getByTitle("Route List").items.add({
                                    Title: this.state.plannedvisittime,
                                    PlannedDate: planneddate,
                                    DealerNameId: items.dealername,
                                    ContactNumber: items.phonenumber,
                                    Location: items.location,
                                    AssignToId: this.state.assignto,
                                    Remarks: this.state.remarks,
                                    Hours: addhour,
                                    Minutes: this.state.selectedmin,
                                    PlannedDateTime: pdt,
                                    AssignId: this.state.assign,
                                    Pincode: items.pincode,
                                    Checkin: "1",
                                    StateId: 0,
                                    DistrictId: 0,
                                }).then(async i => {
                                    newitemid = i.data.ID;
                                    if (newitemid != undefined) {
                                        this.addroute.push({
                                            ViewPlannedDate: planneddateformat,
                                            ViewPlannedTime: plannedtime,
                                            ViewDealerName: items.dealname,
                                            ViewAssign: this.state.assignname,
                                            ID: newitemid,
                                            PlannedDate: planneddate,
                                            StateId: this.state.selectedstate,
                                            DistrictId: this.state.selecteddistrict,
                                            DealerNameId: items.dealername,
                                            ContactNumber: items.phonenumber,
                                            Location: items.location,
                                            AssignToId: i.data.AssignToId,
                                            Remarks: i.data.Remarks,
                                            Hour: i.data.Hours,
                                            Minute: i.data.Minutes,
                                            LocationsId: this.state.locationid,
                                            Pincode: items.pincode,
                                            AssignId: i.data.AssignId,
                                        });
                                        this.setState({
                                            routedatalist: this.addroute,

                                        });
                                    }
                                });
                                if (this.state.hideapprover == true) {
                                    //Add Notification to Admin when SO added route
                                    await sp.web.lists.getByTitle("Notification").items.add({
                                        DashboardType: "Admin",
                                        Notification: notification,
                                        RouteId: newitemid
                                    });
                                    this.setState({
                                        hideapprover: true

                                    });
                                }
                                if (this.state.hideapprover == false) {

                                    this.setState({
                                        assignto: null,
                                        assign: "",
                                        assignname: "",
                                    });
                                }
                                this.setState({
                                    // dealeroption:[],
                                    selectedstate: "",
                                    selecteddistrict: "",
                                    selectedhour: "",
                                    selectedmin: "",
                                    mandatory: true,
                                    planneddate: this.state.planneddate,
                                    dealername: null,
                                    contactnumber: null,
                                    contactnumbererrormsg: "",
                                    remarks: "",
                                    plannedvisittime: "",
                                    location: "",

                                    locationid: "",
                                    currentuser: "",
                                    dealertitle: "",
                                    currentuserid: "",

                                    nouser: true,
                                    nodealer: true,
                                    nouserdealer: true,

                                    pincode: this.state.pincode,
                                    pin: false,
                                    dontknowpin: true,
                                    adddisable: false,
                                    dealerdataarray: [],
                                    dealerkey: []
                                });

                                this.setState({

                                    message: "Saved successfully",
                                    isOpenDialog: true

                                });


                            });
                        }
                    }

                }
                this.setState({ adddisable: false });
            }
        }

    }
    //Update grid 
    private async UpdateRoutedatalist() {
        this.setState({ mandatory: true, dealerbusy: true, assignbusy: true, updatedisable: true, multidealer: true, });
        console.log(this.state.routeindex);
        let dealerid;
        console.log(this.state.dealername);
        let assignid = this.state.assignto;
        console.log(this.state.assignto);
        console.log(this.state.assign);
        let dealname = "";
        let assign = "";
        let route = "";
        let assignbusy;
        let aprvday;
        let addaprv;
        let userdataid;
        let loc = "";
        let ph = "";
        let locid;
        let pin;
        this.data = [];
        var index = this.state.routeindex.index;
        var currentdate = new Date();
        let today = moment(currentdate).format('YYYY-MM-DDTHH:mm:00');
        console.log(today);
        let currentMonth = moment(today).format("MM");
        let currentDay = moment(today).format("DD");
        let planneddate = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        let planneddateformat = moment(this.state.planneddate).format('DD-MMM-YYYY');
        let pdt = moment(this.state.planneddate).format('YYYY-MM-DD' + 'T' + this.state.selectedhour + ':' + this.state.selectedmin + ':00');
        let plannedtime = this.state.selectedhour + ":" + this.state.selectedmin;
        let plannedMonth = moment(this.state.planneddate).format('MM');
        let plannedday = moment(this.state.planneddate).format('DD');
        let list = sp.web.lists.getByTitle("Route List");
        //Get editing dealers id
        if (this.state.dealerkey.length == undefined)
            dealerid = this.state.dealerkey["value"];
        else
            dealerid = this.state.dealerkey[0].value;
        console.log(dealerid);
        //Get dealer data
        const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.filter(" ID eq " + dealerid).getAll(5000);
        console.log(dealeritems);

        ph = dealeritems[0].phone;
        loc = dealeritems[0].street;
        dealname = dealeritems[0].dealer_name;

        if (this.state.pin == false) {
            pin = dealeritems[0].pin;

        }

        this.data[this.data.length] = {
            "phonenumber": ph,
            "location": loc,
            "dealname": dealname,
            "pincode": pin,
            "dealername": dealerid
        };
        this.setState({
            contactnumber: ph,
            location: loc,
            dealertitle: dealname,
            pincode: pin,
            dealerdataarray: this.data
        });
        //Get Assign
        const useritems: any = await sp.web.lists.getByTitle("Users").items.getById(assignid).get();
        console.log(useritems);
        assign = useritems.Title;
        let date = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        //Get Route
        const routeData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
                + dealerid + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
                + date + "</Value></Eq></And><And><Eq><FieldRef Name='Hours' /> <Value Type='Text'>"
                + this.state.selectedhour + "</Value></Eq><Eq><FieldRef Name='Minutes' /> <Value Type='Text'>"
                + this.state.selectedmin + "</Value></Eq></And></And></Where></Query></View>",
        });


        console.log(routeData);
        if (routeData.length == 0) {
            route = "True";
        }
        else {
            for (let i = 0; i < routeData.length; i++) {
                if (routeData[i].ID == this.state.routeindex.Id) {
                    route = "True";
                }
                else {
                    route = "False";
                }

            }

        }

        //Get Assign
        const assignData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='AssignTo' LookupId='TRUE' /><Value Type='Lookup'>"
                + this.state.assignto + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
                + date + "</Value></Eq></And><And><Eq><FieldRef Name='Hours' /> <Value Type='Text'>"
                + this.state.selectedhour + "</Value></Eq><Eq><FieldRef Name='Minutes' /> <Value Type='Text'>"
                + this.state.selectedmin + "</Value></Eq></And></And></Where></Query></View>",
        });
        if (assignData.length == 0) {
            assignbusy = "True";
        }
        else {
            for (let i = 0; i < assignData.length; i++) {
                if (assignData[i].ID == this.state.routeindex.Id) {
                    assignbusy = "True";
                }
                else {
                    assignbusy = "False";
                }

            }
        }
        if (this.state.hideapprover == true) {
            //Same month
            if (currentMonth == plannedMonth) {
                //Settings List
                const settingday = await sp.web.lists.getByTitle("Settings List").select("Title").getItemsByCAMLQuery({
                    ViewXml: "<View><Query><Where><Eq><FieldRef Name='ValueType' /><Value Type='Choice'>Days</Value></Eq></Where></Query></View>",
                });
                console.log(settingday);
                for (let i = 0; i < settingday.length; i++) {
                    console.log(settingday[i].Title);
                    if (settingday[i].Title < 10) {
                        aprvday = "0" + settingday[i].Title;
                    }
                    else {
                        aprvday = settingday[i].Title;
                    }
                    if (aprvday >= currentDay) {
                        addaprv = "add";
                    }
                    else {
                        const userData = await sp.web.lists.getByTitle("Users").getItemsByCAMLQuery({
                            ViewXml: "<View><Query><Where><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
                                + this.state.currentuser + "</Value></Eq></Where></Query></View>",
                        });
                        console.log(userData);
                        for (let i = 0; i < userData.length; i++) {
                            userdataid = userData[i].ID;
                            let extdate = userData[i].ExtendedDate;
                            console.log(extdate);
                            if (moment(today).isSameOrBefore(extdate)) {
                                addaprv = "add";
                            }
                            else {
                                addaprv = "approve";
                            }
                        }

                    }
                    console.log(addaprv);
                }
            }
            else {
                addaprv = "add";
            }
        }
        //Validation
        if (addaprv == "approve") {

            this.setState({
                dialogButton: "Confirm",
                isOpenDialog: true,
                message: "You need approval to create route",
                userdataidState: parseInt(userdataid)

            });

            // this._onCancel();
        }
        else if (assignbusy == "False") {
            this.setState({ assignbusy: false, updatedisable: false, multidealer: false });
        }
        else if (route == "False") {
            this.setState({ dealerbusy: false, updatedisable: false, multidealer: false });
        }
        else if (this.state.nouserdealer == false) {
            this.setState({ nouserdealer: false, updatedisable: false, multidealer: false });
        }
        else if (this.state.nodealer == false) {
            this.setState({ nodealer: false, updatedisable: false, multidealer: false });
        }
        else if (this.state.nouser == false) {
            this.setState({ nouser: false, updatedisable: false, multidealer: false });
        }

        else {
            if (this.state.pin == true) {
                //Get State ID
                const stateId: any[] = await sp.web.lists.getByTitle("StateData").items.select("ID").filter(" website_id eq " + this.state.selectedstate).getAll(5000);
                console.log(stateId);
                //Get District ID
                const districtId: any[] = await sp.web.lists.getByTitle("DistrictData").items.select("ID").filter(" website_id eq " + this.state.selecteddistrict).getAll(5000);
                console.log(districtId);


                if (this.state.dealerdataarray.length == 0) { }
                else {
                    {
                        this.state.dealerdataarray.map(async (items) => {
                            //Update Route
                            const i = await list.items.getById(parseInt(this.state.routeindex.Id)).update({


                                PlannedDate: planneddate,
                                StateId: stateId[0].ID,
                                DistrictId: districtId[0].ID,
                                DealerNameId: items.dealername,
                                ContactNumber: items.phonenumber,
                                Location: items.location,
                                AssignToId: this.state.assignto,
                                Remarks: this.state.remarks,
                                Hours: this.state.selectedhour,
                                Minutes: this.state.selectedmin,
                                PlannedDateTime: pdt,
                                Pincode: items.pincode,

                                AssignId: this.state.assign,
                                Checkin: "1"

                            });
                            this.addroute[index] = ({
                                ViewPlannedDate: planneddateformat,
                                ViewPlannedTime: plannedtime,
                                ViewDealerName: items.dealname,
                                ViewAssign: assign,
                                PlannedDate: planneddate,
                                StateId: this.state.selectedstate,
                                DistrictId: this.state.selecteddistrict,
                                DealerNameId: items.dealername,
                                ContactNumber: items.phonenumber,
                                Location: items.location,
                                AssignToId: this.state.assignto,
                                Remarks: this.state.remarks,
                                Hour: this.state.selectedhour,
                                Minute: this.state.selectedmin,
                                LocationsId: this.state.locationid,
                                Pincode: items.pincode,
                                ID: this.state.routeindex.Id

                            });
                            console.log(this.addroute[index]);
                            if (this.state.hideapprover == false) {

                                this.setState({
                                    assignto: null,
                                    assign: "",
                                    assignname: "",
                                });
                            }
                            this.setState({

                                selectedstate: "",
                                selecteddistrict: "",
                                selectedhour: "",
                                selectedmin: "",
                                mandatory: true,
                                planneddate: this.state.planneddate,
                                dealername: null,
                                contactnumber: null,
                                contactnumbererrormsg: "",
                                remarks: "",
                                plannedvisittime: "",
                                location: "",

                                locationid: "",
                                currentuser: "",
                                dealertitle: "",
                                currentuserid: "",

                                nouser: true,
                                nodealer: true,
                                nouserdealer: true,

                                pincode: this.state.pincode,
                                pin: false,
                                dontknowpin: true,
                                adddisable: false,
                                multidealer: true,
                                dealerdataarray: [],
                                dealerkey: []
                            });
                            this.setState({
                                routeindex: {
                                    Id: null,
                                    index: null
                                }
                            });
                            this.setState({ routedatalist: this.addroute });

                            this.setState({

                                message: "Updated successfully",
                                isOpenDialog: true,
                                dialogButton: "Ok"

                            });
                        });
                    }
                }



            }
            //With Pincode
            else if (this.state.pin == false) {

                if (this.state.dealerdataarray.length == 0) { }
                else {
                    {
                        this.state.dealerdataarray.map(async (items) => {
                            const i = await list.items.getById(parseInt(this.state.routeindex.Id)).update({


                                PlannedDate: planneddate,
                                StateId: 0,
                                DistrictId: 0,
                                DealerNameId: items.dealername,
                                ContactNumber: items.phonenumber,
                                Location: items.location,
                                AssignToId: this.state.assignto,
                                Remarks: this.state.remarks,
                                Hours: this.state.selectedhour,
                                Minutes: this.state.selectedmin,
                                PlannedDateTime: pdt,
                                Pincode: items.pincode,

                                AssignId: this.state.assign,
                                Checkin: "1"

                            });
                            this.addroute[index] = ({
                                ViewPlannedDate: planneddateformat,
                                ViewPlannedTime: plannedtime,
                                ViewDealerName: items.dealname,
                                ViewAssign: assign,
                                PlannedDate: planneddate,
                                StateId: this.state.selectedstate,
                                DistrictId: this.state.selecteddistrict,
                                DealerNameId: items.dealername,
                                ContactNumber: items.phonenumber,
                                Location: items.location,
                                AssignToId: this.state.assignto,
                                Remarks: this.state.remarks,
                                Hour: this.state.selectedhour,
                                Minute: this.state.selectedmin,
                                LocationsId: this.state.locationid,
                                ID: this.state.routeindex.Id,
                                Pincode: items.pincode,
                            });
                            console.log(this.addroute[index]);
                            if (this.state.hideapprover == false) {

                                this.setState({
                                    assignto: null,
                                    assign: "",
                                    assignname: "",
                                });
                            }
                            this.setState({

                                selectedstate: "",
                                selecteddistrict: "",
                                selectedhour: "",
                                selectedmin: "",
                                mandatory: true,
                                planneddate: this.state.planneddate,
                                dealername: null,
                                contactnumber: null,
                                contactnumbererrormsg: "",
                                remarks: "",
                                plannedvisittime: "",
                                location: "",

                                locationid: "",
                                currentuser: "",
                                dealertitle: "",
                                currentuserid: "",

                                nouser: true,
                                nodealer: true,
                                nouserdealer: true,

                                pincode: this.state.pincode,
                                pin: false,
                                dontknowpin: true,
                                adddisable: false,
                                dealerdataarray: [],
                                dealerkey: [],
                                multidealer: true
                            });
                            this.setState({
                                routeindex: {
                                    Id: null,
                                    index: null
                                }
                            });
                            this.setState({
                                routedatalist: this.addroute,
                                message: "Updated successfully",
                                isOpenDialog: true
                            });
                        });
                    }
                }

            }
        }
    }
    // Pincode change
    public pinchange = async (ev: React.FormEvent<HTMLInputElement>, pin?: any) => {
        this.setState({
            pincode: pin || '',
            selecteddistrict: "",
            selectedstate: ""
        });
        this.setState({
            mandatory: true,
            dealerbusy: true,
            assignbusy: true,
            nodealer: true,
            nouser: true,
            nouserdealer: true,
        });
        let user1 = await sp.web.currentUser();
        this.setState({
            currentuser: user1.Title,
            currentuserid: user1.Id,

        });
        let dealerarray = [];
        let assigntoarray = [];
        let userid;
        let assign;
        let user;
        let districtitem;
        let username;
        let sorted_Dealer = [];
        let extension = /^[0-9]+$/;
        if (pin.match(extension)) {
            this.setState({ pinerrormsg: '' });
        } else {
            this.setState({ pinerrormsg: 'Please enter a valid number' });

        }
        //Get Dealer on basis of pincode

        const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.filter(" pin eq " + pin).getAll(5000);
        console.log(dealeritems);
        if (dealeritems.length > 0) {
            for (let i = 0; i < dealeritems.length; i++) {

                let dealer = {
                    value: dealeritems[i].ID,
                    label: dealeritems[i].dealer_name
                };
                districtitem = dealeritems[i].district;

                dealerarray.push(dealer);
                sorted_Dealer = _.orderBy(dealerarray, 'text', ['asc']);
            }

            this.setState({
                dealeroption: sorted_Dealer,
                nodealer: true
            });


            //Get Assign on basis of pincode
            this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").getAll(5000);
            console.log("salesusers" + this.salesuseritems);

            let sorted_Assign = [];
            for (let i = 0; i < this.salesuseritems.length; i++) {
                if (this.salesuseritems[i].DistrictId == districtitem) {
                    user = {
                        key: this.salesuseritems[i].Id,
                        text: this.salesuseritems[i].Title
                    };
                    assigntoarray.push(user);
                    sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);
                }

                if (this.state.hideapprover == true) {
                    if (this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                        user = {
                            key: this.salesuseritems[i].Id,
                            text: this.salesuseritems[i].Title
                        };
                        assign = this.salesuseritems[i].UserNameId;
                        userid = user.key;
                        username = user.text;
                        assigntoarray.push(user);
                        sorted_Assign = _.orderBy(assigntoarray, 'text', ['asc']);
                    }
                }

            }

            this.setState({
                assigntooption: sorted_Assign,
                assignto: userid,
                assign: assign,
                assignname: username,
                nodealer: true,
                nouser: true,
                nouserdealer: true,

            });
        }
        //Validation
        else if (dealeritems.length == 0 && this.state.assigntooption.length == 0) {
            this.setState({
                nouserdealer: false

            });
        }
        else if (dealeritems.length == 0) {
            this.setState({
                nodealer: false

            });
        }
        else if (this.state.assigntooption.length == 0) {
            this.setState({
                nouser: false

            });
        }
        else { }

    }
    // No pincode
    public nopin() {
        console.log(this.state.routeindex.Id);
        if (this.state.routeindex.Id == null) {
            this.setState({
                multidealer: true
            });
        }
        else {
            this.setState({
                multidealer: false
            });
        }
        this.setState({
            dontknowpin: false,
            pin: true,
            pincode: ""
        });
    }
    // Pincode
    public knowpin() {
        console.log(this.state.routeindex.Id);
        if (this.state.routeindex.Id == null) {
            this.setState({
                multidealer: true
            });
        }
        else {
            this.setState({
                multidealer: false
            });
        }
        this.setState({
            dontknowpin: true,
            pin: false,
            selectedstate: "",
            selecteddistrict: "",

        });
    }
    // On Cancel
    private _onCancel = () => {


        this.setState({
            selecteddistrict: "",
            selectedhour: "",
            selectedmin: "",
            mandatory: true,
            selectedstate: "",
            planneddate: null,
            dealername: null,
            contactnumber: null,
            contactnumbererrormsg: "",
            remarks: "",
            plannedvisittime: "",
            location: "",
            assignto: null,
            locationid: '',
            routedatalist: [],
            nouser: true,
            nodealer: true,
            nouserdealer: true,
            // datedisable: false,
            dontknowpin: true,
            pin: false,
            pincode: "",
            adddisable: false,
            dealerdataarray: [],
            dealerkey: []

        });
        console.log(this.state.routedatalist);
        this.props.onClose();

        window.location.href = this.state.siteurl + '/SitePages/RouteList.aspx';



    }

    //Confirmation
   public async close (){
       console.log("close");
       console.log(this.state.dialogButton);
       if (this.state.dialogButton == "Confirm") {
            await sp.web.lists.getByTitle("Test").items.add({
                Text: "Confirm",
                
            });
            const i = await sp.web.lists.getByTitle("Users").items.getById(this.state.userdataidState).update({
                Status: "Request Send"
            });
            if(i){
            this.setState({
                dialogButton: "Ok",
                isOpenDialog: false
            });
            this._onCancel();
            }
        }
        if (this.state.dialogButton == "Delete") {
           await sp.web.lists.getByTitle("Test").items.add({
                Text: "delete",
                
            });
            this.addroute = this.state.routedatalist;
            const items = await this.addroute.filter(item => item !== this.state.deleteData);
            this.addroute = items;

            this.setState({ routedatalist: this.addroute });
            let item = sp.web.lists.getByTitle("Route List").items.getById(this.state.itemId).delete();
            this.setState({
                selectedstate: "",
                selecteddistrict: "",
                selectedhour: "",
                selectedmin: "",
                mandatory: true,
                planneddate: this.state.planneddate,
                dealername: null,
                contactnumber: null,
                contactnumbererrormsg: "",
                remarks: "",
                plannedvisittime: "",
                location: "",
                assignto: null,
                locationid: "",
                currentuser: "",
                dealertitle: "",
                currentuserid: "",
                assign: "",
                dealerbusy: true,
                nouser: true,
                nodealer: true,
                nouserdealer: true,
                assignname: "",
                pincode: "",
                dialogButton: "Ok",
                itemId: '',
                isOpenDialog: false

            });
            this.setState({
                routeindex: {
                    Id: null,
                    index: null
                }
            });

        }

        if (this.state.dialogButton == "Ok") {
            sp.web.lists.getByTitle("Test").items.add({
                Text: "ok",
            });
            this.setState({
                isOpenDialog: false
            });

        }


    }
//    public confirm = () => {
       
//         this.setState({
//             mandatory:false
//         });
 
//          if (this.state.dialogButton == "Confirm") {
//              sp.web.lists.getByTitle("Test").items.add({
//                  Text: "Confirm",
                 
//              });
//              const i = sp.web.lists.getByTitle("Users").items.getById(this.state.userdataidState).update({
//                  Status: "Request Send"
//              });
//              this.setState({
//                  dialogButton: "Ok",
//                  isOpenDialog: false
//              });
//             //  this._onCancel();
 
//          }
//         }
    //Render UI
    public render(): React.ReactElement<IRouteProps> {
        const { firstDayOfWeek } = this.state;
        const hour: IDropdownOption[] = [

            { key: '01', text: '01AM' },
            { key: '02', text: '02AM' },
            { key: '03', text: '03AM' },
            { key: '04', text: '04AM' },
            { key: '05', text: '05AM' },
            { key: '06', text: '06AM' },
            { key: '07', text: '07AM' },
            { key: '08', text: '08AM' },
            { key: '09', text: '09AM' },
            { key: '10', text: '10AM' },
            { key: '11', text: '11AM' },
            { key: '12', text: '12PM' },
            { key: '13', text: '01PM' },
            { key: '14', text: '02PM' },
            { key: '15', text: '03PM' },
            { key: '16', text: '04PM' },
            { key: '17', text: '05PM' },
            { key: '18', text: '06PM' },
            { key: '19', text: '07PM' },
            { key: '20', text: '08PM' },
            { key: '21', text: '09PM' },
            { key: '22', text: '10PM' },
            { key: '23', text: '11PM' },
            { key: '00', text: '12AM' },

        ];
        const min: IDropdownOption[] = [

            { key: '00', text: '00' },
            { key: '05', text: '05' },
            { key: '10', text: '10' },
            { key: '15', text: '15' },
            { key: '20', text: '20' },
            { key: '25', text: '25' },
            { key: '30', text: '30' },
            { key: '35', text: '35' },
            { key: '40', text: '40' },
            { key: '45', text: '45' },
            { key: '50', text: '50' },
            { key: '55', text: '55' },


        ];
        const dropdownStyles: Partial<IDropdownStyles> = {
            dropdown: { width: 80 },
        };
        const EditIcon: IIconProps = { iconName: 'Edit' };
        const DeleteIcon: IIconProps = { iconName: 'Delete' };
        const UpdateIcon: IIconProps = { iconName: 'Add' };
        const ErrorIcon: IIconProps = { iconName: "CaretRightSolid8" };

        let { isOpen } = this.props;
      




        return (


            <Panel isOpen={isOpen} type={PanelType.custom}
                customWidth={'800px'} onDismiss={this._onCancel}  >

                <h3>Create Route</h3>
                <div hidden={this.state.mandatory}><Label style={{ color: "rgb(164, 38, 44)" }}>Please fill all mandatory fields</Label></div>
                <div hidden={this.state.nodealer}><Label style={{ color: "rgb(164, 38, 44)" }}>No Dealer in this district</Label></div>
                <div hidden={this.state.nouser}><Label style={{ color: "rgb(164, 38, 44)" }}>No User in this district </Label></div>
                <div hidden={this.state.nouserdealer}><Label style={{ color: "rgb(164, 38, 44)" }}>No Dealer and User in this district </Label></div>
                <div hidden={this.state.dealerbusy}><Label style={{ color: "rgb(164, 38, 44)" }}>Dealer has an appointment at the same time.Please choose another </Label></div>
                <div hidden={this.state.assignbusy}><Label style={{ color: "rgb(164, 38, 44)" }}>User has an appointment at the same time.Please choose another time </Label></div>
                <div hidden={this.state.nopin}><Label style={{ color: "rgb(164, 38, 44)" }}>Please Select District or Enter Pincode </Label></div>
                <Label>Planned Date And Time</Label>
                <table><tr>
                    <td>
                        <DatePicker //style={{ width: '1000px' }}
                            //className={controlClass.control}
                            firstDayOfWeek={firstDayOfWeek}
                            strings={DayPickerStrings}
                            value={this.state.planneddate}
                            onSelectDate={this._onplanneddateChange}
                            placeholder="Select a date..."
                            ariaLabel="Select a date"
                            formatDate={(date) => moment(date).format('DD/MM/YYYY')}
                            isRequired={true}
                            minDate={new Date()}
                        // disabled={this.state.datedisable}
                        />
                    </td>

                    <td>

                        <Dropdown id="time" required={true}
                            placeholder="--"
                            options={hour}
                            styles={dropdownStyles}
                            selectedKey={this.state.selectedhour}
                            //onChanged={this.usertypeChanged}
                            onChanged={(option) => this.hour(option)}

                        /></td>
                    <td>
                        <Dropdown id="time2" required={true}
                            placeholder="--"
                            options={min}
                            styles={dropdownStyles}
                            selectedKey={this.state.selectedmin}
                            //onChanged={this.usertypeChanged}
                            onChanged={(option) => this.min(option)}

                        /></td>
                </tr>
                </table>
               
                <div hidden={this.state.dontknowpin}>
                    <table><tr><td><Label>Click here if you know pincode</Label></td><td>
                        <IconButton iconProps={ErrorIcon} title="know pincode" ariaLabel="know pincode" onClick={() => this.knowpin()} />
                    </td>  </tr> </table>
                    <Label >State</Label>
                    <Dropdown id="state" required={true}
                        placeholder="Select an option"
                        options={this.state.state}
                        onChanged={this.stateChanged}
                        selectedKey={this.state.selectedstate}
                    />
                    <p><Label >Select District</Label>
                        <Dropdown id="dept"
                            placeholder="Select an option"
                            selectedKey={this.state.selecteddistrict}
                            options={this.state.district}
                            //onChanged={this.dChanged}
                            onChanged={this.districtChange}
                            required={true}
                        /></p>
                </div>
                <div hidden={this.state.pin}>
                    <Label>Pincode</Label>
                    <TextField id="pin"
                        onChange={this.pinchange}
                        placeholder="Pincode"
                        errorMessage={this.state.pinerrormsg}
                        required={true}
                        value={this.state.pincode} ></TextField>

                    <table><tr><td><Label>Click here if you don't know pincode</Label></td><td>
                        <IconButton iconProps={ErrorIcon} title="Don't know pincode" ariaLabel="Don't know pincode" onClick={() => this.nopin()} />
                    </td>  </tr> </table>
                </div>
                <Label >Dealer Name</Label>
       

                <Select
                    value={this.state.dealerkey}
                    onChange={this.dealerChanged}
                    options={this.state.dealeroption}
                    isMulti={this.state.multidealer}
                // isHidden={this.state.hidemultidealer}
                />
        
                <div hidden={this.state.hideapprover} >
                    <p><Label >Assign To</Label>
                        <Dropdown id="assign" required={true}
                            placeholder="Select an option"
                            selectedKey={this.state.assignto}
                            options={this.state.assigntooption}
                            //onChanged={this.dChanged}
                            onChanged={this.assigntoChange}
                        /></p></div>

                <p><Label >Purpose Of Meeting</Label>
                    < TextField value={this.state.remarks} onChange={this.remarkschange} multiline ></TextField></p>
                <PrimaryButton text="Add" disabled={this.state.adddisable} style={{ display: (this.state.routeindex.index == null ? 'block' : 'none') }} onClick={(e) => this.Addroute(e)} />
                <PrimaryButton text="Update" disabled={this.state.updatedisable} style={{ display: (this.state.routeindex.index != null ? 'block' : 'none') }} onClick={this.UpdateRoutedatalist} />
                <div id="documents">
                    <table style={{ border: '1px solid #ddd', display: (this.state.routedatalist.length == 0 ? 'none' : 'block'), width: '100%', borderCollapse: 'collapse', backgroundColor: '#f2f2f2' }}>

                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>PlannedDate</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>Planned Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>Dealer</th>
                            {/* <th style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>Assigned</th>
   */}



                        </tr>


                        <tbody style={{ width: '100%', borderCollapse: 'collapse' }}>
                            {
                                this.state.routedatalist.map((item) => {


                                    return <tr style={{ backgroundColor: '#f2f2f2' }}>

                                        <td style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>{item.ViewPlannedDate}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>{item.ViewPlannedTime}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>{item.ViewDealerName}</td>
                                        {/* <td style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>{item.ViewAssign}</td> */}

                                        <td style={{ padding: '8px' }}> <IconButton iconProps={EditIcon} title="Edit" ariaLabel="Edit" onClick={() => this.EditRoutedatalist(item)} /></td>

                                        <td style={{ padding: '8px' }}> <IconButton iconProps={DeleteIcon} title="Delete" ariaLabel="Delete" onClick={() => this.DeleteRoutedatalist(item)} /></td>

                                    </tr>;
                                })


                            }
                        </tbody>

                    </table>

                </div>

                <Dialog
          isOpen={this.state.isOpen}
          type={DialogType.close}
          // onDismiss={this.closeButton.bind(this)}
          onDismiss={() => this.setState({ isOpen: false })}
          subText={this.state.message}
          isBlocking={false}
          closeButtonAriaLabel='Close'
        >
                {/* <Dialog
                    isOpen={this.state.isOpenDialog}
                    type={DialogType.close}

                    onDismiss={() => this.setState({ isOpenDialog: false })}
                    subText={this.state.message}
                    isBlocking={false}
                    closeButtonAriaLabel='Close'
                > */}

                    <DialogFooter>
                    {/* <Button buttonType={ButtonType.primary} onClick={this.confirm}>Confirm Test</Button> */}
                        <Button buttonType={ButtonType.primary} onClick={this.close} text={this.state.dialogButton}></Button>
                    </DialogFooter>
                </Dialog>


                <DialogFooter>
                    {/* <PrimaryButton text="Save" onClick={this.update} /> */}
                    <PrimaryButton text="Close" onClick={this._onCancel} />

                </DialogFooter>



            </Panel>

        );
    }

}