import * as React from 'react';
import styles from './BalanceStock.module.scss';
import { IBalanceStockProps } from './IBalanceStockProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { 
  TextField,
  DatePicker,
  DayOfWeek,
  IDatePickerStrings, 
  mergeStyleSets,
  DialogFooter, 
  Label, 
  PrimaryButton } from "office-ui-fabric-react";
  import { sp } from '@pnp/sp/presets/all';
  import * as moment from "moment";
  import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';

  export interface IOrderindex {
    Id: any;
    index: any;
    
    
    }

  export interface IBalanceStockState {
    productoption: any[];
    balanceDate      : any;
    productname: any;
    balanceStock:any;
   remarks: any;
   balanceStockError:any;
   noDataError:any;
   routeId: any;
   dealerId:any;
   toDate:any;
   quantity: any;
   balancedatalist:any[];
   productText:any;
   orderindex: IOrderindex;
  
  }

  let getQuantity;
  let balancequantity;
  

export default class BalanceStock extends React.Component<IBalanceStockProps, IBalanceStockState, any > {

  
  constructor(props: IBalanceStockProps) {

    super(props);

    this.state = {
      productoption: [],
      balanceDate     : '',
      productname: "",
      balanceStock:'',
      remarks:"",
      balanceStockError:'',
      noDataError:'',
      routeId:'',
      dealerId:'',
      toDate:'',
      quantity:'',
      balancedatalist:[],
      productText:'',
      orderindex:null,
      
     
    };
    this.productChanged = this.productChanged.bind(this);
    this.remarksChange = this.remarksChange.bind(this);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
    this.updateData = this.updateData.bind(this);
    this.DeleteOrderdatalist = this.DeleteOrderdatalist.bind(this);
    this.EditBalancedatalist = this.EditBalancedatalist.bind(this);
    this._balanceQuantityChange = this._balanceQuantityChange.bind(this);
   

  }

  private addBalance = [];
  private isAdd = "1";
  

  public async componentDidMount() {
    let productarray = [];

    let today = new Date();
    var currentDate     = moment(today).format("DD MMM YYYY");
    console.log(currentDate);
    
    

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const route = urlParams.get('RouteId');
    
    const dealer = urlParams.get('dealerId');

    this.setState({
      routeId:route,
      dealerId:dealer,
      toDate:currentDate
    });
    

    const productitems: any[] = await sp.web.lists.getByTitle("Product").items.select("Title,ID").getAll();
    console.log(productitems);
    
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


    const balanceData = await sp.web.lists.getByTitle("Balance Stock").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='Route' LookupId='TRUE' /><Value Type='Lookup'>"
      + this.state.routeId + "</Value></Eq> <Eq><FieldRef Name='Dealer' LookupId='TRUE' /><Value Type='Lookup'>"
      + this.state.dealerId + "</Value></Eq></And></Where></Query></View>",
      });

     // console.log(balanceData);

      for(let i = 0; i < balanceData.length; i++)
{

let data = productitems.filter((item) => item.ID == balanceData[i].ProductNameId).map(({Title,ID}) => ({Title,ID}));
console.log(data)
this.addBalance.push({
Title: balanceData[i].Title,
ProductNameId: balanceData[i].ProductNameId,
ProductName: data[0].Title,
Date: moment(balanceData[i].Date).format('DD MMM YYYY') , 
Remarks: balanceData[i].Remarks,
RouteId: balanceData[i].RouteId,
DealerId: balanceData[i].DealerId,
ID: balanceData[i].ID
});
console.log(this.addBalance[i].Date);


}

