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
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'

import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  DatePicker,
  mergeStyleSets,
  DayOfWeek,
  IDatePickerStrings,
  DefaultButton,
  Label,
  PrimaryButton,
  Fabric,
  Button, ButtonType
} from "office-ui-fabric-react";
export interface IPlannedDealerViewState {
  user: any;
  userid: any;
  plannedDealing: any[];
  SelectDate: any;
  siteurl: any;
  isOpen: boolean;
  DialogeAlertContent: any;
  PageRedirection: any;
  urlparameter: any;
}

let userGlobal = 0;
const groupByFields: IGrouping[] = [
  {
    name: "PlannedDateFormatted",
    order: GroupOrder.ascending,


  }
];
//View fields for List control
export const viewFields: IViewField[] = [{
  name: "DistrictId",
  displayName: "Dealer Name",
  //linkPropertyName: "c",    
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 150
},
{
  name: "PlanTime",
  displayName: "Time",
  isResizable: true,
  sorting: true,
  minWidth: 60,
  maxWidth: 60
},
{
  name: "Status",
  displayName: "Status",
  isResizable: true,
  sorting: true,
  minWidth: 60,
  maxWidth: 60
},

{
  name: "Location",
  displayName: "Location",
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 150
}

];
export default class PlannedDealerView extends React.Component<IPlannedDealerViewProps, IPlannedDealerViewState, any> {

