import * as React from 'react';
import styles from './PlannedDealerView.module.scss';
import { IPlannedDealerViewProps } from './IPlannedDealerViewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from "moment";
import "@pnp/sp/site-groups";
import { sp, Web, View, ContentType, Search } from "@pnp/sp/presets/all";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { colors } from '@material-ui/core';
import { confirmAlert } from 'react-confirm-alert'; // Import

import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  DatePicker,
  mergeStyleSets,
  DayOfWeek,
  IDatePickerStrings,
  DefaultButton,
  Label,
  PrimaryButton,
  DialogFooter, Fabric
} from "office-ui-fabric-react";
export interface IPlannedDealerViewState {

  user: any;
  userid: any;
  plannedDealing: any[];
  SelectDate: any;
}

let userGlobal = 0;
const groupByFields: IGrouping[] = [
  {
    name: "PlannedDateFormatted",
    order: GroupOrder.ascending
  }
];
export const viewFields: IViewField[] = [{
  name: "DistrictId",
  displayName: "Dealer Name",
  //linkPropertyName: "c",    
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 150
}, {
  name: "PlannedDateTime",
  displayName: "Planned Date",
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 150
},
{
  name: "Location",
  displayName: "Location",
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 150
}, {
  name: "Remarks",
  displayName: "Remarks",
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 150
},
];
export default class PlannedDealerView extends React.Component<IPlannedDealerViewProps, IPlannedDealerViewState, any> {

  constructor(props: IPlannedDealerViewProps) {
    super(props);
    this.state = {
      user: '',
      userid: '',
      plannedDealing: [],
      SelectDate: ''
    };

    this.getDetails = this.getDetails.bind(this);
    this.SelectDate = this.SelectDate.bind(this);
    this._getSelection = this._getSelection.bind(this);
    // this.CancelItem    =this.CancelItem.bind(this);
    // this.Chekin        =this.Chekin.bind(this);
  }
  public async componentDidMount() {
    await this.getDetails();
  }
  private async _getSelection(items: any[]) {
    console.log(items);
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let planneddate = moment(items[0].PlannedDate).format("YYYY-MM-DD");
    let today = new Date();
    let currentDates = moment(today).format("YYYY-MM-DDT12:00:00Z");
    console.log(this.state.user);
    //   const checkinData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
    //     ViewXml: "<View><Query><Where><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>" 
    //     + this.state.user + "</Value></Eq></Where></Query></View>",
    // });
    // const orderData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
    //   ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='LogType' /><Value Type='Choice'>Check In</Value></Eq> <Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
    //     + items[0].DealerNameId + "</Value></Eq></And></Where></Query></View>",
    // });
  //   const checkinData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
  //     ViewXml: "<View><Query><Where><Neq><FieldRef Name='UserName' /><Value Type='Person or Group'>" 
  //     + this.state.user + "</Value></Neq></Where></Query></View>",
  // });
  //already check into this dealer
    const checkinData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><And><Neq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
        + this.state.user + "</Value></Neq><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
             + items[0].DealerNameId + "</Value></Eq></And><Eq><FieldRef Name='LogType' /> <Value Type='Choice'>Check In</Value></Eq></And></Where></Query></View>",
    });
    console.log(checkinData);
