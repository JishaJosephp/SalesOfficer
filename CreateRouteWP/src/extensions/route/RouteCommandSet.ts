import { override } from '@microsoft/decorators';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Log } from '@microsoft/sp-core-library';
import { sp } from "@pnp/sp";
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

import * as strings from 'RouteCommandSetStrings';

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


  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    let PlannedDatefromlist;
    let Statefromlist;
    let Districtfromlist;
    let Dealernamefromlist;
    let contactnumberfromlist;
    let locationfromlist;
    let locationsfromlist;
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
    let dealerarray = [];
    let assigntoarray = [];
    let dontknowpin;
    let pin;
    let statearray = [];
    let districtarray = [];
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
            if ((row.getValueByName('ContactNumber')) == null) {
              contactnumberfromlist = null;
            }
            else {
              contactnumberfromlist = row.getValueByName('ContactNumber');
            }
            if ((row.getValueByName('Pincode')) == null) {
              Pincodefromlist = null;
            }
            else {
              Pincodefromlist = row.getValueByName('Pincode');
            }
            if ((row.getValueByName('Location')) == null) {
              locationfromlist = null;
            }
            else {
              locationfromlist = row.getValueByName('Location');
            }
            try {
              locationsfromlist = row.getValueByName('Locations')[0].lookupId;
            }
            catch {
              locationsfromlist = null;
            }
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
            if ((row.getValueByName('Remarks')) == "") {
              remarksfromlist = "";
            }
            else {
              remarksfromlist = row.getValueByName('Remarks').replace(/(<([^>]+)>)/gi, "");
            }
            const routeitem =await sp.web.lists.getByTitle("Route List").items.getById(row.getValueByName('ID')).get();
            console.log(routeitem);
            const item = await sp.web.lists.getByTitle("Route List").items.getById(row.getValueByName('ID')).select('Author/Id','Author/EMail','Author/FirstName','Author/LastName').expand('Author').get();
            console.log(item);
            authorfromlist = item.Author.EMail;
            authornamefromlist =item.Author.FirstName+" "+item.Author.LastName;
     Hourfromlist=routeitem.Hours;
     Minutefromlist=routeitem.Minutes;
     if(Pincodefromlist == ""||Pincodefromlist == undefined||Pincodefromlist == null){
      dontknowpin= false;
          pin= true;
          const stateitems: any[] = await sp.web.lists.getByTitle("States").items.select("Title,ID").getAll();
       
        for (let i = 0; i < stateitems.length; i++) {

            let statedata = {
                key: stateitems[i].Id,
                text: stateitems[i].Title
            };
            statearray.push(statedata);

        }
        const districtitems: any[] = await sp.web.lists.getByTitle("Districts").items.get();
       
        for (let i = 0; i < districtitems.length; i++) {
            if(districtitems[i].StateId == Statefromlist){
            let districtdata = {
                key: districtitems[i].Id,
                text: districtitems[i].Title
            };
            districtarray.push(districtdata);
        }
        }
          const dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.select("Title,ID").filter(" DistrictId eq " + Districtfromlist).get();
          console.log("dealer" + dealeritems);
          for (let i = 0; i < dealeritems.length; i++) {

            let data = {
              key: dealeritems[i].Id,
              text: dealeritems[i].Title
            };

            dealerarray.push(data);
          }
          const salesuseritems: any[] = await sp.web.lists.getByTitle("Users").items.select("Title,ID").filter(" DistrictId eq " + Districtfromlist).get();
          console.log("salesusers" + salesuseritems);
          for (let i = 0; i < salesuseritems.length; i++) {

            let data = {
              key: salesuseritems[i].Id,
              text: salesuseritems[i].Title
            };

            assigntoarray.push(data);
          }
  }
  else{
    dontknowpin= true;
          pin= false;
       let   pincode = Pincodefromlist.substring(0, 4);

          console.log(pincode.trim());
          const dealeritems = await sp.web.lists.getByTitle("Dealer List").getItemsByCAMLQuery({
            ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='City_x002f_Location_x003a_PinCod' /><Value Type='Lookup'>"
            + pincode +"</Value></BeginsWith></Where></Query></View>",
          });
          
          console.log(dealeritems);
   for (let i = 0; i < dealeritems.length; i++) {
  
          let dealer = {
              key: dealeritems[i].Id,
              text: dealeritems[i].Title
          };
          
          dealerarray.push(dealer);
      }
      let districtitem;
      const locationitems = await sp.web.lists.getByTitle("Location").getItemsByCAMLQuery({
          ViewXml: "<View><Query><Where><BeginsWith><FieldRef Name='PinCode' /><Value Type='Text'>"
          + pincode +"</Value></BeginsWith></Where></Query></View>",
        });
        console.log(locationitems);
        for (let i = 0; i < locationitems.length; i++) {
           districtitem = locationitems[i].DistrictsId;
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
              Locationsprops:locationsfromlist,
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
            this._showEditPanel();
          });
        }

        break;
      case 'COMMAND_2':
        this._showPanel();
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
