import React, { ReactNode, ReactNodeArray } from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';

import {
  ConfiguratorPage,
  ConfiguratorActions,
  ConfiguratorSummary,
  PhasedConfiguratorProvider,
} from './configurator';
import { ConfiguratorProvider } from './configurator/ConfiguratorContext';
import { PricingPage, PricingActions, PricingSummary } from './pricing';
import {
  ProductDetailsPage,
  ProductDetailsActions,
  ProductDetailsSummary,
} from './details';
import { usePackageInfo, useProductInfo } from '../api/package-info';
import { PackageResponse, ProductResponse } from '../api/types/packages';
import { DebugConsole } from './configurator/components/DebugConsole';
import { Page, Header, Content, Footer } from '../components/Page';

type ProductSummaryContextType = {
  productId?: string;
  productInfo?: ProductResponse;
  packageInfo?: PackageResponse;
};

export const ProductSummaryContext = React.createContext<ProductSummaryContextType>(
  {}
);

export type ProductSummaryProps = {
  productId: string;
  actions: ReactNode;
  summary: ReactNode;
};

export function ProductModelPage() {
  const { productId } = useParams<{ productId: string }>();
  const { path } = useRouteMatch();

  const {
    data: productInfo,
    error: errorProductInfo,
    loading: loadingProductInfo,
  } = useProductInfo(productId);
  const {
    data: packageInfo,
    error: errorPackageInfo,
    loading: loadingPackageInfo,
  } = usePackageInfo();

  if (errorProductInfo || errorPackageInfo) {
    return <div>ERROR</div>;
  }

  if (
    loadingPackageInfo ||
    loadingProductInfo ||
    !productInfo ||
    !packageInfo
  ) {
    return null;
  }

  const initialView = productInfo?.views?.find((v) => v.default)?.id;
  const initialLanguage = packageInfo?.languages?.find((l) => l.default)?.id;

  return (
    <Page>
      <ProductSummaryContext.Provider
        value={{ productId, productInfo, packageInfo }}
      >
        <Switch>
          {pages.map((page) => {
            const routePath = page.path(path);
            return (
              <Route path={routePath} key={routePath}>
                <page.provider
                  productId={productId}
                  initialLanguage={initialLanguage}
                  initialView={initialView}
                >
                  <Header>
                    <div className="flex w-full">
                      <div className="flex-1">
                        <h1 className="h1">{productId}</h1>
                        <div className="hidden md:block pt-2">
                          <page.summary />
                        </div>
                      </div>
                      <div className="flex-initial">
                        <page.actions />
                      </div>
                    </div>
                  </Header>
                  <Content>
                    <page.content />
                  </Content>
                  <Footer>{/* <DebugConsole /> */}</Footer>
                </page.provider>
              </Route>
            );
          })}
        </Switch>
      </ProductSummaryContext.Provider>
    </Page>
  );
}

const pages = [
  {
    path: (path: string) => `${path}/configurator`,
    summary: ConfiguratorSummary,
    actions: ConfiguratorActions,
    content: ConfiguratorPage,
    provider: PhasedConfiguratorProvider,
  },
  {
    path: (path: string) => `${path}/pricing`,
    summary: PricingSummary,
    actions: PricingActions,
    content: PricingPage,
    provider: ({ children }: { children: ReactNode }) => <>{children}</>,
  },
  {
    path: (path: string) => `${path}`,
    summary: ProductDetailsSummary,
    actions: ProductDetailsActions,
    content: ProductDetailsPage,
    provider: ({ children }: { children: ReactNode }) => <>{children}</>,
  },
];
