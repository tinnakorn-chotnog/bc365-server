import { Module } from '@nestjs/common';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { DummyResolver } from './dummy/dummy.resolver';
import { DateScalar } from '@bc365-server/common/scalar/date.scalar';
import { AddrInfoExtResolver } from './types/addr-info';
import { UserBranchInfoExtResolver } from './types/user-branch-info';
import { PdAttributeInfoExtResolver } from './types/pd-attribute-info';
import { PoReceiveInfoExtResolver } from './types/po-receive-info';
import { SuReceiveInfoExtResolver } from './types/su-receive-info';
import { SuIssueInfoExtResolver } from './types/su-issue-info';
import { SuReceiveActionInfoExtResolver } from './types/su-receive-action-info';
import { SuIssueActionInfoExtResolver } from './types/su-issue-action-info';
import { PickOrdItemInfoExtResolver } from './types/pick-ord-item-info';
import { PdOrderSuInfoExtResolver } from './types/pd-order-su-info';
import { PdOrderHuInfoExtResolver } from './types/pd-order-hu-info';
import { ShipToAddrInfoExtResolver } from './types/ship-to-addr-info';
import { BranchInventoryPreferenceInfoExtResolver } from './types/branch-inventory-preference-info';
import { UserAllowedBizInfoExtResolver } from './types/user-allowed-biz-info';
import { BankTransferInfoExtResolver } from './types/bank-transfer-info';
import { PaymentGatewayInfoExtResolver } from './types/payment-gateway-info';
import { CreditCardInfoExtResolver } from './types/credit-card-info';
import { ChequeInfoExtResolver } from './types/cheque-info';
import { PdBundleInfoExtResolver } from './types/pd-bundle-info';
import { PdPackageInfoExtResolver } from './types/pd-package-info';
import { ReceiveLotInfoExtResolver } from './types/receive-lot-info';
import { IssueLotInfoExtResolver } from './types/issue-lot-info';
import { PickLotInfoExtResolver } from './types/pick-lot-info';
import { TransferLotInfoExtResolver } from './types/transfer-lot-info';
import { ShipLotInfoExtResolver } from './types/ship-lot-info';
import { ReceiveHistoryInfoExtResolver } from './types/receive-history-info';
import { SortingContainerInfoExtResolver } from './types/sorting-container-info';
import { WhEqmInfoExtResolver } from './types/wh-eqm-info';
import { PdSalesInfoExtResolver } from './types/pd-sales-info';
import { PdPickInfoExtResolver } from './types/pd-pick-info';
import { PoReceiveStorageInfoExtResolver } from './types/po-receive-storage-info';
import { PdPurchaseInfoExtResolver } from './types/pd-purchase-info';
import { PdReceiveInfoExtResolver } from './types/pd-receive-info';
import { PdIssueInfoExtResolver } from './types/pd-issue-info';
import { PdAdjustInfoExtResolver } from './types/pd-adjust-info';
import { PdStorageTransferInfoExtResolver } from './types/pd-storage-transfer-info';
import { PdHuTransferInfoExtResolver } from './types/pd-hu-transfer-info';
import { CateCountInfoExtResolver } from './types/cate-count-info';
import { PdTransferInfoExtResolver } from './types/pd-transfer-info';
import { PickPdInfoExtResolver } from './types/pick-pd-info';
import { BIZ_PROVIDER } from './graphql/biz';
import { USER_PROVIDER } from './graphql/user';
import { BIZ_USER_PROVIDER } from './graphql/biz-user';
import { PAYMENT_METHOD_PROVIDER } from './graphql/payment-method';
import { CUST_PROVIDER } from './graphql/cust';
import { COUNTRY_PROVIDER } from './graphql/country';
import { PROVINCE_PROVIDER } from './graphql/province';
import { DISTRICTS_PROVIDER } from './graphql/districts';
import { TOWN_PROVIDER } from './graphql/town';
import { LANGUAGE_PROVIDER } from './graphql/language';
import { STATUS_TYPE_PROVIDER } from './graphql/status-type';
import { STATUS_PROVIDER } from './graphql/status';
import { TITLE_PROVIDER } from './graphql/title';
import { DATA_TYPE_PROVIDER } from './graphql/data-type';
import { PD_PROVIDER } from './graphql/pd';
import { WH_STORAGE_PROVIDER } from './graphql/wh-storage';
import { PD_STORAGE_PROVIDER } from './graphql/pd-storage';
import { CREDIT_TERM_PROVIDER } from './graphql/credit-term';
import { UOM_PROVIDER } from './graphql/uom';
import { TAX_PROVIDER } from './graphql/tax';
import { CUST_GROUP_PROVIDER } from './graphql/cust-group';
import { SUPP_GROUP_PROVIDER } from './graphql/supp-group';
import { CPD_PROVIDER } from './graphql/cpd';
import { SKILL_PROVIDER } from './graphql/skill';
import { BIZ_USER_GRP_PROVIDER } from './graphql/biz-user-grp';
import { BIZ_USER_ROLE_PROVIDER } from './graphql/biz-user-role';
import { DOC_ARIV_PROVIDER } from './graphql/doc-ariv';
import { DISC_GROUP_PROVIDER } from './graphql/disc-group';
import { DOC_PO_PROVIDER } from './graphql/doc-po';
import { REF_DOC_PROVIDER } from './graphql/ref-doc';
import { CHEQUE_DISBURSED_PROVIDER } from './graphql/cheque-disbursed';
import { BANK_PROVIDER } from './graphql/bank';
import { CHEQUE_RECEIVED_PROVIDER } from './graphql/cheque-received';
import { CHEQUE_TYPE_PROVIDER } from './graphql/cheque-type';
import { DOC_GRN_PROVIDER } from './graphql/doc-grn';
import { DOC_RUNNING_GROUP_PROVIDER } from './graphql/doc-running-group';
import { TRANSLATION_OPTION_PROVIDER } from './graphql/translation-option';
import { BIZ_LANGUAGE_PROVIDER } from './graphql/biz-language';
import { PD_TYPE_PROVIDER } from './graphql/pd-type';
import { PD_GROUP_PROVIDER } from './graphql/pd-group';
import { DOC_GIN_PROVIDER } from './graphql/doc-gin';
import { DATA_FORM_CONFIG_PROVIDER } from './graphql/data-form-config';
import { PD_UOM_PROVIDER } from './graphql/pd-uom';
import { DOC_IVA_PROVIDER } from './graphql/doc-iva';
import { DOC_APIV_PROVIDER } from './graphql/doc-apiv';
import { DOC_POS_PROVIDER } from './graphql/doc-pos';
import { CURRENCY_PROVIDER } from './graphql/currency';
import { PD_BAL_PROVIDER } from './graphql/pd-bal';
import { PD_STORAGE_BAL_PROVIDER } from './graphql/pd-storage-bal';
import { DOC_SHIP_PROVIDER } from './graphql/doc-ship';
import { POS_DEVICE_PROVIDER } from './graphql/pos-device';
import { BRANCH_PROVIDER } from './graphql/branch';
import { PD_CATE_PROVIDER } from './graphql/pd-cate';
import { PD_SUBCATE_PROVIDER } from './graphql/pd-subcate';
import { PRICE_GROUP_PROVIDER } from './graphql/price-group';
import { PRICE_BOOK_PROVIDER } from './graphql/price-book';
import { PRICE_BOOK_ITEM_PROVIDER } from './graphql/price-book-item';
import { PRICE_BOOK_CASCADE_PROVIDER } from './graphql/price-book-cascade';
import { CATE_PROVIDER } from './graphql/cate';
import { SUBCATE_PROVIDER } from './graphql/subcate';
import { DOC_ARC_PROVIDER } from './graphql/doc-arc';
import { DOC_ARC_ITEM_PROVIDER } from './graphql/doc-arc-item';
import { PERIOD_PROVIDER } from './graphql/period';
import { RTP_PROVIDER } from './graphql/rtp';
import { COUNTRY_TRANSLATION_OPTION_PROVIDER } from './graphql/country-translation-option';
import { BIZ_TRANSLATION_OPTION_PROVIDER } from './graphql/biz-translation-option';
import { APP_MENU_PROVIDER } from './graphql/app-menu';
import { USER_TOKEN_PROVIDER } from './graphql/user-token';
import { ASSET_PROVIDER } from './graphql/asset';
import { ASSET_STORAGE_PROVIDER } from './graphql/asset-storage';
import { APP_TYPE_PROVIDER } from './graphql/app-type';
import { SUPP_PROVIDER } from './graphql/supp';
import { SPD_PROVIDER } from './graphql/spd';
import { DOC_SO_PROVIDER } from './graphql/doc-so';
import { DELIVERY_METHOD_PROVIDER } from './graphql/delivery-method';
import { RENTAL_TYPE_PROVIDER } from './graphql/rental-type';
import { PAYMENT_CONDITION_PROVIDER } from './graphql/payment-condition';
import { BRAND_PROVIDER } from './graphql/brand';
import { COLOR_PROVIDER } from './graphql/color';
import { DOC_CDJ_PROVIDER } from './graphql/doc-cdj';
import { EXPENSE_PROVIDER } from './graphql/expense';
import { REVENUE_PROVIDER } from './graphql/revenue';
import { DOC_CRJ_PROVIDER } from './graphql/doc-crj';
import { DOC_ARR_PROVIDER } from './graphql/doc-arr';
import { DOC_NAR_PROVIDER } from './graphql/doc-nar';
import { DOC_NAR_ITEM_PROVIDER } from './graphql/doc-nar-item';
import { PD_BRANCH_PROVIDER } from './graphql/pd-branch';
import { ASSET_BRANCH_PROVIDER } from './graphql/asset-branch';
import { DOC_ARR_ITEM_PROVIDER } from './graphql/doc-arr-item';
import { DOC_RECEIPT_PROVIDER } from './graphql/doc-receipt';
import { BANK_ACCOUNT_TYPE_PROVIDER } from './graphql/bank-account-type';
import { BANK_ACCOUNT_PROVIDER } from './graphql/bank-account';
import { CARD_TYPE_PROVIDER } from './graphql/card-type';
import { PAYMENT_CHANNEL_PROVIDER } from './graphql/payment-channel';
import { APP_ROUTE_PROVIDER } from './graphql/app-route';
import { PD_ATTRIBUTE_PROVIDER } from './graphql/pd-attribute';
import { WH_PROVIDER } from './graphql/wh';
import { PD_WH_PROVIDER } from './graphql/pd-wh';
import { SALES_CHANNEL_PROVIDER } from './graphql/sales-channel';
import { PD_LOT_PROVIDER } from './graphql/pd-lot';
import { PD_LOT_STORAGE_PROVIDER } from './graphql/pd-lot-storage';
import { PD_SN_PROVIDER } from './graphql/pd-sn';
import { CPD_STORAGE_PROVIDER } from './graphql/cpd-storage';
import { SPD_STORAGE_PROVIDER } from './graphql/spd-storage';
import { DOC_DSO_PROVIDER } from './graphql/doc-dso';
import { BIZ_ALLOWED_PROVIDER } from './graphql/biz-allowed';
import { INV_TRN_PROVIDER } from './graphql/inv-trn';
import { APP_MODULE_PROVIDER } from './graphql/app-module';
import { ASSET_WH_PROVIDER } from './graphql/asset-wh';
import { PD_COST_STACK_PROVIDER } from './graphql/pd-cost-stack';
import { WH_STORAGE_TYPE_PROVIDER } from './graphql/wh-storage-type';
import { WH_ZONE_PROVIDER } from './graphql/wh-zone';
import { WH_AISLE_PROVIDER } from './graphql/wh-aisle';
import { WH_RACK_PROVIDER } from './graphql/wh-rack';
import { WH_SHELF_PROVIDER } from './graphql/wh-shelf';
import { NEIGHBOURHOOD_PROVIDER } from './graphql/neighbourhood';
import { WH_STAFF_PROVIDER } from './graphql/wh-staff';
import { WH_EQM_PROVIDER } from './graphql/wh-eqm';
import { WORK_SHIFT_PROVIDER } from './graphql/work-shift';
import { DSP_PROVIDER } from './graphql/dsp';
import { WH_STORAGE_RESTRICTION_PROVIDER } from './graphql/wh-storage-restriction';
import { PACKAGING_TYPE_PROVIDER } from './graphql/packaging-type';
import { HU_TYPE_PROVIDER } from './graphql/hu-type';
import { WH_HU_PROVIDER } from './graphql/wh-hu';
import { PD_HU_PROVIDER } from './graphql/pd-hu';
import { PD_HU_PROFILE_PROVIDER } from './graphql/pd-hu-profile';
import { SU_TYPE_PROVIDER } from './graphql/su-type';
import { PD_SU_PROFILE_PROVIDER } from './graphql/pd-su-profile';
import { WH_SU_PROVIDER } from './graphql/wh-su';
import { PD_SU_PROVIDER } from './graphql/pd-su';
import { PAYMENT_GATEWAY_PROVIDER } from './graphql/payment-gateway';
import { DOC_PICK_PROVIDER } from './graphql/doc-pick';
import { DOC_TASK_PROVIDER } from './graphql/doc-task';
import { DOC_PACK_SU_PROVIDER } from './graphql/doc-pack-su';
import { SHIPPING_CARRIER_PROVIDER } from './graphql/shipping-carrier';
import { SHIPPING_ZONE_PROVIDER } from './graphql/shipping-zone';
import { RPN_PLAN_PROVIDER } from './graphql/rpn-plan';
import { WH_CONTROLLER_PROVIDER } from './graphql/wh-controller';
import { DOC_TFO_PROVIDER } from './graphql/doc-tfo';
import { DOC_TFR_PROVIDER } from './graphql/doc-tfr';
import { DOC_PFFM_PROVIDER } from './graphql/doc-pffm';
import { SDAL_PROVIDER } from './graphql/sdal';
import { DOC_ORESV_PROVIDER } from './graphql/doc-oresv';
import { RESV_TYPE_PROVIDER } from './graphql/resv-type';
import { PD_RESV_PROVIDER } from './graphql/pd-resv';
import { PROP_CONFIG_PROVIDER } from './graphql/prop-config';
import { PROP_TYPE_PROVIDER } from './graphql/prop-type';
import { PROP_UNIT_TYPE_PROVIDER } from './graphql/prop-unit-type';
import { PROP_UNIT_PROVIDER } from './graphql/prop-unit';
import { PROP_FACILITY_PROVIDER } from './graphql/prop-facility';
import { PROP_UNIT_FACILITY_PROVIDER } from './graphql/prop-unit-facility';
import { PROP_BILL_PROVIDER } from './graphql/prop-bill';
import { PROP_SERVICE_ITEM_PROVIDER } from './graphql/prop-service-item';
import { PROP_SERVICE_UNIT_PROVIDER } from './graphql/prop-service-unit';
import { PROP_SERVICE_TYPE_PROVIDER } from './graphql/prop-service-type';
import { PROP_SERVICE_UNIT_ITEM_PROVIDER } from './graphql/prop-service-unit-item';
import { KITCHEN_PROVIDER } from './graphql/kitchen';
import { KITCHEN_ORD_PROVIDER } from './graphql/kitchen-ord';
import { RESTA_MENU_PROVIDER } from './graphql/resta-menu';
import { DOC_RESTA_ORD_PROVIDER } from './graphql/doc-resta-ord';
import { RESTA_TABLE_PROVIDER } from './graphql/resta-table';
import { RESTA_AREA_PROVIDER } from './graphql/resta-area';
import { RESTA_TABLE_TYPE_PROVIDER } from './graphql/resta-table-type';
import { RESTA_OPTION_GROUP_PROVIDER } from './graphql/resta-option-group';
import { RESTA_BRANCH_MENU_PROVIDER } from './graphql/resta-branch-menu';
import { CONTACT_PROVIDER } from './graphql/contact';
import { APP_MESSAGE_PROVIDER } from './graphql/app-message';
import { APP_NAV_GROUP_PROVIDER } from './graphql/app-nav-group';
import { APP_NAV_PROVIDER } from './graphql/app-nav';
import { APP_NOTI_PROVIDER } from './graphql/app-noti';
import { APP_SHORTCUT_PROVIDER } from './graphql/app-shortcut';
import { USER_MESSAGE_PROVIDER } from './graphql/user-message';
import { USER_NOTI_PROVIDER } from './graphql/user-noti';
import { USER_SHORTCUT_PROVIDER } from './graphql/user-shortcut';
import { CHAT_BOX_PROVIDER } from './graphql/chat-box';
import { CHAT_MESSAGE_PROVIDER } from './graphql/chat-message';
import { CHAT_BOX_MEMBER_PROVIDER } from './graphql/chat-box-member';

