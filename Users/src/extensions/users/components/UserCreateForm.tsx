import * as React from 'react';
import { IUserCreateFormProps } from './IUserCreateFormProps';
import { Panel,Label,TextField, PanelType,DialogFooter,PrimaryButton, IPanelProps,Dropdown,IDropdownStyles,IDropdownOption } from "office-ui-fabric-react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users/web";
import * as _ from 'lodash';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
export interface IPeoplepickerdata {
    id: any;
    text: any;
    email:any;
}
export interface ICustomPanelState {
  
    selecteddistrict: any;
    selectedstate: any;
    usertype:any;
    moberrormsg: any;
    emailerrormsg: any;
    ageerrormsg:any;
    mobnum: any;
    permanentaddress: any;
    name: any;
    idtype:any;
    idnumber:any;
    agenum:any;
    state: any[];
    district: any[];
    hidesales:boolean;
    setusername: string;
    usernameid: any;
    mandatory: boolean;
    useremail:any;
}
export default class UserCreateForm extends React.Component<IUserCreateFormProps, any> {
    private mobflag: any;
    private emailflag: any;
    private agenoflag:any;
    private usernamecheck: any;

    constructor(props: IUserCreateFormProps) {
        super(props);
        // sp.setup({
        //     spfxContext: this.props.context
        //   });
        this.state = {
           
            state: [],
            district: [],
            selecteddistrict: "",
            selectedstate: "",
            moberrormsg: "",
            emailerrormsg: "",
            ageerrormsg:"",
            permanentaddress: "",
            name:"",
            idtype:"",
            idnumber:"",
            mobnum: "",
            agenum:"",
            usertype:"",
            hidesales:true,
            setusername: "",
            usernameid: "",
            useremail:"",
            mandatory:true
        };
        this.districtChanged = this.districtChanged.bind(this);
        this.stateChanged = this.stateChanged.bind(this);
    }
    public async componentDidMount() {
       
        const stateitems: any[] = await sp.web.lists.getByTitle("StateData").items.select("ID,website_id,state").getAll();
        let statearray = [];
        let sorted_State = [];
        for (let i = 0; i < stateitems.length; i++) {

            let statedata = {
                key: stateitems[i].ID,
                text: stateitems[i].state
            };
            statearray.push(statedata);

        }
        console.log(statearray);
        sorted_State = _.orderBy(statearray, 'text', ['asc']);
        // _.orderBy(chars, 'name', 'asc');
    
        this.setState({
            state: sorted_State
        });
    

    }
    public save = async () => {
        // let name = ((document.getElementById("name") as HTMLInputElement).value);
        // console.log(name);
        this.setState({ mandatory: true });  
        console.log(this.state.name);
        console.log(this.state.agenum);
        console.log(this.state.permanentaddress);
        console.log(this.state.mobnum);
        console.log(this.state.email);
        console.log(this.state.selectedstate);
        console.log(this.state.selecteddistrict);
        console.log(this.state.idtype);
        console.log(this.state.idnumber);
        console.log(this.state.usertype);
        console.log(this.state.usernameid);
        if(this.state.usertype == "Sales" ){
            if (this.state.name == "" || this.state.mobnum == "" || this.state.email == "" 
            || this.state.usernameid == "" || this.state.usernameid == undefined || this.state.idnumber == ""
            || this.state.selectedstate == "" || this.state.selecteddistrict == ""||this.state.idtype == ""
            || this.state.usertype == "" || this.state.permanentaddress == "" || this.state.agenum == ""
            || this.agenoflag == 0 ||this.mobflag == 0||this.emailflag == 0){
                this.setState({ mandatory: false });  
            }
            else{
                let conf = confirm("Do you want to submit?");
                if (conf == true) {
        
                    sp.web.lists.getByTitle("Users").items.add({
        
                        Title: this.state.name,
                        Age: this.state.agenum,
                        Address: this.state.permanentaddress,
                        ContactNumber: this.state.mobnum,
                        EmailId: this.state.email,
                        DistrictId: this.state.selecteddistrict,
                        StateId: this.state.selectedstate,
                        IDType:this.state.idtype,
                        IDNumber:this.state.idnumber,
                        UserType:this.state.usertype,
                        UserNameId: this.state.usernameid,
                        UserNamee:this.state.setusername
                    });
                   
                        this._onCancel();
                }
            }
        }
        if(this.state.usertype == "Admin"){
            if (this.state.name == "" || this.state.mobnum == ""||this.mobflag == 0 
            || this.state.email == "" || this.emailflag == 0
            || this.state.usernameid == "" || this.state.usernameid == undefined 
            || this.state.usertype == ""){
                this.setState({ mandatory: false });  
            }
            else{
                let conf = confirm("Do you want to submit?");
                if (conf == true) {
        
                    sp.web.lists.getByTitle("Users").items.add({
        
                        Title: this.state.name,
                        ContactNumber: this.state.mobnum,
                        EmailId: this.state.email,
                        UserType:this.state.usertype,
                        UserNameId: this.state.usernameid,
                        UserNamee:this.state.setusername
                    });
                    // const groups = await sp.web.siteGroups();
                    // console.log(groups);
                   
                    //     const users = await sp.web.siteUsers;
                    //     console.log(users);
                    //     var loginmaill=this.state.useremail;
                    //     var maill =loginmaill;
                    //     try{
                    //     sp.web.siteGroups.getByName("HOAdmin").users
                    //     .add("i:0#.f|membership|"+maill).then(function(d){
                    //         console.log(d);
                    //     });
                    // }
                    // catch{}
                        this._onCancel();
                }
            }
        }
       
        
    }
    private _namechange = (ev: React.FormEvent<HTMLInputElement>, newfname?: string) => {
        this.setState({ 
            name: newfname || '',
            mandatory: true
     });
    }
    private _agechange = (ev: React.FormEvent<HTMLInputElement>, age?: any) => {
        this.setState({ agenum: age || '' });
        let extension = /^[0-9]+$/;
        if (age.match(extension)) {
            this.setState({ ageerrormsg: '' });
            this.agenoflag = 1;
        } else {
            this.setState({ ageerrormsg: 'Please enter a valid number' });
            this.agenoflag = 0;
        }

    }
    private _onaddress1change = (ev: React.FormEvent<HTMLInputElement>, padress?: any) => {
        this.setState({ 
            permanentaddress: padress || '',
            mandatory: true
    });
    }
    private _onmobchange = (ev: React.FormEvent<HTMLInputElement>, mob?: any) => {
        this.setState({ mobnum: mob || '' });
        let mnum = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        let mnum2 = /^(\+\d{1,3}[- ]?)?\d{11}$/;
        //let mnum = /^(\+\d{1,3}[- ]?)$/;
        if (mob.match(mnum) || mob.match(mnum2)) {
            this.setState({ moberrormsg: '' });
            this.mobflag = 1;
        } else {
            this.setState({ moberrormsg: 'Please enter a valid mobile number' });
            this.mobflag = 0;
        }
    }
    private _onemailchange = (ev: React.FormEvent<HTMLInputElement>, email?: any) => {
        this.setState({ email: email || '' });
        let emailformat = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;


        if (email.match(emailformat)) {
            this.setState({ emailerrormsg: '' });
            this.emailflag = 1;
        }
        else {

            this.setState({ emailerrormsg: 'Enter a valid email' });
            this.emailflag = 0;
        }



    }
    public async stateChanged(option: { key: any; text: any }) {
        console.log(option.key);
         this.setState({ selectedstate: option.key });
        // console.log(this.state.selectedstate);
         const items: any[] = await sp.web.lists.getByTitle("DistrictData").items.select("ID,district,website_id").filter(" state_id eq " + option.key).get();
         console.log(items);

         let sorted_District = [];
         let filtereddistrict = [];
         for (let i = 0; i < items.length; i++) {


             let districtdata = {
                 key: items[i].ID,
                 text: items[i].district
             };


             filtereddistrict.push(districtdata);
         }
         sorted_District = _.orderBy(filtereddistrict, 'text', ['asc']);
             this.setState({
             district: sorted_District
         });
    }
    public districtChanged(option: { key: any; }) {
        console.log(option.key);
         this.setState({ selecteddistrict: option.key });
        // console.log(this.state.selecteddistrict);
    }
    private _idtypechange = (ev: React.FormEvent<HTMLInputElement>, idtype?: string) => {
        this.setState({ idtype: idtype || '' });
    }
    private _idnumberchange = (ev: React.FormEvent<HTMLInputElement>, idnumber?: string) => {
        this.setState({ idnumber: idnumber || '' });
    }
    public usertypeChanged(option: { key: any; }) {
        console.log(option.key);
        if(option.key == "Sales"){
            this.setState({ 
                usertype: option.key,
                hidesales:false 
            });
        }
        else{
            this.setState({ 
                usertype: option.key,
                hidesales:true 
            });
        }
        
        // console.log(this.state.selecteddistrict);
    }
    private _Approver = (items: any[]) => {

        console.log(items);
        let getSelectedUsers: IPeoplepickerdata[] = [];
        for (let item in items) {
            getSelectedUsers.push({
                id: items[item].id,
                text: items[item].text,
                email: items[item].secondaryText
            });
        }
        if (getSelectedUsers.length != 0) {
            console.log(getSelectedUsers);
            this.setState({ usernameid: getSelectedUsers[0].id });
            console.log(this.state.usernameid);
            this.setState({ setusername: getSelectedUsers[0].text });
            console.log(this.state.setusername);
            this.setState({useremail:getSelectedUsers[0].email});
            this.usernamecheck = 1;
        }
        else {
            this.usernamecheck = 0;
            this.setState({ usernameid: "" });
            this.setState({ setusername: "" });

        }


    }
    public render(): React.ReactElement<IUserCreateFormProps> {

        // const filterOptions = createFilterOptions({
        //     matchFrom: 'start'
          
        //   });
        // let { isOpen, currentTitle, onClose, dismissPanel } = this.props;
        const UserType: IDropdownOption[] = [

            { key: 'Sales', text: 'Sales' },
            { key: 'Admin', text: 'Admin' },

        ];
        let { isOpen } = this.props;
        return (
            <Panel isOpen={isOpen} type={PanelType.medium} onDismiss={this._onCancel} >

                <h2>CREATE USERS</h2>
                <div>
                <div hidden={this.state.mandatory}><Label style={{ color: "red" }}>Please fill all mandatory fields</Label></div>
                <p><Label >Name </Label>
                < TextField required 
                        id="name" 
                        value={this.state.name} 
                        onChange={this._namechange} 
                        ></TextField>
                        
                        </p>

                <p><Label >Contact Number </Label>
                < TextField id="mob" required={true}
                                onChange={this._onmobchange} 
                                value={this.state.mobnum}
                                errorMessage={this.state.moberrormsg}
                     ></TextField></p>
                <p><Label >Email Id </Label>
                < TextField  id="email" required
                            onChange={this._onemailchange}
                            value={this.state.email}
                            errorMessage={this.state.emailerrormsg}
                   ></TextField></p>
                   <p><Label >User Name* </Label>
                    <PeoplePicker 
                            context={this.props.context}
                            personSelectionLimit={3}
                            groupName={""} // Leave this blank in case you want to filter from all users    
                            showtooltip={true}
                            required={true}
                            disabled={false}
                            ensureUser={true}
                            onChange={this._Approver}
                            //selectedItems={this._Approver}
                            showHiddenInUI={false}
                            defaultSelectedUsers={[this.state.setusername]}
                            principalTypes={[PrincipalType.User]}
                            resolveDelay={1000} /></p>
                    <Label >User Type</Label>
                <Dropdown id="usertype" required={true}
                            placeholder="Select an option"
                            options={UserType}
                            //onChanged={this.usertypeChanged}
                            onChanged={(option) => this.usertypeChanged(option)}
                            
                        />
                </div>
                <div id ="sales" hidden = {this.state.hidesales}>
                <p><Label >Age: </Label>
                < TextField  id="age"  required 
                    value={this.state.agenum} 
                    onChange={this._agechange} 
                    errorMessage={this.state.ageerrormsg}
                ></TextField></p>
                <p><Label >Address:</Label>
                < TextField  id="address" required 
                            value={this.state.permanentaddress} 
                            onChange={this._onaddress1change}
                            multiline  
                        ></TextField></p>
                <Label >State</Label>
                {/* <Autocomplete
      id="combo-box-demo"
      options={this.state.state.map((option) => option.district)}
      filterOptions={filterOptions}
      //getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Sales Team" variant="outlined" />}
    /> */}
                <Dropdown id="state" required={true}
                            placeholder="Select an option"
                            options={this.state.state}
                            onChanged={this.stateChanged}
                            selectedKey={this.state.selectedstate}
                        />
                <Label >District</Label>
                <Dropdown id="district" required={true}
                            placeholder="Select an option"
                            options={this.state.district}
                            onChanged={this.districtChanged}
                            selectedKey={this.state.selecteddistrict}
                        /> 
                
                <p><Label >ID Type: </Label>
                < TextField required 
                        id="idtype" 
                        value={this.state.idtype} 
                        onChange={this._idtypechange} 
                        ></TextField></p>
                <p><Label >ID Number: </Label>
                < TextField required 
                        id="name" 
                        value={this.state.idnumber} 
                        onChange={this._idnumberchange} 
                        ></TextField></p>
               
                </div> 
                <DialogFooter>
                    <PrimaryButton text="Save" onClick={this.save} />
                    <PrimaryButton text="Cancel" onClick={this._onCancel} />
                </DialogFooter>
            </Panel >

        );
    }
    private _onCancel = () => {
        this.setState({
            
            selecteddistrict: '',
            selectedstate: '',
            moberrormsg: '',
            emailerrormsg: '',
            ageerrormsg:'',
            permanentaddress: '',
            name:'',
            idtype:'',
            idnumber:'',
            mobnum: '',
            agenum:'',
            usertype:'',
            hidesales:true,
            setusername: '',
            usernameid: '',
            useremail:'',
            email:'',
            mandatory:true


        });
        // console.log("errorr..........................")
        this.props.onClose();
    }
}