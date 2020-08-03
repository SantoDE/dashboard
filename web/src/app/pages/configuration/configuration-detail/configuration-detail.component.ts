import { Component, OnInit } from '@angular/core';
import { DaprConfiguration } from 'src/app/types/types';
import { ConfigurationsService } from 'src/app/configurations/configurations.service';
import { ActivatedRoute } from '@angular/router';
import * as yaml from 'js-yaml';
import { ThemeService } from 'src/app/theme/theme.service';
import { YamlViewerOptions } from 'src/app/types/types';

@Component({
  selector: 'app-configuration-detail',
  templateUrl: './configuration-detail.component.html',
  styleUrls: ['./configuration-detail.component.scss']
})
export class ConfigurationDetailComponent implements OnInit {

  private name: string;
  public configuration: any;
  public configurationMetadata: string | object;
  public configurationDeployment: string | object;
  public options: YamlViewerOptions;
  public loadedConfiguration: boolean;

  constructor(
    private route: ActivatedRoute,
    private configurationsService: ConfigurationsService,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.params.name;
    this.getConfiguration(this.name);
    this.options = {
      folding: true,
      minimap: { enabled: true },
      readOnly: false,
      language: 'yaml',
      theme: this.themeService.getTheme().includes('dark') ? 'vs-dark' : 'vs',
    };
    this.themeService.themeChanged.subscribe((newTheme: string) => {
      this.options = {
        ...this.options,
        theme: newTheme.includes('dark') ? 'vs-dark' : 'vs',
      };
    });
  }

  getConfiguration(name: string): void {
    this.configurationsService.getConfiguration(name).subscribe((data: DaprConfiguration) => {
      this.configuration = data;
      this.configurationDeployment = yaml.safeDump(data);
      this.configurationMetadata = yaml.safeDump(data.spec);
      this.loadedConfiguration = true;
    });
  }
}
