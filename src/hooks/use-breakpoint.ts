import { baseTheme } from 'themes';

type TDeviceSlugs = 'mobile' | 'desktop' | 'tablet' | 'verticalTablet' | 'largeDesktop';

export const QueryMapping: Record<TDeviceSlugs, string> = {
  desktop: baseTheme.breakpoints.up('md'), // x > 768px
  tablet: baseTheme.breakpoints.down(1027), // 768px < x < 1027px
  mobile: baseTheme.breakpoints.down('md'), // 0 < x < 768px
  verticalTablet: baseTheme.breakpoints.up('lg'),
  largeDesktop: baseTheme.breakpoints.up('xl'),
};