this.setState({
  balancedatalist: this.addBalance
  });


      


  }
  public async productChanged(option: { key: any; text: any }) {
    //console.log(option.key);
    this.setState({ productname: option.key,
      productText: option.text
     });


  const product = await sp.web.lists.getByTitle("Balance Stock").getItemsByCAMLQuery({
    ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='ProductName'  LookupId='TRUE' /><Value Type='Lookup'>" 
    + option.key + "</Value></Eq> <Eq><FieldRef Name='Dealer' LookupId='TRUE' /><Value Type='Lookup'>"
    + this.state.dealerId + "</Value></Eq></And></Where></Query></View>",
});



console.log(product);

if(product.length == 0){

   (document.getElementById('balaQuantity')as HTMLInputElement).value='0';

  

}
else{
  
 

  for (let i = 0; i < product.length; i++) {
   // getQuantity = product[i].Title;

    (document.getElementById('balaQuantity')as HTMLInputElement).value=product[i].Title;
    
  }
  //console.log(getQuantity);

  
}


  }




  public remarksChange = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, remarks?: any) => {

    ((document.getElementById("balaQuantity") as HTMLInputElement).value)=this.state.quantity;

    this.setState({ remarks: remarks });

  }

  public update = async () => {

    console.log(this.state.toDate);
    

   
    let remarks     = ((document.getElementById("remarks") as HTMLInputElement).value);
    console.log(remarks);
    
    balancequantity = ((document.getElementById("balaQuantity") as HTMLInputElement).value);
    this.setState({
      quantity:balancequantity
    });

    if ((balancequantity == undefined || balancequantity == null || balancequantity == "")
    && (this.state.productname == undefined || this.state.productname == null || this.state.productname == "")
    && (remarks == undefined || remarks == null || remarks == "")

  ) {

    return this.setState({
      noDataError: "Fill Details"
    });

  }

  else if ((balancequantity % 1) != 0) {
    console.log("Not ");
    return this.setState({
      balanceStockError: "Enter a valid number"
    });
    
    }
    else if (parseInt(balancequantity) <= 0) {
    console.log("Not ");
    return this.setState({
      balanceStockError: "Enter a valid number"
    });
    
    }

    else if(this.handleCheck(this.state.productname) == true){
      return this.setState({
      noDataError: "Already added this product"
      });
      }

  else {
    
      sp.web.lists.getByTitle("Balance Stock").items.add({

        Title:  balancequantity,
        ProductNameId: this.state.productname,
        Date: this.state.toDate,        
        Remarks: remarks,
        DealerId: this.state.dealerId,
        RouteId:this.state.routeId

      }).then(i => {
        let newitemid = i.data.ID;
        console.log(newitemid);
        
        if (newitemid != undefined) {
        this.addBalance.push({   
        Title: i.data.Title,
        ProductNameId: i.data.ProductNameId,
        ProductName: this.state.productText,
        Date: this.state.toDate,
        Remarks:  i.data.Remarks,
        RouteId:this.state.routeId,
        DealerId:this.state.dealerId,
        ID:newitemid
        });
        console.log(this.addBalance);
        
    this.setState({
      balancedatalist: this.addBalance,
      });
    }
    })
    
  }

  balancequantity='';

  
this.setState({

  productname: "",
  remarks: "",
  noDataError:'',
  balanceStockError:'',
  orderindex:null
  
  });
  this.setState({
  orderindex: {
  Id: null,
  index: null
  }
  });

  }

  public async cancel() {
    
    
    window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + this.state.dealerId + "&RouteId=" + this.state.routeId + "&checkin=1";

    
  }

 

  public EditBalancedatalist = async (item) => {
   // console.log(item);
    this.isAdd = "0";
    var index = this.state.balancedatalist.indexOf(item);

let orderindex: IOrderindex;
orderindex = {
Id: item.ID,
index: index
};
this.setState({ orderindex: orderindex });
balancequantity= item.Title;
this.setState({
productname: item.ProductNameId,
productText:item.ProductName,
remarks: item.Remarks,
routeId:item.RouteId,
dealerId:item.DealerId



});
   
    }


    public updateData = async () => {

      let remarks     = ((document.getElementById("remarks") as HTMLInputElement).value);

      console.log(this.state.toDate);
      
      balancequantity = ((document.getElementById("balaQuantity") as HTMLInputElement).value);
      this.setState({
        quantity:balancequantity
      });
  
      if ((balancequantity == undefined || balancequantity == null || balancequantity == "")
      && (this.state.productname == undefined || this.state.productname == null || this.state.productname == "")
      && (remarks == undefined || remarks == null || remarks == "")
  
    ) {
  
      return this.setState({
        noDataError: "Fill Details"
      });
  
    }
    else if ((balancequantity % 1) != 0) {
      console.log("Not ");
      return this.setState({
        balanceStockError: "Enter a valid number"
      });
      
      }
      else if (parseInt(balancequantity) <= 0) {
      console.log("Not ");
      return this.setState({
        balanceStockError: "Enter a valid number"
      });
      
      }


    
      else {
    
      
      sp.web.lists.getByTitle("Balance Stock").items.getById(parseInt(this.state.orderindex.Id)).update({
      Title: balancequantity,
      ProductNameId: this.state.productname,
      Date: this.state.toDate,
      Remarks: remarks,
      RouteId: this.state.routeId,
      DealerId: this.state.dealerId
      });
      
      
      this.addBalance[this.state.orderindex.index] = ({
      Title: balancequantity,
      ProductNameId: this.state.productname,
      ProductName: this.state.productText,
      Date: this.state.toDate,
      Remarks: remarks,
      RouteId: this.state.routeId,
      DealerId: this.state.dealerId,
      ID: this.state.orderindex.Id
      });
      console.log(this.addBalance[this.state.orderindex.index]);
      this.setState({
      balancedatalist: this.addBalance,
      });
      
      // window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx";
      
      
      }
      
      
      alert("Updated successfully");
      this.isAdd = "1";

      balancequantity='';

this.setState({

  productname: "",
  remarks: "",
  noDataError:'',
  balanceStockError:'',
  orderindex:null
  
  });
  this.setState({
  orderindex: {
  Id: null,
  index: null
  }
  });

      }

      public DeleteOrderdatalist = async (data) => {
        if (confirm('Are you sure you want to delete the data?')) {
        // alert(data.ID);
        this.addBalance = this.state.balancedatalist;
        const items = this.addBalance.filter(item => item !== data);
        this.addBalance = items;
        
        this.setState({ balancedatalist: this.addBalance });
        let item = await sp.web.lists.getByTitle("Balance Stock").items.getById(data.ID).delete();

        balancequantity='';
        
        this.setState({
        
        productname: "",
        remarks: "",
        noDataError: '',
        toDate: '',
        productText: '',
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

        handleCheck(val) {
          return this.state.balancedatalist.some(item => (val === item.ProductNameId));
          }

    public _balanceQuantityChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {

      //alert(newValue);
      balancequantity=newValue;
      this.setState({ quantity: newValue });

    
        
        
          }


  public render(): React.ReactElement<IBalanceStockProps> {

    const EditIcon: IIconProps = { iconName: 'Edit' };
const DeleteIcon: IIconProps = { iconName: 'Delete' };


    return (

      <div className={ styles.balanceStockDiv }>

        <h2 className={styles.heading}>Balance Stock Update</h2>

        

<Label >Product Name</Label>  <Dropdown id="product"
          placeholder="Select an option"
          options={this.state.productoption}
          onChanged={this.productChanged}
          selectedKey={this.state.productname}
        //onChange={this.deptChanged}
        />

<p><Label >Balance Stock </Label>
          < TextField  id="balaQuantity" errorMessage={this.state.balanceStockError} value={balancequantity}  onChange={this._balanceQuantityChange}>
          </TextField></p>

          <Label>Date</Label>
          <DatePicker id="DueDate" 
          formatDate={(date) => moment(date).format('DD MMM YYYY')} 
          value={new Date()}
          disabled={true}
          />


<p><Label >Remarks</Label>
          < TextField id="remarks"  multiline autoAdjustHeight value={this.state.remarks} ></TextField></p>

          <p style={{ color: "rgb(164, 38, 44)" }}>{this.state.noDataError}</p>

          <td> <PrimaryButton id="Add" text="Add" onClick={this.update} style={{ width: "100px",marginLeft:"1px",marginBottom:"5px", display: (this.isAdd == "1" ? 'block' : 'none') }} /></td>
          <td><PrimaryButton id="Update" text="Update" onClick={this.updateData} style={{ width: "100px",marginLeft:"1px",marginBottom:"5px", display: (this.isAdd == "0" ? 'block' : 'none') }} /></td>

<div id="balanceview">                                  

  <table style={{ border: '1px solid #ddd', display: (this.state.balancedatalist.length == 0 ? 'none' : 'block'), width: '100%', borderCollapse: 'collapse', backgroundColor: '#f2f2f2' }}>


  <tr style={{ backgroundColor: '#f2f2f2' }}>
<th style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>Product Name</th>
<th style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>Balance Stock</th>
<th style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>Date</th>
{/* <th style={{ border: '1px solid #ddd', padding: '8px', borderCollapse: 'collapse' }}>Assigned</th>
*/}

</tr>

<tbody style={{ width: '100%', borderCollapse: 'collapse' }}>
{
this.state.balancedatalist.map((item) => {

  return <tr style={{ backgroundColor: '#f2f2f2' }}>

    <td style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>{item.ProductName}</td>
<td style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>{item.Title}</td>
<td style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>{item.Date}</td>

<td style={{ padding: '5px' }}> <IconButton iconProps={EditIcon} title="Edit" ariaLabel="Edit" onClick={() => this.EditBalancedatalist(item)} /></td>

<td style={{ padding: '5px' }}> <IconButton iconProps={DeleteIcon} title="Delete" ariaLabel="Delete"  onClick={() => this.DeleteOrderdatalist(item)} /></td>

  </tr>

})
  }
</tbody>

    </table>
  </div>

<br></br>

  <td><PrimaryButton id="Cancel" style={{ width: "100px"}} text="Cancel" onClick={this.cancel} /></td>


  

          
      </div>
    );
  }
}
