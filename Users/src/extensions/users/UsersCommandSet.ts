import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import { sp } from "@pnp/sp";
import * as strings from 'UsersCommandSetStrings';
import * as React from 'react';
import { IUserCreateFormProps } from './components/IUserCreateFormProps';
import UserCreateForm from "./components/UserCreateForm";
import * as ReactDom from 'react-dom';
import { assign } from '@uifabric/utilities';
import UserEditForm from './components/UserEditForm';
import * as $ from 'jquery';
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IUsersCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
  sourceRelativeUrl: string;
  pagerelativeUrl:string;
}

const LOG_SOURCE: string = 'UsersCommandSet';

export default class UsersCommandSet extends BaseListViewCommandSet<IUsersCommandSetProperties> {
  private panelPlaceHolder: HTMLDivElement = null;
  @override
  public onInit(): Promise<void> {
    this.properties.sourceRelativeUrl = "/sites/SalesOfficerApplication/Lists/Users";
    this.properties.pagerelativeUrl = "/sites/SalesOfficerApplication/SitePages/Users.aspx";
    var Libraryurl = this.context.pageContext.list.serverRelativeUrl;
    let Pageurl = this.context.pageContext.site.serverRequestPath;
    Log.info(LOG_SOURCE, 'Initialized UsersCommandSet');
    sp.setup({
      spfxContext: this.context
    });
    this.panelPlaceHolder = document.body.appendChild(document.createElement("div"));
    //Hide buttons on the rybbon
    if ((Libraryurl == this.properties.sourceRelativeUrl) || (Pageurl == this.properties.pagerelativeUrl)) {
      
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
        $("button[name='Export']").hide();
        $("button[name='Integrate']").hide();
      }, 1);

    }
    return Promise.resolve();
  }
  //New Panel
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
  private _dismissPanel = () => {

    this._renderPanelComponent({ isOpen: false });
  }
  public _renderPanelComponent(props: any) {
    const element: React.ReactElement<IUserCreateFormProps> = React.createElement(UserCreateForm, assign({
      onClose: null,
      paneltype: "",
      isOpen: false,
      context: this.context
      //  listId: null
    }, props));


    ReactDom.render(element, this.panelPlaceHolder);
  }
  //Edit panel
  public _showEditPanel() {
    this._renderEditPanelComponent({
      isOpen: true,
      listId: this.context.pageContext.list.id.toString(),
      onClose: this._dismissEditPanel
    });
  }
  public _renderEditPanelComponent(props: any) {
    const element: React.ReactElement<IUserCreateFormProps> = React.createElement(UserEditForm, assign({
      onClose: null,
      paneltype: "",
      isOpen: false,
      context: this.context
    }, props));
    ReactDom.render(element, this.panelPlaceHolder);
  }
  private _dismissEditPanel = () => {
    this._renderEditPanelComponent({ isOpen: false });
  }
  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {

    this.properties.sourceRelativeUrl = "/sites/SalesOfficerApplication/Lists/Users";
    this.properties.pagerelativeUrl = "/sites/SalesOfficerApplication/SitePages/Users.aspx";
    var Libraryurl = this.context.pageContext.list.serverRelativeUrl;
    let Pageurl = this.context.pageContext.site.serverRequestPath;
      const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    const compareTwoCommand: Command = this.tryGetCommand('COMMAND_2');
    compareTwoCommand.visible = (Libraryurl == this.properties.sourceRelativeUrl) || (Pageurl == this.properties.pagerelativeUrl);
    if (compareOneCommand) {
      compareOneCommand.visible = ((event.selectedRows.length === 1 && (Pageurl == this.properties.pagerelativeUrl)) || (event.selectedRows.length === 1 && (Libraryurl == this.properties.sourceRelativeUrl)));

    }
    if ((Libraryurl == this.properties.sourceRelativeUrl) || (Pageurl == this.properties.pagerelativeUrl)) {
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
        $("button[name='Export']").hide();
        $("button[name='Integrate']").hide();
      }, 1);

    }
  }

  @override
  public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
    let ItemIdfromlist;
    let name;
    let agenum;
    let permanentaddress;
    let mobnum;
    let email;
    let idtype;
    let idnumber;
    let selectedstate;
    let selecteddistrict;
    let UserNameId;
    let UserType;
    let currentuser;
    let currentuserid;
    switch (event.itemId) {
      case 'COMMAND_1':
        //Get details of the selected item by it's ID and pass it to the interface
        if (event.selectedRows.length > 0) {
          event.selectedRows.forEach(async (row: RowAccessor, index: number) => {
            ItemIdfromlist = row.getValueByName('ID');
            const item: any = await sp.web.lists.getByTitle("Users").items.getById(ItemIdfromlist).get();
        console.log(item);
        name=item.Title;
        agenum=item.Age;
        permanentaddress=item.Address;
        mobnum=item.ContactNumber;
        email=item.EmailId;
        idtype=item.IDType;
        idnumber=item.IDNumber;
        selectedstate=item.StateId;
        selecteddistrict=item.DistrictId;
        UserNameId=item.usernameid;
        UserType=item.UserType;

        const stateWebsiteId = await sp.web.lists.getByTitle("StateData").items.getById(selectedstate).get();

            const element: React.ReactElement<IUserCreateFormProps> = React.createElement(UserEditForm, assign({
               id: row.getValueByName('ID'),
               name:item.Title,
        agenum:item.Age,
        permanentaddress:item.Address,
        mobnum:item.ContactNumber,
        email:item.EmailId,
        idtype:item.IDType,
        idnumber:item.IDNumber,
        selectedstate:stateWebsiteId.website_id,
        selecteddistrict:item.DistrictId,
        UserNameId:item.UserNameId,
        UserType:item.UserType
              
               }));
            ReactDom.render(element, this.panelPlaceHolder);
            try{
              let user = await sp.web.currentUser();
              
                  currentuser= user.Title;
                  currentuserid= user.Id;
      
            }
              catch{}
              try{
              let grp1: any[] = await sp.web.siteGroups.getByName("HOAdmin").users();
              for (let i = 0; i < grp1.length; i++) {
                  if (currentuserid == grp1[i].Id) {
                    this._showEditPanel();
                  }
      
              } }
              catch{}
              try{
              let grp2: any[] = await sp.web.siteGroups.getByName("SalesOfficer").users();
              for (let i = 0; i < grp2.length; i++) {
                  if (currentuserid == grp2[i].Id) {
                    Dialog.alert("Access Denied");
                  }
      
              }
          }
          catch{}
            

          });
        }
        break;
      case 'COMMAND_2':
        //Dialog.alert(`${this.properties.sampleTextTwo}`);
        try{
          let user = await sp.web.currentUser();
          
              currentuser= user.Title;
              currentuserid= user.Id;
  
        }
          catch{}
          try{
          let grp1: any[] = await sp.web.siteGroups.getByName("HOAdmin").users();
          for (let i = 0; i < grp1.length; i++) {
              if (currentuserid == grp1[i].Id) {
                this._showPanel();
              }
  
          } }
          catch{}
          try{
          let grp2: any[] = await sp.web.siteGroups.getByName("SalesOfficer").users();
          for (let i = 0; i < grp2.length; i++) {
              if (currentuserid == grp2[i].Id) {
                Dialog.alert("Access Denied");
              }
  
          }
      }
      catch{}

        
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
