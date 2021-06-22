import * as React from 'react';
import styles from './CheckinCheckout.module.scss';
import { ICheckinCheckoutProps } from './ICheckinCheckoutProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Dropdown, IDropdownStyles, Label, PrimaryButton, TextField,Button,ButtonType } from 'office-ui-fabric-react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups";
import * as moment from 'moment';
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog'
export interface IWorkingWithState {
  latitude: any;
  longitude: any;
  hideadmin:boolean;
  hidesales:boolean;
  currentdate:any;
  currentuser:any;
  currentuserid:any;
  dealeroption: any[];
  dealername: any;
  dealertitle:any;
  remarks: any;
  mandatory: boolean;
  hidecheckin: boolean;
  hidecheckout: boolean;
  hidenoroute:boolean;
  checkinId:any;
  routeid:any;
  hideremark:boolean;
  fromMail:any;
  dealer_website_id:any;
  siteurl:any;
  isOpen:boolean;
  DialogeAlertContent:any;
  update:any;
 }
 

export default class CheckinCheckout extends React.Component<ICheckinCheckoutProps,IWorkingWithState, {}> {
  constructor(props) {
    super(props);
    this.state = {
      latitude:"",
      longitude:"",
      hideadmin:true,
      hidesales:false,
      currentdate:"",
      currentuser:"",
      currentuserid:"",
      dealeroption: [],
      dealername: "",
      dealertitle:"",
      remarks: "",
      fromMail:"",
      dealer_website_id:"",
      mandatory:true,
      hidecheckin: true,
      hidecheckout: true,
      hidenoroute:true,
      checkinId:null,
      routeid:null,
      hideremark:true,
      siteurl:'',
      isOpen:false,
      DialogeAlertContent:'',
      update:''
    };
    // this.dealerChanged = this.dealerChanged.bind(this);
    this.geoSuccess = this.geoSuccess.bind(this);
    this.checkin = this.checkin.bind(this);
    this.checkout = this.checkout.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this.check =this.check.bind(this);
    this.captureorder =this.captureorder.bind(this);
    this.balancesheet = this.balancesheet.bind(this);
    this.noprocess = this.noprocess.bind(this);
    this.locationupdate=this.locationupdate.bind(this);
  }
  //On Load
  public async componentDidMount() {
    //Get Current Url
    const rootwebData = await sp.site.rootWeb();
    console.log(rootwebData);
    var webValue = rootwebData.ResourcePath.DecodedUrl;
    //alert(webValue);
    this.setState({
      siteurl: webValue
    });
    let dealerarray = [];
    let routeid;
    let dealerid;
    let dealername;
    let checkin;
    let dealer_website_id;
    try{
    let user = await sp.web.currentUser();
    console.log(user);
    //Check sales officer or not
    let grp2 : any[] = await sp.web.siteGroups.getByName("SalesOfficer").users();
      for (let i = 0; i < grp2.length; i++) {
          if(user.Id == grp2[i].Id){
              this.setState({
                hideadmin:true,
                hidesales:false
              }); 
          }
          
      }
      this.setState({
        currentuser: user.Title,
        currentuserid:user.Id,
        fromMail:user.Email
 
    });
    }
    catch{}
    //Get from parameters
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    dealerid = queryParms.getValue("dealerId");
    routeid = queryParms.getValue("RouteId");
    checkin = queryParms.getValue("checkin");
    dealer_website_id=queryParms.getValue("dealer_website_id");
    //Get Checkin checkout data
    const checkinData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='LogType' /><Value Type='Choice'>Check In</Value></Eq> <Eq><FieldRef Name='Route' LookupId='TRUE' /><Value Type='Lookup'>"
      + routeid + "</Value></Eq> </And></Where></Query></View>",
  });
 
  console.log(checkinData);
  if(checkinData.length == 0){
    this.setState({hidecheckin:false,hidecheckout: true,});
  }
  else{
  for (let i = 0; i < checkinData.length; i++) {
    
      this.setState({ 
      hidecheckout: false,
      hidecheckin:true,
      checkinId:checkinData[i].Id,
      dealername: checkinData[i].DealerNameId,
     }); 
    }
  }
  //Get current date
    var currentdate = new Date();
    console.log(currentdate);
    let today = moment(currentdate).format('YYYY-MM-DDT12:00:00Z');
  //Get Dealer  
    const dealeritems = await sp.web.lists.getByTitle("DealersData").items.getById(dealerid).get();
      console.log(dealeritems);
      dealername = dealeritems.dealer_name;

 //Get Location
    if(navigator.geolocation) {
      //Get current position
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
              } else {
                  // alert("Geolocation is not supported by this browser.");
              }
              this.setState({
                currentdate:currentdate,
                dealername:dealerid,
                routeid:routeid,
                dealertitle:dealername,
                dealer_website_id:dealer_website_id
            });

    
    }
    // Get current position
    private  geoSuccess(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      // alert("lat:" + lat + " lng:" + lng);
      this.setState({
              latitude:lat,
              longitude:lng 
      });
    }
    //On Error
    private geoError() {
      // alert("Geocoder failed.");
    }
    //Checkin Button click
    private async checkin(){
      this.setState({ mandatory: true }); 
      let checkinId;
      let isCheckin = false;
      var currentdate = new Date();
      //Verify location
      if(this.state.latitude==""||this.state.longitude==""){
        this.setState({ isOpen: true ,DialogeAlertContent:"Please exit the application then turn on your device location and try again"});
      }
      else
      {
        let location = this.state.latitude+","+this.state.longitude;
        const routeitems = await sp.web.lists.getByTitle("Route List").items.getById(this.state.routeid).get();
        if(routeitems.Checkin == 2){
          this.setState({ isOpen: true ,DialogeAlertContent:"Sales Officer already checkin to this dealer"});
        //  Dialog.alert("Sales Officer already checkin to this dealer");
        }
        const search = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
          ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='LogType' /><Value Type='Choice'>Check In</Value></Eq> <Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
          + this.state.dealername + "</Value></Eq> </And></Where></Query></View>",
      });
      
  if(search.length > 0)
  {
  for (let i = 0; i < search.length; i++) {
  let item=search[i];
  let checkin=item.Checkin;
  let checkinDate = moment(checkin).format("YYYY-MM-DD");
  let currentDatee = moment(currentdate).format("YYYY-MM-DD");
  if(checkinDate == currentDatee)
  {
  isCheckin = true;
  }
  }
  
  }
    if(search.length != 0 && isCheckin){
      this.setState({ isOpen: true ,DialogeAlertContent:"Sales Officer already checkin to this dealer now. Please try after some time"});
      
    }
     else if ( this.state.dealername == ""){
            this.setState({ mandatory: false });  
        }
        else{
          this.setState({ isOpen: true ,DialogeAlertContent:"Are you ready to meet?",update:"1"});
       
        
        }
      }
     
    }
    open = () => this.setState({isOpen: true})
