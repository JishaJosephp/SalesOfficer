import * as React from 'react';
import styles from './PlotLocations.module.scss';
import { IPlotLocationsProps } from './IPlotLocationsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ReactBingmaps } from 'react-bingmaps';
import { sp,  Web } from '@pnp/sp/presets/all';
import 'bingmaps';
import {
  Dropdown,
  DatePicker,
  DialogFooter,
  PrimaryButton

} from "office-ui-fabric-react";

import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';

import * as moment from "moment";
import { useMediaQuery } from 'react-responsive';


export interface IPlotLocationsState {

  user               : any;
  userid             : any;
  marker             : any;
  center             : any[];
  officerKey         : any;
  userGlobal         : any;
  selectedDate       : any;
  officerOption      : any;
  officerOptions     : any;
  officerSelected?   : { key: string | number | undefined };
  locationCoordinates: any[];
  selectedTeam:any;
  
 
}



export default class PlotLocations extends React.Component<IPlotLocationsProps,IPlotLocationsState, any> {
 
  constructor(props: IPlotLocationsProps) {

    super(props);

    this.state = {

      user                : '',
      userid              : '',
      marker              : [],
      center              : ["9.931233", "76.267303"],
      officerKey          : "",
      userGlobal          : '',
      selectedDate        : '',
      officerOption       : [],
      officerOptions      : [],
      officerSelected     : undefined,
      locationCoordinates :[],
      selectedTeam: ""
      
     
    };

    this.goHome            = this.goHome.bind(this);
    this.getDetails        = this.getDetails.bind(this);
    this.searchData        = this.searchData.bind(this);
    this._selectedDate     = this._selectedDate.bind(this);
    // this.officerChanged    = this.officerChanged.bind(this);
    

  }

  public async componentDidMount() {

    sp.web.currentUser.get().then((r) => {

      this.setState({ user: r["Title"], userid: r["Id"] });
      console.log(r["Title"]);
      console.log(r["Id"]);

  });


  const users = await sp.web.siteGroups.getByName("HOAdmin").users();
  console.log(users);

  for (let i = 0; i < users.length; i++) {
    if(users[i].Title==this.state.user)
    {
      //console.log("In group");

      this.setState({
        userGlobal:1
      });

      break;  
    }
    else{
      // console.log(users[i].Title);
      
      // console.log("Not in group");
      this.setState({
        userGlobal:0
      });

    }
    
  }

  this.getDetails();
 
  }

  public async getDetails(){

    if(this.state.userGlobal == 1)
    {

   //Get Sales user details from list
    const userName = await sp.web.lists.getByTitle("Users").items.filter("UserType eq 'Sales'").orderBy("Title").get();
    console.log(userName); 

    let optionUser = [];
    let opt=[];
    for (let i = 0; i < userName.length; i++) {
      opt.push({ "title": userName[i].Title,"Id":  userName[i].Id});
  
        let userdata = {
            key: userName[i].Id,
            text: userName[i].Title
        };
  
        optionUser.push(userdata);
    }

    this.setState({
      officerOptions: optionUser,
      officerOption: opt
    });
    console.log(optionUser); 
    console.log(opt);

  }
    

  }


  //onChange function of sales officer
  // public officerChanged(option: { key: any; }) {

  //   console.log(option.key);
  //   this.setState({

  //   officerKey  : option.key,
  //   officerSelected: { key: option.key }

  //   });

  // }

  //onButtonClick Function
  public async searchData(){

    var count;
    let cooSplit;
    let dealerName;
    let dealerLocation;
    let infoDescription;
    let latitudeLongitude;

   
    let locationDetails = [];

    let formattedDate     = moment(this.state.selectedDate).format("YYYY-MM-DDT12:00:00Z");

    //console.log(formattedDate);
   

    if(this.state.userGlobal == 1)
    {


  //Get selected sales officers route data correspoinding to Today's date
  
      const search = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='PlannedDateTime' /><Value Type='DateTime'>" 
        + formattedDate + "</Value></Eq> <Eq><FieldRef Name='AssignTo' /><Value Type='Lookup'>"
        + this.state.selectedTeam + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
    });
    console.log(search);

    
  //   const search = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
  //     ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='PlannedDateTime' /><Value Type='DateTime'>" 
  //     + formattedDate + "</Value></Eq> <Eq><FieldRef Name='AssignTo' LookupId='TRUE' /><Value Type='Lookup'>"
  //     + this.state.officerKey + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
  // });


  //Get selected Sales officers location details and dealer details from list
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


