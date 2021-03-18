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

import * as moment from "moment";


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
      locationCoordinates :[]
      
     
    };

    this.goHome            = this.goHome.bind(this);
    this.getDetails        = this.getDetails.bind(this);
    this.searchData        = this.searchData.bind(this);
    this._selectedDate     = this._selectedDate.bind(this);
    this.officerChanged    = this.officerChanged.bind(this);
    

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

   //Get Sales user details from list
    const userName = await sp.web.lists.getByTitle("Users").items.filter("UserType eq 'Sales'").get();
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


  //onChange function of sales officer
  public officerChanged(option: { key: any; }) {

    console.log(option.key);
    this.setState({

    officerKey  : option.key,
    officerSelected: { key: option.key }

    });

  }

  //onButtonClick Function
  public async searchData(){

    let cooSplit;
    var count;
    let dealerName;
    let infoDescription;

    // let today           = new Date();
    // let currentDate     = moment(today).format("YYYY-MM-DDT12:00:00Z");
    let locationDetails = [];

    let formattedDate     = moment(this.state.selectedDate).format("YYYY-MM-DDT12:00:00Z");

    //console.log(formattedDate);
   

    if(this.state.userGlobal == 1)
    {


      let salesTeam = ((document.getElementById("combo-box-demo") as HTMLInputElement).value);
      console.log(salesTeam);

  //Get selected sales officers route data correspoinding to Today's date
  
      const search = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='PlannedDateTime' /><Value Type='DateTime'>" 
        + formattedDate + "</Value></Eq> <Eq><FieldRef Name='AssignTo' /><Value Type='Lookup'>"
        + salesTeam + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
    });

    
  //   const search = await sp.web.lists.getByTitle("Route List").getItemsByCAMLQuery({
  //     ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='PlannedDateTime' /><Value Type='DateTime'>" 
  //     + formattedDate + "</Value></Eq> <Eq><FieldRef Name='AssignTo' LookupId='TRUE' /><Value Type='Lookup'>"
  //     + this.state.officerKey + "</Value></Eq> </And></Where><OrderBy><FieldRef Name='PlannedTime'/></OrderBy></Query></View>",
  // });

  console.log(search);

  //Get selected Sales officers location details and dealer details from list
  for(let i = 0; i < search.length; i++)
  {
    
    const item: any = await sp.web.lists.getByTitle("Location").items.getById(search[i].LocationsId).get();
    cooSplit = item.Coordinates.split(',');
    count    =i+1+"";

    const dealer: any = await sp.web.lists.getByTitle("Dealer List").items.getById(search[i].DealerNameId).get();
    dealerName=dealer.Title;

    if(search[i].Status == null  || search[i].Status == undefined)
    {

    //Change details to acceptable array format
    locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: search[i].PlanTime }, "pushPinOption":{color:"red",text: count , description: item.Title }}
  
    }
  
    else{
  
    
      infoDescription=search[i].PlanTime+"<br/>"+search[i].Status;

     //Change details to acceptable array format
      locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{ color:"red",text: count , description: item.Title }}
  
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
    
    const item: any = await sp.web.lists.getByTitle("Location").items.getById(search[i].LocationsId).get();
    cooSplit = item.Coordinates.split(',');
    count    =i+1+"";
   
    const dealer: any = await sp.web.lists.getByTitle("Dealer List").items.getById(search[i].DealerNameId).get();
    dealerName=dealer.Title;
    
    
    
  //locationDetails[i]={ "location":cooSplit, "option":{ color: 'red',text: count , description: item.Title }}

  if(search[i].Status == null || search[i].Status == undefined)
  {

    //Change details to acceptable array format

  locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: search[i].PlanTime }, "pushPinOption":{ color:"red",text: count , description: item.Title }}

  }

  else{

    infoDescription="Time: "+search[i].PlanTime+"<br/>"+search[i].Status;
    

    //Change details to acceptable array format

    locationDetails[i]={ "location":cooSplit,  "addHandler":"mouseover", "infoboxOption": { title: dealerName, description: infoDescription }, "pushPinOption":{ color:"red",text: count , description: item.Title }}


  }


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
   
  

  }

  private _selectedDate = (date?: Date): void => {
    this.setState({selectedDate: date});
  };

  public async goHome() {
    
    
    window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Sales-Officer.aspx";

    
  }

  public render(): React.ReactElement<IPlotLocationsProps> {

 const filterOptions = createFilterOptions({
  matchFrom: 'start'

});
 
      
    return (
      <div>

        <table>
          <tr>

          <Autocomplete
      id="combo-box-demo"
      options={this.state.officerOption.map((option) => option.title)}
      filterOptions={filterOptions}
      //getOptionLabel={(option) => option.title}
      style={{ width: "250px", height:"50px", display:( this.state.userGlobal== 1 ? '':'none') }}
      renderInput={(params) => <TextField {...params} label="Select Sales/Service Team" variant="outlined" />}
    />
            
          </tr>
          <br></br>
            
      
              <tr>

              <DatePicker id="selectdate" 
          formatDate={(date) => moment(date).format('DD/MM/YYYY')} 
          value={this.state.selectedDate}
          placeholder="Select a Date"
          onSelectDate={this._selectedDate}
          isRequired={true}
          style={{ width: '205px' }} 
          
          />

              </tr>
             
            
          </table>

          <br></br>

        
  

          <PrimaryButton text="Get Route"  onClick={this.searchData} className={styles.buttonStyle} />

          <br></br>

          <br></br>

          <PrimaryButton id="home" text="Go to Home" onClick={this.goHome}  className={styles.buttonStyle}/>


          <br></br>



          <br></br>

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
