import { BIZ_PROVIDER } from "./services/biz";
import { USER_PROVIDER } from "./services/user";
import { BIZ_USER_PROVIDER } from "./services/biz-user";
import { PAYMENT_METHOD_PROVIDER } from "./services/payment-method";
import { CUST_PROVIDER } from "./services/cust";
import { COUNTRY_PROVIDER } from "./services/country";
import { PROVINCE_PROVIDER } from "./services/province";
import { DISTRICTS_PROVIDER } from "./services/districts";
import { TOWN_PROVIDER } from "./services/town";
import { LANGUAGE_PROVIDER } from "./services/language";
import { STATUS_TYPE_PROVIDER } from "./services/status-type";
import { STATUS_PROVIDER } from "./services/status";
import { TITLE_PROVIDER } from "./services/title";
import { DATA_TYPE_PROVIDER } from "./services/data-type";
import { PD_PROVIDER } from "./services/pd";
import { WH_STORAGE_PROVIDER } from "./services/wh-storage";
import { PD_STORAGE_PROVIDER } from "./services/pd-storage";
import { CREDIT_TERM_PROVIDER } from "./services/credit-term";
import { UOM_PROVIDER } from "./services/uom";
import { TAX_PROVIDER } from "./services/tax";
import { CUST_GROUP_PROVIDER } from "./services/cust-group";
import { SUPP_GROUP_PROVIDER } from "./services/supp-group";
import { PD_CUST_PROVIDER } from "./services/pd-cust";
import { SKILL_PROVIDER } from "./services/skill";
import { BIZ_USER_GRP_PROVIDER } from "./services/biz-user-grp";
import { BIZ_USER_ROLE_PROVIDER } from "./services/biz-user-role";
import { DOC_ARIV_PROVIDER } from "./services/doc-ariv";
import { DISC_GROUP_PROVIDER } from "./services/disc-group";
import { DOC_PO_PROVIDER } from "./services/doc-po";
import { REF_DOC_PROVIDER } from "./services/ref-doc";
import { CHEQUE_DISBURSED_PROVIDER } from "./services/cheque-disbursed";
import { BANK_PROVIDER } from "./services/bank";
import { CHEQUE_RECEIVED_PROVIDER } from "./services/cheque-received";
import { CHEQUE_TYPE_PROVIDER } from "./services/cheque-type";
import { DOC_GRN_PROVIDER } from "./services/doc-grn";
import { DOC_RUNNING_GROUP_PROVIDER } from "./services/doc-running-group";
import { TRANSLATION_OPTION_PROVIDER } from "./services/translation-option";
import { BIZ_LANGUAGE_PROVIDER } from "./services/biz-language";
import { PD_TYPE_PROVIDER } from "./services/pd-type";
import { PD_GROUP_PROVIDER } from "./services/pd-group";
import { DOC_GIN_PROVIDER } from "./services/doc-gin";
import { DATA_FORM_CONFIG_PROVIDER } from "./services/data-form-config";
import { PD_UOM_PROVIDER } from "./services/pd-uom";
import { DOC_IVA_PROVIDER } from "./services/doc-iva";
import { DOC_APIV_PROVIDER } from "./services/doc-apiv";
import { DOC_POS_PROVIDER } from "./services/doc-pos";
import { CURRENCY_PROVIDER } from "./services/currency";
import { PD_BAL_PROVIDER } from "./services/pd-bal";
import { PD_STORAGE_BAL_PROVIDER } from "./services/pd-storage-bal";
import { DOC_SHIP_PROVIDER } from "./services/doc-ship";
import { POS_DEVICE_PROVIDER } from "./services/pos-device";
import { BRANCH_PROVIDER } from "./services/branch";
import { PD_CATE_PROVIDER } from "./services/pd-cate";
import { PD_SUBCATE_PROVIDER } from "./services/pd-subcate";
import { PRICE_GROUP_PROVIDER } from "./services/price-group";
import { PRICE_BOOK_PROVIDER } from "./services/price-book";
import { PRICE_BOOK_ITEM_PROVIDER } from "./services/price-book-item";
import { PRICE_BOOK_CASCADE_PROVIDER } from "./services/price-book-cascade";
import { CATE_PROVIDER } from "./services/cate";
import { SUBCATE_PROVIDER } from "./services/subcate";
import { DOC_ARC_PROVIDER } from "./services/doc-arc";
import { DOC_ARC_ITEM_PROVIDER } from "./services/doc-arc-item";
import { PERIOD_PROVIDER } from "./services/period";
import { RTP_PROVIDER } from "./services/rtp";
import { COUNTRY_TRANSLATION_OPTION_PROVIDER } from "./services/country-translation-option";
import { BIZ_TRANSLATION_OPTION_PROVIDER } from "./services/biz-translation-option";
import { APP_MENU_PROVIDER } from "./services/app-menu";
import { USER_TOKEN_PROVIDER } from "./services/user-token";
import { ASSET_PROVIDER } from "./services/asset";
import { ASSET_STORAGE_PROVIDER } from "./services/asset-storage";
import { APP_TYPE_PROVIDER } from "./services/app-type";
import { SUPP_PROVIDER } from "./services/supp";
import { PD_SUPP_PROVIDER } from "./services/pd-supp";
import { DOC_SO_PROVIDER } from "./services/doc-so";
import { DELIVERY_METHOD_PROVIDER } from "./services/delivery-method";
import { RENTAL_TYPE_PROVIDER } from "./services/rental-type";
import { PAYMENT_CONDITION_PROVIDER } from "./services/payment-condition";
import { BRAND_PROVIDER } from "./services/brand";
import { COLOR_PROVIDER } from "./services/color";
import { DOC_CDJ_PROVIDER } from "./services/doc-cdj";
import { EXPENSE_PROVIDER } from "./services/expense";
import { REVENUE_PROVIDER } from "./services/revenue";
import { DOC_CRJ_PROVIDER } from "./services/doc-crj";
import { DOC_ARR_PROVIDER } from "./services/doc-arr";
import { DOC_NAR_PROVIDER } from "./services/doc-nar";
import { DOC_NAR_ITEM_PROVIDER } from "./services/doc-nar-item";
import { PD_BRANCH_PROVIDER } from "./services/pd-branch";
import { ASSET_BRANCH_PROVIDER } from "./services/asset-branch";
import { DOC_ARR_ITEM_PROVIDER } from "./services/doc-arr-item";
import { DOC_RECEIPT_PROVIDER } from "./services/doc-receipt";
import { BANK_ACCOUNT_TYPE_PROVIDER } from "./services/bank-account-type";
import { BANK_ACCOUNT_PROVIDER } from "./services/bank-account";
import { CARD_TYPE_PROVIDER } from "./services/card-type";
import { PAYMENT_CHANNEL_PROVIDER } from "./services/payment-channel";
import { APP_ROUTE_PROVIDER } from "./services/app-route";
import { PD_ATTRIBUTE_PROVIDER } from "./services/pd-attribute";
import { WH_PROVIDER } from "./services/wh";
import { PD_WH_PROVIDER } from "./services/pd-wh";
import { SALES_CHANNEL_PROVIDER } from "./services/sales-channel";
import { PD_LOT_PROVIDER } from "./services/pd-lot";
import { PD_LOT_STORAGE_PROVIDER } from "./services/pd-lot-storage";
import { PD_SN_PROVIDER } from "./services/pd-sn";
import { DOC_PL_PROVIDER } from "./services/doc-pl";
import { PD_VARIANT_PROVIDER } from "./services/pd-variant";
import { PD_VARIANT_GROUP_PROVIDER } from "./services/pd-variant-group";
import { PD_CUST_STORAGE_PROVIDER } from "./services/pd-cust-storage";
import { PD_SUPP_STORAGE_PROVIDER } from "./services/pd-supp-storage";
import { DOC_DSO_PROVIDER } from "./services/doc-dso";
import { BIZ_ALLOWED_PROVIDER } from "./services/biz-allowed";
import { INV_TRN_PROVIDER } from "./services/inv-trn";
import { APP_MODULE_PROVIDER } from "./services/app-module";
import { DOC_IVT_PROVIDER } from "./services/doc-ivt";
import { DOC_WTW_PROVIDER } from "./services/doc-wtw";
import { DOC_WTR_PROVIDER } from "./services/doc-wtr";
import { ASSET_WH_PROVIDER } from "./services/asset-wh";
import { PD_COST_STACK_PROVIDER } from "./services/pd-cost-stack";
import { WH_STORAGE_TYPE_PROVIDER } from "./services/wh-storage-type";
import { WH_ZONE_PROVIDER } from "./services/wh-zone";
import { WH_AISLE_PROVIDER } from "./services/wh-aisle";
import { WH_RACK_PROVIDER } from "./services/wh-rack";
import { WH_SHELF_PROVIDER } from "./services/wh-shelf";
import { NEIGHBOURHOOD_PROVIDER } from "./services/neighbourhood";
import { DOC_PL_STORAGE_PROVIDER } from "./services/doc-pl-storage";
import { DOC_PL_PD_PROVIDER } from "./services/doc-pl-pd";
import { WH_STAFF_PROVIDER } from "./services/wh-staff";
import { WH_EQM_PROVIDER } from "./services/wh-eqm";
import { WORK_SHIFT_PROVIDER } from "./services/work-shift";
import { DOC_PL_ROUTE_PROVIDER } from "./services/doc-pl-route";
import { DSP_PROVIDER } from "./services/dsp";
import { DOC_PL_WO_PROVIDER } from "./services/doc-pl-wo";
import { DOC_PL_PSTORAGE_PROVIDER } from "./services/doc-pl-pstorage";
import { DOC_PL_PSTORAGE_ITEM_PROVIDER } from "./services/doc-pl-pstorage-item";
import { DOC_PL_OSTORAGE_PROVIDER } from "./services/doc-pl-ostorage";
import { WH_STORAGE_RESTRICTION_PROVIDER } from "./services/wh-storage-restriction";
import { PACKAGING_TYPE_PROVIDER } from "./services/packaging-type";
import { HU_TYPE_PROVIDER } from "./services/hu-type";
import { WH_HU_PROVIDER } from "./services/wh-hu";
import { PD_HU_PROVIDER } from "./services/pd-hu";
import { PD_HU_TYPE_PROVIDER } from "./services/pd-hu-type";
import { SU_TYPE_PROVIDER } from "./services/su-type";
import { PD_SU_TYPE_PROVIDER } from "./services/pd-su-type";
import { WH_SU_PROVIDER } from "./services/wh-su";
import { PD_SU_PROVIDER } from "./services/pd-su";
import { PAYMENT_GATEWAY_PROVIDER } from "./services/payment-gateway";

