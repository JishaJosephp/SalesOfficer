import * as React from 'react';
import styles from './RouteApproval.module.scss';
import { IRouteApprovalProps } from './IRouteApprovalProps';
import * as moment from 'moment';
import { sp, Web, View, ContentType, Search } from "@pnp/sp/presets/all";
import { escape } from '@microsoft/sp-lodash-subset';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog'
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles, } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, DialogFooter, Panel, Spinner, SpinnerType, PanelType, IPanelProps, Button, ButtonType } from "office-ui-fabric-react";
export interface IApprovalState {
  firstDayOfWeek?: DayOfWeek;
  hidebutton: boolean;
  hideddv: boolean;
  Statusvalue: any;
  hidedd: boolean;
  UserName: any;
  Action: string;
  planneddate: any;
  selectedhour: any;
  selectedmin: any;
  commentError: any;
  isdisable: boolean;
  siteurl: any;
  isOpen: boolean;
  DialogeAlertContent: any;
}
//Month Array
const DayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',

  ],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker',
};
export default class RouteApproval extends React.Component<IRouteApprovalProps, IApprovalState, {}> {

  public constructor(props: IRouteApprovalProps, state: IApprovalState) {

    super(props);
    //state initialisation
    this.state = {
      hidebutton: false,
      hideddv: false,
      Statusvalue: '',
      hidedd: true,
      UserName: '',
      Action: '',
      planneddate: '',
      selectedhour: '',
      selectedmin: '',
      commentError: '',
      isdisable: false,
      siteurl: '',
      isOpen: false,
      DialogeAlertContent: ''

    }
    //Register submit button
    this.handleSubmitButton = this.handleSubmitButton.bind(this);
  }

