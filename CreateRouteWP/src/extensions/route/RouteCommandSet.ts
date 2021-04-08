import { override } from '@microsoft/decorators';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Log } from '@microsoft/sp-core-library';
import { sp,  Web } from '@pnp/sp/presets/all';
import { assign } from '@uifabric/utilities';
import * as $ from 'jquery';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
  RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import CreateRoute from "../components/CreateRoute";
import EditRoute from "../components/EditRoute";
import { IRouteProps } from "../components/IRouteProps";
import * as _ from 'lodash';
import * as strings from 'RouteCommandSetStrings';
import * as moment from "moment";


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IRouteCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
  sourceRelativeUrl: string;
}


const LOG_SOURCE: string = 'RouteCommandSet';

export default class RouteCommandSet extends BaseListViewCommandSet<IRouteCommandSetProperties> {
  private panelPlaceHolder: HTMLDivElement = null;

  

  @override
  public onInit(): Promise<void> {
    this.properties.sourceRelativeUrl = "/sites/SalesOfficerApplication/Lists/RouteList";
    var Libraryurl = this.context.pageContext.list.serverRelativeUrl;
    sp.setup({
      spfxContext: this.context
    });
    this.panelPlaceHolder = document.body.appendChild(document.createElement("div"));
    Log.info(LOG_SOURCE, 'Initialized RouteCommandSet');
    if ((Libraryurl == this.properties.sourceRelativeUrl) ) {
      
      setInterval(() => {
        $("button[name='New']").hide();
        $("button[name='Copy link']").hide();
        $("button[name='Share']").hide();
        $("button[name='Edit in grid view']").hide();
        $("button[name='Export to Excel']").hide();
        $("button[name='Power Apps']").hide();
        $("button[name='Automate']").hide();
        // $("button[aria-label='More']").hide();
        $("button[name='Comment']").hide();
        $("button[name='Edit']").hide();
        $("button[name='Alert me']").hide();
        $("button[name='Manage my alerts']").hide();
        $("button[name='Select items']").hide();
      }, 1);

    }
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    this.properties.sourceRelativeUrl = "/sites/SalesOfficerApplication/Lists/RouteList";
    var Libraryurl = this.context.pageContext.list.serverRelativeUrl;
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    // if (compareOneCommand) {
    //   // This command should be hidden unless exactly one row is selected.
    //   compareOneCommand.visible = event.selectedRows.length === 1;
    // }
    const compareTwoCommand: Command = this.tryGetCommand('COMMAND_2');
    compareTwoCommand.visible = (Libraryurl == this.properties.sourceRelativeUrl) ;
    if (compareOneCommand) {
      compareOneCommand.visible = ((event.selectedRows.length === 1 && (Libraryurl == this.properties.sourceRelativeUrl)));

    }
    if ((Libraryurl == this.properties.sourceRelativeUrl) ) {
      setTimeout(() => {
        $("button[name='New']").hide();
        $("button[name='Copy link']").hide();
        $("button[name='Share']").hide();
        $("button[name='Edit in grid view']").hide();
        $("button[name='Export to Excel']").hide();
        $("button[name='Power Apps']").hide();
        $("button[name='Automate']").hide();
        // $("button[aria-label='More']").hide();
        $("button[name='Comment']").hide();
        $("button[name='Edit']").hide();
        $("button[name='Alert me']").hide();
        $("button[name='Manage my alerts']").hide();
        $("button[name='Select items']").hide();

      }, 1);


    }
  }
  public _showPanel() {
    this._renderPanelComponent({
      isOpen: true,
       //paneltype: "Small",
       
      //currentTitle,
      //itemId,
      listId: this.context.pageContext.list.id.toString(),
      onClose: this._dismissPanel
      //onClose: this._dismissPanel
    });
  }
  public _showEditPanel() {
    this._renderEditPanelComponent({
      isOpen: true,

      // paneltype: "",
      //currentTitle,
      //itemId,


      listId: this.context.pageContext.list.id.toString(),
      onClose: this._dismissEditPanel
      //onClose: this._dismissPanel
    });

  }
  private _dismissPanel = () => {

    this._renderPanelComponent({ isOpen: false });
  }
  public _renderPanelComponent(props: any) {
    const element: React.ReactElement<IRouteProps> = React.createElement(CreateRoute, assign({
      onClose: null,
      paneltype: "",
    
      //onClose: null,
      // currentTitle: null,
      // itemId: null,
      isOpen: false,
      context: this.context
      //  listId: null
    }, props));


    ReactDom.render(element, this.panelPlaceHolder);
  }
  public _renderEditPanelComponent(props: any) {
    const element: React.ReactElement<IRouteProps> = React.createElement(EditRoute, assign({
      onClose: null,
      paneltype: "",
      isOpen: false,
      context: this.context
    }, props));
    ReactDom.render(element, this.panelPlaceHolder);

  }
  public _dismissEditPanel = () => {
    this._renderEditPanelComponent({ isOpen: false });
  }


