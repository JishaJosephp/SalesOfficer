import * as React from 'react';
import styles from './RouteDashboard.module.scss';
import { IRouteDashboardProps } from './IRouteDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, Web } from '@pnp/sp/presets/all';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import * as moment from "moment";

export interface IRouteDashboardState {

  user        : any;
  userid      : any;
  userType    : any;
  userGlobal  : any;
  routeDetails: any[];

}

export default class RouteDashboard extends React.Component<IRouteDashboardProps, IRouteDashboardState, any> {

  constructor(props: IRouteDashboardProps) {

    super(props);

    this.state = {

      user         : '',
      userid       : '',
      userType     : 'Admin',
      userGlobal   : '',
      routeDetails : []

    };

    this.getDetails = this.getDetails.bind(this);

  }

  public async componentDidMount() {

    this.getDetails();

  }

  //Get routes created by the salesofficer prior to the current date and the no. of days passed from the property pane 
  public async getDetails() {

    let today = new Date();
    let currentDate = moment(today).format("YYYY-MM-DDT12:00:00Z");
    var new_date = moment(currentDate, "YYYY-MM-DDT12:00:00Z").subtract('days', this.props.NoOfDays);
    let toDate = new_date.format("YYYY-MM-DDT12:00:00Z");

    const routeData = await sp.web.lists.getByTitle("Notification").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='DashboardType' /><Value Type='Text'>"
        + this.state.userType + "</Value></Eq><And><Geq><FieldRef Name='Created' /><Value Type='DateTime'>"
        + toDate + "</Value></Geq> <Leq><FieldRef Name='Created' /><Value Type='DateTime'>"
        + currentDate + "</Value></Leq></And></And></Where><OrderBy><FieldRef Name='ID' Ascending='False'/></OrderBy></Query></View>",
    });

    //console.log(routeData);

    this.setState({
      routeDetails: routeData
    });

  }

  public render(): React.ReactElement<IRouteDashboardProps> {

    return (

      <div>

        <h2 className={styles.heading} style={{ display: (this.state.routeDetails.length != 0 ? '' : 'none') }} >Route Notification</h2>

        {this.state.routeDetails.map((item) => (

          <Alert severity="info" className={styles.notification}  >{item.Notification}</Alert>

        ))}

      </div>
    );
  }
}
