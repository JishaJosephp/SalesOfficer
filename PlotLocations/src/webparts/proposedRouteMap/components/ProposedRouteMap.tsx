import * as React from 'react';
import styles from './ProposedRouteMap.module.scss';
import { IProposedRouteMapProps } from './IProposedRouteMapProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useMediaQuery } from 'react-responsive';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import { ReactBingmaps } from 'react-bingmaps';
import 'bingmaps';
import {
  DatePicker

} from "office-ui-fabric-react";
import { sp,  Web } from '@pnp/sp/presets/all';
import * as moment from "moment";

export interface IProposedRouteMapState {

  user                : any;
  userid              : any;
  siteurl             : string;
  center              : any[];
  selectedDate        : any;
  locationCoordinates : any[];
 
}

export default class ProposedRouteMap extends React.Component<IProposedRouteMapProps,IProposedRouteMapState, any> {

  constructor(props: IProposedRouteMapProps) {

    super(props);

    this.state = {


      user                : '',
      userid              : '',
      center              : ["9.931233", "76.267303"],
      siteurl             : '',
      selectedDate        : '',
      locationCoordinates : []
      
     
    };

  
    // this.officerChanged    = this.officerChanged.bind(this);
    this.goHome            = this.goHome.bind(this);
    this.searchData        = this.searchData.bind(this);
    

  }

  public async componentDidMount() {

    const rootwebData = await sp.site.rootWeb();
    console.log(rootwebData);
    var webValue = rootwebData.ResourcePath.DecodedUrl;
    //alert(webValue);

    
    sp.web.currentUser.get().then((r) => {

      this.setState({ 
        user: r["Title"],
         userid: r["Id"],
         siteurl: webValue 
      });
      // console.log(r["Title"]);
      // console.log(r["Id"]);

  });

  }

  private _selectedDate = (date?: Date): void => {
    this.setState({selectedDate: date});
  };

  public async searchData(){

    var count;
    let cooSplit;
    let dealerName;
    let dealerLocation;
    let infoDescription;
    let latitudeLongitude;

   
    let locationDetails = [];

    let formattedDate     = moment(this.state.selectedDate).format("YYYY-MM-DDT12:00:00Z");

    const search = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='PlannedDateTime' /><Value Type='DateTime'>" 
      + formattedDate + "</Value></Eq> <Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
      + this.state.user + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
  });

  console.log(search);

  for(let i = 0; i < search.length; i++)
  {
    
     count    =i+1+"";
   
    const dealer = await sp.web.lists.getByTitle("DealersData").items.getById(search[i].DealerNameId).get();
    console.log(dealer);

    dealerName=dealer.dealer_name;
    dealerLocation=dealer.street;
    
    //co_ordinates=dealer.latitude,dealer.longitude;
     latitudeLongitude=dealer.latitude+","+dealer.longitude;
    cooSplit = latitudeLongitude.split(',');
    console.log(cooSplit);
    
    
  //locationDetails[i]={ "location":cooSplit, "option":{ color: 'red',text: count , description: item.Title }}


    infoDescription="Time: "+search[i].PlanTime;

    //Change details to acceptable array format

  locationDetails[i]={ "location":cooSplit,  "addHandler":"click", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{ color:"green",text: count , description: dealerLocation }}

  //console.log(locationDetails);

}
console.log(locationDetails);



