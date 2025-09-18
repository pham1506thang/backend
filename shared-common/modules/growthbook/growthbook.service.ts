import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { GrowthBook } from '@growthbook/growthbook';

@Injectable()
export class GrowthBookService implements OnModuleInit {
  // private growthbook: GrowthBook;

  constructor(private configService: ConfigService) {
    // Temporarily disabled GrowthBook integration
    // this.growthbook = new GrowthBook({
    //   apiHost: this.configService.get<string>('GROWTHBOOK_API_HOST'),
    //   clientKey: this.configService.get<string>('GROWTHBOOK_CLIENT_KEY'),
    //   enableDevMode: process.env.NODE_ENV !== 'production',
    // });
    // const tenantId =
    //   this.configService.get<string>('GROWTHBOOK_TENANT_ID') ?? '';
    // this.growthbook.setAttributes({ tenantId });
  }

  async onModuleInit() {
    // Load features from GrowthBook API
    // await this.growthbook.init();
  }

  getEnabledFeatures(): string[] {
    // const features = this.growthbook.getFeatures();
    // const enabled: string[] = [];

    // for (const key of Object.keys(features)) {
    //   if (this.growthbook.isOn(key)) {
    //     enabled.push(key);
    //   }
    // }

    // return enabled;
    return [];
  }

  isFeatureEnabled(featureKey: string): boolean {
    // return this.growthbook.isOn(featureKey);
    return false;
  }
}
