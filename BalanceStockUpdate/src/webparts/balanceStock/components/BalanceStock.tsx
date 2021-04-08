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
PrimaryButton
} from "office-ui-fabric-react";
import { sp } from '@pnp/sp/presets/all';
import * as moment from "moment";
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';

export interface IOrderindex {
Id: any;
index: any;


}
export interface IBalanceStockData {
productname: any;
balanceStock: any;
balanceid: any;
productid: any;
ErrorMessage: any;
}
export interface IBalanceStockState {
productoption: any[];
balanceDate: any;
productname: any;
balanceStock: any;
remarks: any;
balanceStockError: any;
noDataError: any;
routeId: any;
dealerId: any;
toDate: any;
quantity: any;
balancedatalist: IBalanceStockData[];
productText: any;
orderindex: IOrderindex;
error: boolean;
mandatory: boolean;
dealer_website_id:any;
}

let getQuantity;
let balancequantity;


export default class BalanceStock extends React.Component<IBalanceStockProps, IBalanceStockState, any> {


constructor(props: IBalanceStockProps) {

super(props);

this.state = {
productoption: [],
balanceDate: '',
productname: "",
balanceStock: '',
remarks: "",
balanceStockError: '',
noDataError: '',
routeId: '',
dealerId: '',
toDate: '',
quantity: '',
balancedatalist: [],
productText: '',
orderindex: null,
error: false,
mandatory: true,dealer_website_id:''

};
// this.productChanged = this.productChanged.bind(this);
this.remarkschange = this.remarkschange.bind(this);
// this.update = this.update.bind(this);
this.cancel = this.cancel.bind(this);
this.updateData = this.updateData.bind(this);

this._balanceQuantityChange = this._balanceQuantityChange.bind(this);


}

private addBalance = [];
private isAdd = "1";
private Balance = [];

public async componentDidMount() {
let productarray = [];

let today = new Date();
var currentDate = moment(today).format("DD MMM YYYY");
console.log(currentDate);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const route = urlParams.get('RouteId');
const dealer_website_id= urlParams.get('dealer_website_id');
const dealer = urlParams.get('dealerId');

this.setState({
routeId: route,
dealerId: dealer,
toDate: currentDate,
dealer_website_id:dealer_website_id
});
let dealerid = parseInt(dealer);
let remarks;
const balancelist = await sp.web.lists.getByTitle("Balance Stock").getItemsByCAMLQuery({
ViewXml: "<View><Query><Where><Eq><FieldRef Name='DealerName' LookupId='TRUE' /><Value Type='Lookup'>"
+ dealerid + "</Value></Eq></Where></Query></View>",
});
console.log(balancelist);
const productitems: any[] = await sp.web.lists.getByTitle("Product").items.select("Title,ID").getAll();
if (balancelist.length == 0) {

console.log(productitems);
for (let i = 0; i < productitems.length; i++) {
this.Balance[i] = ({
productname: productitems[i].Title,
productid: productitems[i].Id,
balanceStock: "0",
balanceid: 0,
ErrorMessage: ""
});
}
}
else {
for (let i = 0; i < productitems.length; i++) {
// let productid = balancelist[i].ProductNameId;

let data = balancelist.filter((item) => item.ProductNameId == productitems[i].ID);
// const productitems = await sp.web.lists.getByTitle("Product").items.getById(productid).select("Title").get();
// console.log(productitems);
if (data.length > 0) {
this.Balance[i] = ({
productname: productitems[i].Title,
productid: productitems[i].ID,
balanceStock: data[0].Title,
balanceid: data[0].Id,
ErrorMessage: ""
});
remarks = data[0].Remarks
}
else {
this.Balance[i] = ({
productname: productitems[i].Title,
productid: productitems[i].ID,
balanceStock: "0",
balanceid: 0,
ErrorMessage: ""
});
}
}

}
this.setState({
balancedatalist: this.Balance,
 remarks: remarks 
});




}
public remarkschange = (ev: React.FormEvent<HTMLInputElement>, remarks?: any) => {
this.setState({ mandatory: true });
this.setState({ remarks: remarks });

}
public async cancel() {
window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + this.state.dealerId + "&RouteId=" + this.state.routeId + "&checkin=0"+"&dealer_website_id="+this.state.dealer_website_id;
}


public handleCheck(val) {
return this.state.balancedatalist.some(item => (val === item.productid));
}
public _balanceQuantityChange = idx => e => {
this.setState({ mandatory: true,error: false });
this.Balance = [...this.state.balancedatalist];
let extension = /^[0-9]+$/;
if (e.target.value.match(extension)) {
this.Balance[idx] = ({
productname: this.state.balancedatalist[idx].productname,
productid: this.state.balancedatalist[idx].productid,
balanceStock: e.target.value,
balanceid: this.state.balancedatalist[idx].balanceid,
ErrorMessage: ""
});
} else {


this.Balance[idx] = ({
productname: this.state.balancedatalist[idx].productname,
productid: this.state.balancedatalist[idx].productid,
balanceStock: e.target.value,
balanceid: this.state.balancedatalist[idx].balanceid,
ErrorMessage: "Enter a valid number"
});
this.setState({ error: true });

}

this.setState({ balancedatalist: this.Balance });

}
public updateData = async () => {
console.log(this.Balance);
this.setState({ mandatory: true });
let batch = sp.web.createBatch();
let list = sp.web.lists.getByTitle("Balance Stock");

const entityTypeFullName = await list.getListItemEntityTypeFullName();
if (this.state.error == true) {
// this.setState({ mandatory: false });
}

else {
for (let i = 0; i < this.state.balancedatalist.length; i++) {

await this.upsert(batch, this.state.balancedatalist[i].balanceStock, this.state.balancedatalist[i].balanceid, this.state.balancedatalist[i].productid, this.state.toDate, this.state.remarks, this.state.routeId, this.state.dealerId);
}
await batch.execute();

let data = this.state.balancedatalist.filter((item) => item.productname == "Refill Cylinder");
if(data.length > 0)
{
  console.log("Refill Cylinder "+data[0].balanceStock)
  var param= new FormData();
  param.append('dealer_id',this.state.dealer_website_id)
  param.append('stock',data[0].balanceStock)
        const requestOptions1 = {
          method: 'POST',
          // headers: { 'Content-Type': 'application/json' },
          body: param
      };
     await fetch('https://mrbutlers.com/find_dealer/update_stock.php', requestOptions1)
          .then(response => response.json())
          .then((data) =>{
            console.log(data)
       if(data.message==true )
       {
         alert("Balance Stock updated successfully and Refill Cylinder quantity updated in Website")
       }
           })
          .catch((error) => {
                   console.log(error);
                 });
  
  console.log("Done");
 
}
else
{
  alert("Balance Stock updated successfully");
}
window.location.href = window.location.href = "https://mrbutlers.sharepoint.com/sites/SalesOfficerApplication/SitePages/Checkin-Checkout.aspx?dealerId=" + this.state.dealerId + "&RouteId=" + this.state.routeId + "&checkin=0"+"&dealer_website_id="+this.state.dealer_website_id;
}
}
private async upsert(batch, balanceStock, balanceid, productid, toDate, remarks, routeid, dealerid) {

if (balanceid == 0) {

sp.web.lists.getByTitle("Balance Stock").items.inBatch(batch).add({

Title: balanceStock,
ProductNameId: productid,
Date: toDate,
Remarks: remarks,
DealerNameId: dealerid,
RouteId: routeid

});
}
else {

sp.web.lists.getByTitle("Balance Stock").items.inBatch(batch).getById(balanceid).update({
Title: balanceStock,
ProductNameId: productid,
Date: toDate,
Remarks: remarks,
DealerNameId: dealerid,
RouteId: routeid
});
}

}

public render(): React.ReactElement<IBalanceStockProps> {

const EditIcon: IIconProps = { iconName: 'Edit' };
const DeleteIcon: IIconProps = { iconName: 'Delete' };
return (

<div className={styles.balanceStockDiv}>
<h2 className={styles.heading}>Balance Stock Update</h2>
<div hidden={this.state.mandatory}><Label style={{ color: "red" }}>Please fill all mandatory fields</Label></div>
<table>
<tr><th><Label>Date</Label></th><td> <DatePicker id="DueDate"
formatDate={(date) => moment(date).format('DD MMM YYYY')}
value={new Date()}
disabled={true}
/></td></tr>
</table>
<table>
<tr>
<th><Label >Product Name</Label></th>
<th><Label >Balance Stock </Label></th>
</tr>
<tbody style={{ width: '100%', borderCollapse: 'collapse' }}>
{
this.state.balancedatalist.map((item, idx) => {

return <tr style={{ backgroundColor: '#f2f2f2' }}>

<td style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>{item.productname}</td>
<td style={{ border: '1px solid #ddd', padding: '5px', borderCollapse: 'collapse' }}>
< TextField id="balaQuantity" errorMessage={item.ErrorMessage} value={item.balanceStock} onChange={this._balanceQuantityChange(idx)}>
</TextField></td>

</tr>;

})
}
</tbody>
</table>
<p><Label >Remarks</Label>
< TextField value={this.state.remarks} onChange={this.remarkschange} multiline ></TextField></p>
<br></br>
<td><PrimaryButton id="Update" text="Update" onClick={this.updateData} style={{ width: "100px", marginLeft: "1px", marginBottom: "5px" }} /></td>
<td><PrimaryButton id="Cancel" style={{ width: "100px" }} text="Cancel" onClick={this.cancel} /></td>
</div>
);
}
}