if(locationDetails.length != 0)
{

  this.setState({
    locationCoordinates:locationDetails,
    center: locationDetails[0].location
    
  });

}

  }

  public async goHome() {
    
    
    window.location.href = window.location.href = this.state.siteurl+"/SitePages/Sales-Officer.aspx";

    
  }

  public render(): React.ReactElement<IProposedRouteMapProps> {

    const Mobile = ({ children }) => {
      const isMobile = useMediaQuery({ maxWidth: 767 })
      return isMobile ? children : null
    }
    const Default = ({ children }) => {
      const isNotMobile = useMediaQuery({ minWidth: 768 })
      return isNotMobile ? children : null
    }


    const HomeIcon: IIconProps = { iconName: 'Home' };
    const RootIcon: IIconProps = { iconName: 'MapPin' };
    return (
      <div>


      <div>
        
          <Mobile>
       
      
      
              <table>
     
                <br></br>
      
                    <tr>
      
                      <td>
      
                    <DatePicker id="selectdate" 
                formatDate={(date) => moment(date).format('DD/MM/YYYY')} 
                value={this.state.selectedDate}
                placeholder="Select a Date"
                onSelectDate={this._selectedDate}
                isRequired={true}
                style={{ width: '205px' }} 
                
                />
                </td>
                <td>
      
                <IconButton iconProps={RootIcon} title="Route" ariaLabel="Route" onClick={this.searchData} styles={{
                icon: {color: 'white'},
                root: {
                  marginLeft:"5px",
                  backgroundColor: '#145cab',
                  selectors: {
                    ':hover .ms-Button-icon': {
                      color: 'white'
                    },
                    ':active .ms-Button-icon': {
                      color: 'white'
                    }
                  }
                },
                rootHovered: {backgroundColor: '#145cab'},
                rootPressed: {backgroundColor: '#145cab'}
              }}
                
                />
                </td>
                <td>
      
                <IconButton iconProps={HomeIcon} title="Home" ariaLabel="Home" onClick={this.goHome}   styles={{
                icon: {color: 'white'},
                root: {
                  marginLeft:"3px",
                  backgroundColor: '#145cab',
                  selectors: {
                    ':hover .ms-Button-icon': {
                      color: 'white'
                    },
                    ':active .ms-Button-icon': {
                      color: 'white'
                    }
                  }
                },
                rootHovered: {backgroundColor: '#145cab'},
                rootPressed: {backgroundColor: '#145cab'}
              }} />
      
             
      
      
                  </td>
      
                    </tr>
                   
                  
                </table>
      
              
      
      <br></br>
      
                <br></br>
          </Mobile>
          <Default>
      
      
        
      
        <table>
          <tr>
      
            <td>
            <DatePicker id="selectdate" 
                formatDate={(date) => moment(date).format('DD/MM/YYYY')} 
                value={this.state.selectedDate}
                placeholder="Select a Date"
                onSelectDate={this._selectedDate}
                isRequired={true}
                style={{ width: '205px' }} 
                
                />
            </td>
            <td>
            <IconButton iconProps={RootIcon} title="Route" ariaLabel="Route" onClick={this.searchData} styles={{
                icon: {color: 'white'},
                root: {
                  marginLeft:"5px",
                  backgroundColor: '#145cab',
                  selectors: {
                    ':hover .ms-Button-icon': {
                      color: 'white'
                    },
                    ':active .ms-Button-icon': {
                      color: 'white'
                    }
                  }
                },
                rootHovered: {backgroundColor: '#145cab'},
                rootPressed: {backgroundColor: '#145cab'}
              }}
                
                />
                </td>
                <td>
      
            <IconButton iconProps={HomeIcon} title="Home" ariaLabel="Home" onClick={this.goHome}   styles={{
                icon: {color: 'white'},
                root: {
                  marginLeft:"5px",
                  backgroundColor: '#145cab',
                  selectors: {
                    ':hover .ms-Button-icon': {
                      color: 'white'
                    },
                    ':active .ms-Button-icon': {
                      color: 'white'
                    }
                  }
                },
                rootHovered: {backgroundColor: '#145cab'},
                rootPressed: {backgroundColor: '#145cab'}
              }} />
              
               
            </td>
          </tr>
        </table>
          
      
      
              <table>
                <tr> 
                 
                </tr>
                 <tr>
      
                    </tr>
                   
                </table>
      
               
          
          </Default>
        </div>
                  <div className={styles.contains}>
                  <ReactBingmaps style={{height:"100%", width:"100%"}}
                  bingmapKey = "AtmDLABlu9vKraV5X43ryyNtuqBlhF1MNQcOypaS8kl9lugOHMvHPVEYUqYb-9C9"
                  center = {this.state.center}
                  mapTypeId = {"road"}
                  navigationBarMode = {"compact"}
                  supportedMapTypes = {["road","canvasDark"]}
                  zoom = {11}
                  infoboxesWithPushPins = {this.state.locationCoordinates}       
                  >
                  </ReactBingmaps>
      
                  </div>
      
          </div>
    );
  }
}
