import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RouteApprovalWebPartStrings';
import RouteApproval from './components/RouteApproval';
import { IRouteApprovalProps } from './components/IRouteApprovalProps';
import { sp } from '@pnp/sp';

export interface IRouteApprovalWebPartProps {
  description: string;
}

export default class RouteApprovalWebPart extends BaseClientSideWebPart <IRouteApprovalWebPartProps> {
  public async onInit(): Promise<void> {
    return super.onInit().then(_ => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context,
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<IRouteApprovalProps> = React.createElement(
      RouteApproval,
      {
        description: this.properties.description
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
