import * as React from 'react';
import styles from './CaptureOrderRequisition.module.scss';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { ICaptureOrderRequisitionProps } from './ICaptureOrderRequisitionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles, } from 'office-ui-fabric-react/lib/Dropdown';
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
export interface IOrderindex {
  Id: any;
  index: any;


}
export interface ICaptureOrderRequisitionState {
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
      quantityError: '', orderdatalist: [],
      routeid: "",
      dealerid: "",
      orderindex: null,
      Product: ""

    };
    this.productChanged = this.productChanged.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  private addOrder = [];
  private isAdd = "1";
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

    var queryParms = new UrlQueryParameterCollection(window.location.href);
    var dealerIdParm = queryParms.getValue("dealerId");
    var routeIdParm = queryParms.getValue("RouteId");
    this.setState({ dealerid: dealerIdParm, routeid: routeIdParm });

    // const orderData = await sp.web.lists.getByTitle("Order List").getItemsByCAMLQuery({
    //   ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='DealerId' LookupId='True' /><Value Type='Lookup'>"
    //   + routeIdParm + "</Value></Eq> <Eq><FieldRef Name='RouteId' /><Value Type='Lookup'>"
    //   + dealerIdParm + "</Value></Eq> </And></Where></Query></View>",
    //   });
      const orderData = await sp.web.lists.getByTitle("Order List").getItemsByCAMLQuery({
        ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='Route' LookupId='TRUE' /><Value Type='Lookup'>"
        + routeIdParm + "</Value></Eq> <Eq><FieldRef Name='Dealer' LookupId='TRUE' /><Value Type='Lookup'>"
        + dealerIdParm + "</Value></Eq></And></Where></Query></View>",
        });
      console.log(orderData);
      for(let i = 0; i < orderData.length; i++)
      {
        let data = productitems.filter((item) => item.ID ==  orderData[i].ProductNameId).map(({Title,ID}) => ({Title,ID}));
        console.log(data)
        this.addOrder.push({
          Title: orderData[i].Title,
          ProductNameId: orderData[i].ProductNameId,
          RequiredDate:moment(orderData[i].RequiredDate).format("DD MMM YYYY") ,
          DateCaptured:  orderData[i].DateCaptured,
          Remarks:  orderData[i].Remarks,
          RouteId: orderData[i].RouteId,
          DealerId:  orderData[i].DealerId,
          Product:   data[0].Title,
          date:orderData[i].RequiredDate, //moment(orderData[i].RequiredDate).format("DD/MM/YYYY"),
          ID:  orderData[i].ID,
          reqDatepickerValue:moment(orderData[i].RequiredDate).format("DD/MM/YYYY") ,//moment(orderData[i].RequiredDate).format("DD/MM/YYYY")
        });
      }
      this.setState({
        orderdatalist: this.addOrder,
      });
  }
  public productChanged(option: { key: any; text: any }) {
    //console.log(option.key);
    this.setState({ productname: option.key, Product: option.text, noDataError: "" });
    console.log(this.state.productname,);
  }
  public _onrequiredquantitychange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

    //alert(newValue);
    this.setState({  quantityError: "",requiredquantity: newValue });


  }
  public _onrequireddateChange = (date?: Date): void => {
    this.setState({ requireddate: date });


  }

  public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {

    this.setState({ remarks: remarks });

  }
  public update = async () => {

    this.setState({
      quantityError: "",
      noDataError: ""
    });
    let today = new Date();
    let currentDate = moment(today).format("DD MMM YYYY");
    console.log(currentDate);

    let Requireddate = moment(this.state.requireddate, 'DD/MM/YYYY').format("DD MMM YYYY");
    console.log(Requireddate);
    let reqDate=this.state.requireddate;
    if ((this.state.requiredquantity == undefined || this.state.requiredquantity == null || this.state.requiredquantity == "")
      && (this.state.productname == undefined || this.state.productname == null || this.state.productname == "")
      && (this.state.remarks == undefined || this.state.remarks == null || this.state.remarks == "")
      && (Requireddate == undefined || Requireddate == null || Requireddate == "Invalid date")

    ) {

      return this.setState({
        noDataError: "Fill Details"
      });

    }
    else if ((this.state.requiredquantity % 1) != 0) {
      console.log("Not ");
      return this.setState({
        quantityError: "Enter a valid number"
      });

    }
    else if (parseInt(this.state.requiredquantity) <= 0) {
      console.log("Not ");
      return this.setState({
        quantityError: "Enter a valid number"
      });

    }
    //   else if(this.handleCheck(this.state.productname,this.state.requireddate) == true){
    //    return this.setState({
    //     noDataError: "Already added this product"
    //   });
    // }
    else {
      let quantity=this.state.requiredquantity;
      let ProductNameId=this.state.productname;
      sp.web.lists.getByTitle("Order List").items.getById(parseInt(this.state.orderindex.Id)).update({
        Title: this.state.requiredquantity,
        ProductNameId:this.state.productname,
        RequiredDate: Requireddate,
        DateCaptured: currentDate,
        Remarks: this.state.remarks,
        RouteId: this.state.routeid,
        DealerId: this.state.dealerid
      });//.then(i => {
      //   console.log(i);
        this.addOrder[this.state.orderindex.index] = ({
          Title: this.state.requiredquantity,
          ProductNameId: this.state.productname,
          RequiredDate: Requireddate,
          DateCaptured: currentDate,
          Remarks: this.state.remarks,
          RouteId: this.state.routeid,
          DealerId: this.state.dealerid,
          Product: this.state.Product,
          date: reqDate,
          ID: this.state.orderindex.Id,
          reqDatepickerValue: moment(reqDate, 'DD/MM/YYYY').format("DD/MM/YYYY")
          // Title: i.data.Title,
          // ProductNameId: i.data.ProductNameId,
          // RequiredDate: Requireddate,
          // DateCaptured: currentDate,
          // Remarks: i.data.Remarks,
          // RouteId: this.state.routeid,
          // DealerId: this.state.dealerid,
          // Product: this.state.Product,
          // date: reqDate,
          // ID: newitemid,
          // reqDatepickerValue: moment(reqDate, 'DD/MM/YYYY').format("DD/MM/YYYY")
        
        });
        console.log(this.addOrder[this.state.orderindex.index]);
        this.setState({
          orderdatalist: this.addOrder,
        });


        //  window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx";
     // })


    }
    console.log("before clear");
    console.log(this.addOrder);
    this.setState({

      productname: "",
      requiredquantity: "",
      requireddate: null,
      remarks: "",
      noDataError:'',
      quantityError:'',   
      orderindex:null

        });
        this.setState({
            orderindex: {
                Id: null,
                index: null
            }
        });

        console.log("after clear");
        console.log(this.addOrder);
        // this.setState({
        //   orderdatalist: this.addOrder,
        // });
    //  this.setState({

    //     productname: "",
    //     requiredquantity: "",
    //     requireddate: null,
    //     remarks: "",
    //     noDataError:'',
    //     quantityError:'',   
    //     orderindex:null

    //       });
    //       this.setState({
    //           orderindex: {
    //               Id: null,
    //               index: null
    //           }
    //       });
         
    alert("Updated successfully");
    this.isAdd = "1";
  }
  public Add = async () => {
    this.setState({
      quantityError: "",
      noDataError: ""
    });

    let today = new Date();
    let currentDate = moment(today).format("DD MMM YYYY");
    console.log(currentDate);

    let Requireddate = moment(this.state.requireddate, 'DD/MM/YYYY').format("DD MMM YYYY");
    console.log(Requireddate);
let reqDate=this.state.requireddate;
    if ((this.state.requiredquantity == undefined || this.state.requiredquantity == null || this.state.requiredquantity == "")
      && (this.state.productname == undefined || this.state.productname == null || this.state.productname == "")
      && (this.state.remarks == undefined || this.state.remarks == null || this.state.remarks == "")
      && (Requireddate == undefined || Requireddate == null || Requireddate == "Invalid date")

    ) {

      return this.setState({
        noDataError: "Fill Details"
      });

    }
    else if ((this.state.requiredquantity % 1) != 0) {
        console.log("Not ");
        return this.setState({
          quantityError: "Enter a valid number"
        });

      }
      else if (parseInt(this.state.requiredquantity) <= 0) {
        console.log("Not ");
        return this.setState({
          quantityError: "Enter a valid number"
        });

      }
        else if(this.handleCheck(this.state.productname,this.state.requireddate) == true){
         return this.setState({
          noDataError: "Already added this product"
        });
      }
      else {
       
      sp.web.lists.getByTitle("Order List").items.add({
        Title: this.state.requiredquantity,
        ProductNameId: this.state.productname,
        RequiredDate: Requireddate,
        DateCaptured: currentDate,
        Remarks: this.state.remarks,
        RouteId: this.state.routeid,
        DealerId: this.state.dealerid
      }).then(i => {
        let newitemid = i.data.ID;
        if (newitemid != undefined) {
          this.addOrder.push({
            Title: i.data.Title,
            ProductNameId: i.data.ProductNameId,
            RequiredDate: Requireddate,
            DateCaptured: currentDate,
            Remarks: i.data.Remarks,
            RouteId: this.state.routeid,
            DealerId: this.state.dealerid,
            Product: this.state.Product,
            date: reqDate,
            ID: newitemid,
            reqDatepickerValue: moment(reqDate, 'DD/MM/YYYY').format("DD/MM/YYYY")

            // Title: this.state.requiredquantity,
            // ProductNameId: this.state.productname,
            // RequiredDate: Requireddate,
            // DateCaptured: currentDate,
            // Remarks: this.state.remarks,
            // RouteId: this.state.routeid,
            // DealerId: this.state.dealerid,
            // Product: this.state.Product,
            // date: this.state.requireddate,
            // ID: newitemid,
            // reqDatepickerValue: moment(this.state.requireddate, 'DD/MM/YYYY').format("DD/MM/YYYY")
          });
          this.setState({
            orderdatalist: this.addOrder,
          });
        }

        //  window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx";
      })

    }
    


     this.setState({

        productname: "",
        requiredquantity: "",
        requireddate: null,
        remarks: "",
        noDataError:'',
        quantityError:'',   
        orderindex:null

          });
          this.setState({
              orderindex: {
                  Id: null,
                  index: null
              }
          });

  }
  handleCheck(val,date) {
    var Fdate= moment(this.state.requireddate, 'DD/MM/YYYY').format("DD/MM/YYYY")
    return this.state.orderdatalist.some(item => (val === item.ProductNameId)&&(Fdate ===item.reqDatepickerValue));
}
  public DeleteOrderdatalist = async (data) => {
    if (confirm('Are you sure you want to delete the data?')) {
      //  alert(data.ID);
      this.addOrder = this.state.orderdatalist;
      const items = this.addOrder.filter(item => item !== data);
      this.addOrder = items;

      this.setState({ orderdatalist: this.addOrder });
      let item = await sp.web.lists.getByTitle("Order List").items.getById(data.ID).delete();
      this.setState({
        Title: '',
        productname: "",
        requiredquantity: "",
        requireddate: null,
        remarks: "",
        noDataError: '',
        quantityError: '',

        Product: "",
        orderindex: null

      });
      this.setState({
        orderindex: {
          Id: null,
          index: null
        }
      });
    }
  }
  public EditOrderdatalist = async (item) => {
    this.isAdd = "0";
    console.log(item);
    var index = this.state.orderdatalist.indexOf(item);

    let orderindex: IOrderindex;
    orderindex = {
      Id: item.ID,
      index: index
    };
    //const dateformat     = moment(item.date).format("DD-MM-YYYY");;// moment(item.date).format("YYYY-MM-DDT12:00:00Z");
   const dateformats = new Date(item.date)
    this.setState({ orderindex: orderindex });
    this.setState({
      requiredquantity: item.Title,
      productname: item.ProductNameId,
      requireddate:dateformats ,
      remarks: item.Remarks,
      routeid: item.RouteId,
      dealerid: item.DealerId,
      Product: item.Product


    });
  }
  public async cancel() {


    window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + this.state.dealerid + "&RouteId=" + this.state.routeid + "&checkin=1";;
  }

  public render(): React.ReactElement<ICaptureOrderRequisitionProps> {
    const { firstDayOfWeek } = this.state;
    const EditIcon: IIconProps = { iconName: 'Edit' };
    const DeleteIcon: IIconProps = { iconName: 'Delete' };
    const UpdateIcon: IIconProps = { iconName: 'Add' };

    return (
      <div className={styles.orderDiv}>

        <h2 className={styles.heading}>Capture Order</h2>

        <Label >Product Name</Label>  <Dropdown id="dept"
          placeholder="Select an option"
          selectedKey={this.state.productname}
          options={this.state.productoption}
          onChanged={this.productChanged}

        //onChange={this.deptChanged}
        />
        <p><Label >Required Quantity </Label>
          < TextField value={this.state.requiredquantity} onChange={this._onrequiredquantitychange} errorMessage={this.state.quantityError} >
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
          isRequired={true}
        
          formatDate={(date) => moment(date).format('DD/MM/YYYY')}

        />

        <p><Label >Remarks</Label>
          < TextField value={this.state.remarks} onChange={this.remarkschange} multiline  ></TextField></p>

        <p style={{ color: "rgb(164, 38, 44)" }}>{this.state.noDataError}</p>
        <td> <PrimaryButton id="Add" text="Add" onClick={this.Add} style={{ width: "100px",marginLeft:"1px",marginBottom:"5px", display: (this.isAdd == "1" ? 'block' : 'none') }} /></td>
        <td><PrimaryButton id="Update" text="Update" onClick={this.update} style={{ width: "100px",marginLeft:"1px",marginBottom:"5px", display: (this.isAdd == "0" ? 'block' : 'none') }} /></td>
        <div id="orderview">
          <table style={{ border: '1px solid #ddd', display: (this.state.orderdatalist.length == 0 ? 'none' : 'block'), width: '100%', borderCollapse: 'collapse', backgroundColor: '#f2f2f2' }}>

            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>Product Name</th>
              <th style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>Qty</th>
              <th style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>Required date</th>
              <th  style={{padding: '4px' }}></th>
              <th  style={{ padding: '4px' }}></th>
              {/* <th style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>Assigned</th>
   */}



            </tr>


            <tbody style={{ width: '100%', borderCollapse: 'collapse' }}>
              {
                this.state.orderdatalist.map((item) => {


                  return <tr style={{ backgroundColor: '#f2f2f2' }}>

                    <td style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>{item.Product}</td>
                    <td style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>{item.Title}</td>
                    <td style={{ border: '1px solid #ddd', padding: '4px', borderCollapse: 'collapse' }}>{item.RequiredDate}</td>
                    {/* <td style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>{item.ViewAssign}</td> */}

                    <td style={{ padding: '4px' }}> <IconButton iconProps={EditIcon} title="Edit" ariaLabel="Edit" onClick={() => this.EditOrderdatalist(item)} /></td>

                    <td style={{  padding: '4px' }}> <IconButton iconProps={DeleteIcon} title="Delete" ariaLabel="Delete" onClick={() => this.DeleteOrderdatalist(item)} /></td>





                  </tr>;
                })


              }
            </tbody>

          </table>

        </div>

          <td><PrimaryButton id="Cancel"  style={{ width: "100px"}} text="Cancel" onClick={this.cancel} /></td>
         
        {/* {/ <PrimaryButton text="Cancel" onClick={this._onCancel} /> /} */}


      </div>
    );
  }
}