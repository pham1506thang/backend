import { SetMetadata } from '@nestjs/common';

export const CONTROLLER_FEATURE_KEY = 'controller-feature';
export const ControllerFeature = (featureKey: string) =>
  SetMetadata(CONTROLLER_FEATURE_KEY, featureKey);
