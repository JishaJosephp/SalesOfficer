export interface IDealerProps {
    onClose: () => void;

    isOpen: boolean;
    paneltype: any;
    dismissPanel: () => void;
    itemidprops: number;
    listId: string;
    context: any | null;
    Permanentdealerprops:any;
    Districtprops: any;
    DealerNameprops: any;
    ContactNumberprops: any;
    Locationprops: any;
    Coordinatesprops: any;
    Addressprops: any;
    stateprops: any;
    locationoptionprops: any;
    districtoptionprops: any;


}