  private Actionitems: IDropdownOption[] = [];
  public async componentDidMount() {
    //Get current site url
    const rootwebData = await sp.site.rootWeb();
    console.log(rootwebData);
    var webValue = rootwebData.ResourcePath.DecodedUrl;
    this.setState({
      siteurl: webValue
    });
    await this.BindApprovalForm();
  }
  //Dialoge open
  open = () => this.setState({ isOpen: true })
  //Dialoge close
  close = () => {
    this.setState({ isOpen: false, DialogeAlertContent: "" })
    window.location.href = this.state.siteurl + '/';
  }
  //Bind Approval form
  public async BindApprovalForm() {
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    var itemID = queryParms.getValue("ItemID");
    var userId = parseInt(itemID);
    let Name;
    let Status;
    let ExtendedDate;
    //Get users data
    const items: any = await sp.web.lists.getByTitle("Users").items.get();
    console.log(items);
    for (let i = 0; i < items.length; i++) {
      if (userId == items[i].Id) {
        Name = items[i].Title;
        Status = items[i].Status;
        ExtendedDate = items[i].ExtendedDate;
      }
    }
    this.Actionitems.push({ key: 'Approved', text: 'Approved' });
    this.Actionitems.push({ key: 'Cancelled', text: 'Cancelled' });

    if (Name != null) {
      this.setState({
        UserName: Name,

      });
    }

    if (Status != "Request Send") {
      this.setState({
        Statusvalue: Status,
        isdisable: true
      });

      if (ExtendedDate != null) {
        console.log(ExtendedDate);
        var hours = moment(ExtendedDate).format('HH');
        var minutes = moment(ExtendedDate).format('mm');
        this.setState({
          planneddate: ExtendedDate,
          selectedmin: minutes,
          selectedhour: hours,
        });
      }
    }
  }
  //Submit button click
  public async handleSubmitButton() {
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    var ItemID = queryParms.getValue("ItemID");
    var ItemIDd = parseInt(ItemID);
    var ListID = queryParms.getValue("ListID");
    var ListIDd = parseInt(ListID);

    let pdt = moment(this.state.planneddate).format('YYYY-MM-DD' + 'T' + this.state.selectedhour + ':' + this.state.selectedmin + ':00');
    if (this.state.Action == undefined || this.state.Action == null || this.state.Action == '') {
      return this.setState({
        commentError: "Required"
      });
    }
    else if (this.state.Action == "Approved" && this.state.planneddate == "") {
      return this.setState({
        commentError: "Date Required"
      });
    }
    else {
      if (this.state.Action == "Cancelled") {
        pdt = null;

      }
      await sp.web.lists.getByTitle("Users").items.getById(ItemIDd).update({
        Status: this.state.Action,
        ExtendedDate: pdt
      }).then(async i => {
      });
      await sp.web.lists.getByTitle("ApprovalList").items.getById(ListIDd).update({
        Title: "1"
      });
    }
    //Open dialogue
    this.setState({ isOpen: true, DialogeAlertContent: "Data Saved Successfully" });
  }
  //Date picker change
  public _onplanneddateChange = (date?: Date): void => {
    this.setState({
      planneddate: date,
    });

    console.log(this.state.planneddate);
  }
  //Style change in button hover Submit
  public hover(): void {
    document.getElementById("b1").style.backgroundColor = "#498205";
    document.getElementById("b1").style.color = "white";
  }
  //Style change in button no hover Submit
  public nohover(): void {
    document.getElementById("b1").style.backgroundColor = "white";
    document.getElementById("b1").style.color = "black";
  }
  //Hour change
  public hour(option: { key: any; }) {
    console.log(option.key);
    this.setState({
      selectedhour: option.key,
    });
  }
  //Min change
  public min(option: { key: any; }) {
    console.log(option.key);
    this.setState({
      selectedmin: option.key,
    });
  }
  //Style change in button hover Cancel
  public hoverr(): void {
    document.getElementById("b2").style.backgroundColor = "#498205";
    document.getElementById("b2").style.color = "white";
  }
  //Style change in button no hover Cancel
  public nohoverr(): void {
    document.getElementById("b2").style.backgroundColor = "white";
    document.getElementById("b2").style.color = "black";
  }
  //Canecel button redirection to home page
  public handleCancelButton() {

    window.location.href = this.state.siteurl + '/';
  }
  //Dropdown Status change 
  private ChangeId = (item: IDropdownOption): void => {
    this.setState({
      Action: item.text,
      Statusvalue: item.text,
      commentError: ""
    });
  }
  public render(): React.ReactElement<IRouteApprovalProps> {
    const { firstDayOfWeek } = this.state;
    //Time Hour Array
    const hour: IDropdownOption[] = [

      { key: '01', text: '01AM' },
      { key: '02', text: '02AM' },
      { key: '03', text: '03AM' },
      { key: '04', text: '04AM' },
      { key: '05', text: '05AM' },
      { key: '06', text: '06AM' },
      { key: '07', text: '07AM' },
      { key: '08', text: '08AM' },
      { key: '09', text: '09AM' },
      { key: '10', text: '10AM' },
      { key: '11', text: '11AM' },
      { key: '12', text: '12PM' },
      { key: '13', text: '01PM' },
      { key: '14', text: '02PM' },
      { key: '15', text: '03PM' },
      { key: '16', text: '04PM' },
      { key: '17', text: '05PM' },
      { key: '18', text: '06PM' },
      { key: '19', text: '07PM' },
      { key: '20', text: '08PM' },
      { key: '21', text: '09PM' },
      { key: '22', text: '10PM' },
      { key: '23', text: '11PM' },
      { key: '00', text: '12AM' },

    ];
    //Time Min Array
    const min: IDropdownOption[] = [

      { key: '00', text: '00' },
      { key: '05', text: '05' },
      { key: '10', text: '10' },
      { key: '15', text: '15' },
      { key: '20', text: '20' },
      { key: '25', text: '25' },
      { key: '30', text: '30' },
      { key: '35', text: '35' },
      { key: '40', text: '40' },
      { key: '45', text: '45' },
      { key: '50', text: '50' },
      { key: '55', text: '55' },


    ];
    //Dropdown width style
    const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: 100 },
    };
    return (
      <div >
        <div >
          <div>
            <div >
              <table>
                <tr>
                  <td><b> Requestor :{this.state.UserName}</b></td>
                  <td></td>
                </tr>
                <tr>
                  <label><b>Route Plan Submission Extension Date</b></label>
                </tr>
                <tr><td>
                  <DatePicker
                    firstDayOfWeek={firstDayOfWeek}
                    strings={DayPickerStrings}
                    value={this.state.planneddate}
                    onSelectDate={this._onplanneddateChange}
                    placeholder="Select a date..."
                    ariaLabel="Select a date"
                    formatDate={(date) => moment(date).format('DD/MM/YYYY')}
                    isRequired={true}
                    disabled={this.state.isdisable}
                  />
                </td>
                  <td>
                    <Dropdown id="time" required={true}
                      placeholder="--"
                      options={hour}
                      styles={dropdownStyles}
                      //onChanged={this.usertypeChanged}
                      selectedKey={this.state.selectedhour}
                      onChanged={(option) => this.hour(option)}
                      isDisabled={this.state.isdisable}

                    /></td>
                  <td>
                    <Dropdown id="time2" required={true}
                      placeholder="--"
                      options={min}
                      styles={dropdownStyles}
                      selectedKey={this.state.selectedmin}
                      //onChanged={this.usertypeChanged}
                      onChanged={(option) => this.min(option)}
                      isDisabled={this.state.isdisable}

                    />
                  </td>
                </tr>
                <tr>
                  <Dropdown placeholder="Select Status" style={{ marginBottom: '10px', backgroundColor: "white" }} options={this.Actionitems} errorMessage={this.state.commentError}
                    onChanged={this.ChangeId} selectedKey={this.state.Statusvalue}
                    required disabled={this.state.isdisable} />
                </tr>
                <tr>
                  <td></td>
                  <td>


                  </td> </tr>
              </table>
              <DefaultButton id="b2" style={{ marginTop: '40px', float: "left", marginRight: "10px", backgroundColor: "white", borderRadius: "10px", border: "1px solid gray" }}
                onMouseOver={this.hoverr} onMouseLeave={this.nohoverr}
                onClick={this.handleSubmitButton} disabled={this.state.isdisable}
              >
                Submit
</DefaultButton >
              <DefaultButton id="b1" style={{ marginTop: '40px', float: "left", backgroundColor: "white", borderRadius: "10px", border: "1px solid gray" }}
                onMouseOver={this.hover} onMouseLeave={this.nohover}
                onClick={this.handleCancelButton}
              >Cancel
</DefaultButton >


            </div>
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
      </div>
    );
  }
}