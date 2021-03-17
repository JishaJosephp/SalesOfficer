import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IUserCreateFormProps {
    onClose: () => void;
    isOpen: boolean;
    paneltype: any;
    id: any;
    context:any|null;
    name:any;
    agenum:any;
    permanentaddress:any;
    mobnum:any;
    email:any;
    idtype:any;
    idnumber:any;
    selectedstate:any;
    selecteddistrict:any;
    UserNameId:any;
    UserType:any;
}