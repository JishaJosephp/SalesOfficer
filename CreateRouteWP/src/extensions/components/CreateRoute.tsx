import * as React from 'react';
import { IRouteProps } from './IRouteProps';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, DialogFooter, Panel, Spinner, SpinnerType, PanelType, IPanelProps } from "office-ui-fabric-react";
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
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
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
    datedisable: boolean;
    routeindex: IRouteindex;
    pincode: any;
    pinerrormsg: any;
    nopin: boolean;
    dontknowpin: boolean;
    pin: boolean;
    assignbusy: boolean;
    adddisable: boolean;
    updatedisable: boolean;
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
            datedisable: false,
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
            updatedisable: false
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
    }

    public dealerarray = [];
    public salesuseritems: any[];
    private addroute = [];
    public async componentDidMount() {
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
        // let districtarray = [];
        let dealerarray = [];
//States Array
        const stateitems: any[] = await sp.web.lists.getByTitle("States").items.select("Title,ID").getAll();
        let statearray = [];
        for (let i = 0; i < stateitems.length; i++) {

            let statedata = {
                key: stateitems[i].Id,
                text: stateitems[i].Title
            };
            statearray.push(statedata);

        }
        this.setState({
            state: statearray
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
        // console.log(this.state.selectedstate);
        const items: any[] = await sp.web.lists.getByTitle("Districts").items.select("Title,ID").filter(" StateId eq " + option.key).get();
        console.log(items);


        let filtereddistrict = [];
        for (let i = 0; i < items.length; i++) {


            let districtdata = {
                key: items[i].Id,
                text: items[i].Title
            };


            filtereddistrict.push(districtdata);
        }
        this.setState({
            district: filtereddistrict
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
        const dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.select("Title,ID").filter(" DistrictId eq " + option.key).get();
        console.log("dealer" + dealeritems);
        // console.log("dealer" + dealeritems);
        for (let i = 0; i < dealeritems.length; i++) {

            let dealer = {
                key: dealeritems[i].Id,
                text: dealeritems[i].Title
            };

            dealerarray.push(dealer);
        }

        this.setState({
            dealeroption: dealerarray
        });
        const useritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" UserType eq 'Sales'").get();
        console.log(useritems);
//Filter Assign based on district
        this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").get();
        console.log("salesusers" + this.salesuseritems);


        for (let i = 0; i < this.salesuseritems.length; i++) {
            if (this.salesuseritems[i].DistrictId == option.key) {
                user = {
                    key: this.salesuseritems[i].Id,
                    text: this.salesuseritems[i].Title
                };
                assigntoarray.push(user);
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
                }
            }

        }
        this.setState({
            assigntooption: assigntoarray,
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
//On Dealer Changed
    public async dealerChanged(option: { key: any; }) {
        //console.log(option.key);
        let locationarray = [];
        let loc = "";
        let ph = "";
        let locid;
        let dealname = "";
        this.setState({ dealername: option.key });

        const dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.get();
        console.log(dealeritems);
        for (let i = 0; i < dealeritems.length; i++) {

            if (dealeritems[i].Id == option.key) {
                ph = dealeritems[i].ContactNumber;
                locid = dealeritems[i].City_x002f_LocationId;
                dealname = dealeritems[i].Title;
            }
        }
        const item: any = await sp.web.lists.getByTitle("Location").items.getById(locid).get();
        console.log(item);
        loc = item.Title;
        let data = {
            key: item.Id,
            text: item.Title
        };
        locationarray.push(data);

        this.setState({
            contactnumber: ph,
            locationoption: locationarray,
            location: loc,
            locationid: locid,
            dealertitle: dealname
        });
    }
//On Contact Number changed
    public _oncontactnumberchange = (ev: React.FormEvent<HTMLInputElement>, mob?: any) => {
        this.setState({ contactnumber: mob });
        let mnum = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        let mnum2 = /^(\+\d{1,3}[- ]?)?\d{11}$/;
        //let mnum = /^(\+\d{1,3}[- ]?)$/;
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
            // adddisable:false,

            // dealerbusy:true

        });

    }
//On min Changed
    public min(option: { key: any; }) {
        console.log(option.key);
        this.setState({
            selectedmin: option.key,
            // adddisable:false,
            // dealerbusy:true

        });
    }
//On update to cancel
    public update = async () => {
        this._onCancel();
    }
//On grid edit
    public EditRoutedatalist = async (item) => {
        console.log(item);

        this.setState({
            updatedisable: false
        });
        let dealerarray = [];
        let assigntoarray = [];
        let userid;
        let assign;
        let user;
        let username;
        let locpin;
        var index = this.state.routedatalist.indexOf(item);
        if (item.Pincode == "") {
            this.setState({
                dontknowpin: false,
                pin: true,

            });
            const dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.select("Title,ID").filter(" DistrictId eq " + item.DistrictId).get();
            console.log("dealer" + dealeritems);
            // console.log("dealer" + dealeritems);
            for (let i = 0; i < dealeritems.length; i++) {

                let dealer = {
                    key: dealeritems[i].Id,
                    text: dealeritems[i].Title
                };

                dealerarray.push(dealer);
            }

            this.setState({
                dealeroption: dealerarray
            });
            const useritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" UserType eq 'Sales'").get();
            console.log(useritems);

            this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").get();
            console.log("salesusers" + this.salesuseritems);


            for (let i = 0; i < this.salesuseritems.length; i++) {
                if (this.salesuseritems[i].DistrictId == item.DistrictId || this.state.currentuserid == this.salesuseritems[i].UserNameId) {
                    user = {
                        key: this.salesuseritems[i].Id,
                        text: this.salesuseritems[i].Title
                    };
                    assigntoarray.push(user);
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
                    }
                }

            }
            this.setState({
                assigntooption: assigntoarray,
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
            locpin = item.Pincode.substring(0, 4);

            console.log(locpin.trim());


            const dealeritems = await sp.web.lists.getByTitle("Dealer List").getItemsByCAMLQuery({
                ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='City_x002f_Location_x003a_PinCod' /><Value Type='Lookup'>"
                    + locpin + "</Value></BeginsWith></Where></Query></View>",
            });

            console.log(dealeritems);
            for (let i = 0; i < dealeritems.length; i++) {

                let dealer = {
                    key: dealeritems[i].Id,
                    text: dealeritems[i].Title
                };

                dealerarray.push(dealer);
            }

            this.setState({
                dealeroption: dealerarray
            });
            let districtitem;
            const locationitems = await sp.web.lists.getByTitle("Location").getItemsByCAMLQuery({
                ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='PinCode' /><Value Type='Text'>"
                    + locpin + "</Value></BeginsWith></Where></Query></View>",
            });
            console.log(locationitems);
            for (let i = 0; i < locationitems.length; i++) {
                districtitem = locationitems[i].DistrictsId;
            }
            this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" DistrictId eq " + districtitem).get();
            for (let i = 0; i < this.salesuseritems.length; i++) {

                user = {
                    key: this.salesuseritems[i].Id,
                    text: this.salesuseritems[i].Title
                };

                if (assigntoarray.indexOf(user) == -1) {
                    assigntoarray.push(user);
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
                    }
                }


                this.setState({
                    assigntooption: assigntoarray,
                    assignto: userid,
                    assign: assign,
                    assignname: username

                });
            }

        }

        let routeindex: IRouteindex;
        routeindex = {
            Id: item.ID,
            index: index
        };
        this.setState({ routeindex: routeindex });
        this.setState({
            //    planneddate:item.PlannedDate,
            selectedstate: item.StateId,
            selecteddistrict: item.DistrictId,
            dealername: item.DealerNameId,
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
        if (confirm('Are you sure you want to delete the data?')) {
            //  alert(data.ID);
            this.addroute = this.state.routedatalist;
            const items = this.addroute.filter(item => item !== data);
            this.addroute = items;

            this.setState({ routedatalist: this.addroute });
            let item = await sp.web.lists.getByTitle("Route List").items.getById(data.ID).delete();
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
                datedisable: true

            });
            this.setState({
                routeindex: {
                    Id: null,
                    index: null
                }
            });

        }
    }
//On add route
    private Addroute = async (e) => {
        console.log(this.state.hideapprover);
        this.setState({ mandatory: true, dealerbusy: true, assignbusy: true, adddisable: true });
        let siteUrl = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication";
        let web = Web(siteUrl);
        let itemId;
        let route;
        let assignbusy;
        let aprvday;
        let addaprv;
        let userdataid;
        this.addroute = this.state.routedatalist;
        let newitemid;
        var currentdate = new Date();
        let today = moment(currentdate).format('YYYY-MM-DDTHH:mm:00');
        console.log(today);
        let currentMonth = moment(today).format("MM");
        let planneddate = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        let planneddateformat = moment(this.state.planneddate).format('DD-MMM-YYYY');
        let pdt = moment(this.state.planneddate).format('YYYY-MM-DD' + 'T' + this.state.selectedhour + ':' + this.state.selectedmin + ':00');
        let notification = this.state.currentuser + " created a route to visit " + this.state.dealertitle + " on "
            + planneddateformat + " at " + this.state.selectedhour + ":" + this.state.selectedmin;
        let date = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        let plannedtime = this.state.selectedhour + ":" + this.state.selectedmin;
        let plannedday = moment(this.state.planneddate).format('DD');
        let plannedMonth = moment(this.state.planneddate).format('MM');
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
        if (this.state.hideapprover == true) {
            //Same month
            if (currentMonth == plannedMonth) {
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
                    if (aprvday >= plannedday) {
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
            let conf = confirm("You need approval to create route");
            if (conf == true) {
                const i = await sp.web.lists.getByTitle("Users").items.getById(parseInt(userdataid)).update({
                    Status: "Request Send"
                });
                this._onCancel();
            }
            this._onCancel();
        }
        else if (assignbusy == "False") {
            this.setState({ assignbusy: false, adddisable: false });
        }
        else if (route == "False") {
            this.setState({ dealerbusy: false, adddisable: false });
        }
        else if (this.state.nouserdealer == false) {
            this.setState({ nouserdealer: false, adddisable: false });
        }
        else if (this.state.nodealer == false) {
            this.setState({ nodealer: false, adddisable: false });
        }
        else if (this.state.nouser == false) {
            this.setState({ nouser: false, adddisable: false });
        }

        else {
            //No pincode
            if (this.state.pin == true) {
                if (planneddate == "" || this.state.selectedhour == "" || this.state.selectedmin == ""
                    || this.state.dealername == "" || this.state.contactnumber == "" || this.contactflag == 0
                    || this.state.location == "" || this.state.assignto == ""
                    || this.state.selectedstate == "" && this.state.selecteddistrict == "") {
                    this.setState({ mandatory: false, adddisable: false });
                }
                else {
                    let conf = confirm("Do you want to submit?");
                    if (conf == true) {
                        let a = await sp.web.lists.getByTitle("Route List").items.add({
                            Title: this.state.plannedvisittime,
                            PlannedDate: planneddate,
                            StateId: this.state.selectedstate,
                            DistrictId: this.state.selecteddistrict,
                            DealerNameId: this.state.dealername,
                            ContactNumber: this.state.contactnumber,
                            Location: this.state.location,
                            AssignToId: this.state.assignto,
                            Remarks: this.state.remarks,
                            Hours: this.state.selectedhour,
                            Minutes: this.state.selectedmin,
                            PlannedDateTime: pdt,
                            LocationsId: this.state.locationid,
                            AssignId: this.state.assign,
                            Pincode: this.state.pincode,
                            Checkin: "1"
                        }).then(async i => {
                            newitemid = i.data.ID;
                            if (newitemid != undefined) {
                                this.addroute.push({
                                    ViewPlannedDate: planneddateformat,
                                    ViewPlannedTime: plannedtime,
                                    ViewDealerName: this.state.dealertitle,
                                    ViewAssign: this.state.assignname,
                                    ID: newitemid,
                                    PlannedDate: planneddate,
                                    StateId: this.state.selectedstate,
                                    DistrictId: this.state.selecteddistrict,
                                    DealerNameId: this.state.dealername,
                                    ContactNumber: this.state.contactnumber,
                                    Location: this.state.location,
                                    AssignToId: this.state.assignto,
                                    Remarks: this.state.remarks,
                                    Hour: this.state.selectedhour,
                                    Minute: this.state.selectedmin,
                                    LocationsId: this.state.locationid,
                                    Pincode: this.state.pincode,
                                    AssignId: this.state.assign,
                                });
                                this.setState({
                                    routedatalist: this.addroute,

                                });
                            }
                        });
                        if (this.state.hideapprover == true) {
                            await sp.web.lists.getByTitle("Notification").items.add({
                                DashboardType: "Admin",
                                Notification: notification,
                                RouteId: newitemid
                            });
                            this.setState({
                                hideapprover: true

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
                            assignto: null,
                            locationid: "",
                            currentuser: "",
                            dealertitle: "",
                            pin: false,
                            dontknowpin: true,
                            assign: "",
                            // dealerbusy:true,
                            nouser: true,
                            nodealer: true,
                            nouserdealer: true,
                            assignname: "",
                            datedisable: true,
                            pincode: "",
                            adddisable: false,
                        });

                    }
                }
            }
            //With Pincode
            else if (this.state.pin == false) {
                if (planneddate == "" || this.state.selectedhour == "" || this.state.selectedmin == ""
                    || this.state.dealername == "" || this.state.contactnumber == "" || this.contactflag == 0
                    || this.state.location == "" || this.state.assignto == "" || this.state.pincode == "") {
                    this.setState({ mandatory: false, adddisable: false });
                }
                else {
                    let conf = confirm("Do you want to submit?");
                    if (conf == true) {
                        let a = await sp.web.lists.getByTitle("Route List").items.add({
                            Title: this.state.plannedvisittime,
                            PlannedDate: planneddate,
                            DealerNameId: this.state.dealername,
                            ContactNumber: this.state.contactnumber,
                            Location: this.state.location,
                            AssignToId: this.state.assignto,
                            Remarks: this.state.remarks,
                            Hours: this.state.selectedhour,
                            Minutes: this.state.selectedmin,
                            PlannedDateTime: pdt,
                            LocationsId: this.state.locationid,
                            AssignId: this.state.assign,
                            Pincode: this.state.pincode,
                            Checkin: "1",
                            StateId: 0,
                            DistrictId: 0,
                        }).then(async i => {
                            newitemid = i.data.ID;
                            if (newitemid != undefined) {
                                this.addroute.push({
                                    ViewPlannedDate: planneddateformat,
                                    ViewPlannedTime: plannedtime,
                                    ViewDealerName: this.state.dealertitle,
                                    ViewAssign: this.state.assignname,
                                    ID: newitemid,
                                    PlannedDate: planneddate,
                                    StateId: this.state.selectedstate,
                                    DistrictId: this.state.selecteddistrict,
                                    DealerNameId: this.state.dealername,
                                    ContactNumber: this.state.contactnumber,
                                    Location: this.state.location,
                                    AssignToId: this.state.assignto,
                                    Remarks: this.state.remarks,
                                    Hour: this.state.selectedhour,
                                    Minute: this.state.selectedmin,
                                    LocationsId: this.state.locationid,
                                    Pincode: this.state.pincode,
                                    AssignId: this.state.assign,
                                });
                                this.setState({
                                    routedatalist: this.addroute,

                                });
                            }
                        });
                        if (this.state.hideapprover == true) {
                            await sp.web.lists.getByTitle("Notification").items.add({
                                DashboardType: "Admin",
                                Notification: notification,
                                RouteId: newitemid
                            });
                            this.setState({
                                hideapprover: true

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
                            assignto: null,
                            locationid: "",
                            currentuser: "",
                            dealertitle: "",
                            currentuserid: "",
                            assign: "",
                            // dealerbusy:true,
                            nouser: true,
                            nodealer: true,
                            nouserdealer: true,
                            assignname: "",
                            datedisable: true,
                            pincode: "",
                            pin: false,
                            dontknowpin: true,
                            adddisable: false
                        });
                        // alert("Saved successfully");
                    }
                }
            }
            this.setState({ adddisable: false });

        }

    }
    //Update grid 
    private async UpdateRoutedatalist() {
        this.setState({ mandatory: true, dealerbusy: true, assignbusy: true, updatedisable: true });
        console.log(this.state.routeindex);
        let dealerid = this.state.dealername
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
        var index = this.state.routeindex.index;
        var currentdate = new Date();
        let today = moment(currentdate).format('YYYY-MM-DDTHH:mm:00');
        console.log(today);
        let currentMonth = moment(today).format("MM");
        let planneddate = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
        let planneddateformat = moment(this.state.planneddate).format('DD-MMM-YYYY');
        let pdt = moment(this.state.planneddate).format('YYYY-MM-DD' + 'T' + this.state.selectedhour + ':' + this.state.selectedmin + ':00');
        let plannedtime = this.state.selectedhour + ":" + this.state.selectedmin;
        let plannedMonth = moment(this.state.planneddate).format('MM');
        let plannedday = moment(this.state.planneddate).format('DD');
        let list = sp.web.lists.getByTitle("Route List");
        const dealeritems: any = await sp.web.lists.getByTitle("Dealer List").items.getById(dealerid).get();
        dealname = dealeritems.Title;
        const useritems: any = await sp.web.lists.getByTitle("Users").items.getById(assignid).get();
        console.log(useritems);
        assign = useritems.Title;
        let date = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
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
            for (let i = 0; i < routeData.length; i++) {
                if (routeData[i].ID == this.state.routeindex.Id) {
                    route = "True";
                }
                else {
                    route = "False";
                }

            }

        }


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
            if (currentMonth == plannedMonth) {
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
                    if (aprvday >= plannedday) {
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
                            console.log(extdate)
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
            let conf = confirm("You need approval to create route");
            if (conf == true) {
                const i = await sp.web.lists.getByTitle("Users").items.getById(parseInt(userdataid)).update({
                    Status: "Request Send"
                });
                this._onCancel();
            }
            this._onCancel();
        }
        else if (assignbusy == "False") {
            this.setState({ assignbusy: false, updatedisable: false });
        }
        else if (route == "False") {
            this.setState({ dealerbusy: false, updatedisable: false });
        }
        else if (this.state.nouserdealer == false) {
            this.setState({ nouserdealer: false, updatedisable: false });
        }
        else if (this.state.nodealer == false) {
            this.setState({ nodealer: false, updatedisable: false });
        }
        else if (this.state.nouser == false) {
            this.setState({ nouser: false, updatedisable: false });
        }

        else {
            if (this.state.pin == true) {
                const i = await list.items.getById(parseInt(this.state.routeindex.Id)).update({

                    // Title: this.state.plannedvisittime,
                    PlannedDate: planneddate,
                    StateId: this.state.selectedstate,
                    DistrictId: this.state.selecteddistrict,
                    DealerNameId: this.state.dealername,
                    ContactNumber: this.state.contactnumber,
                    Location: this.state.location,
                    AssignToId: this.state.assignto,
                    Remarks: this.state.remarks,
                    Hours: this.state.selectedhour,
                    Minutes: this.state.selectedmin,
                    PlannedDateTime: pdt,
                    Pincode: this.state.pincode,
                    LocationsId: this.state.locationid,
                    AssignId: this.state.assign,
                    Checkin: "1"

                });
                this.addroute[index] = ({
                    ViewPlannedDate: planneddateformat,
                    ViewPlannedTime: plannedtime,
                    ViewDealerName: dealname,
                    ViewAssign: assign,
                    PlannedDate: planneddate,
                    StateId: this.state.selectedstate,
                    DistrictId: this.state.selecteddistrict,
                    DealerNameId: this.state.dealername,
                    ContactNumber: this.state.contactnumber,
                    Location: this.state.location,
                    AssignToId: this.state.assignto,
                    Remarks: this.state.remarks,
                    Hour: this.state.selectedhour,
                    Minute: this.state.selectedmin,
                    LocationsId: this.state.locationid,
                    Pincode: this.state.pincode,
                    ID: this.state.routeindex.Id

                });
                console.log(this.addroute[index]);
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
                    // dealerbusy:true,
                    nouser: true,
                    nodealer: true,
                    nouserdealer: true,
                    assignname: "",
                    datedisable: true,
                    pincode: "",
                    updatedisable: false
                });
                this.setState({
                    routeindex: {
                        Id: null,
                        index: null
                    }
                });
                this.setState({ routedatalist: this.addroute });
                alert("Updated successfully");
            }
            else if (this.state.pin == false) {
                const i = await list.items.getById(parseInt(this.state.routeindex.Id)).update({

                    // Title: this.state.plannedvisittime,
                    PlannedDate: planneddate,
                    StateId: 0,
                    DistrictId: 0,
                    DealerNameId: this.state.dealername,
                    ContactNumber: this.state.contactnumber,
                    Location: this.state.location,
                    AssignToId: this.state.assignto,
                    Remarks: this.state.remarks,
                    Hours: this.state.selectedhour,
                    Minutes: this.state.selectedmin,
                    PlannedDateTime: pdt,
                    Pincode: this.state.pincode,
                    LocationsId: this.state.locationid,
                    AssignId: this.state.assign,
                    Checkin: "1"

                });
                this.addroute[index] = ({
                    ViewPlannedDate: planneddateformat,
                    ViewPlannedTime: plannedtime,
                    ViewDealerName: dealname,
                    ViewAssign: assign,
                    PlannedDate: planneddate,
                    StateId: this.state.selectedstate,
                    DistrictId: this.state.selecteddistrict,
                    DealerNameId: this.state.dealername,
                    ContactNumber: this.state.contactnumber,
                    Location: this.state.location,
                    AssignToId: this.state.assignto,
                    Remarks: this.state.remarks,
                    Hour: this.state.selectedhour,
                    Minute: this.state.selectedmin,
                    LocationsId: this.state.locationid,
                    ID: this.state.routeindex.Id,
                    Pincode: this.state.pincode,
                });
                console.log(this.addroute[index]);
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
                    // dealerbusy:true,
                    nouser: true,
                    nodealer: true,
                    nouserdealer: true,
                    assignname: "",
                    datedisable: true,
                    pincode: "",
                    updatedisable: false

                });
                this.setState({
                    routeindex: {
                        Id: null,
                        index: null
                    }
                });
                this.setState({ routedatalist: this.addroute });
                alert("Updated successfully");
            }
        }
    }
    public pinchange = async (ev: React.FormEvent<HTMLInputElement>, pin?: any) => {
        this.setState({
            pincode: pin || '',
            selecteddistrict: "",
            selectedstate: ""
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
        let username;
        let extension = /^[0-9]+$/;
        if (pin.match(extension)) {
            this.setState({ pinerrormsg: '' });
        } else {
            this.setState({ pinerrormsg: 'Please enter a valid number' });

        }
        pin = pin.substring(0, 4);

        console.log(pin.trim());


        const dealeritems = await sp.web.lists.getByTitle("Dealer List").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='City_x002f_Location_x003a_PinCod' /><Value Type='Lookup'>"
                + pin + "</Value></BeginsWith></Where></Query></View>",
        });

        console.log(dealeritems);
        for (let i = 0; i < dealeritems.length; i++) {

            let dealer = {
                key: dealeritems[i].Id,
                text: dealeritems[i].Title
            };

            dealerarray.push(dealer);
        }

        this.setState({
            dealeroption: dealerarray
        });
        let districtitem;
        const locationitems = await sp.web.lists.getByTitle("Location").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='PinCode' /><Value Type='Text'>"
                + pin + "</Value></BeginsWith></Where></Query></View>",
        });
        console.log(locationitems);
        for (let i = 0; i < locationitems.length; i++) {
            districtitem = locationitems[i].DistrictsId;
        }
        this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" DistrictId eq " + districtitem).get();
        for (let i = 0; i < this.salesuseritems.length; i++) {

            user = {
                key: this.salesuseritems[i].Id,
                text: this.salesuseritems[i].Title
            };

            if (assigntoarray.indexOf(user) == -1) {
                assigntoarray.push(user);
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
                }
            }


            this.setState({
                assigntooption: assigntoarray,
                assignto: userid,
                assign: assign,
                assignname: username

            });
        }
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
    public nopin() {
        this.setState({
            dontknowpin: false,
            pin: true,
            pincode: ""
        });
    }
    public knowpin() {
        this.setState({
            dontknowpin: true,
            pin: false,
            selectedstate: "",
            selecteddistrict: ""
        });
    }
    public adddealer(){
        window.location.href = 'https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/Lists/DealerList/AllItems.aspx';
    }
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
            datedisable: false,
            dontknowpin: true,
            pin: false,
            pincode: "",
            adddisable: false

        });
        console.log(this.state.routedatalist);
        this.props.onClose();
    }
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
                <div hidden={this.state.mandatory}><Label style={{ color: "red" }}>Please fill all mandatory fields</Label></div>
                <div hidden={this.state.nodealer}><Label style={{ color: "red" }}>No Dealer in this district</Label></div>
                <div hidden={this.state.nouser}><Label style={{ color: "red" }}>No User in this district </Label></div>
                <div hidden={this.state.nouserdealer}><Label style={{ color: "red" }}>No Dealer and User in this district </Label></div>
                <div hidden={this.state.dealerbusy}><Label style={{ color: "red" }}>Dealer has an appointment at the same time.Please choose another </Label></div>
                <div hidden={this.state.assignbusy}><Label style={{ color: "red" }}>User has an appointment at the same time.Please choose another time </Label></div>
                <div hidden={this.state.nopin}><Label style={{ color: "red" }}>Please Select District or Enter Pincode </Label></div>
                <Label>Planned Date And Time</Label>
                <table><tr><td>
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
                        disabled={this.state.datedisable}
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
                {/* <TextField
                    id="time"
                    label="Planned Visit Time"
                    type="time"
                    //defaultValue="07:30"
                    value={this.state.plannedvisittime}
                    onChange={this.onplannedvisittimechange}
                    required={true}
                /> */}
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
                <Label >Dealer Name</Label>  <Dropdown id="dealer"
                    placeholder="Select an option"
                    selectedKey={this.state.dealername}
                    options={this.state.dealeroption}
                    onChanged={this.dealerChanged}
                    required={true}
                //onChange={this.deptChanged}
                />
                <table><tr><td><Label>Add New Dealer</Label></td><td>
                        <IconButton iconProps={UpdateIcon} title="Add Dealer" ariaLabel="Add Dealer" onClick={() => this.adddealer()} />
                    </td>  </tr> </table>
                {/* <div>
                    <p><Label >Location</Label>  <Dropdown id="location"
                        placeholder="Select an option"
                        selectedKey={this.state.locationid}
                        options={this.state.locationoption}
                        disabled
                    /></p> </div> */}
                <div > <p><Label >Location </Label>
                    < TextField value={this.state.location} disabled

                    ></TextField></p> </div>
                <p><Label >Contact Number </Label>
                    < TextField value={this.state.contactnumber}
                        onChange={this._oncontactnumberchange}
                        errorMessage={this.state.contactnumbererrormsg} required={true}   ></TextField></p>

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

                <DialogFooter>
                    {/* <PrimaryButton text="Save" onClick={this.update} /> */}
                    <PrimaryButton text="Close" onClick={this._onCancel} />
                </DialogFooter>

            </Panel>

        );
    }



}