if(checkinData.length == 0)
{
  //already this user checkin to any other dealer
  // const plannedData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
  //   ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
  //     + this.state.user + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
  //     + currentDates + "</Value></Eq></And><Eq><FieldRef Name='Checkin' /> <Value Type='Text'>0</Value></Eq></And></Where></Query></View>",
  // });
  const plannedData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
    ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
      + this.state.user + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
      + currentDates + "</Value></Eq></And><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
      + items[0].DealerNameId + "</Value></Eq></And></Where></Query></View>",
  });
  console.log(plannedData);
  if (planneddate == currentDate)
   {
    if (plannedData.length >= 1) {
      if (items[0].Checkin == "1"){
        for (let i = 0; i < plannedData.length; i++) {
          if(items[0].Id==plannedData[i].ID)
          {
            const checkinData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
              ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
                + this.state.user + "</Value></Eq><Eq><FieldRef Name='LogType' /> <Value Type='Choice'>Check In</Value></Eq></And></Where></Query></View>",
            });
            console.log(checkinData);
            if (checkinData.length == 0) {
              let conf = confirm("Are you sure to move checkin page ?");
              if (conf == true) {
              
                  window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + items[0].DealerNameId + "&RouteId=" + items[0].Id + "&checkin=" + items[0].Checkin;
              }
            }
    else{
      alert("You are already checked into one dealer at this time. Try again after check out");
    } 
          }
        }
        //nithya
      
//nithya
    }
    else  if (items[0].Checkin == "0")
    {
      if (plannedData[0].DealerNameId == items[0].DealerNameId) {
        window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + items[0].DealerNameId + "&RouteId=" + items[0].Id + "&checkin=" + items[0].Checkin;
      }
    }
    else  if (items[0].Checkin == "2")
    {
      alert("You are already checked out from this dealer");
    }
    }
    else {
      if (plannedData[0].DealerNameId == items[0].DealerNameId) {
        window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + items[0].DealerNameId + "&RouteId=" + items[0].Id + "&checkin=" + items[0].Checkin;
      }
      else {
        alert("You are already checked into one dealer at this time. Try again after check out");
      }
    } 
  }
}
else{
  alert("One officer already checked into this dealer at this time. Try again later");
}
   
    console.log('Selected items:', items);
  }

  private SelectDate = (date?: Date): void => {
    this.setState({ SelectDate: date });
  };
  public searchData = async () => {

  }
  public async cancel() {
    window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Sales-Officer.aspx";
  }
  public async getDetails() {

    await sp.web.currentUser.get().then((r) => {

      this.setState({ user: r["Title"], userid: r["Id"] });
      console.log(r["Title"]);
      console.log(r["Id"]);

    });
    console.log(this.state.user);
    // const users = await sp.web.siteGroups.getByName("HOAdmin").users();
    // console.log(users);
    // for (let i = 0; i < users.length; i++) {
    //   if(users[i].Title==this.state.user)
    //   {
    //     console.log("In group");
    //     userGlobal=1;
    //     break;  
    //   }
    //   else{
    //     console.log(users[i].Title);

    //     console.log("Not in group");
    //     userGlobal=0; 
    //   }

    // }
    let today = new Date();
    let currentDate = moment(today).format("YYYY-MM-DDT12:00:00Z");
    console.log(currentDate);

    const plannedData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Geq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
        + currentDate + "</Value></Geq> <Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
        + this.state.user + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
    });

    // const plannedData= await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
    //   ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
    //   + this.state.currentuser + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
    //   + today + "</Value></Eq></And><Eq><FieldRef Name='Checkin' /> <Value Type='Text'>1</Value></Eq></And></Where></Query></View>",
    //   });
    //   const plannedData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
    //     ViewXml: "<View><Query><Where><Geq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>" 
    //     + currentDate + "</Value></Geq></Where></Query></View>",
    // });
    console.log(plannedData);


    for (let i = 0; i < plannedData.length; i++) {

      const dealer: any = await sp.web.lists.getByTitle("Dealer List").items.getById(plannedData[i].DealerNameId).get();
      console.log(dealer.Title);
      plannedData[i].DistrictId = dealer.Title;
      plannedData[i].PlannedDateTime = moment(plannedData[i].PlannedDateTime).format("DD-MMM-YYYY HH:mm A");
      // const location: any = await sp.web.lists.getByTitle("Location").items.getById(plannedData[i].LocationId).get();
      // console.log(location.Title);
      // plannedData[i].LocationId=location.Title;  





    }


    console.log(plannedData);

    this.setState({
      plannedDealing: plannedData
    });

  }


  public render(): React.ReactElement<IPlannedDealerViewProps> {
    const controlClass = mergeStyleSets({

      control: {

        // marginBottom    : '15px',
        maxWidth: '200px',

      },

    });
    return (
      <div >
        <div className={styles.tableFixHead}>
          {/* <table><tr>
                     <td>
                 <DatePicker id="DueDate" style={{ width: '100%' }} 
          formatDate={(date) => moment(date).format('DD/MM/YYYY')} 
             value={this.state.SelectDate}
          className={controlClass.control}
          placeholder="Select a date"
          onSelectDate={this.SelectDate}
          isRequired={true}

          /></td><td>
           <PrimaryButton text="View" onClick={this.searchData} className={ styles.buttonStyle } />
           </td></tr>
           </table> */}
          <ListView
            items={this.state.plannedDealing}
            showFilter={true}

            filterPlaceHolder="Search..."
            compact={true}
            selectionMode={SelectionMode.single}
            selection={this._getSelection}
            groupByFields={groupByFields}
            viewFields={viewFields}
          />
          <DialogFooter>
          <PrimaryButton id="Cancel"  style={{ width: "150px"}} text="Go to Home" onClick={this.cancel} />
          </DialogFooter>
         
          {/* <table className={styles.table2} id="plannedDealer" >
<tr>

<th>Planned Date</th>
<th>Dealer Name</th>
<th>Planned Visit Time</th>
<th>Location</th>
<th>Remarks</th>
</tr>
<tbody>
{

  
this.state.plannedDealing.map((item) => {

return <tr style={{height:"40px"}}>
<td>{item.PlannedDateFormatted}</td>
<td>{item.DealerNameId}</td>
<td>{item.Title}</td>
<td>{item.Location}</td>
<td>{item.Remarks}</td>
</tr>

})

 

}
</tbody>

</table> */}
        </div>






      </div>
    );
  }
}
