export interface AppError extends Error {
  status?: number;
}
export interface TokenTag {
  label: string;
  address_hash: string;
  display_name: string;
}

export interface TokenTags {
  private_tags: any[];
  public_tags: TokenTag[];
  watchlist_names: string[];
}

export interface NextPageParams {
  contract_address_hash: string;
  fiat_value: string | null;
  holder_count: number;
  is_name_null: boolean;
  items_count: number;
  market_cap: string | null;
  name: string;
}

export interface ExplorerResponse {
  items: TokenItem[];
  next_page_params?: {
    contract_address_hash: string;
    items_count: number;
  };
}

export interface TokenItem {
  address: string;
  circulating_market_cap: string | null;
  decimals: string | null;
  exchange_rate: string | null;
  holders: string;
  icon_url: string | null;
  name: string | null;
  symbol: string | null;
  type: string;
}