//Alert    
close = () =>{ 
 
  if(this.state.update=="1")
  {
    this.CheckInDealerMethod();
  }
  else if(this.state.update=="2")
  {
    this.NoProcessMethod();
  }
  else if(this.state.update=="3")
  {
    this.setState({ 
        hideremark:false,
        hidecheckin:true,
        hidecheckout:true
    }); 
  
  }
  this.setState({isOpen: false,DialogeAlertContent:"",update:"0"})
} 
//No Process
private async NoProcessMethod()
{
  let location = this.state.latitude+","+this.state.longitude;
  var currentdate = new Date();
  let a= await sp.web.lists.getByTitle("CheckIn CheckOut").items.add({
    LogType:"Nil",
    Checkin:currentdate,
    LogLocation:location,
    DealerNameId:this.state.dealername,
    UserNameId:this.state.currentuserid,
    RouteId:this.state.routeid
    });
    const routeitems = await sp.web.lists.getByTitle("Route List").items.getById(this.state.routeid).update({
      
      Status:"Nil"
      });
  this._onCancel();
   window.location.href = this.state.siteurl+'/SitePages/Dealer-View.aspx';
}
//Checkin Add Data
private async CheckInDealerMethod()
{
  let checkinId;
  let location = this.state.latitude+","+this.state.longitude;
  let a= await sp.web.lists.getByTitle("CheckIn CheckOut").items.add({
    LogType:"Check In",
    Checkin:new Date(),
    LogLocation:location,
    DealerNameId:this.state.dealername,
    UserNameId:this.state.currentuserid,
    RouteId:this.state.routeid
    });
    const routeitems = await sp.web.lists.getByTitle("Route List").items.getById(this.state.routeid).update({
      Checkin:"0",
      Status:"Check In"
      });
    checkinId = a.data.ID; 
    console.log(checkinId);
    this.setState({ 
      hidecheckout: false,
    hidecheckin:true,
    checkinId:checkinId 
  }); 
}
//Checkout
    private async checkout(){
      var currentdate = new Date();
      if ( this.state.remarks == ""){
        this.setState({ mandatory: false });  
    }
    else{
      
        const i = await sp.web.lists.getByTitle("CheckIn CheckOut").items.getById(this.state.checkinId).update({
          LogType:"Check Out",
          Checkout:currentdate,
          Remark: this.state.remarks
          });
          const routeitems = await sp.web.lists.getByTitle("Route List").items.getById(this.state.routeid).update({
            Checkin:"2",
            Status:"Check Out"
            });
            this._onCancel();
            window.location.href = this.state.siteurl+'/SitePages/Dealer-View.aspx';
            
          } 
     
    }
    //No process Alert
    public  async noprocess(){
      var currentdate = new Date();
     
      this.setState({ 
        isOpen: true ,
        DialogeAlertContent:"Are you sure No process need to be executed ?",
        update:"2"
      });

    }
    //Checkout Alert
    private async check(){
      this.setState({ 
        isOpen: true ,
        DialogeAlertContent:"Are you sure to checkout? Click OK to Checkout or Cancel to New Order or Stock Update",
        update:"3"
      });
      
    
    }
    //On Cancel
    public _onCancel = () => {
      
      this.setState({
        hidecheckout: true,
        hidecheckin:false,
        dealername: "",
        dealertitle:"",
        remarks: "",
        mandatory:true, 
      });
    }
    //Capture order
    public  captureorder(){ 
      window.location.href = this.state.siteurl+"/SitePages/CaptureOrder.aspx?dealerId="+this.state.dealername+"&RouteId="+this.state.routeid+"&dealer_website_id="+this.state.dealer_website_id;
    }
    //Balance sheet
    public  balancesheet(){
       window.location.href = this.state.siteurl+"/SitePages/Balancesheet.aspx?dealerId="+this.state.dealername+"&RouteId="+this.state.routeid+"&dealer_website_id="+this.state.dealer_website_id;
    }
    //Location Update
    public async locationupdate(){
      let location = this.state.latitude+","+this.state.longitude;
      if(this.state.latitude==""||this.state.longitude==""){
        this.setState({ isOpen: true ,DialogeAlertContent:"Please exit the application then turn on your device location and try again"});
        //alert("Please exit the application then turn on your device location and try again");
      }
    else{
      const dealeritems = await sp.web.lists.getByTitle("DealersData").items.getById(this.state.dealername).update({
        latitude:this.state.latitude,
        longitude:this.state.longitude
        });
        var param= new FormData();
        param.append('dealer_id',this.state.dealer_website_id)
        param.append('latitude',this.state.latitude)
        param.append('longitude',this.state.longitude)
       
              const requestOptions1 = {
                method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                body: param
            };
           await fetch('https://mrbutlers.com/find_dealer/update_location.php', requestOptions1)
                .then(response => response.json())
                .then((data) =>{
                  console.log(data)
             if(data.status==true )
             {
              this.setState({ isOpen: true ,DialogeAlertContent:"Dealer Location updated successfully"});
              
             }
                 })
                .catch((error) => {
                         console.log(error);
                       });
        
        console.log("Done");  
    }
     }
     //Remark change
  public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {

    this.setState({ remarks: remarks });

}
  public render(): React.ReactElement<ICheckinCheckoutProps> {
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 200 },
    };
    return (
      <div className={ styles.checkinCheckout } >
          <div hidden={this.state.mandatory}><Label style={{ color: "red" }}>Please fill all mandatory fields</Label></div>
         <div ><Label ><h1>{this.state.dealertitle}</h1></Label> </div>
                <div hidden={this.state.hideremark}>
                <Label >Remarks:</Label>
                < TextField value={this.state.remarks} onChange={this.remarkschange} multiline required></TextField>
                </div>
          <table style={{alignContent:"Right"}} hidden={this.state.hidesales} >
            <tr></tr>
          <tr  hidden={this.state.hidecheckin}>
            
            <td>
              <PrimaryButton style={{ width: "150px" }} id="checkin" text="Check In" onClick={this.checkin} />
            </td>
            </tr>
            <tr  hidden={this.state.hidecheckin}>
            
            <td>
              <PrimaryButton style={{ width: "150px" }} id="noprocess" text="No Process" onClick={this.noprocess} />
            </td>
            </tr>
            <tr hidden={this.state.hidecheckout}>
            <td >
              <PrimaryButton style={{ width: "150px" }} id="balancesheet" text="Stock Update" onClick={this.balancesheet}  />
            </td>
          </tr>
            <tr hidden={this.state.hidecheckout}>
            <td >
              <PrimaryButton style={{ width: "150px" }} id="captureorder" text="New Order" onClick={this.captureorder}  />
            </td>
          </tr>
          <tr hidden={this.state.hidecheckout}>
            <td >
              <PrimaryButton style={{ width: "150px" }} id="locationupdate" text="Location Update" onClick={this.locationupdate}  />
            </td>
          </tr>
            <tr hidden={this.state.hideremark}>
            <td >
              <PrimaryButton style={{ width: "150px" }} id="checkout" text="Check Out" onClick={this.checkout}  />
            </td>
          </tr>
          <tr hidden={this.state.hidecheckout}>
            <td >
              <PrimaryButton style={{ width: "150px" }} id="check" text="Check Out" onClick={this.check}  />
            </td>
          </tr>
        </table>
        <div hidden={this.state.hideadmin}><p className={ styles.errorStyle } >You are not sales user</p></div>
        <div hidden={this.state.hidenoroute} ><p className={ styles.errorStyle }>No Route assigned to you for visiting dealer</p></div>
        <Dialog
          isOpen={this.state.isOpen}
          type={DialogType.close}
          // onDismiss={this.closeButton.bind(this)}
         
          onDismiss={() => this.setState({ isOpen: false })}
          subText={this.state.DialogeAlertContent}
          isBlocking={false}
          closeButtonAriaLabel='Close'
        >
        
          <DialogFooter>
            <Button buttonType={ButtonType.primary} onClick={this.close}>OK</Button>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}