export const ALL_PROVIDER = [
	...BIZ_PROVIDER,
	...USER_PROVIDER,
	...BIZ_USER_PROVIDER,
	...PAYMENT_METHOD_PROVIDER,
	...CUST_PROVIDER,
	...COUNTRY_PROVIDER,
	...PROVINCE_PROVIDER,
	...DISTRICTS_PROVIDER,
	...TOWN_PROVIDER,
	...LANGUAGE_PROVIDER,
	...STATUS_TYPE_PROVIDER,
	...STATUS_PROVIDER,
	...TITLE_PROVIDER,
	...DATA_TYPE_PROVIDER,
	...PD_PROVIDER,
	...WH_STORAGE_PROVIDER,
	...PD_STORAGE_PROVIDER,
	...CREDIT_TERM_PROVIDER,
	...UOM_PROVIDER,
	...TAX_PROVIDER,
	...CUST_GROUP_PROVIDER,
	...SUPP_GROUP_PROVIDER,
	...PD_CUST_PROVIDER,
	...SKILL_PROVIDER,
	...BIZ_USER_GRP_PROVIDER,
	...BIZ_USER_ROLE_PROVIDER,
	...DOC_ARIV_PROVIDER,
	...DISC_GROUP_PROVIDER,
	...DOC_PO_PROVIDER,
	...REF_DOC_PROVIDER,
	...CHEQUE_DISBURSED_PROVIDER,
	...BANK_PROVIDER,
	...CHEQUE_RECEIVED_PROVIDER,
	...CHEQUE_TYPE_PROVIDER,
	...DOC_GRN_PROVIDER,
	...DOC_RUNNING_GROUP_PROVIDER,
	...TRANSLATION_OPTION_PROVIDER,
	...BIZ_LANGUAGE_PROVIDER,
	...PD_TYPE_PROVIDER,
	...PD_GROUP_PROVIDER,
	...DOC_GIN_PROVIDER,
	...DATA_FORM_CONFIG_PROVIDER,
	...PD_UOM_PROVIDER,
	...DOC_IVA_PROVIDER,
	...DOC_APIV_PROVIDER,
	...DOC_POS_PROVIDER,
	...CURRENCY_PROVIDER,
	...PD_BAL_PROVIDER,
	...PD_STORAGE_BAL_PROVIDER,
	...DOC_SHIP_PROVIDER,
	...POS_DEVICE_PROVIDER,
	...BRANCH_PROVIDER,
	...PD_CATE_PROVIDER,
	...PD_SUBCATE_PROVIDER,
	...PRICE_GROUP_PROVIDER,
	...PRICE_BOOK_PROVIDER,
	...PRICE_BOOK_ITEM_PROVIDER,
	...PRICE_BOOK_CASCADE_PROVIDER,
	...CATE_PROVIDER,
	...SUBCATE_PROVIDER,
	...DOC_ARC_PROVIDER,
	...DOC_ARC_ITEM_PROVIDER,
	...PERIOD_PROVIDER,
	...RTP_PROVIDER,
	...COUNTRY_TRANSLATION_OPTION_PROVIDER,
	...BIZ_TRANSLATION_OPTION_PROVIDER,
	...APP_MENU_PROVIDER,
	...USER_TOKEN_PROVIDER,
	...ASSET_PROVIDER,
	...ASSET_STORAGE_PROVIDER,
	...APP_TYPE_PROVIDER,
	...SUPP_PROVIDER,
	...PD_SUPP_PROVIDER,
	...DOC_SO_PROVIDER,
	...DELIVERY_METHOD_PROVIDER,
	...RENTAL_TYPE_PROVIDER,
	...PAYMENT_CONDITION_PROVIDER,
	...BRAND_PROVIDER,
	...COLOR_PROVIDER,
	...DOC_CDJ_PROVIDER,
	...EXPENSE_PROVIDER,
	...REVENUE_PROVIDER,
	...DOC_CRJ_PROVIDER,
	...DOC_ARR_PROVIDER,
	...DOC_NAR_PROVIDER,
	...DOC_NAR_ITEM_PROVIDER,
	...PD_BRANCH_PROVIDER,
	...ASSET_BRANCH_PROVIDER,
	...DOC_ARR_ITEM_PROVIDER,
	...DOC_RECEIPT_PROVIDER,
	...BANK_ACCOUNT_TYPE_PROVIDER,
	...BANK_ACCOUNT_PROVIDER,
	...CARD_TYPE_PROVIDER,
	...PAYMENT_CHANNEL_PROVIDER,
	...APP_ROUTE_PROVIDER,
	...PD_ATTRIBUTE_PROVIDER,
	...WH_PROVIDER,
	...PD_WH_PROVIDER,
	...SALES_CHANNEL_PROVIDER,
	...PD_LOT_PROVIDER,
	...PD_LOT_STORAGE_PROVIDER,
	...PD_SN_PROVIDER,
	...DOC_PL_PROVIDER,
	...PD_VARIANT_PROVIDER,
	...PD_VARIANT_GROUP_PROVIDER,
	...PD_CUST_STORAGE_PROVIDER,
	...PD_SUPP_STORAGE_PROVIDER,
	...DOC_DSO_PROVIDER,
	...BIZ_ALLOWED_PROVIDER,
	...INV_TRN_PROVIDER,
	...APP_MODULE_PROVIDER,
	...DOC_IVT_PROVIDER,
	...DOC_WTW_PROVIDER,
	...DOC_WTR_PROVIDER,
	...ASSET_WH_PROVIDER,
	...PD_COST_STACK_PROVIDER,
	...WH_STORAGE_TYPE_PROVIDER,
	...WH_ZONE_PROVIDER,
	...WH_AISLE_PROVIDER,
	...WH_RACK_PROVIDER,
	...WH_SHELF_PROVIDER,
	...NEIGHBOURHOOD_PROVIDER,
	...DOC_PL_STORAGE_PROVIDER,
	...DOC_PL_PD_PROVIDER,
	...WH_STAFF_PROVIDER,
	...WH_EQM_PROVIDER,
	...WORK_SHIFT_PROVIDER,
	...DOC_PL_ROUTE_PROVIDER,
	...DSP_PROVIDER,
	...DOC_PL_WO_PROVIDER,
	...DOC_PL_PSTORAGE_PROVIDER,
	...DOC_PL_PSTORAGE_ITEM_PROVIDER,
	...DOC_PL_OSTORAGE_PROVIDER,
	...WH_STORAGE_RESTRICTION_PROVIDER,
	...PACKAGING_TYPE_PROVIDER,
	...HU_TYPE_PROVIDER,
	...WH_HU_PROVIDER,
	...PD_HU_PROVIDER,
	...PD_HU_TYPE_PROVIDER,
	...SU_TYPE_PROVIDER,
	...PD_SU_TYPE_PROVIDER,
	...WH_SU_PROVIDER,
	...PD_SU_PROVIDER,
	...PAYMENT_GATEWAY_PROVIDER,
]