    if(search[i].Status == null  || search[i].Status == undefined)
    {

      infoDescription="Time: "+search[i].PlanTime;

    //Change details to acceptable array format
    locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{color:"red",text: count , description: dealerLocation }}
  
    }
  
    else{
  
    
      infoDescription="Time: "+search[i].PlanTime+"<br/>"+search[i].Status;

     //Change details to acceptable array format
      locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{ color:"red",text: count , description: dealerLocation }}
  
    }
    
   
    //locationDetails[i]={ "location":cooSplit, "option":{ color: 'red',text: count , description: item.Title }}

  }


  if(locationDetails.length != 0)
  {

    this.setState({
      locationCoordinates:locationDetails,
      center: locationDetails[0].location
      
    });

  }
  else{

    this.setState({
      locationCoordinates:[],
      center: []
      
    });
    
  }

    }

    else if(this.state.userGlobal == 0)
    {

       //Get logged in sales officers route data correspoinding to Today's date
    const search = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='PlannedDateTime' /><Value Type='DateTime'>" 
      + formattedDate + "</Value></Eq> <Eq><FieldRef Name='Assign' /><Value Type='Person or Group'>"
      + this.state.user + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
  });

  console.log(search);

  //Get location details and dealer details from list
  for(let i = 0; i < search.length; i++)
  {
    
     count    =i+1+"";
   
    const dealer = await sp.web.lists.getByTitle("DealersData").items.getById(search[i].DealerNameId).get();
    //console.log(dealer);

    dealerName=dealer.dealer_name;
    dealerLocation=dealer.street;
    
    //co_ordinates=dealer.latitude,dealer.longitude;
     latitudeLongitude=dealer.latitude+","+dealer.longitude;
    cooSplit = latitudeLongitude.split(',');
    
    
  //locationDetails[i]={ "location":cooSplit, "option":{ color: 'red',text: count , description: item.Title }}

  if(search[i].Status == null || search[i].Status == undefined)
  {

    infoDescription="Time: "+search[i].PlanTime;

    //Change details to acceptable array format

  locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{ color:"red",text: count , description: dealerLocation }}


  //console.log(locationDetails);

  }

  else{

    infoDescription="Time: "+search[i].PlanTime+"<br/>"+search[i].Status;
    

    //Change details to acceptable array format

    locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{ color:"red",text: count , description: dealerLocation }}
    

  }


  }

  
  if(locationDetails.length != 0)
  {


    //console.log(locationDetails);
    

    this.setState({
      locationCoordinates:locationDetails,
      center: locationDetails[0].location
      
    });

  }
  else{

    this.setState({
      locationCoordinates:[],
      center: []
      
    });
    
  }

    }
   
  

  }

  private _selectedDate = (date?: Date): void => {
    this.setState({selectedDate: date});
  };

  public async goHome() {
    
    
    window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Sales-Officer.aspx";

    
  }

  public render(): React.ReactElement<IPlotLocationsProps> {

    const Desktop = ({ children }) => {
      const isDesktop = useMediaQuery({ minWidth: 992 })
      return isDesktop ? children : null
    }
    const Tablet = ({ children }) => {
      const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
      return isTablet ? children : null
    }
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

 const filterOptions = createFilterOptions({
  matchFrom: 'start'

});


      
    return (
      <div>


<div>
  
    <Mobile>
 


        <table>
          <tr>

    
<Autocomplete
    
      id="combo-box-demo"
      options={this.state.officerOption.map((option) => option.title)}
      filterOptions={filterOptions}
      value={this.state.selectedTeam}
      onChange={(event: any, newValue: string | null) => {
        this.setState({
          selectedTeam:newValue
        });
      }}

      //getOptionLabel={(option) => option.title}
      style={{ width: "240px", height:"50px", display:( this.state.userGlobal== 1 ? '':'none') }}
      renderInput={(params) => <TextField {...params} label="Select Sales/Service Team" margin="none" />}
    />
            
        
          </tr>
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
            backgroundColor: '#498205',
            selectors: {
              ':hover .ms-Button-icon': {
                color: 'white'
              },
              ':active .ms-Button-icon': {
                color: 'white'
              }
            }
          },
          rootHovered: {backgroundColor: '#498205'},
          rootPressed: {backgroundColor: '#498205'}
        }}
          
          />
          </td>
          <td>

          <IconButton iconProps={HomeIcon} title="Home" ariaLabel="Home" onClick={this.goHome}   styles={{
          icon: {color: 'white'},
          root: {
            marginLeft:"3px",
            backgroundColor: '#498205',
            selectors: {
              ':hover .ms-Button-icon': {
                color: 'white'
              },
              ':active .ms-Button-icon': {
                color: 'white'
              }
            }
          },
          rootHovered: {backgroundColor: '#498205'},
          rootPressed: {backgroundColor: '#498205'}
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

     

    
<Autocomplete
      id="combo-box-demo"
      options={this.state.officerOption.map((option) => option.title)}
      filterOptions={filterOptions}
      value={this.state.selectedTeam}
      onChange={(event: any, newValue: string | null) => {
        this.setState({
          selectedTeam:newValue
        });
      }}
      //getOptionLabel={(option) => option.title}
      style={{ width: "240px", height:"50px", display:( this.state.userGlobal== 1 ? '':'none') }}
      renderInput={(params) => <TextField {...params} label="Select Sales/Service Team" margin="none" />}
    />

      </td>

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
            backgroundColor: '#498205',
            selectors: {
              ':hover .ms-Button-icon': {
                color: 'white'
              },
              ':active .ms-Button-icon': {
                color: 'white'
              }
            }
          },
          rootHovered: {backgroundColor: '#498205'},
          rootPressed: {backgroundColor: '#498205'}
        }}
          
          />
          </td>
          <td>

      <IconButton iconProps={HomeIcon} title="Home" ariaLabel="Home" onClick={this.goHome}   styles={{
          icon: {color: 'white'},
          root: {
            marginLeft:"5px",
            backgroundColor: '#498205',
            selectors: {
              ':hover .ms-Button-icon': {
                color: 'white'
              },
              ':active .ms-Button-icon': {
                color: 'white'
              }
            }
          },
          rootHovered: {backgroundColor: '#498205'},
          rootPressed: {backgroundColor: '#498205'}
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
