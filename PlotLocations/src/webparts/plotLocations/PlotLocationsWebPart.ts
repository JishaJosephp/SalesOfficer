import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PlotLocationsWebPartStrings';
import PlotLocations from './components/PlotLocations';
import { IPlotLocationsProps } from './components/IPlotLocationsProps';
import { sp } from "@pnp/sp/presets/all";

export interface IPlotLocationsWebPartProps {
  description: string;
  
}

export default class PlotLocationsWebPart extends BaseClientSideWebPart<IPlotLocationsWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then((_) => {
      // other init code may be present
   
      sp.setup({
        spfxContext: this.context,
      });
    });
   }

  public render(): void {
    const element: React.ReactElement<IPlotLocationsProps> = React.createElement(
      PlotLocations,
      {
        description: this.properties.description,
        
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
