import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AddrInfo } from '../types/addr-info';
import { UserBranchInfo } from '../types/user-branch-info';
import { PdAttributeInfo } from '../types/pd-attribute-info';
import { PoReceiveInfo } from '../types/po-receive-info';
import { SuReceiveInfo } from '../types/su-receive-info';
import { SuIssueInfo } from '../types/su-issue-info';
import { SuReceiveActionInfo } from '../types/su-receive-action-info';
import { SuIssueActionInfo } from '../types/su-issue-action-info';
import { PickOrdItemInfo } from '../types/pick-ord-item-info';
import { PdOrderSuInfo } from '../types/pd-order-su-info';
import { PdOrderHuInfo } from '../types/pd-order-hu-info';
import { ShipToAddrInfo } from '../types/ship-to-addr-info';
import { BranchInventoryPreferenceInfo } from '../types/branch-inventory-preference-info';
import { UserAllowedBizInfo } from '../types/user-allowed-biz-info';
import { BankTransferInfo } from '../types/bank-transfer-info';
import { PaymentGatewayInfo } from '../types/payment-gateway-info';
import { CreditCardInfo } from '../types/credit-card-info';
import { ChequeInfo } from '../types/cheque-info';
import { PdBundleInfo } from '../types/pd-bundle-info';
import { PdPackageInfo } from '../types/pd-package-info';
import { ReceiveLotInfo } from '../types/receive-lot-info';
import { IssueLotInfo } from '../types/issue-lot-info';
import { PickLotInfo } from '../types/pick-lot-info';
import { TransferLotInfo } from '../types/transfer-lot-info';
import { ShipLotInfo } from '../types/ship-lot-info';
import { ReceiveHistoryInfo } from '../types/receive-history-info';
import { SortingContainerInfo } from '../types/sorting-container-info';
import { WhEqmInfo } from '../types/wh-eqm-info';
import { PdSalesInfo } from '../types/pd-sales-info';
import { PdPickInfo } from '../types/pd-pick-info';
import { PoReceiveStorageInfo } from '../types/po-receive-storage-info';
import { PdPurchaseInfo } from '../types/pd-purchase-info';
import { PdReceiveInfo } from '../types/pd-receive-info';
import { PdIssueInfo } from '../types/pd-issue-info';
import { PdAdjustInfo } from '../types/pd-adjust-info';
import { PdStorageTransferInfo } from '../types/pd-storage-transfer-info';
import { PdHuTransferInfo } from '../types/pd-hu-transfer-info';
import { CateCountInfo } from '../types/cate-count-info';
import { PdTransferInfo } from '../types/pd-transfer-info';
import { PickPdInfo } from '../types/pick-pd-info';

@ObjectType()
export class Dummy {

	@Field(() => ID, { nullable: true })
	dummyId?: string;

    @Field(type => AddrInfo, { nullable: true })
    addrInfo: AddrInfo;

    @Field(type => UserBranchInfo, { nullable: true })
    userBranchInfo: UserBranchInfo;

    @Field(type => PdAttributeInfo, { nullable: true })
    pdAttributeInfo: PdAttributeInfo;

    @Field(type => PoReceiveInfo, { nullable: true })
    poReceiveInfo: PoReceiveInfo;

    @Field(type => SuReceiveInfo, { nullable: true })
    suReceiveInfo: SuReceiveInfo;

    @Field(type => SuIssueInfo, { nullable: true })
    suIssueInfo: SuIssueInfo;

    @Field(type => SuReceiveActionInfo, { nullable: true })
    suReceiveActionInfo: SuReceiveActionInfo;

    @Field(type => SuIssueActionInfo, { nullable: true })
    suIssueActionInfo: SuIssueActionInfo;

    @Field(type => PickOrdItemInfo, { nullable: true })
    pickOrdItemInfo: PickOrdItemInfo;

    @Field(type => PdOrderSuInfo, { nullable: true })
    pdOrderSuInfo: PdOrderSuInfo;

    @Field(type => PdOrderHuInfo, { nullable: true })
    pdOrderHuInfo: PdOrderHuInfo;

    @Field(type => ShipToAddrInfo, { nullable: true })
    shipToAddrInfo: ShipToAddrInfo;

    @Field(type => BranchInventoryPreferenceInfo, { nullable: true })
    branchInventoryPreferenceInfo: BranchInventoryPreferenceInfo;

    @Field(type => UserAllowedBizInfo, { nullable: true })
    userAllowedBizInfo: UserAllowedBizInfo;

    @Field(type => BankTransferInfo, { nullable: true })
    bankTransferInfo: BankTransferInfo;

    @Field(type => PaymentGatewayInfo, { nullable: true })
    paymentGatewayInfo: PaymentGatewayInfo;

    @Field(type => CreditCardInfo, { nullable: true })
    creditCardInfo: CreditCardInfo;

    @Field(type => ChequeInfo, { nullable: true })
    chequeInfo: ChequeInfo;

    @Field(type => PdBundleInfo, { nullable: true })
    pdBundleInfo: PdBundleInfo;

    @Field(type => PdPackageInfo, { nullable: true })
    pdPackageInfo: PdPackageInfo;

    @Field(type => ReceiveLotInfo, { nullable: true })
    receiveLotInfo: ReceiveLotInfo;

    @Field(type => IssueLotInfo, { nullable: true })
    issueLotInfo: IssueLotInfo;

    @Field(type => PickLotInfo, { nullable: true })
    pickLotInfo: PickLotInfo;

    @Field(type => TransferLotInfo, { nullable: true })
    transferLotInfo: TransferLotInfo;

    @Field(type => ShipLotInfo, { nullable: true })
    shipLotInfo: ShipLotInfo;

    @Field(type => ReceiveHistoryInfo, { nullable: true })
    receiveHistoryInfo: ReceiveHistoryInfo;

    @Field(type => SortingContainerInfo, { nullable: true })
    sortingContainerInfo: SortingContainerInfo;

    @Field(type => WhEqmInfo, { nullable: true })
    whEqmInfo: WhEqmInfo;

    @Field(type => PdSalesInfo, { nullable: true })
    pdSalesInfo: PdSalesInfo;

    @Field(type => PdPickInfo, { nullable: true })
    pdPickInfo: PdPickInfo;

    @Field(type => PoReceiveStorageInfo, { nullable: true })
    poReceiveStorageInfo: PoReceiveStorageInfo;

    @Field(type => PdPurchaseInfo, { nullable: true })
    pdPurchaseInfo: PdPurchaseInfo;

    @Field(type => PdReceiveInfo, { nullable: true })
    pdReceiveInfo: PdReceiveInfo;

    @Field(type => PdIssueInfo, { nullable: true })
    pdIssueInfo: PdIssueInfo;

    @Field(type => PdAdjustInfo, { nullable: true })
    pdAdjustInfo: PdAdjustInfo;

    @Field(type => PdStorageTransferInfo, { nullable: true })
    pdStorageTransferInfo: PdStorageTransferInfo;

    @Field(type => PdHuTransferInfo, { nullable: true })
    pdHuTransferInfo: PdHuTransferInfo;

    @Field(type => CateCountInfo, { nullable: true })
    cateCountInfo: CateCountInfo;

    @Field(type => PdTransferInfo, { nullable: true })
    pdTransferInfo: PdTransferInfo;

    @Field(type => PickPdInfo, { nullable: true })
    pickPdInfo: PickPdInfo;

}
