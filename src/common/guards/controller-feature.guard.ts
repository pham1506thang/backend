import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GrowthBookService } from '../../modules/growthbook/growthbook.service';
import { CONTROLLER_FEATURE_KEY } from '../decorators/controller-feature.decorator';

@Injectable()
export class ControllerFeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private growthBookService: GrowthBookService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const featureKey = this.reflector.get<string>(
      CONTROLLER_FEATURE_KEY,
      context.getClass(),
    );

    if (!featureKey) {
      return true; // If no feature key is specified, allow access
    }

    // Check if the feature is enabled
    const isEnabled = this.growthBookService.isFeatureEnabled(featureKey);

    if (!isEnabled) {
      throw new ForbiddenException(`Feature ${featureKey} is not enabled`);
    }

    return true;
  }
}