  constructor(props: IPlannedDealerViewProps) {
    super(props);
    this.state = {
      user: '',
      userid: '',
      plannedDealing: [],
      SelectDate: '',
      siteurl: '',
      isOpen: false,
      DialogeAlertContent: '',
      PageRedirection: '',
      urlparameter: ''
    };

    this.getDetails = this.getDetails.bind(this);
    this.SelectDate = this.SelectDate.bind(this);
    this._getSelection = this._getSelection.bind(this);
  }
  public async componentDidMount() {
    //Get site url
    const rootwebData = await sp.site.rootWeb();
    console.log(rootwebData);
    var webValue = rootwebData.ResourcePath.DecodedUrl;
    //alert(webValue);
    this.setState({
      siteurl: webValue
    });
    //get all dealers data
    await this.getDetails();
  }
  //Selection change of dealer item
  private async _getSelection(items: any[]) {
    console.log(items);
    let isCheckin = false;
    let isCheckins = false;
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let planneddate = moment(items[0].PlannedDate).format("YYYY-MM-DD");
    let today = new Date();
    let currentDates = moment(today).format("YYYY-MM-DDT12:00:00Z");
    console.log(this.state.user);

    //already check into this dealer
    const checkinData = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><And><Neq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
        + this.state.user + "</Value></Neq><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
        + items[0].DealerNameId + "</Value></Eq></And><Eq><FieldRef Name='LogType' /> <Value Type='Choice'>Check In</Value></Eq></And></Where></Query></View>",
    });
    console.log(checkinData);

    if (checkinData.length > 0) {
      for (let i = 0; i < checkinData.length; i++) {
        let item = checkinData[i];
        let checkin = item.Checkin;
        let checkinDate = moment(checkin).format("YYYY-MM-DD");
        if (checkinDate == currentDate) {
          isCheckin = true;
        }
      }

    }
    if (checkinData.length == 0 || !isCheckin) {
      //already this user checkin to any other dealer
      const plannedData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
          + this.state.user + "</Value></Eq><Eq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
          + currentDates + "</Value></Eq></And><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
          + items[0].DealerNameId + "</Value></Eq></And></Where></Query></View>",
      });
      console.log(plannedData);
      if (planneddate == currentDate) {
        if (plannedData.length >= 1) {
          if (items[0].Checkin == "1") {
            for (let i = 0; i < plannedData.length; i++) {
              if (items[0].Id == plannedData[i].ID) {
                const checkinDatas = await sp.web.lists.getByTitle("CheckIn CheckOut").getItemsByCAMLQuery({
                  ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
                    + this.state.user + "</Value></Eq><Eq><FieldRef Name='LogType' /> <Value Type='Choice'>Check In</Value></Eq></And></Where></Query></View>",
                });
                console.log(checkinDatas);
                if (checkinDatas.length > 0) {
                  for (let i = 0; i < checkinDatas.length; i++) {
                    let item = checkinDatas[i];
                    let checkins = item.Checkin;
                    let checkinDates = moment(checkins).format("YYYY-MM-DD");
                    if (checkinDates == currentDate) {
                      isCheckins = true;

                    }
                  }
                }
                if (checkinDatas.length == 0 || !isCheckins) {
                  //Checkin alert and redirect to checkin page
                  this.setState({ isOpen: true, DialogeAlertContent: "Are you sure to move checkin page?", PageRedirection: "1", urlparameter: "dealerId=" + items[0].DealerNameId + "&RouteId=" + items[0].Id + "&checkin=" + items[0].Checkin + "&dealer_website_id=" + items[0].Minutes });

                }
                else {
                  this.setState({ isOpen: true, DialogeAlertContent: "You are already checked into one dealer at this time. Try again after check out" });
                }
              }
            }

          }
          //Already checkin and redirect to checkin page
          else if (items[0].Checkin == "0") {
            if (plannedData[0].DealerNameId == items[0].DealerNameId) {
              window.location.href = this.state.siteurl + "/SitePages/Checkin-Checkout.aspx?dealerId=" + items[0].DealerNameId + "&RouteId=" + items[0].Id + "&checkin=" + items[0].Checkin + "&dealer_website_id=" + items[0].Minutes;
            }
          }
          else if (items[0].Checkin == "2") {
            this.setState({ isOpen: true, DialogeAlertContent: "You are already checked out from this dealer" });

          }
        }
        else {
          if (plannedData[0].DealerNameId == items[0].DealerNameId) {
            window.location.href = this.state.siteurl + "/SitePages/Checkin-Checkout.aspx?dealerId=" + items[0].DealerNameId + "&RouteId=" + items[0].Id + "&checkin=" + items[0].Checkin + "&dealer_website_id=" + items[0].Minutes;
          }
          else {
            this.setState({ isOpen: true, DialogeAlertContent: "You are already checked into one dealer at this time. Try again after check out" });
          }
        }
      }
    }
    else {
      this.setState({ isOpen: true, DialogeAlertContent: "One officer already checked into this dealer at this time. Try again later" });
    }

    console.log('Selected items:', items);
  }

  private SelectDate = (date?: Date): void => {
    this.setState({ SelectDate: date });
  };
  open = () => this.setState({ isOpen: true })
  //Close dialogue
  close = () => {
    if (this.state.PageRedirection == "1") {
      window.location.href = this.state.siteurl + "/SitePages/Checkin-Checkout.aspx?" + this.state.urlparameter;
    }
    this.setState({ isOpen: false, DialogeAlertContent: "", PageRedirection: "0" })
  }
  //Get route details
  public async getDetails() {
    await sp.web.currentUser.get().then((r) => {
      this.setState({ user: r["Title"], userid: r["Id"] });
      console.log(r["Title"]);
      console.log(r["Id"]);

    });
    console.log(this.state.user);
    let today = new Date();
    let currentDate = moment(today).format("YYYY-MM-DDT12:00:00Z");
    console.log(currentDate);
    //Get today's and future route
    const plannedData = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Geq><FieldRef Name='PlannedDate' /><Value Type='DateTime'>"
        + currentDate + "</Value></Geq> <Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
        + this.state.user + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
    });
    console.log(plannedData);
    //Get dealer data
    for (let i = 0; i < plannedData.length; i++) {
      const dealer: any = await sp.web.lists.getByTitle("DealersData").items.getById(plannedData[i].DealerNameId).get();
      console.log(dealer.Title);
      plannedData[i].DistrictId = dealer.dealer_name;
      plannedData[i].Minutes = dealer.website_id;
    }
    console.log(plannedData);
    this.setState({
      plannedDealing: plannedData
    });
  }
  public render(): React.ReactElement<IPlannedDealerViewProps> {
    const controlClass = mergeStyleSets({
      control: {
        maxWidth: '200px',
      },
    });
    return (

      <div >
        <div className={styles.tableFixHead}>
          <h2>Dealer Visit</h2>

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
          <Dialog
            isOpen={this.state.isOpen}
            type={DialogType.close}
            onDismiss={this.close.bind(this)}

            subText={this.state.DialogeAlertContent}
            isBlocking={false}
            closeButtonAriaLabel='Close'
          >
            <DialogFooter>
              <Button buttonType={ButtonType.primary} onClick={this.close}>OK</Button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    );
  }
}
