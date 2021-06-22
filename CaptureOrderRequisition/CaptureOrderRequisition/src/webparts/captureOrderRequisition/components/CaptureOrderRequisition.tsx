import * as React from 'react';
import styles from './CaptureOrderRequisition.module.scss';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { ICaptureOrderRequisitionProps } from './ICaptureOrderRequisitionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles, } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, Button, ButtonType, Panel, Spinner, SpinnerType, PanelType, IPanelProps } from "office-ui-fabric-react";
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
import { IEmailProperties } from '@pnp/sp/sputilities';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
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
export interface IOrderindex {
  Id: any;
  index: any;


}
export interface ICaptureOrderData {
  productname: any;
  requiredquantity: any;
  requireddate: any;
  productid: any;
  ErrorMessage: any;
}
export interface ICaptureOrderRequisitionState {
  CaptureOrderData: ICaptureOrderData[];
  Title: any;
  firstDayOfWeek?: DayOfWeek;
  productname: any;
  productoption: any[];
  requiredquantity: any;
  requireddate: any;
  remarks: any;
  noDataError: any;
  quantityError: any;
  orderdatalist: any[];
  routeid: string,
  dealerid: string,
  orderindex: IOrderindex;
  Product: any;
  dealer_website_id: any;
  siteurl: any;
  isOpen: boolean;
  DialogeAlertContent: any;
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
      remarks: "",
      noDataError: '',
      quantityError: '',
      orderdatalist: [],
      routeid: "",
      dealerid: "",
      orderindex: null,
      Product: "",
      CaptureOrderData: [],
      dealer_website_id: '',
      siteurl: '',
      isOpen: false,
      DialogeAlertContent: ''
    };
    this.cancel = this.cancel.bind(this);
  }
  private captureOrderData: ICaptureOrderData[] = [];
  private addOrder = [];
  private isAdd = "1";

  public async componentDidMount() {
    //Get site url
    const rootwebData = await sp.site.rootWeb();
    console.log(rootwebData);
    var webValue = rootwebData.ResourcePath.DecodedUrl;
    //alert(webValue);
    this.setState({
      siteurl: webValue
    });
    //get query string parameter
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    var dealerIdParm = queryParms.getValue("dealerId");
    var routeIdParm = queryParms.getValue("RouteId");
    const dealer_website_id = queryParms.getValue('dealer_website_id');
    this.setState({ dealerid: dealerIdParm, routeid: routeIdParm, dealer_website_id: dealer_website_id });
    let productarray = [];
    //get product items
    const productitems: any[] = await sp.web.lists.getByTitle("Product").items.select("Title,ID").getAll();
    const orderData = await sp.web.lists.getByTitle("Order List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='Route' LookupId='TRUE' /><Value Type='Lookup'>"
        + routeIdParm + "</Value></Eq> <Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
        + dealerIdParm + "</Value></Eq></And></Where></Query></View>",
    });
    console.log(orderData);
    //Bind null value for each product
    for (let i = 0; i < productitems.length; i++) {
      if (orderData.length == 0) {
        this.captureOrderData[i] = ({
          productname: productitems[i].Title,
          productid: productitems[i].Id,
          requiredquantity: "",
          ErrorMessage: "",
          requireddate: new Date()

        });
      }
      //Bind corresponding order data for each product
      else {
        let res = orderData.filter((item) => item.ProductNameId == productitems[i].ID)
        if (res.length > 0) {
          this.captureOrderData[i] = ({
            productname: productitems[i].Title,
            productid: productitems[i].Id,
            requiredquantity: res[0].Title,
            requireddate: new Date(res[0].RequiredDate),
            ErrorMessage: ""
          });
          this.setState({ remarks: res[0].Remarks });
        }
        else {
          this.captureOrderData[i] = ({
            productname: productitems[i].Title,
            productid: productitems[i].Id,
            requiredquantity: "",
            ErrorMessage: "",
            requireddate: new Date()
          });
        }
      }
    }
    this.setState({
      productoption: productarray,
      CaptureOrderData: this.captureOrderData
    });
    console.log(this.state.remarks);
  }
  //Remarks added
  public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {

    this.setState({ remarks: remarks });

  }
  public timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }
  open = () => this.setState({ isOpen: true })
  //ALert close
  close = () => {
    this.setState({ isOpen: false, DialogeAlertContent: "" })
    window.location.href = this.state.siteurl + "/SitePages/Checkin-Checkout.aspx?dealerId=" + this.state.dealerid + "&RouteId=" + this.state.routeid + "&dealer_website_id=" + this.state.dealer_website_id;
  }
  //new order method
  public AddData = async () => {
    let batch = sp.web.createBatch();
    let list = sp.web.lists.getByTitle("Order List");
    let today = new Date();
    let currentDate = moment(today).format("DD MMM YYYY");
    let headid;
    let captureheademail;
    let captureheadname;
    const entityTypeFullName = await list.getListItemEntityTypeFullName()
    let flag = 0;
    let user = await sp.web.currentUser();
    console.log(user);
    let fromemail = user.Email;
    let salesofficer = user.Title;
    let order = "";
    let dealername = "";
    let remark = "";
    let dealerid = parseInt(this.state.dealerid);
    const dealeritems = await sp.web.lists.getByTitle("DealersData").items.getById(dealerid).get();
    console.log(dealeritems);
    dealername = dealeritems.dealer_name;
    //Sales head email from settings list for new order mail sending
    const captureHead = await sp.web.lists.getByTitle("Settings List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><Eq><FieldRef Name='ValueType' /><Value Type='Choice'>Capture Order</Value></Eq></Where></Query></View>",
    });
    headid = captureHead[0].HeadId;
    const users = await sp.web.siteUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].Id == headid) {

        captureheademail = users[i].Email;
        captureheadname = users[i].Title;
      }
    }
    console.log(this.state.CaptureOrderData);
    for (let i = 0; i < this.state.CaptureOrderData.length; i++) {
      let Requireddate = moment(this.state.CaptureOrderData[i].requireddate, 'DD/MM/YYYY').format("DD MMM YYYY");
      if (this.state.CaptureOrderData[i].requiredquantity != "") {
        await this.upsert(batch, this.state.CaptureOrderData[i].requiredquantity, this.state.CaptureOrderData[i].productid, Requireddate, currentDate, this.state.remarks, this.state.routeid, this.state.dealerid)
        flag = 1;
        order = order + "<tr><td>" + this.state.CaptureOrderData[i].productname + "</td><td></td><td>" + this.state.CaptureOrderData[i].requiredquantity + "</td><td></td><td>" + Requireddate + "</td></tr>"
        remark = this.state.remarks;
      }
    }
    let mailMessage = "<p><table><tr><th>Product Name</th><th></th><th>Quantity</th><th></th><th>Required Date</th></tr>" + order + "</table></p>";
    let MailBody = "<p>Hi " + captureheadname +
      ",</p><p>A new requirement has been purchased from <b>" + dealername +
      "</b> by " + salesofficer +
      " on " + currentDate + "</p><p><table><tr><td>Remarks</td><td>:</td><td>" + remark +
      "</td></tr></table></p><p>" + mailMessage +
      "</p>";
    batch.execute().then(async res => {
      //Email sent for sales head
      if (flag == 1) {
        const emailProps: IEmailProperties = {
          From: fromemail,
          To: [captureheademail],
          Subject: "Order Information",
          Body: MailBody,
          AdditionalHeaders: {
            "content-type": "text/html"
          }
        };
        await sp.utility.sendEmail(emailProps);
        console.log("Email Sent!");
        this.setState({ isOpen: true, DialogeAlertContent: "Data Saved Successfully" });
      }
      else {
        this.setState({ isOpen: true, DialogeAlertContent: "Enter any data" });
      }
    });
  }
  private OrderData = [];
  //Quantity change
  public progressplannedchange = (e, i) => {
    this.OrderData = [...this.state.CaptureOrderData];
    if (parseInt(e.target.value) < 0) {
      console.log("Not ");

      this.OrderData[i] = ({
        productname: this.state.CaptureOrderData[i].productname,
        requiredquantity: "",
        requireddate: this.state.CaptureOrderData[i].requireddate,
        productid: this.state.CaptureOrderData[i].productid,
        ErrorMessage: "Enter a valid number"
      });
      return this.setState({ CaptureOrderData: this.OrderData });

    } else if ((e.target.value % 1) != 0) {
      console.log("Not ");
      this.OrderData[i] = ({
        productname: this.state.CaptureOrderData[i].productname,
        requiredquantity: "",
        requireddate: this.state.CaptureOrderData[i].requireddate,
        productid: this.state.CaptureOrderData[i].productid,
        ErrorMessage: "Enter a valid number"
      });
      return this.setState({ CaptureOrderData: this.OrderData });

    }
    else {

      this.OrderData[i] = ({
        productname: this.state.CaptureOrderData[i].productname,
        requiredquantity: e.target.value,
        requireddate: this.state.CaptureOrderData[i].requireddate,
        productid: this.state.CaptureOrderData[i].productid,
        ErrorMessage: ""
      });
      this.setState({ CaptureOrderData: this.OrderData });
    }
  }
  //Get order data of each product
  private getOrders(productname) {
    const orderData = sp.web.lists.getByTitle("Order List").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><And><Eq><FieldRef Name='Route' LookupId='TRUE' /><Value Type='Lookup'>"
        + this.state.routeid + "</Value></Eq><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
        + this.state.dealerid + "</Value></Eq></And><Eq><FieldRef Name='ProductName' LookupId='TRUE' /><Value Type='Lookup'>"
        + productname + "</Value></Eq></And></Where></Query></View>",
    });
    console.log(orderData);
    return orderData;
  }
  //Batch updation
  private async upsert(batch, quantity, productname, Requireddate, currentDate, remarks, routeid, dealerid) {
    const listdata = await this.getOrders(productname);
    if (listdata.length == 0) {
      sp.web.lists.getByTitle("Order List").items.inBatch(batch).add(this.createOrderObject(quantity, productname, Requireddate, currentDate, remarks, routeid, dealerid)
      );
    }
    else {
      var updateid;
      listdata.forEach(async editid => {
        updateid = editid.ID;
      });
      sp.web.lists.getByTitle("Order List").items.inBatch(batch).getById(updateid).update({
        Title: quantity,
        ProductNameId: productname,
        RequiredDate: Requireddate,
        DateCaptured: currentDate,
        Remarks: remarks,
        RouteId: routeid,
        DealerNameId: dealerid
      });
    }
  }
  //Object for batch updation
  private createOrderObject(quantity, productname, Requireddate, currentDate, remarks, routeid, dealerid) {
    return {
      Title: quantity,
      ProductNameId: productname,
      RequiredDate: Requireddate,
      DateCaptured: currentDate,
      Remarks: remarks,
      RouteId: routeid,
      DealerNameId: dealerid
    };
  }
  //Date change update in order array
  private _onSelectPlannedDate = (e, i) => {
    this.OrderData = [...this.state.CaptureOrderData];
    this.OrderData[i] = ({
      productname: this.state.CaptureOrderData[i].productname,
      requiredquantity: this.state.CaptureOrderData[i].requiredquantity,
      requireddate: e,//moment(e).format("DD MMM YYYY") ,
      productid: this.state.CaptureOrderData[i].productid
    });
    this.setState({ CaptureOrderData: this.OrderData });
  }
  //Cancel redirect to checkin page
  public async cancel() {
    window.location.href = this.state.siteurl + "/SitePages/Checkin-Checkout.aspx?dealerId=" + this.state.dealerid + "&RouteId=" + this.state.routeid + "&checkin=1" + "&dealer_website_id=" + this.state.dealer_website_id;;
  }

  public render(): React.ReactElement<ICaptureOrderRequisitionProps> {
    const { firstDayOfWeek } = this.state;
    const EditIcon: IIconProps = { iconName: 'Edit' };
    const DeleteIcon: IIconProps = { iconName: 'Delete' };
    const UpdateIcon: IIconProps = { iconName: 'Add' };

    return (
      <div style={{ minWidth: "100px", maxWidth: "395px" }}>
        <h2 className={styles.heading}>New Order</h2>
        <table style={{ border: '1px solid #ddd', display: (this.state.CaptureOrderData.length == 0 ? 'none' : 'block'), width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <th style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse', textAlign: 'left' }}>Product</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse', textAlign: 'left' }}>Quantity</th>
            <th style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse', textAlign: 'left' }}>Required Date</th>

          </thead>
          <tbody >
            {
              this.state.CaptureOrderData.map((item, i) => {
                return <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <td style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>
                    {this.state.CaptureOrderData[i].productname}

                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse', width: '15px' }}>
                    <TextField
                      onChange={(e) => this.progressplannedchange(e, i)}
                      value={this.state.CaptureOrderData[i].requiredquantity}
                      defaultValue={this.state.CaptureOrderData[i].requiredquantity}
                      errorMessage={this.state.CaptureOrderData[i].ErrorMessage}
                    ></TextField>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>
                    <DatePicker

                      onSelectDate={(e) => this._onSelectPlannedDate(e, i)}
                      placeholder="Select a date..."
                      ariaLabel="Select a date"
                      minDate={new Date}
                      value={this.state.CaptureOrderData[i].requireddate}
                      formatDate={(date) => moment(date).format('DD/MM/YYYY')}
                    />
                  </td>

                </tr>;
              })
            }
          </tbody>
        </table>

        < TextField value={this.state.remarks} onChange={this.remarkschange} multiline ></TextField>
        <table>
          <tr>
            <td> <PrimaryButton id="Add" text="Save" onClick={this.AddData} style={{ width: "100px", marginLeft: "1px", marginTop: "5px", marginBottom: "5px", display: (this.isAdd == "1" ? 'block' : 'none') }} /></td>
            <td><PrimaryButton id="Cancel" style={{ width: "100px" }} text="Cancel" onClick={this.cancel} /></td>
          </tr>
        </table>
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

    );
  }
}