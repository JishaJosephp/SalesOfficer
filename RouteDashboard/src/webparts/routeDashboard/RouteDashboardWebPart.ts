import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RouteDashboardWebPartStrings';
import RouteDashboard from './components/RouteDashboard';
import { IRouteDashboardProps } from './components/IRouteDashboardProps';
import { sp } from "@pnp/sp/presets/all";

export interface IRouteDashboardWebPartProps {
  NoOfDays: number;
}

export default class RouteDashboardWebPart extends BaseClientSideWebPart<IRouteDashboardWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then((_) => {
      // other init code may be present
   
      sp.setup({
        spfxContext: this.context,
      });
    });
   }

  public render(): void {
    const element: React.ReactElement<IRouteDashboardProps> = React.createElement(
      RouteDashboard,
      {
        NoOfDays: this.properties.NoOfDays
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('NoOfDays', {
                  label: "Number of days"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
