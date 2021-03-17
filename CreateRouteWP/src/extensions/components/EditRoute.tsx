import * as React from 'react';
import { IRouteProps } from './IRouteProps';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, DialogFooter, Panel, Spinner, SpinnerType, PanelType, IPanelProps } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
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
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
export interface IRouteState {
    itemid: any;
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
    selectedhour:any;
    selectedmin:any;
    mandatory: boolean;
    locationid:any;
    hideapprover:boolean;
    currentuser:any;
    dealertitle:any;
    pastplanneddate: any;
    pastdealername: any;
    pastselectedhour:any;
    pastselectedmin:any;
    authoremail:any;
    fromMail:any;
    authorname:any;
    currentuserid:any;
    assign:any;
    dealerbusy:boolean;
    nouser:boolean;
    nodealer:boolean;
    nouserdealer:boolean;
    pinerrormsg:any;
    nopin:boolean;
    pincode:any;
    assignname:any;
    dontknowpin: boolean;
    pin: boolean;
    assignbusy:boolean;
    savedisable:boolean
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
export default class EditRoute extends React.Component<IRouteProps, IRouteState> {
    public contactflag: any;
    private  group:any;
    public constructor(props: IRouteProps) {
        super(props);
        this.state = {
            itemid: props.itemidprops,
            planneddate: props.PlannedDateprops,
            dealername: props.DealerNameprops,
            contactnumber: props.ContactNumberprops,
            contactnumbererrormsg: "",
            remarks: props.Remarksprops,
            plannedvisittime: props.PlannedVisitTimeprops,
            location: props.Locationprops,
            assignto: props.AssignToprops,
            // district: props.Districtprops,
            dealeroption: props.dealeroptionsprops,
            locationoption: [],
            assigntooption: props.assigntooptionprops,
            districtoption: [],
            state: props.stateoptionprops,
            selectedstate: props.Stateprops,
            district: props.districtoptionprops,
            selecteddistrict: props.Districtprops,
            selectedhour:props.hourprops,
            selectedmin:props.minuteprops,
            mandatory:true,
            locationid:props.Locationsprops,
            hideapprover:false,
            currentuser:"",
            dealertitle:props.Dealerprops,
            fromMail:"",
            pastplanneddate: props.PlannedDateprops,
            pastdealername: props.DealerNameprops,
            pastselectedhour:props.hourprops,
            pastselectedmin:props.minuteprops,
            authoremail:props.Authorprops,
            authorname:props.Authornameprops,
            currentuserid:"",
            assign:props.Assignprops,
            dealerbusy:true,
            nouser:true,
            nodealer:true,
            nouserdealer:true,
            pinerrormsg:"",
            nopin:true,
            pincode:props.Pincodeprops,
            assignname:"",
            dontknowpin: props.dontknowpinprops,
            pin:props.pinprops,
            assignbusy:true,
            savedisable:false
        };
        this.dealerChanged = this.dealerChanged.bind(this);
        this._oncontactnumberchange = this._oncontactnumberchange.bind(this);
        this.locationChange = this.locationChange.bind(this);
        this.assigntoChange = this.assigntoChange.bind(this);
        this.districtChange = this.districtChange.bind(this);
        this.stateChanged = this.stateChanged.bind(this);
    }
    public componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.itemidprops !== prevState.itemidprops) {
            this.setState({
                itemid: nextProps.itemidprops,
                planneddate: nextProps.PlannedDateprops,
                selecteddistrict: nextProps.Districtprops,
                dealername: nextProps.DealerNameprops,
                contactnumber: nextProps.ContactNumberprops,
                location: nextProps.Locationprops,
                assignto: nextProps.AssignToprops,
                remarks: nextProps.Remarksprops,
                plannedvisittime: nextProps.PlannedVisitTimeprops,
                dealeroption: nextProps.dealeroptionsprops,
                assigntooption: nextProps.assigntooptionprops,
                selectedstate:nextProps.Stateprops,
                selectedmin:nextProps.minuteprops,
                selectedhour:nextProps.hourprops,
                locationid:nextProps.Locationsprops,
                pastplanneddate: nextProps.PlannedDateprops,
            pastdealername: nextProps.DealerNameprops,
            pastselectedhour:nextProps.hourprops,
            pastselectedmin:nextProps.minuteprops,
            authoremail:nextProps.Authorprops,
            authorname:nextProps.Authornameprops,
            dealertitle:nextProps.Dealerprops,
            assign:nextProps.Assignprops,
            dealerbusy:true,
            nouser:true,
            nodealer:true,
            nouserdealer:true,
            pinerrormsg:"",
            nopin:true,
            pincode:nextProps.Pincodeprops,
            dontknowpin:nextProps.dontknowpinprops,
            pin:nextProps.pinprops,
            state: nextProps.stateoptionprops,
            district: nextProps.districtoptionprops,
            assignbusy:true,
            savedisable:false
            });
            
        }
    }
 
    public  salesuseritems: any[];
    public async componentDidMount() {
        try{
        let user = await sp.web.currentUser();
     this.setState({
            currentuser: user.Title,
            fromMail:user.Email,
            currentuserid:user.Id,
        });
    }
    catch{}
    try{
        let grp1 : any[] = await sp.web.siteGroups.getByName("HOAdmin").users();
        for (let i = 0; i < grp1.length; i++) {
            if(this.state.currentuserid == grp1[i].Id){
                this.group ="1";
                this.setState({
                    hideapprover: false
                }); 
            }
        }}
        catch{}
        try{
        let grp2 : any[] = await sp.web.siteGroups.getByName("SalesOfficer").users();
        for (let i = 0; i < grp2.length; i++) {
            if(this.state.currentuserid == grp2[i].Id){
                this.group ="2";
                this.setState({
                    hideapprover: true
                }); 
            }
        }
    }
    catch{}
    let locationarray = [];
    let assigntoarray = [];
    let districtarray = [];
    let dealerarray = [];
    let pin;
    let userid ;
    let assign;
    let user;
    let username;
    if(this.state.pincode == ""||this.state.pincode == undefined||this.state.pincode == null){
        this.setState({
            dontknowpin: false,
            pin: true
        });
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

        const districtitems: any[] = await sp.web.lists.getByTitle("Districts").items.get();
        // const districtitems: any[] = await sp.web.lists.getByTitle("Districts").items.select("Title,ID").getAll();
        //let districtarray = [];
        for (let i = 0; i < districtitems.length; i++) {
            if(districtitems[i].StateId == this.state.selectedstate){
            let districtdata = {
                key: districtitems[i].Id,
                text: districtitems[i].Title
            };
            districtarray.push(districtdata);
        }
        }
        this.setState({
            district: districtarray
        });

    }
    else{
        this.setState({
            dontknowpin: true,
            pin: false
        });
        pin = this.state.pincode.substring(0, 4);

        console.log(pin.trim());
        
        
        const dealeritems = await sp.web.lists.getByTitle("Dealer List").getItemsByCAMLQuery({
          ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='City_x002f_Location_x003a_PinCod' /><Value Type='Lookup'>"
          + pin +"</Value></BeginsWith></Where></Query></View>",
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
            + pin +"</Value></BeginsWith></Where></Query></View>",
          });
          console.log(locationitems);
          for (let i = 0; i < locationitems.length; i++) {
             districtitem = locationitems[i].DistrictsId;
          }
        //   this.salesuseritems = await sp.web.lists.getByTitle("Users").getItemsByCAMLQuery({
        //     ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='UserType' /><Value Type='Choice'>Sales</Value></Eq> <Eq><FieldRef Name='District' LookupId='TRUE' /><Value Type='Lookup'>"
        //     + districtitem + "</Value></Eq> </And></Where></Query></View>",
        // });
       
          this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId").filter(" DistrictId eq " + districtitem).get();
          for (let i = 0; i < this.salesuseritems.length; i++) {
           
                user = {
                    key: this.salesuseritems[i].Id,
                    text: this.salesuseritems[i].Title
                };
                userid = this.state.assignto;
                if(assigntoarray.indexOf(user) == -1){
                assigntoarray.push(user);
                }
                
           
            if(this.state.hideapprover== true){
                if(this.state.currentuserid == this.salesuseritems[i].UserNameId){
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
            assignto:userid,
            assign:assign,
            assignname:username
           
        });
    }
    }


    }
    
    public _onplanneddateChange = (date?: Date): void => {
        //let planneddate = moment(date, 'DD/MM/YYYY').format("DD MMM YYYY");
        this.setState({ planneddate: date });

        console.log(this.state.planneddate);
    }
    public async dealerChanged(option: { key: any; }) {
        //console.log(option.key);
        let locationarray = [];
        let loc="";
        let ph="";
        let locid;
        let dealname="";
        this.setState({ dealername: option.key });
        const items: any[] = await sp.web.lists.getByTitle("Location").items.get();
        console.log(this.state.selecteddistrict);
        const dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.get();
        console.log(dealeritems);
        for (let i = 0; i < dealeritems.length; i++) {
 
         if(dealeritems[i].Id == option.key){
            ph =dealeritems[i].ContactNumber;
            locid =dealeritems[i].City_x002f_LocationId;
            dealname =dealeritems[i].Title;
         }
        }
        const item: any = await sp.web.lists.getByTitle("Location").items.getById(locid).get();
        console.log(item);
        loc=item.Title;
        let data = {
            key: item.Id,
            text: item.Title
        };
        locationarray.push(data);
        
       this.setState({
        contactnumber:ph,
        locationoption: locationarray,
        location:loc,
        locationid:locid,
        dealertitle:dealname
       });
    }
    public locationChange(option: { key: any; }) {
        //console.log(option.key);
        this.setState({ location: option.key });
        console.log(this.state.location);
    }
    public async districtChange(option: { key: any; }) {
        let dealerarray = [];
        let assigntoarray = [];
        let userid ;
        let assign;
        let user;
        this.setState({ selecteddistrict: option.key ,pincode:""});
       
         const dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.select("Title,ID").filter(" DistrictId eq " + option.key).get();
         console.log("dealer" + dealeritems);
        // console.log("dealer" + dealeritems);
        for (let i = 0; i < dealeritems.length; i++) {

            let data = {
                key: dealeritems[i].Id,
                text: dealeritems[i].Title
            };

            dealerarray.push(data);
        }
        this.setState({
            dealeroption: dealerarray
        });
        const useritems: any[] = await sp.web.lists.getByTitle("Users").items.get();
        console.log(useritems);
        this.salesuseritems = await sp.web.lists.getByTitle("Users").items.select("Title,ID,UserNameId,DistrictId").get();
        console.log("salesusers" + this.salesuseritems);
      
       
       for (let i = 0; i < this.salesuseritems.length; i++) {
            if(this.salesuseritems[i].DistrictId == option.key ){
                user = {
                    key: this.salesuseritems[i].Id,
                    text: this.salesuseritems[i].Title
                };
                assigntoarray.push(user);
            }
           
            if(this.state.hideapprover== true){
                if(this.state.currentuserid == this.salesuseritems[i].UserNameId){
                    user = {
                        key: this.salesuseritems[i].Id,
                        text: this.salesuseritems[i].Title
                    };
                    assign = this.salesuseritems[i].UserNameId;
                    userid = user.key;
                    assigntoarray.push(user);
                }
            }
            
       }
       this.setState({
            assigntooption: assigntoarray,
            assignto:userid,
            assign:assign
           
        });
        if(this.state.dealeroption.length == 0 && this.state.assigntooption.length == 0){
            this.setState({
                nouserdealer:false
               
            });
        }
        else if(this.state.dealeroption.length == 0){
            this.setState({
                nodealer:false
               
            });
        }
        else if(this.state.assigntooption.length == 0){
            this.setState({
                nouser:false
               
            });
        }
        else{}
    }
    public _oncontactnumberchange = (ev: React.FormEvent<HTMLInputElement>, mob?: any) => {
        this.setState({ contactnumber: mob });
        let mnum = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        let mnum2 = /^(\+\d{1,3}[- ]?)?\d{11}$/;
        //let mnum = /^(\+\d{1,3}[- ]?)$/;
        if (mob.match(mnum) || mob.match(mnum2) || mob == '') {
            this.setState({ contactnumbererrormsg: '' });
            this.contactflag = 1;

        }
        else {
            this.setState({ contactnumbererrormsg: 'Please enter a valid mobile number' });
            this.contactflag = 0;
        }
    }
    public onplannedvisittimechange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

        //alert(newValue);
        this.setState({ plannedvisittime: newValue });


    }
    public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {

        this.setState({ remarks: remarks });

    }
    public assigntoChange(option: { key: any }) {
        let assign;
        for (let i = 0; i < this.salesuseritems.length; i++) {
            if(option.key == this.salesuseritems[i].Id){
            assign = this.salesuseritems[i].UserNameId;
            }
        }
        this.setState({ 
            assignto: option.key,
            assign:assign
         });
    }
    public hour(option: { key: any; }) {
        console.log(option.key);
        this.setState({ 
            selectedhour: option.key,
            dealerbusy:true,
             assignbusy:true
        });
        
    }
    public min(option: { key: any; }) {
        console.log(option.key);
        this.setState({ 
            selectedmin: option.key,
            dealerbusy:true,
            assignbusy:true
        });
    }
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
    public pinchange = async (ev: React.FormEvent<HTMLInputElement>, pin?: any) => {
        this.setState({ pincode: pin || '' ,selectedstate:"",selecteddistrict:""});
        let dealerarray = [];
        let assigntoarray = [];
        let userid ;
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
              + pin +"</Value></BeginsWith></Where></Query></View>",
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
            + pin +"</Value></BeginsWith></Where></Query></View>",
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
                
                if(assigntoarray.indexOf(user) == -1){
                assigntoarray.push(user);
                }
           
            if(this.state.hideapprover== true){
                if(this.state.currentuserid == this.salesuseritems[i].UserNameId){
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
            assignto:userid,
            assign:assign,
            assignname:username
           
        });
    }
        if(this.state.dealeroption.length == 0 && this.state.assigntooption.length == 0){
            this.setState({
                nouserdealer:false
               
            });
        }
        else if(this.state.dealeroption.length == 0){
            this.setState({
                nodealer:false
               
            });
        }
        else if(this.state.assigntooption.length == 0){
            this.setState({
                nouser:false
               
            });
        }
        else{}
        
        }
    public update = async () => {
        this.setState({ mandatory: true ,assignbusy:true,dealerbusy:true,savedisable:true}); 
        let siteUrl = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication";
        let web = Web(siteUrl);
        let planneddate;
        let pdt;
        let assignto;
        let RouteId;
        let NotificationID;
        let planneddateformat;
        let isnot;
        let assignbusy;
        let route;
        console.log("Past Planned Date"+this.state.pastplanneddate);
        console.log("Planned Date"+this.state.planneddate);
        console.log(this.state.authoremail);
        if (this.state.planneddate == null) {
            planneddate = null;
            pdt = null;
        }
        else {
            //planneddate = moment(this.state.planneddate, 'DD/MM/YYYY').format('YYYY-MM-DDT12:00:00Z');
            planneddate = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
           pdt =moment(this.state.planneddate).format('YYYY-MM-DD'+'T'+this.state.selectedhour+':'+this.state.selectedmin);
           planneddateformat = moment(this.state.planneddate).format('DD-MMM-YYYY');
       }
       let notification = this.state.currentuser + " modified a route to visit "+this.state.dealertitle +" on "
       +planneddateformat+" at "+this.state.selectedhour+":"+this.state.selectedmin;
       let date = moment(this.state.planneddate).format('YYYY-MM-DDT12:00:00Z');
       const routeData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
        + this.state.dealername + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>" 
        + date + "</Value></Eq></And><And><Eq><FieldRef Name='Hours' /> <Value Type='Text'>"
        +this.state.selectedhour+"</Value></Eq><Eq><FieldRef Name='Minutes' /> <Value Type='Text'>"
        + this.state.selectedmin+"</Value></Eq></And></And></Where></Query></View>",
    });

     
    console.log(routeData);
    if(routeData.length == 0){
        route ="True";
    }
    else{
        for (let i = 0; i < routeData.length; i++) {
            if(routeData[i].ID == this.state.itemid){
                route ="True";
            }
            else{
                route = "False";
            }

        }
        
    }
   

    const assignData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='AssignTo' LookupId='TRUE' /><Value Type='Lookup'>"
        + this.state.assignto + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>" 
        + date + "</Value></Eq></And><And><Eq><FieldRef Name='Hours' /> <Value Type='Text'>"
        +this.state.selectedhour+"</Value></Eq><Eq><FieldRef Name='Minutes' /> <Value Type='Text'>"
        + this.state.selectedmin+"</Value></Eq></And></And></Where></Query></View>",
    });
    if(assignData.length == 0){
        assignbusy ="True";
    }
    else{
        for (let i = 0; i < assignData.length; i++) {
            if(assignData[i].ID == this.state.itemid){
                assignbusy ="True";
            }
            else{
                assignbusy = "False";
            }

        }
    }
    if(assignbusy == "False"){
        this.setState({ assignbusy:false,savedisable:false });
    }
    else if(route == "False"){
        this.setState({ dealerbusy:false,savedisable:false });
    }
    else if(this.state.nouserdealer == false){
           this.setState({nouserdealer:false,savedisable:false});
       }
       else if(this.state.nodealer == false){
           this.setState({nodealer:false,savedisable:false});
       }
       else if(this.state.nouser == false){
           this.setState({nouser:false,savedisable:false});
       }
      else {
          if (this.state.pin == true) {
        if (planneddate == "" || this.state.selectedhour == "" || this.state.selectedmin == ""
            || this.state.dealername == "" || this.state.contactnumber == "" || this.contactflag == 0
            || this.state.location == "" || this.state.assignto == ""
            || this.state.selectedstate == "" && this.state.selecteddistrict == "") {
            this.setState({ mandatory: false,savedisable:false });
        }
        else {
        let conf = confirm("Do you want to submit?");
        if (conf == true) {
            let list = sp.web.lists.getByTitle("Route List");

            const i = await list.items.getById(this.state.itemid).update({

                //Title: this.state.plannedvisittime,
                PlannedDate: planneddate,
                StateId: this.state.selectedstate,
                DistrictId: this.state.selecteddistrict,
                DealerNameId: this.state.dealername,
                ContactNumber: this.state.contactnumber,
                Location: this.state.location,
                AssignToId: this.state.assignto,
                Remarks: this.state.remarks,
                Hours:this.state.selectedhour,
                Minutes:this.state.selectedmin,
                PlannedDateTime:pdt,
                LocationsId:this.state.locationid,
                AssignId:this.state.assign,
                Checkin:"1",
                Pincode:this.state.pincode,
            });
                
                if(this.state.hideapprover== true){
                    
                    const notificationitems: any[] = await sp.web.lists.getByTitle("Notification").items.getAll();
                    console.log(notificationitems);
                    for (let n = 0; n < notificationitems.length; n++) {
                        if(notificationitems[n].RouteId == this.state.itemid){
                            isnot="1";
                            RouteId = notificationitems[n].RouteId;
                            NotificationID = notificationitems[n].ID;
                        }
                    }
                    if(isnot == "1"){
                    await sp.web.lists.getByTitle("Notification").items.getById(NotificationID).update({
        
                        DashboardType: "Admin",
                        Notification:notification,
                     });
                    }
                    else{
                        // await sp.web.lists.getByTitle("Notification").items.add({
        
                        //     DashboardType: "Sales",
                        //     Notification:notification,
                        //     RouteId:this.state.itemid
                        // });
                    }
                    }
                     if((this.state.hideapprover== true)&&(this.state.authoremail !=this.state.fromMail)){
                     
                     let msg = this.state.currentuser+" modified the route for the dealer "+this.state.dealertitle +" on "+planneddateformat+" at "+ 
                      this.state.selectedhour +":"+this.state.selectedmin+".";
                    let Mailmsg="Hai "+this.state.authorname+",</p><p>"+msg+"</p>";
                    console.log(Mailmsg);
                   if((this.state.pastplanneddate != this.state.planneddate)||
                   (this.state.pastdealername != this.state.dealername)||
                   (this.state.pastselectedhour != this.state.selectedhour)||
                   (this.state.pastselectedmin != this.state.selectedmin)){
                       console.log(Mailmsg);
                     const emailProps: IEmailProperties = {
                        From:this.state.fromMail,
                        To: [this.state.authoremail],
                        Subject: "Modification of Route",
                        Body: Mailmsg,
                        AdditionalHeaders: {
                            "content-type": "text/html"
                        }
                        };
                        
                        await sp.utility.sendEmail(emailProps);
                        console.log("Email Sent!");
                   
                 }
                }
                this._onCancel();
            // });
        
        
        
        }
        this._onCancel();
         }
        }
        else if (this.state.pin == false) {
            if (planneddate == "" || this.state.selectedhour == "" || this.state.selectedmin == ""
                || this.state.dealername == "" || this.state.contactnumber == "" || this.contactflag == 0
                || this.state.location == "" || this.state.assignto == "" || this.state.pincode == "") {
                this.setState({ mandatory: false,savedisable:false });
            }
            else {
                let conf = confirm("Do you want to submit?");
                if (conf == true) {
                    let list = sp.web.lists.getByTitle("Route List");
        
                    const i = await list.items.getById(this.state.itemid).update({
        
                        //Title: this.state.plannedvisittime,
                        PlannedDate: planneddate,
                        DealerNameId: this.state.dealername,
                        ContactNumber: this.state.contactnumber,
                        Location: this.state.location,
                        AssignToId: this.state.assignto,
                        Remarks: this.state.remarks,
                        Hours:this.state.selectedhour,
                        Minutes:this.state.selectedmin,
                        PlannedDateTime:pdt,
                        LocationsId:this.state.locationid,
                        AssignId:this.state.assign,
                        Checkin:"1",
                        Pincode:this.state.pincode,
                        StateId: 0,
                        DistrictId: 0,
                    });
                        
                        if(this.state.hideapprover== true){
                            
                            const notificationitems: any[] = await sp.web.lists.getByTitle("Notification").items.getAll();
                            console.log(notificationitems);
                            for (let n = 0; n < notificationitems.length; n++) {
                                if(notificationitems[n].RouteId == this.state.itemid){
                                    isnot="1";
                                    RouteId = notificationitems[n].RouteId;
                                    NotificationID = notificationitems[n].ID;
                                }
                            }
                            if(isnot == "1"){
                            await sp.web.lists.getByTitle("Notification").items.getById(NotificationID).update({
                
                                DashboardType: "Admin",
                                Notification:notification,
                             });
                            }
                            else{
                                // await sp.web.lists.getByTitle("Notification").items.add({
                
                                //     DashboardType: "Sales",
                                //     Notification:notification,
                                //     RouteId:this.state.itemid
                                // });
                            }
                            }
                             if((this.state.hideapprover== true)&&(this.state.authoremail !=this.state.fromMail)){
                             
                             let msg = this.state.currentuser+" modified the route for the dealer "+this.state.dealertitle +" on "+planneddateformat+" at "+ 
                              this.state.selectedhour +":"+this.state.selectedmin+".";
                            let Mailmsg="Hai "+this.state.authorname+",</p><p>"+msg+"</p>";
                            try{
                           if((this.state.pastplanneddate != this.state.planneddate)||
                           (this.state.pastdealername != this.state.dealername)||
                           (this.state.pastselectedhour != this.state.selectedhour)||
                           (this.state.pastselectedmin != this.state.selectedmin)){
                               console.log("From:"+this.state.fromMail);
                               console.log("To:"+this.state.authoremail);
                             const emailProps: IEmailProperties = {
                                From:this.state.fromMail,
                                To: [this.state.authoremail],
                                Subject: "Modification of Route",
                                Body: Mailmsg,
                                AdditionalHeaders: {
                                    "content-type": "text/html"
                                }
                                };
                                
                                await sp.utility.sendEmail(emailProps);
                                console.log("Email Sent!");
                           
                         }
                        }catch{}
                        }
                        
                    // });
                    alert("Updated successfully");
                    this._onCancel();
                }
                this._onCancel();
                 }
        }

    }
}
public adddealer(){
    window.location.href = 'https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/Lists/DealerList/AllItems.aspx';
}
    public async nopin() {
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
        this.setState({
            dontknowpin: false,
            pin: true
        });
    }
    public knowpin() {
        this.setState({
            dontknowpin: true,
            pin: false
        });
    }
    private _onCancel = () => {
        this.props.onClose();
        this.setState({
            selecteddistrict: '',
            selectedhour:'',
            selectedmin:'',
            mandatory:true,
            selectedstate: '',
            planneddate: null,
            dealername:'',
            contactnumber: null,
            contactnumbererrormsg: '',
            remarks: '',
            plannedvisittime: '',
            location: '',
            assignto: '',
            locationid:'',
            savedisable:false,
            itemid:''
        });
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
        const UpdateIcon: IIconProps = { iconName: 'Add' };
        const ErrorIcon: IIconProps = { iconName: "CaretRightSolid8" };
        const dropdownStyles: Partial<IDropdownStyles> = {
            dropdown: { width: 80 },
          };
        let { isOpen } = this.props;
        return (

            <Panel isOpen={isOpen} type={PanelType.custom}
                customWidth={'800px'} onDismiss={this._onCancel}>

                <h3>Edit Route</h3>
                <div hidden={this.state.mandatory}><Label style={{ color: "red" }}>Please fill all mandatory fields</Label></div>
                <div hidden={this.state.nodealer}><Label style={{ color: "red" }}>No Dealer in this district</Label></div>
                <div hidden={this.state.nouser}><Label style={{ color: "red" }}>No User in this district </Label></div>
                <div hidden={this.state.nouserdealer}><Label style={{ color: "red" }}>No Dealer and User in this district </Label></div>
                <div hidden={this.state.dealerbusy}><Label style={{ color: "red" }}> Dealer has an appointment at the same time.Please choose another </Label></div>
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
                />
                 </td><td>
                               
                               <Dropdown id="time" required={true}
                                           placeholder="--"
                                           options={hour}
                                           styles={dropdownStyles}
                                           //onChanged={this.usertypeChanged}
                                           selectedKey={this.state.selectedhour}
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
                <Label >Dealer Name</Label>  <Dropdown id="dept"
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
                {/* <p><Label >Location</Label>  <Dropdown id="location"
                    placeholder="Select an option"
                    selectedKey={this.state.locationid}
                    options={this.state.locationoption}
                    disabled
                /></p> */}
                 <p><Label >Location </Label>
                    < TextField value={this.state.location} disabled
                   
                      ></TextField></p> 
                <p><Label >Contact Number </Label>
                    < TextField value={this.state.contactnumber} 
                    onChange={this._oncontactnumberchange} 
                    errorMessage={this.state.contactnumbererrormsg} required={true}   ></TextField></p>
               
               <div hidden={this.state.hideapprover}>
                <p><Label >Assign To</Label>
                    <Dropdown id="assign" required={true}
                        placeholder="Select an option"
                        selectedKey={this.state.assignto}
                        options={this.state.assigntooption}
                        //onChanged={this.dChanged}
                        onChanged={this.assigntoChange}
                    /></p></div>
                <p><Label >Remarks</Label>
                    < TextField value={this.state.remarks} onChange={this.remarkschange} multiline  ></TextField></p>

                <DialogFooter>
                    <PrimaryButton text="Save" onClick={this.update} disabled ={this.state.savedisable} />
                    <PrimaryButton text="Cancel" onClick={this._onCancel} />
                </DialogFooter>
            </Panel>

        );
    }



}