  public async _syncData() {

    let updatedDate;
    let stateData=[], districtData=[], dealerData=[];
    let statefilterData=[], districtFiltered=[], dealerFiltered=[];
    let stateUpdated, districtUpdated, dealerUpdated, dateListId;
    let today = new Date();
    let currentDate = moment(today).format("YYYY-MM-DD");
    console.log(currentDate);

    const updatedData = await sp.web.lists.getByTitle("SyncData").items.get();
    console.log(updatedData); 

   
    
    for (let i = 0; i < updatedData.length; i++) {
      
      var dateConv = moment(updatedData[i].Date, "YYYY-MM-DDT12:00:00Z").add('days',1);
      updatedDate = dateConv.format("YYYY-MM-DD");
      console.log(updatedDate);
      dateListId=updatedData[i].Id;
      
    }

    if(updatedDate === currentDate){
      console.log("updated");
      
  }
  else{
    
  
    let stateUrl='https://2uf4bdrqq9.execute-api.ap-south-1.amazonaws.com/dev/getstate';
    
    await fetch(stateUrl)  
    .then((response) => response.json())
    .then((textResponse) => {
  stateData=textResponse;
  
    })
    .catch((error) => {
    console.log(error);
    });

    statefilterData =stateData.filter((item: any) =>
    item.date_modified >= updatedDate 
);
console.log(statefilterData);

const stateList = await sp.web.lists.getByTitle("StateData").items.get();
//console.log(stateList); 

if(statefilterData.length != 0)
{

for (let i = 0; i < statefilterData.length; i++) {

  stateUpdated=0;

  for (let j = 0; j < stateList.length; j++) {

    if(statefilterData[i].id == stateList[j].website_id && statefilterData[i].deleted_status == 1){

      sp.web.lists.getByTitle("StateData").items.getById(stateList[j].Id).update({
 
        Status: "Deleted"
      });
     

        stateUpdated=1;
      
    }
    if(statefilterData[i].id == stateList[j].website_id && statefilterData[i].deleted_status == 0){
     
     await sp.web.lists.getByTitle("StateData").items.getById(parseInt(stateList[j].Id)).update({
        Title: statefilterData[i].id+"",
        website_id: statefilterData[i].id,
        state: statefilterData[i].state
      });

      stateUpdated=1;
    
  }
    
    
  }

  if(stateUpdated == 0)
  {

    await sp.web.lists.getByTitle("StateData").items.add({
      Title: statefilterData[i].id+"",
      website_id: statefilterData[i].id,
      state: statefilterData[i].state
    });

  }
  
}
}


let districtUrl='https://2uf4bdrqq9.execute-api.ap-south-1.amazonaws.com/dev/getalldistrict';
 
await fetch(districtUrl)  
.then((response) => response.json())
.then((textResponse) => {
districtData=textResponse;

})
.catch((error) => {
console.log(error);
});


districtFiltered =districtData.filter((item: any) =>
item.date_modified >= updatedDate 
);
//console.log(districtFiltered);


const districtList = await sp.web.lists.getByTitle("DistrictData").items.getAll(5000);
console.log(districtList); 

if(districtFiltered.length != 0)
{

for (let i = 0; i < districtFiltered.length; i++) {

  districtUpdated=0;

  for (let j = 0; j < districtList.length; j++) {

    if(districtFiltered[i].id == districtList[j].website_id && districtFiltered[i].deleted_status == 1){

      sp.web.lists.getByTitle("DistrictData").items.getById(districtList[j].Id).update({
 
        Status: "Deleted"
      });
     

      districtUpdated=1;
      
    }
    if(districtFiltered[i].id == districtList[j].website_id && districtFiltered[i].deleted_status == 0){
     
     await sp.web.lists.getByTitle("DistrictData").items.getById(districtList[j].Id).update({
        Title: districtFiltered[i].id+"",
        website_id: districtFiltered[i].id,
        district: districtFiltered[i].district,
        state_id: districtFiltered[i].state_id
      });

      districtUpdated=1;
    
  }
    
    
  }

  if(districtUpdated == 0)
  {

    await sp.web.lists.getByTitle("DistrictData").items.add({
      Title: districtFiltered[i].id+"",
        website_id: districtFiltered[i].id,
        district: districtFiltered[i].district,
        state_id: districtFiltered[i].state_id
    });

  }
  
}
}

let dealerUrl='https://2uf4bdrqq9.execute-api.ap-south-1.amazonaws.com/dev/getalldealers';
 
await fetch(dealerUrl)  
.then((response) => response.json())
.then((textResponse) => {
dealerData=textResponse;

})
.catch((error) => {
console.log(error);
});

dealerFiltered =dealerData.filter((item: any) =>
item.date_modified >= updatedDate 
);
console.log(dealerFiltered);

const dealerList = await sp.web.lists.getByTitle("DealersData").items.getAll(5000);

if(dealerFiltered.length != 0)
{

for (let i = 0; i < dealerFiltered.length; i++) {

  dealerUpdated=0;

  for (let j = 0; j < dealerList.length; j++) {

    if(dealerFiltered[i].id == dealerList[j].website_id && dealerFiltered[i].deleted_status == 1){

      sp.web.lists.getByTitle("DealersData").items.getById(districtList[j].Id).update({
 
        Status: "Deleted"

      });
     

      dealerUpdated=1;
      
    }
    if(dealerFiltered[i].id == dealerList[j].website_id && dealerFiltered[i].deleted_status == 0){
      
     
     await sp.web.lists.getByTitle("DealersData").items.getById(dealerList[j].Id).update({
        Title: dealerFiltered[i].id+"",
        website_id: dealerFiltered[i].id,
        district: dealerFiltered[i].district,
        state: dealerFiltered[i].state,
        street: dealerFiltered[i].street,
        landmark: dealerFiltered[i].landmark,
        pin: dealerFiltered[i].pin+"",
        dealer_name: dealerFiltered[i].dealer_name,
        phone: dealerFiltered[i].phone,
        pdt_sodamaker: dealerFiltered[i].pdt_sodamaker,
        pdt_refill_cylinder: dealerFiltered[i].pdt_refill_cylinder,
        pdt_wet_grinder: dealerFiltered[i].pdt_wet_grinder,
        pdt_copper_bottle: dealerFiltered[i].pdt_copper_bottle,
        pdt_thermosteel_bottle: dealerFiltered[i].pdt_thermosteel_bottle,
        pdt_iron_box: dealerFiltered[i].pdt_iron_box,
        latitude: dealerFiltered[i].latitude,
        longitude:  dealerFiltered[i].longitude,
        geo_status:  dealerFiltered[i].geo_status,
        cookware_skillet:  dealerFiltered[i].cookware_skillet,
        cookware_tawa:  dealerFiltered[i].cookware_tawa,
        cookware_kadai:  dealerFiltered[i].cookware_kadai,
        glass_bottle:  dealerFiltered[i].glass_bottle,
        knives:  parseInt(dealerFiltered[i].knives)

     });

      dealerUpdated=1;
    
  }
    
    
  }

  if(dealerUpdated == 0)
  {

     await sp.web.lists.getByTitle("DealersData").items.add({
      Title: dealerFiltered[i].id+"",
      website_id: dealerFiltered[i].id,
      district: dealerFiltered[i].district,
      state: dealerFiltered[i].state,
      street: dealerFiltered[i].street,
      landmark: dealerFiltered[i].landmark,
      pin: dealerFiltered[i].pin+"",
      dealer_name: dealerFiltered[i].dealer_name,
      phone: dealerFiltered[i].phone,
      pdt_sodamaker: dealerFiltered[i].pdt_sodamaker,
      pdt_refill_cylinder: dealerFiltered[i].pdt_refill_cylinder,
      pdt_wet_grinder: dealerFiltered[i].pdt_wet_grinder,
      pdt_copper_bottle: dealerFiltered[i].pdt_copper_bottle,
      pdt_thermosteel_bottle: dealerFiltered[i].pdt_thermosteel_bottle,
      pdt_iron_box: dealerFiltered[i].pdt_iron_box,
      latitude: dealerFiltered[i].latitude,
      longitude:  dealerFiltered[i].longitude,
      geo_status:  dealerFiltered[i].geo_status,
      cookware_skillet:  dealerFiltered[i].cookware_skillet,
      cookware_tawa:  dealerFiltered[i].cookware_tawa,
      cookware_kadai:  dealerFiltered[i].cookware_kadai,
      glass_bottle:  dealerFiltered[i].glass_bottle,
      knives:  parseInt(dealerFiltered[i].knives)
     });

  }
  
}
}

await sp.web.lists.getByTitle("SyncData").items.getById(dateListId).update({
  Date:currentDate
});

  }


  }


  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    let PlannedDatefromlist;
    let Statefromlist;
    let Districtfromlist;
    let Dealernamefromlist;
    let contactnumberfromlist;
    let locationfromlist;
    // let locationsfromlist;
    let assigntofromlist;
    let assignfromlist;
    let remarksfromlist;
    let PlannedVisitTimefromlist;
    let Hourfromlist;
    let Minutefromlist;
    let authorfromlist;
    let authornamefromlist;
    let Dealerfromlist;
    let Pincodefromlist;
    let districtitem;
    let dontknowpin;
    let pin;
    let statearray = [];
    let state = [];
    let districtarray = [];
    let district = [];
    let dealerarray = [];
    let dealer =[];
    let assigntoarray = [];
    let assignarr =[];
    switch (event.itemId) {
      case 'COMMAND_1':
        if (event.selectedRows.length > 0) {
          event.selectedRows.forEach(async (row: RowAccessor, index: number) => {
            console.log(event);

            if ((row.getValueByName('PlannedDateFormatted')) == "") {
              PlannedDatefromlist = null;
            }
            else {
              PlannedDatefromlist = new Date(row.getValueByName('PlannedDateFormatted'));
            }
            // if ((row.getValueByName('Hours')) == "") {
            //   Hourfromlist = "";
            // }
            // else {
            //   Hourfromlist = row.getValueByName('Hours');
            // }
            // if ((row.getValueByName('Minutes')) == "") {
            //  Minutefromlist = "";
            // }
            // else {
            //   Minutefromlist = row.getValueByName('Minutes');
            // }
            try {
              Statefromlist = row.getValueByName('State')[0].lookupId;
            }
            catch {
              Statefromlist = null;
            }
            try {
              Districtfromlist = row.getValueByName('District')[0].lookupId;
            }
            catch {
              Districtfromlist = null;
            }
            try {
              Dealernamefromlist = row.getValueByName('DealerName')[0].lookupId;
            }
            catch {
              Dealernamefromlist = null;
            }
            try {
              Dealerfromlist = row.getValueByName('DealerName')[0].lookupValue;
            }
            catch {
              Dealerfromlist = null;
            }
            // if ((row.getValueByName('ContactNumber')) == null) {
            //   contactnumberfromlist = null;
            // }
            // else {
            //   contactnumberfromlist = row.getValueByName('ContactNumber');
            // }
            // if ((row.getValueByName('Pincode')) == null) {
            //   Pincodefromlist = null;
            // }
            // else {
            //   Pincodefromlist = row.getValueByName('Pincode');
            // }
            // if ((row.getValueByName('Location')) == null) {
            //   locationfromlist = null;
            // }
            // else {
            //   locationfromlist = row.getValueByName('Location');
            // }
            // try {
            //   locationsfromlist = row.getValueByName('Locations')[0].lookupId;
            // }
            // catch {
            //   locationsfromlist = null;
            // }
            try {
              assigntofromlist = row.getValueByName('AssignTo')[0].lookupId;
            }
            catch {
              assigntofromlist = null;
            }
            try {
              assignfromlist = row.getValueByName('Assign')[0].lookupId;
            }
            catch {
              assignfromlist = null;
            }
            try {
              authorfromlist = row.getValueByName('Author')[0].email;
            }
            catch {
              authorfromlist = null;
            }
            try {
              authornamefromlist = row.getValueByName('Author')[0].title;
            }
            catch {
              authornamefromlist = null;
            }
            if ((row.getValueByName('Title')) == '') {
              PlannedVisitTimefromlist = '';
            }
            else {
              PlannedVisitTimefromlist = row.getValueByName('Title');
            }
            // if ((row.getValueByName('Remarks')) == "") {
            //   remarksfromlist = "";
            // }
            // else {
            //   remarksfromlist = row.getValueByName('Remarks').replace(/(<([^>]+)>)/gi, "");
            // }
            const routeitem =await sp.web.lists.getByTitle("Route List").items.getById(row.getValueByName('ID')).get();
            console.log(routeitem);
            const item = await sp.web.lists.getByTitle("Route List").items.getById(row.getValueByName('ID')).select('Author/Id','Author/EMail','Author/FirstName','Author/LastName').expand('Author').get();
            console.log(item);
            authorfromlist = item.Author.EMail;
            authornamefromlist =item.Author.FirstName+" "+item.Author.LastName;
     Hourfromlist=routeitem.Hours;
     Minutefromlist=routeitem.Minutes;
     remarksfromlist=routeitem.Remarks;
     locationfromlist=routeitem.Location;
     Pincodefromlist=routeitem.Pincode;
     contactnumberfromlist=routeitem.ContactNumber;
     if(Pincodefromlist == ""||Pincodefromlist == undefined||Pincodefromlist == null){
      dontknowpin= false;
          pin= true;
          const stateitems: any[] = await sp.web.lists.getByTitle("StateData").items.select("ID,website_id,state").getAll();
       
        for (let i = 0; i < stateitems.length; i++) {

            let statedata = {
                key: stateitems[i].ID,
                text: stateitems[i].state
            };
            state.push(statedata);
            statearray= _.orderBy(state, 'text', ['asc']);
            
        }
        const districtitems: any[] = await sp.web.lists.getByTitle("DistrictData").items.select("ID,district,website_id").filter(" state_id eq " + Statefromlist).get();
       
        for (let i = 0; i < districtitems.length; i++) {
            
            let districtdata = {
                key: districtitems[i].ID,
                text: districtitems[i].district
            };
            district.push(districtdata);
            districtarray= _.orderBy(district, 'text', ['asc']);
                }
                const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.select("ID,dealer_name,website_id").filter(" district eq " + Districtfromlist).get();
          console.log("dealer" + dealeritems);
          for (let i = 0; i < dealeritems.length; i++) {

            let data = {
              key: dealeritems[i].ID,
              text: dealeritems[i].dealer_name
            };
            dealer.push(data);
            dealerarray= _.orderBy(dealer, 'text', ['asc']);
          }
          const salesuseritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID").filter(" DistrictId eq " + Districtfromlist).get();
          console.log("salesusers" + salesuseritems);
          for (let i = 0; i < salesuseritems.length; i++) {

            let data = {
              key: salesuseritems[i].Id,
              text: salesuseritems[i].Title
            };
assignarr.push(data);
            assigntoarray= _.orderBy(assignarr, 'text', ['asc']);
          }
  }
  else{
    dontknowpin= true;
          pin= false;
       let   pincode = Pincodefromlist.substring(0, 4);

          console.log(pincode.trim());
          const dealeritems: any[] = await sp.web.lists.getByTitle("DealersData").items.filter("substringof('" + pincode + "',pin)").getAll(5000);
          console.log(dealeritems);
   for (let i = 0; i < dealeritems.length; i++) {
  
          let deal = {
              key: dealeritems[i].ID,
              text: dealeritems[i].dealer_name
          };
          districtitem = dealeritems[i].district;
          dealer.push(deal);
          dealerarray= _.orderBy(dealer, 'text', ['asc']);
      }
      
     
        const salesuseritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID").filter(" DistrictId eq " + districtitem).get();
        console.log("salesusers" + salesuseritems);
        for (let i = 0; i < salesuseritems.length; i++) {

          let data = {
            key: salesuseritems[i].Id,
            text: salesuseritems[i].Title
          };

          assigntoarray.push(data);
        }
     }
           
console.log(authorfromlist);
            const element: React.ReactElement<IRouteProps> = React.createElement(EditRoute, assign({
              itemidprops: row.getValueByName('ID'),
              PlannedDateprops: PlannedDatefromlist,
              Stateprops:Statefromlist,
              Districtprops: Districtfromlist,
              DealerNameprops: Dealernamefromlist,
              ContactNumberprops: contactnumberfromlist,
              Locationprops: locationfromlist,
              AssignToprops: assigntofromlist,
              PlannedVisitTimeprops: PlannedVisitTimefromlist,
              Remarksprops: remarksfromlist,
              dealeroptionsprops: dealerarray,
              assigntooptionprops: assigntoarray,
              minuteprops:Minutefromlist,
              hourprops:Hourfromlist,
              // Locationsprops:locationsfromlist,
              Authorprops:authorfromlist,
              Authornameprops:authornamefromlist,
              Dealerprops:Dealerfromlist,
              Assignprops:assignfromlist,
              Pincodeprops:Pincodefromlist,
              dontknowpinprops:dontknowpin,
              pinprops:pin,
              stateoptionprops:statearray,
              districtoptionprops:districtarray
            }));
            ReactDom.render(element, this.panelPlaceHolder);

            this._syncData();
            this._showEditPanel();
          });
        }

        break;
      case 'COMMAND_2':
        this._syncData();
        this._showPanel();
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