@Module({
    imports: [
    ],
    controllers: [],
    providers: [
        RedisLockService,
        RedisSequenceService,
        DummyResolver,
        DateScalar,
		AddrInfoExtResolver,
		UserBranchInfoExtResolver,
		PdAttributeInfoExtResolver,
		PoReceiveInfoExtResolver,
		SuReceiveInfoExtResolver,
		SuIssueInfoExtResolver,
		SuReceiveActionInfoExtResolver,
		SuIssueActionInfoExtResolver,
		PickOrdItemInfoExtResolver,
		PdOrderSuInfoExtResolver,
		PdOrderHuInfoExtResolver,
		ShipToAddrInfoExtResolver,
		BranchInventoryPreferenceInfoExtResolver,
		UserAllowedBizInfoExtResolver,
		BankTransferInfoExtResolver,
		PaymentGatewayInfoExtResolver,
		CreditCardInfoExtResolver,
		ChequeInfoExtResolver,
		PdBundleInfoExtResolver,
		PdPackageInfoExtResolver,
		ReceiveLotInfoExtResolver,
		IssueLotInfoExtResolver,
		PickLotInfoExtResolver,
		TransferLotInfoExtResolver,
		ShipLotInfoExtResolver,
		ReceiveHistoryInfoExtResolver,
		SortingContainerInfoExtResolver,
		WhEqmInfoExtResolver,
		PdSalesInfoExtResolver,
		PdPickInfoExtResolver,
		PoReceiveStorageInfoExtResolver,
		PdPurchaseInfoExtResolver,
		PdReceiveInfoExtResolver,
		PdIssueInfoExtResolver,
		PdAdjustInfoExtResolver,
		PdStorageTransferInfoExtResolver,
		PdHuTransferInfoExtResolver,
		CateCountInfoExtResolver,
		PdTransferInfoExtResolver,
		PickPdInfoExtResolver,
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
		...CPD_PROVIDER,
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
		...SPD_PROVIDER,
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
		...CPD_STORAGE_PROVIDER,
		...SPD_STORAGE_PROVIDER,
		...DOC_DSO_PROVIDER,
		...BIZ_ALLOWED_PROVIDER,
		...INV_TRN_PROVIDER,
		...APP_MODULE_PROVIDER,
		...ASSET_WH_PROVIDER,
		...PD_COST_STACK_PROVIDER,
		...WH_STORAGE_TYPE_PROVIDER,
		...WH_ZONE_PROVIDER,
		...WH_AISLE_PROVIDER,
		...WH_RACK_PROVIDER,
		...WH_SHELF_PROVIDER,
		...NEIGHBOURHOOD_PROVIDER,
		...WH_STAFF_PROVIDER,
		...WH_EQM_PROVIDER,
		...WORK_SHIFT_PROVIDER,
		...DSP_PROVIDER,
		...WH_STORAGE_RESTRICTION_PROVIDER,
		...PACKAGING_TYPE_PROVIDER,
		...HU_TYPE_PROVIDER,
		...WH_HU_PROVIDER,
		...PD_HU_PROVIDER,
		...PD_HU_PROFILE_PROVIDER,
		...SU_TYPE_PROVIDER,
		...PD_SU_PROFILE_PROVIDER,
		...WH_SU_PROVIDER,
		...PD_SU_PROVIDER,
		...PAYMENT_GATEWAY_PROVIDER,
		...DOC_PICK_PROVIDER,
		...DOC_TASK_PROVIDER,
		...DOC_PACK_SU_PROVIDER,
		...SHIPPING_CARRIER_PROVIDER,
		...SHIPPING_ZONE_PROVIDER,
		...RPN_PLAN_PROVIDER,
		...WH_CONTROLLER_PROVIDER,
		...DOC_TFO_PROVIDER,
		...DOC_TFR_PROVIDER,
		...DOC_PFFM_PROVIDER,
		...SDAL_PROVIDER,
		...DOC_ORESV_PROVIDER,
		...RESV_TYPE_PROVIDER,
		...PD_RESV_PROVIDER,
		...PROP_CONFIG_PROVIDER,
		...PROP_TYPE_PROVIDER,
		...PROP_UNIT_TYPE_PROVIDER,
		...PROP_UNIT_PROVIDER,
		...PROP_FACILITY_PROVIDER,
		...PROP_UNIT_FACILITY_PROVIDER,
		...PROP_BILL_PROVIDER,
		...PROP_SERVICE_ITEM_PROVIDER,
		...PROP_SERVICE_UNIT_PROVIDER,
		...PROP_SERVICE_TYPE_PROVIDER,
		...PROP_SERVICE_UNIT_ITEM_PROVIDER,
		...KITCHEN_PROVIDER,
		...KITCHEN_ORD_PROVIDER,
		...RESTA_MENU_PROVIDER,
		...DOC_RESTA_ORD_PROVIDER,
		...RESTA_TABLE_PROVIDER,
		...RESTA_AREA_PROVIDER,
		...RESTA_TABLE_TYPE_PROVIDER,
		...RESTA_OPTION_GROUP_PROVIDER,
		...RESTA_BRANCH_MENU_PROVIDER,
		...CONTACT_PROVIDER,
		...APP_MESSAGE_PROVIDER,
		...APP_NAV_GROUP_PROVIDER,
		...APP_NAV_PROVIDER,
		...APP_NOTI_PROVIDER,
		...APP_SHORTCUT_PROVIDER,
		...USER_MESSAGE_PROVIDER,
		...USER_NOTI_PROVIDER,
		...USER_SHORTCUT_PROVIDER,
		...CHAT_BOX_PROVIDER,
		...CHAT_MESSAGE_PROVIDER,
		...CHAT_BOX_MEMBER_PROVIDER
    ],
    exports: [
        RedisLockService,
        RedisSequenceService,
        DummyResolver,
		AddrInfoExtResolver,
		UserBranchInfoExtResolver,
		PdAttributeInfoExtResolver,
		PoReceiveInfoExtResolver,
		SuReceiveInfoExtResolver,
		SuIssueInfoExtResolver,
		SuReceiveActionInfoExtResolver,
		SuIssueActionInfoExtResolver,
		PickOrdItemInfoExtResolver,
		PdOrderSuInfoExtResolver,
		PdOrderHuInfoExtResolver,
		ShipToAddrInfoExtResolver,
		BranchInventoryPreferenceInfoExtResolver,
		UserAllowedBizInfoExtResolver,
		BankTransferInfoExtResolver,
		PaymentGatewayInfoExtResolver,
		CreditCardInfoExtResolver,
		ChequeInfoExtResolver,
		PdBundleInfoExtResolver,
		PdPackageInfoExtResolver,
		ReceiveLotInfoExtResolver,
		IssueLotInfoExtResolver,
		PickLotInfoExtResolver,
		TransferLotInfoExtResolver,
		ShipLotInfoExtResolver,
		ReceiveHistoryInfoExtResolver,
		SortingContainerInfoExtResolver,
		WhEqmInfoExtResolver,
		PdSalesInfoExtResolver,
		PdPickInfoExtResolver,
		PoReceiveStorageInfoExtResolver,
		PdPurchaseInfoExtResolver,
		PdReceiveInfoExtResolver,
		PdIssueInfoExtResolver,
		PdAdjustInfoExtResolver,
		PdStorageTransferInfoExtResolver,
		PdHuTransferInfoExtResolver,
		CateCountInfoExtResolver,
		PdTransferInfoExtResolver,
		PickPdInfoExtResolver,
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
		...CPD_PROVIDER,
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
		...SPD_PROVIDER,
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
		...CPD_STORAGE_PROVIDER,
		...SPD_STORAGE_PROVIDER,
		...DOC_DSO_PROVIDER,
		...BIZ_ALLOWED_PROVIDER,
		...INV_TRN_PROVIDER,
		...APP_MODULE_PROVIDER,
		...ASSET_WH_PROVIDER,
		...PD_COST_STACK_PROVIDER,
		...WH_STORAGE_TYPE_PROVIDER,
		...WH_ZONE_PROVIDER,
		...WH_AISLE_PROVIDER,
		...WH_RACK_PROVIDER,
		...WH_SHELF_PROVIDER,
		...NEIGHBOURHOOD_PROVIDER,
		...WH_STAFF_PROVIDER,
		...WH_EQM_PROVIDER,
		...WORK_SHIFT_PROVIDER,
		...DSP_PROVIDER,
		...WH_STORAGE_RESTRICTION_PROVIDER,
		...PACKAGING_TYPE_PROVIDER,
		...HU_TYPE_PROVIDER,
		...WH_HU_PROVIDER,
		...PD_HU_PROVIDER,
		...PD_HU_PROFILE_PROVIDER,
		...SU_TYPE_PROVIDER,
		...PD_SU_PROFILE_PROVIDER,
		...WH_SU_PROVIDER,
		...PD_SU_PROVIDER,
		...PAYMENT_GATEWAY_PROVIDER,
		...DOC_PICK_PROVIDER,
		...DOC_TASK_PROVIDER,
		...DOC_PACK_SU_PROVIDER,
		...SHIPPING_CARRIER_PROVIDER,
		...SHIPPING_ZONE_PROVIDER,
		...RPN_PLAN_PROVIDER,
		...WH_CONTROLLER_PROVIDER,
		...DOC_TFO_PROVIDER,
		...DOC_TFR_PROVIDER,
		...DOC_PFFM_PROVIDER,
		...SDAL_PROVIDER,
		...DOC_ORESV_PROVIDER,
		...RESV_TYPE_PROVIDER,
		...PD_RESV_PROVIDER,
		...PROP_CONFIG_PROVIDER,
		...PROP_TYPE_PROVIDER,
		...PROP_UNIT_TYPE_PROVIDER,
		...PROP_UNIT_PROVIDER,
		...PROP_FACILITY_PROVIDER,
		...PROP_UNIT_FACILITY_PROVIDER,
		...PROP_BILL_PROVIDER,
		...PROP_SERVICE_ITEM_PROVIDER,
		...PROP_SERVICE_UNIT_PROVIDER,
		...PROP_SERVICE_TYPE_PROVIDER,
		...PROP_SERVICE_UNIT_ITEM_PROVIDER,
		...KITCHEN_PROVIDER,
		...KITCHEN_ORD_PROVIDER,
		...RESTA_MENU_PROVIDER,
		...DOC_RESTA_ORD_PROVIDER,
		...RESTA_TABLE_PROVIDER,
		...RESTA_AREA_PROVIDER,
		...RESTA_TABLE_TYPE_PROVIDER,
		...RESTA_OPTION_GROUP_PROVIDER,
		...RESTA_BRANCH_MENU_PROVIDER,
		...CONTACT_PROVIDER,
		...APP_MESSAGE_PROVIDER,
		...APP_NAV_GROUP_PROVIDER,
		...APP_NAV_PROVIDER,
		...APP_NOTI_PROVIDER,
		...APP_SHORTCUT_PROVIDER,
		...USER_MESSAGE_PROVIDER,
		...USER_NOTI_PROVIDER,
		...USER_SHORTCUT_PROVIDER,
		...CHAT_BOX_PROVIDER,
		...CHAT_MESSAGE_PROVIDER,
		...CHAT_BOX_MEMBER_PROVIDER
    ]
})
export class Demo1ResolverModule { }
