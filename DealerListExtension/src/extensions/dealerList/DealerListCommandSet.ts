import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { sp } from "@pnp/sp";
import { assign } from '@uifabric/utilities';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
  RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import NewDealer from '../component/NewDealer';
import EditDealer from '../component/EditDealer';
import { IDealerProps } from '../component/IDealerProps';

import * as strings from 'DealerListCommandSetStrings';
import * as $ from 'jquery';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDealerListCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
  sourceRelativeUrl: string;
}

const LOG_SOURCE: string = 'DealerListCommandSet';

export default class DealerListCommandSet extends BaseListViewCommandSet<IDealerListCommandSetProperties> {
  private panelPlaceHolder: HTMLDivElement = null;
  @override
  public onInit(): Promise<void> {
    var Libraryurl = this.context.pageContext.list.serverRelativeUrl;
    this.properties.sourceRelativeUrl = "/sites/SalesOfficerApplication/Lists/DealerList";
    //this.properties.pagerelativeUrl = "/sites/DMS/SitePages/Document-Repository.aspx";

    sp.setup({
      spfxContext: this.context
    });
    this.panelPlaceHolder = document.body.appendChild(document.createElement("div"));
    Log.info(LOG_SOURCE, 'Initialized DealerListCommandSet');
     if ((Libraryurl == this.properties.sourceRelativeUrl) ) {
      
       setInterval(() => {
       $("button[name='New']").hide();
         $("button[name='Copy link']").hide();
         $("button[name='Share']").hide();
         $("button[name='Edit in grid view']").hide();
         $("button[name='Export to Excel']").hide();
         $("button[name='Power Apps']").hide();
         $("button[name='Automate']").hide();
        //  $("button[aria-label='More']").hide();
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
    var Libraryurl = this.context.pageContext.list.serverRelativeUrl;
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    const compareTwoCommand: Command = this.tryGetCommand('COMMAND_2');
    if (Libraryurl == this.properties.sourceRelativeUrl) {
      compareTwoCommand.visible = true;
    }
    else {
      compareTwoCommand.visible = false;
    }
    if (compareOneCommand) {
      compareOneCommand.visible = (event.selectedRows.length === 1 && (Libraryurl == this.properties.sourceRelativeUrl))
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
    //     $("button[aria-label='More']").hide();
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
      // paneltype: "Medium",
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
    const element: React.ReactElement<IDealerProps> = React.createElement(NewDealer, assign({
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
    const element: React.ReactElement<IDealerProps> = React.createElement(EditDealer, assign({
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

    let Districtfromlist;
    let Dealernamefromlist;
    let contactnumberfromlist;
    let locationfromlist;
    let Statefromlist;
let permanentdealerfromlist;
    let Addressfromlist;
    let Coordinatesfromlist;

    switch (event.itemId) {
      case 'COMMAND_1':
        if (event.selectedRows.length > 0) {
          event.selectedRows.forEach(async (row: RowAccessor, index: number) => {

            const Dealeritems: any[] = await sp.web.lists.getByTitle("Dealer List").items.select("Title", "ID", "State/Title", "State/Id", "District/Title", "District/Id", "ContactNumber", "City_x002f_Location/Title", "City_x002f_Location/Id", "Address1", "Coordinates").expand("State", "District", "City_x002f_Location").filter("ID eq " + row.getValueByName('ID')).get();
            for (let i = 0; i < Dealeritems.length; i++) {
              try {

                Statefromlist = Dealeritems[0].State.Id;

              }
              catch {

                Statefromlist = null;

              }
              try {

                Districtfromlist = Dealeritems[0].District.Id;

              }
              catch {

                Districtfromlist = null;

              }
              if (row.getValueByName('Welcomemessge') == 'Yes') {
                permanentdealerfromlist = true;
              }
              else {
                permanentdealerfromlist = false;
  
              }
              if (Dealeritems[0].ContactNumber == null) {
                contactnumberfromlist = null;

              }
              else {

                contactnumberfromlist = Dealeritems[0].ContactNumber;

              }
              try {

                locationfromlist = Dealeritems[0].City_x002f_Location.Id;

              }
              catch {

                locationfromlist = null;

              }

              if (Dealeritems[0].Title == '') {
                Dealernamefromlist = '';

              }
              else {

                Dealernamefromlist = Dealeritems[0].Title;

              }
              if (Dealeritems[0].Address1 == "") {
                Addressfromlist = "";

              }
              else {

                Addressfromlist = Dealeritems[0].Address1.replace(/(<([^>]+)>)/gi, "");

              }
              if (Dealeritems[0].Coordinates == "") {
                Coordinatesfromlist = "";

              }
              else {

                Coordinatesfromlist = Dealeritems[0].Coordinates;

              }


            }
            // try {

            //   Statefromlist = row.getValueByName('State')[0].lookupId;

            // }
            // catch {

            //   Statefromlist = null;

            // }
            // try {

            //   Districtfromlist = row.getValueByName('District')[0].lookupId;

            // }
            // catch {

            //   Districtfromlist = null;

            // }

            // if ((row.getValueByName('ContactNumber')) == null) {
            //   contactnumberfromlist = null;

            // }
            // else {

            //   contactnumberfromlist = row.getValueByName('ContactNumber');

            // }
            // try {

            //   locationfromlist = row.getValueByName('City_x002f_Location')[0].lookupId;

            // }
            // catch {

            //   locationfromlist = null;

            // }

            // if ((row.getValueByName('Title')) == '') {
            //   Dealernamefromlist = '';

            // }
            // else {

            //   Dealernamefromlist = row.getValueByName('Title');

            // }
            // if ((row.getValueByName('Address1')) == "") {
            //   Addressfromlist = "";

            // }
            // else {

            //   Addressfromlist = row.getValueByName('Address1').replace(/(<([^>]+)>)/gi, "");

            // }
            // if ((row.getValueByName('Coordinates')) == "") {
            //   Coordinatesfromlist = "";

            // }
            // else {

            //   Coordinatesfromlist = row.getValueByName('Coordinates');

            // }
            let locationarray = [];

            const locationitems: any[] = await sp.web.lists.getByTitle("Location").items.select("Title,ID").filter(" DistrictsId eq " + Districtfromlist).getAll();
            console.log("location" + locationitems);
            for (let i = 0; i < locationitems.length; i++) {

              let data = {
                key: locationitems[i].Id,
                text: locationitems[i].Title
              };

              locationarray.push(data);
            }

            let districtarray = [];

            const districtitems: any[] = await sp.web.lists.getByTitle("Districts").items.select("Title,ID").filter(" StateId eq " + Statefromlist).getAll();
            console.log("district" + districtitems);
            for (let i = 0; i < districtitems.length; i++) {

              let data = {
                key: districtitems[i].Id,
                text: districtitems[i].Title
              };


              districtarray.push(data);
            }


            const element: React.ReactElement<IDealerProps> = React.createElement(EditDealer, assign({
              itemidprops: row.getValueByName('ID'),

              Districtprops: Districtfromlist,
              DealerNameprops: Dealernamefromlist,
              ContactNumberprops: contactnumberfromlist,
              Locationprops: locationfromlist,
              Permanentdealerprops:permanentdealerfromlist,
              Coordinatesprops: Coordinatesfromlist,
              Addressprops: Addressfromlist,
              stateprops: Statefromlist,
              locationoptionprops: locationarray,
              districtoptionprops: districtarray

            }));
            ReactDom.render(element, this.panelPlaceHolder);
            this._showEditPanel();
          })
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
