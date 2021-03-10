import * as React from 'react';
import styles from './RouteApproval.module.scss';
import { IRouteApprovalProps } from './IRouteApprovalProps';
import * as moment from 'moment';
import { escape } from '@microsoft/sp-lodash-subset';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownProps, IDropdownStyles, } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, DefaultButton, Label, PrimaryButton, DialogFooter, Panel, Spinner, SpinnerType, PanelType, IPanelProps } from "office-ui-fabric-react";
export interface IApprovalState {
  firstDayOfWeek?: DayOfWeek;
}
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
export default class RouteApproval extends React.Component<IRouteApprovalProps,IApprovalState, {}> {
 
  public constructor(props: IRouteApprovalProps, state: IApprovalState) {

    super(props);
    this.state = {

    }
  }
  public render(): React.ReactElement<IRouteApprovalProps> {
    const { firstDayOfWeek } = this.state;
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
                <td><b> Requestor :</b></td>
                <td>Name</td>
              </tr>
              <tr>
                <label><b>Route Plan Submission Date</b></label>
              </tr>
              <tr><td>
                <DatePicker //style={{ width: '1000px' }}
                    //className={controlClass.control}
                    firstDayOfWeek={firstDayOfWeek}
                    strings={DayPickerStrings}
                  
                    placeholder="Select a date..."
                    ariaLabel="Select a date"
                    formatDate={(date) => moment(date).format('DD/MM/YYYY')} 
                    isRequired={true}
                   
                />
                </td>
                
                <td>
                               
                <Dropdown id="time" required={true}
                            placeholder="--"
                            options={hour}
                            styles={dropdownStyles}
                            
                            
                        /></td>
                        <td>
                        <Dropdown id="time2" required={true}
                            placeholder="--"
                            options={min}
                            styles={dropdownStyles}
                           
                            
                        /></td>
                        </tr>
                </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
