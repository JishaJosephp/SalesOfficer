import * as React from 'react';
import styles from './CheckinCheckout.module.scss';
import { ICheckinCheckoutProps } from './ICheckinCheckoutProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Dropdown, IDropdownStyles, Label, PrimaryButton, TextField } from 'office-ui-fabric-react';
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
      mandatory:true,
      hidecheckin: true,
      hidecheckout: true,
      hidenoroute:true,
      checkinId:null,
      routeid:null,
      hideremark:true
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
  }
  public async componentDidMount() {
    let dealerarray = [];
    let routeid;
    let dealerid;
    let dealername;
    let checkin;
    try{
    let user = await sp.web.currentUser();
    console.log(user);
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
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    dealerid = queryParms.getValue("dealerId");
    routeid = queryParms.getValue("RouteId");
    checkin = queryParms.getValue("checkin");
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
    var currentdate = new Date();
    console.log(currentdate);
    let today = moment(currentdate).format('YYYY-MM-DDT12:00:00Z');
    const dealeritems = await sp.web.lists.getByTitle("Dealer List").items.getById(dealerid).get();
      console.log(dealeritems);
      dealername = dealeritems.Title;

 
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
              } else {
                  // alert("Geolocation is not supported by this browser.");
              }
              this.setState({
                currentdate:currentdate,
                dealername:dealerid,
                routeid:routeid,
                dealertitle:dealername,
            });

    
    }
    private  geoSuccess(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      // alert("lat:" + lat + " lng:" + lng);
      this.setState({
              latitude:lat,
              longitude:lng 
      });
    }
    private geoError() {
      // alert("Geocoder failed.");
    }
    private async checkin(){
      this.setState({ mandatory: true }); 
      let checkinId;
      var currentdate = new Date();
      let location = this.state.latitude+","+this.state.longitude;
      const routeitems = await sp.web.lists.getByTitle("Route List").items.getById(this.state.routeid).get();
      if(routeitems.Checkin == 2){
        alert("Sales Officer already checkin to this dealer");
      }
      const search = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='LogType' /><Value Type='Choice'>Check In</Value></Eq> <Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
        + this.state.dealername + "</Value></Eq> </And></Where></Query></View>",
    });
  if(search.length != 0){
    alert("Sales Officer already checkin to this dealer now. Please try after some time");
  }
   else if ( this.state.dealername == ""){
          this.setState({ mandatory: false });  
      }
      else{
      let conf = confirm("Are you ready to meet?");
      if (conf == true) {
 
         let a= await sp.web.lists.getByTitle("CheckIn CheckOut").items.add({
          LogType:"Check In",
          Checkin:currentdate,
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
      }
    }
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
            window.location.href = 'https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Dealer-View.aspx';
            
          } 
     
    }
    public  async noprocess(){
      var currentdate = new Date();
      let location = this.state.latitude+","+this.state.longitude;
      let conf = confirm("Are you sure No process need to be executed ?");
      if (conf == true) {
 
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
         window.location.href = 'https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Dealer-View.aspx';
            
        }

    }
    private async check(){
      let conf = confirm("Are you sure to checkout? Click OK to Checkout or Cancel to Update Capture Order or Balance Stock");
      if (conf == true) {
 
      this.setState({ 
        hideremark:false,
        hidecheckin:true,
        hidecheckout:true
    }); 
  }
    }
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
    public  captureorder(){ 
      window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/CaptureOrder.aspx?dealerId="+this.state.dealername+"&RouteId="+this.state.routeid;
    }
    public  balancesheet(){
       window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Balancesheet.aspx?dealerId="+this.state.dealername+"&RouteId="+this.state.routeid;
    }
 
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
                <Label >Remarks:</Label>< TextField value={this.state.remarks} onChange={this.remarkschange} multiline required></TextField>
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
      
      </div>
    );
  }
}

