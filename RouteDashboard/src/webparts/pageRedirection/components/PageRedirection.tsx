import * as React from 'react';
import styles from './PageRedirection.module.scss';
import { IPageRedirectionProps } from './IPageRedirectionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, Web } from '@pnp/sp/presets/all';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

export interface IPageRedirectionState {

  user         : any;
  userid       : any;
  siteurl      : string;
  userType     : any;
  userGlobal   : any;
  routeDetails : any[];

}

export default class PageRedirection extends React.Component<IPageRedirectionProps, IPageRedirectionState, any> {

  constructor(props: IPageRedirectionProps) {

    super(props);

    this.state = {

      user         : '',
      userid       : '',
      siteurl      : '',
      userType     : '',
      userGlobal   : '',
      routeDetails : []

    };

    this.getDetails = this.getDetails.bind(this);

  }
  public async componentDidMount() {

    const rootwebData = await sp.site.rootWeb();
    console.log(rootwebData);
    var webValue = rootwebData.ResourcePath.DecodedUrl;
    //alert(webValue);
    this.setState({
      siteurl: webValue
    });

    this.getDetails();

  }

  //Get current user details and check if the user is a member of HOAdmin group
  public async getDetails() {

    sp.web.currentUser.get().then((r) => {
      this.setState({ user: r["Title"], userid: r["Id"] });
      console.log(r["Title"]);
      console.log(r["Id"]);
    });
    try {

      const users = await sp.web.siteGroups.getByName("HOAdmin").users();
      // console.log(users);
      for (let i = 0; i < users.length; i++) {
        if (users[i].Title == this.state.user) {
          //Group member 
          this.setState({
            userGlobal: 1,
            userType: 'Admin'
          });

          break;
        }
        else {
          //Normal user
          this.setState({
            userGlobal: 0,
            userType: 'SalesOfficer'
          });

        }


      }
    }
    catch { }

//If in group redirect to Admin home page otherwise redirect to sales officer home page
    if (this.state.userGlobal == 1)

      window.location.href = this.state.siteurl + "/SitePages/Admin.aspx";

    else if (this.state.userGlobal == 0)

      window.location.href = this.state.siteurl + "/SitePages/Sales-Officer.aspx";

  }

  public render(): React.ReactElement<IPageRedirectionProps> {
    return (
      <div>

        <Spinner label="Loading..." labelPosition="right" size={SpinnerSize.large} style={{ marginRight: "30%", marginLeft: "30%", marginTop: "70%" }} />

      </div>
    );
  }
}
