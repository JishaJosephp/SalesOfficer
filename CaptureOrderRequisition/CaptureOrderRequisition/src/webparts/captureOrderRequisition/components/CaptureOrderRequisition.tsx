import * as React from 'react';
import styles from './CaptureOrderRequisition.module.scss';
import { ICaptureOrderRequisitionProps } from './ICaptureOrderRequisitionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, DialogFooter, Panel, Spinner, SpinnerType, PanelType, IPanelProps } from "office-ui-fabric-react";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import * as moment from 'moment';
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
const controlClass = mergeStyleSets({
  control: {
    margin: '0 0 15px 0',
    width: ''

  },
});
export interface ICaptureOrderRequisitionState {
  Title: any;
  firstDayOfWeek?: DayOfWeek;
  productname: any;
  productoption: any[];
  requiredquantity: any;
  requireddate: any;
  datecaptured: any;
  remarks: any;

}

export default class CaptureOrderRequisition extends React.Component<ICaptureOrderRequisitionProps, ICaptureOrderRequisitionState, {}> {
  public constructor(props: ICaptureOrderRequisitionProps, state: ICaptureOrderRequisitionState) {

    super(props);
    this.state = {
      Title: '',
      productname: "",
      productoption: [],
      requiredquantity: "",
      requireddate: null,
      datecaptured: null,
      remarks: ""

    };
    this.productChanged = this.productChanged.bind(this);
  }
  public async componentDidMount() {
    let productarray = [];
    const productitems: any[] = await sp.web.lists.getByTitle("Product").items.select("Title,ID").getAll();
    //console.log("district" + districtitems);
    for (let i = 0; i < productitems.length; i++) {

      let data = {
        key: productitems[i].Id,
        text: productitems[i].Title
      };

      productarray.push(data);
    }
    this.setState({
      productoption: productarray
    });


  }
  public productChanged(option: { key: any; }) {
    //console.log(option.key);
    this.setState({ productname: option.key });
    console.log(this.state.productname);
  }
  public _onrequiredquantitychange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

    //alert(newValue);
    this.setState({ requiredquantity: newValue });


  }
  public _onrequireddateChange = (date?: Date): void => {
    this.setState({ requireddate: date });


  }
  public _ondatecapturedChange = (date?: Date): void => {
    this.setState({ datecaptured: date });


  }
  public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {

    this.setState({ remarks: remarks });

  }
  public update = async () => {

    let siteUrl = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication";
    let web = Web(siteUrl);
    let Requireddate = moment(this.state.requireddate, 'DD/MM/YYYY').format("DD MMM YYYY");
    let DateCaptured = moment(this.state.datecaptured, 'DD/MM/YYYY').format("DD MMM YYYY");

    console.log(Requireddate);
    console.log(DateCaptured);


    let conf = confirm("Do you want to submit?");
    if (conf == true) {

      sp.web.lists.getByTitle("Order List").items.add({

        Title: this.state.requiredquantity,
        ProductNameId: this.state.productname,
        RequiredDate: Requireddate,
        DateCaptured: DateCaptured,

        Remarks: this.state.remarks


      }).then(i => {
        window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/Lists/OrderList/AllItems.aspx";
      })
    }

  }
  public render(): React.ReactElement<ICaptureOrderRequisitionProps> {
    const { firstDayOfWeek } = this.state;

    return (
      <div className={styles.captureOrderRequisition}>
        <Label >Product Name</Label>  <Dropdown id="dept"
          placeholder="Select an option"
          selectedKey={this.state.productname}
          options={this.state.productoption}
          onChanged={this.productChanged}

        //onChange={this.deptChanged}
        />
        <p><Label >Required Quantity </Label>
          < TextField value={this.state.requiredquantity} onChange={this._onrequiredquantitychange}  >
          </TextField></p>

        <Label>Required Date</Label>

        <DatePicker //style={{ width: '1000px' }}
          //className={controlClass.control}
          firstDayOfWeek={firstDayOfWeek}
          strings={DayPickerStrings}
          value={this.state.requireddate}
          onSelectDate={this._onrequireddateChange}
          placeholder="Select a date..."
          ariaLabel="Select a date"

        />
        <Label>Date Captured</Label>

        <DatePicker //style={{ width: '1000px' }}
          //className={controlClass.control}
          firstDayOfWeek={firstDayOfWeek}
          strings={DayPickerStrings}
          value={this.state.datecaptured}
          onSelectDate={this._ondatecapturedChange}
          placeholder="Select a date..."
          ariaLabel="Select a date"

        />
        <p><Label >Remarks</Label>
          < TextField value={this.state.remarks} onChange={this.remarkschange} multiline  ></TextField></p>
        <DialogFooter>
          <PrimaryButton text="Submit" onClick={this.update} />
          {/* <PrimaryButton text="Cancel" onClick={this._onCancel} /> */}
        </DialogFooter>

      </div>
    );
  }
}
