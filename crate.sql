CREATE TABLE IF NOT EXISTS  "Korato"."Biz" (
	"bizId" VARCHAR PRIMARY KEY,
	"bizNo" VARCHAR,
	"bizName" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"branchCode" VARCHAR,
	"taxid" VARCHAR,
	"contact" OBJECT(STRICT) AS (
		"telephone" varchar,
		"mobile" varchar,
		"email" varchar
	),
	"preference" OBJECT(STRICT) AS (
		"purchasePreference" OBJECT(STRICT) AS (
			"field0" integer
		),
		"salePreference" OBJECT(STRICT) AS (
			"field0" integer
		),
		"inventoryPreference" OBJECT(STRICT) AS (
			"field0" integer
		)
	)
);

CREATE TABLE IF NOT EXISTS  "Korato"."User" (
	"userId" VARCHAR PRIMARY KEY,
	"name" VARCHAR,
	"email" VARCHAR,
	"password" VARCHAR,
	"company" VARCHAR,
	"tfaEnabled" BOOLEAN,
	"tfaSecret" VARCHAR,
	"agreements" BOOLEAN,
	"avatar" VARCHAR,
	"profile" OBJECT(STRICT) AS (
		"addr" OBJECT(STRICT) AS (
			"addr1" varchar,
			"addr2" varchar,
			"country" varchar,
			"province" varchar,
			"district" varchar,
			"town" varchar,
			"zip" varchar
		),
		"contact" OBJECT(STRICT) AS (
			"telephone" varchar,
			"mobile" varchar,
			"email" varchar
		)
	),
	"preferLang" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."BizUser" (
	"bizUserId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"userId" VARCHAR,
	"bizUserGrpId" VARCHAR,
	"preferLanguageId" VARCHAR,
	"allowedBranches" ARRAY(OBJECT(STRICT) AS (
		"branchId" varchar,
		"branchNo" varchar,
		"branchName" varchar,
		"active" boolean
	)),
	"allowAllBranches" BOOLEAN,
	"active" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."PaymentMethod" (
	"paymentMethodId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"paymentMethodCode" VARCHAR,
	"paymentMethodDesc" VARCHAR,
	"applyImmediately" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."Cust" (
	"custId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"custCode" VARCHAR,
	"custName" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"contact" OBJECT(STRICT) AS (
		"telephone" varchar,
		"mobile" varchar,
		"email" varchar
	),
	"custGroupId" VARCHAR,
	"discGroupId" VARCHAR,
	"logoUrl" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Country" (
	"countryId" VARCHAR PRIMARY KEY,
	"countryCode" VARCHAR,
	"countryName" VARCHAR,
	"iso3" VARCHAR,
	"iso2" VARCHAR,
	"numericCode" VARCHAR,
	"phoneCode" VARCHAR,
	"captital" VARCHAR,
	"currency" VARCHAR,
	"currencyName" VARCHAR,
	"currencySymbol" VARCHAR,
	"tld" VARCHAR,
	"native" VARCHAR,
	"region" VARCHAR,
	"subregion" VARCHAR,
	"timezones" ARRAY(OBJECT(STRICT) AS (
		"zoneName" varchar,
		"gmtOffset" varchar,
		"gmtOffsetName" varchar,
		"abbreviation" varchar,
		"tzName" varchar
	)),
	"latitude" VARCHAR,
	"longitude" VARCHAR,
	"emoji" VARCHAR,
	"emojiu" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Province" (
	"provinceId" VARCHAR PRIMARY KEY,
	"provinceCode" VARCHAR,
	"provinceName" VARCHAR,
	"type" VARCHAR,
	"latitude" VARCHAR,
	"longitude" VARCHAR,
	"countryId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Districts" (
	"districtsId" VARCHAR PRIMARY KEY,
	"districtsCode" VARCHAR,
	"districtsName" VARCHAR,
	"latitude" VARCHAR,
	"longitude" VARCHAR,
	"wikiDataId" VARCHAR,
	"provinceId" VARCHAR,
	"countryId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Town" (
	"townId" VARCHAR PRIMARY KEY,
	"townCode" VARCHAR,
	"townName" VARCHAR,
	"districtsId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Language" (
	"languageId" VARCHAR PRIMARY KEY,
	"languageCode" VARCHAR,
	"languageName" VARCHAR,
	"nativeName" VARCHAR,
	"rtl" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."StatusType" (
	"statusId" VARCHAR PRIMARY KEY,
	"statusType" VARCHAR,
	"statusName" VARCHAR,
	"statuses" ARRAY(OBJECT(STRICT) AS (
		"statusCode" varchar,
		"statusName" varchar,
		"prevStatus" varchar,
		"nextStatus" varchar,
		"defaultStatus" boolean
	)),
	"defaultStatus" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Status" (
	"statusId" VARCHAR PRIMARY KEY,
	"statusCode" VARCHAR,
	"statusName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Title" (
	"titleId" VARCHAR PRIMARY KEY,
	"titleCode" VARCHAR,
	"titleName" VARCHAR,
	"bizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DataType" (
	"dataTypeId" VARCHAR PRIMARY KEY,
	"typeCode" VARCHAR,
	"typeName" VARCHAR,
	"standardType" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."Pd" (
	"pdId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdNo" VARCHAR,
	"pdName" VARCHAR,
	"uomId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"rop" INTEGER,
	"pdTypeId" VARCHAR,
	"pdGroupId" VARCHAR,
	"pdCateId" VARCHAR,
	"pdSubcateId" VARCHAR,
	"priceGroupId" VARCHAR,
	"cateId" VARCHAR,
	"subcateId" VARCHAR,
	"variantParentId" VARCHAR,
	"allocatedQty" INTEGER,
	"reservedQty" INTEGER,
	"onOrderQty" INTEGER,
	"attribute" ARRAY(OBJECT(STRICT) AS (
		"pdAttributeId" varchar,
		"variantGroupId" varchar,
		"variantInfo" ARRAY(OBJECT(STRICT) AS (
			"variantCode" varchar,
			"variantDesc" varchar,
			"variantId" varchar
		)),
		"generated" boolean
	)),
	"lotSn" OBJECT(STRICT) AS (
		"useLot" boolean,
		"useSn" boolean,
		"lotMask" varchar,
		"snMask" varchar,
		"shelfLife" integer,
		"retestInterval" integer
	),
	"package" ARRAY(OBJECT(STRICT) AS (
		"pdId" varchar,
		"qty" integer
	)),
	"bundle" ARRAY(OBJECT(STRICT) AS (
		"pdId" varchar,
		"qty" integer
	)),
	"stdPrice" DOUBLE PRECISION,
	"stdCost" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."Loc" (
	"locId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locNo" VARCHAR,
	"locName" VARCHAR,
	"suppId" VARCHAR,
	"custId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdLoc" (
	"pdLocId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locId" VARCHAR,
	"pdId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"ropQty" DOUBLE PRECISION,
	"status" VARCHAR,
	"pdWhId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."CreditTerm" (
	"creditTermId" VARCHAR PRIMARY KEY,
	"creditTermCode" VARCHAR,
	"creditTermDesc" VARCHAR,
	"creditTermDay" INTEGER,
	"bizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Uom" (
	"uomId" VARCHAR PRIMARY KEY,
	"uomCode" VARCHAR,
	"uomDesc" VARCHAR,
	"bizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Tax" (
	"taxId" VARCHAR PRIMARY KEY,
	"taxCode" VARCHAR,
	"taxName" VARCHAR,
	"taxRate" DOUBLE PRECISION,
	"bizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."CustGroup" (
	"custGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"custGroupCode" VARCHAR,
	"custGroupName" VARCHAR,
	"discGroupId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."SuppGroup" (
	"suppGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"suppGroupCode" VARCHAR,
	"suppGroupName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdCust" (
	"pdCustId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"custId" VARCHAR,
	"pdId" VARCHAR,
	"custPdNo" VARCHAR,
	"custPdName" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"usePriceIncludeTax" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."Skill" (
	"skillId" VARCHAR PRIMARY KEY,
	"skillCode" VARCHAR,
	"skillName" VARCHAR,
	"bizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."BizUserGrp" (
	"bizUserGrpId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"grpCode" VARCHAR,
	"grpName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."BizUserRole" (
	"bizUserRoleId" VARCHAR PRIMARY KEY,
	"roleCode" VARCHAR,
	"roleName" VARCHAR,
	"bizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocAriv" (
	"docArivId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"custName" VARCHAR,
	"billtoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"shiptoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"subtotalAmt" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"whtAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"docShipId" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocArivItem" (
	"docArivItemId" VARCHAR PRIMARY KEY,
	"pdId" VARCHAR,
	"pdDesc" VARCHAR,
	"invoicedQty" DOUBLE PRECISION,
	"shippedQty" DOUBLE PRECISION,
	"pdUomId" VARCHAR,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"status" VARCHAR,
	"docArivId" VARCHAR,
	"bizId" VARCHAR,
	"docSoId" INTEGER,
	"docSoItemId" VARCHAR,
	"docShipItemId" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DiscGroup" (
	"discGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"code" VARCHAR,
	"name" VARCHAR,
	"priceType" VARCHAR,
	"discRate" DOUBLE PRECISION,
	"rounded" INTEGER
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPo" (
	"docPoId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"dueDate" TIMESTAMP WITH TIME ZONE,
	"suppId" VARCHAR,
	"billtoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"shiptoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"subtotalAmt" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"whtAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPoItem" (
	"docPoItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"suppId" VARCHAR,
	"docPoId" VARCHAR,
	"orderDate" TIMESTAMP WITH TIME ZONE,
	"dueDate" TIMESTAMP WITH TIME ZONE,
	"pdId" VARCHAR,
	"orderedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"qtyToReceive" DOUBLE PRECISION,
	"receivedQty" DOUBLE PRECISION,
	"qtyToReturn" DOUBLE PRECISION,
	"returnedQty" DOUBLE PRECISION,
	"qtyToInvoice" DOUBLE PRECISION,
	"invoicedQty" DOUBLE PRECISION,
	"backlogQty" DOUBLE PRECISION,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."RefDoc" (
	"refDocId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"refDocCode" VARCHAR,
	"refDocDesc" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."ChequeDisbursed" (
	"chequeDisbursedId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"chequeNo" VARCHAR,
	"chequeDate" TIMESTAMP WITH TIME ZONE,
	"chequeAmt" DOUBLE PRECISION,
	"chequeTypeId" VARCHAR,
	"bankId" VARCHAR,
	"docPaymentItemId" INTEGER,
	"payeeName" VARCHAR,
	"note" TEXT,
	"status" VARCHAR,
	"custId" VARCHAR,
	"suppId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Bank" (
	"bankId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"bankCode" VARCHAR,
	"bankName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."ChequeReceived" (
	"chequeReceivedId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"chequeNo" VARCHAR,
	"chequeDate" TIMESTAMP WITH TIME ZONE,
	"chequeAmt" DOUBLE PRECISION,
	"chequeTypeId" VARCHAR,
	"bankId" VARCHAR,
	"bankBranch" VARCHAR,
	"payerName" VARCHAR,
	"note" TEXT,
	"status" VARCHAR,
	"custId" VARCHAR,
	"suppId" VARCHAR,
	"receiveDate" TIMESTAMP WITH TIME ZONE,
	"depositDate" TIMESTAMP WITH TIME ZONE,
	"returnDate" TIMESTAMP WITH TIME ZONE,
	"redepositDate" TIMESTAMP WITH TIME ZONE,
	"voidDate" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS  "Korato"."ChequeType" (
	"chequeTypeId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"chequeTypeCode" VARCHAR,
	"chequeTypeDesc" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocGrn" (
	"docGrnId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"whId" VARCHAR,
	"suppId" VARCHAR,
	"suppName" VARCHAR,
	"refNo" VARCHAR,
	"status" VARCHAR,
	"docPoId" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocGrnItem" (
	"docGrnItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docGrnId" VARCHAR,
	"pdId" VARCHAR,
	"receivedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"pdLocId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"returnedQty" DOUBLE PRECISION,
	"status" VARCHAR,
	"docPoItemId" VARCHAR,
	"refTransId" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRunningGroup" (
	"docRunningGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"runningGroupName" VARCHAR,
	"defaultSeq" INTEGER,
	"selectionJs" TEXT,
	"contextJs" TEXT,
	"runningItem" ARRAY(OBJECT(STRICT) AS (
		"seq" integer,
		"description" varchar,
		"pattern" varchar,
		"resetType" varchar
	))
);

CREATE TABLE IF NOT EXISTS  "Korato"."TranslationOption" (
	"translationOptionId" VARCHAR PRIMARY KEY,
	"languageId" VARCHAR,
	"name" VARCHAR,
	"baseLanguageId" VARCHAR,
	"labels" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"messages" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"countries" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"provinces" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"districts" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"status" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"version" VARCHAR,
	"releaseDate" TIMESTAMP WITH TIME ZONE,
	"releaseNote" TEXT,
	"credit" TEXT
);

CREATE TABLE IF NOT EXISTS  "Korato"."BizLanguage" (
	"bizLanguageId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"languageId" VARCHAR,
	"useCustomTranslation" BOOLEAN,
	"useAsDefault" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocAsc" (
	"docAscId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" VARCHAR,
	"name" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"taxid" VARCHAR,
	"contact" OBJECT(STRICT) AS (
		"telephone" varchar,
		"mobile" varchar,
		"email" varchar
	),
	"status" VARCHAR,
	"bid" VARCHAR,
	"userId" VARCHAR,
	"acceptedNotified" BOOLEAN,
	"approvedNotified" BOOLEAN,
	"rejectedNotified" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdType" (
	"pdTypeId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdTypeCode" VARCHAR,
	"pdTypeDesc" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdGroup" (
	"pdGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdGroupCode" VARCHAR,
	"pdGroupName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocGin" (
	"docGinId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"whId" VARCHAR,
	"refNo" VARCHAR,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocGinItem" (
	"docGinItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docGinId" VARCHAR,
	"pdId" VARCHAR,
	"pdLocId" VARCHAR,
	"issuedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"status" VARCHAR,
	"refTransId" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DataFormConfig" (
	"dataFormConfigId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"formCode" VARCHAR,
	"formName" VARCHAR,
	"formTpl" ARRAY(OBJECT(STRICT) AS (
		"tplName" varchar,
		"tplValues" varchar
	)),
	"formFilter" ARRAY(OBJECT(STRICT) AS (
		"filterName" varchar,
		"filterParams" varchar,
		"sortDirection" varchar,
		"sortBy" varchar,
		"defaultValue" boolean
	)),
	"formTag" ARRAY(OBJECT(STRICT) AS (
		"tagName" varchar,
		"tagValue" varchar,
		"tagColor" varchar
	)),
	"formWfStatus" ARRAY(OBJECT(STRICT) AS (
		"wfStatusName" varchar,
		"wfStatusValue" varchar
	)),
	"displayAsTab" BOOLEAN,
	"tabPosition" VARCHAR,
	"tableAsList" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocSoItem" (
	"docSoItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docSoId" VARCHAR,
	"pdId" VARCHAR,
	"orderedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"qtyToShip" DOUBLE PRECISION,
	"shippedQty" DOUBLE PRECISION,
	"qtyToInvoice" DOUBLE PRECISION,
	"qtyInvoiced" DOUBLE PRECISION,
	"qtyToReturn" DOUBLE PRECISION,
	"returnedQty" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdUom" (
	"pdUomId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdId" VARCHAR,
	"uomId" VARCHAR,
	"convFactor" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocIva" (
	"docIvaId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"whId" VARCHAR,
	"refNo" VARCHAR,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocIvaItem" (
	"docIvaItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docIvaId" VARCHAR,
	"pdId" VARCHAR,
	"pdLocId" VARCHAR,
	"adjustedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"status" VARCHAR,
	"refTransId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocApivItem" (
	"docApivItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docApivId" VARCHAR,
	"pdId" VARCHAR,
	"pdDesc" VARCHAR,
	"invoicedQty" DOUBLE PRECISION,
	"pdUomId" VARCHAR,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocApiv" (
	"docApivId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"suppId" VARCHAR,
	"suppName" VARCHAR,
	"billtoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"shiptoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"subtotalAmt" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"whtAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocShipItem" (
	"docShipItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docShipId" VARCHAR,
	"docSoId" VARCHAR,
	"pdId" VARCHAR,
	"shippedQty" DOUBLE PRECISION,
	"pdLocId" VARCHAR,
	"uomId" VARCHAR,
	"status" VARCHAR,
	"docSoItemId" VARCHAR,
	"refTransId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPos" (
	"docPosId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"custName" VARCHAR,
	"subtotalAmt" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"posDeviceId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPosItem" (
	"docPosItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docPosId" VARCHAR,
	"pdId" VARCHAR,
	"pdLocId" VARCHAR,
	"pdLotId" INTEGER,
	"pdLocLotId" INTEGER,
	"billedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"status" VARCHAR,
	"posDeviceId" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Currency" (
	"currencyId" VARCHAR PRIMARY KEY,
	"currencyCode" VARCHAR,
	"currencyName" VARCHAR,
	"symbol" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdBal" (
	"pdBalId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdId" VARCHAR,
	"beginingOhQty" DOUBLE PRECISION,
	"endingOhQty" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdLocBal" (
	"pdLocBalId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdLocId" VARCHAR,
	"pdId" VARCHAR,
	"beginingOhQty" DOUBLE PRECISION,
	"endingOhQty" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocShip" (
	"docShipId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"docSoId" VARCHAR,
	"refNo" VARCHAR,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PosDevice" (
	"posDeviceId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"posDeviceNo" VARCHAR,
	"posDeviceDesc" VARCHAR,
	"brand" VARCHAR,
	"modelVariant" VARCHAR,
	"sn" VARCHAR,
	"posType" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Branch" (
	"branchId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchNo" VARCHAR,
	"branchName" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	)
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdCate" (
	"pdCateId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdCateCode" VARCHAR,
	"pdCateName" VARCHAR,
	"pdGroupId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdSubcate" (
	"pdSubcateId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdSubcateCode" VARCHAR,
	"pdSubcateName" VARCHAR,
	"pdCateId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PriceGroup" (
	"priceGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"priceGroupCode" VARCHAR,
	"priceGroupName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PriceBook" (
	"priceBookId" VARCHAR PRIMARY KEY,
	"priceBookCode" VARCHAR,
	"priceBookName" VARCHAR,
	"bizId" VARCHAR,
	"priceGroupId" VARCHAR,
	"inEffectiveDate" TIMESTAMP WITH TIME ZONE,
	"outEffectiveDate" TIMESTAMP WITH TIME ZONE,
	"custGroupId" VARCHAR,
	"custSubgroupId" INTEGER
);

CREATE TABLE IF NOT EXISTS  "Korato"."PriceBookItem" (
	"priceBookItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"priceBookId" VARCHAR,
	"pdId" VARCHAR,
	"stdPrice" DOUBLE PRECISION,
	"unitPrice" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."PriceBookCascade" (
	"priceBookCascadeId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"priceBookItemId" VARCHAR,
	"fromQty" INTEGER,
	"toQty" INTEGER,
	"discRate" DOUBLE PRECISION,
	"unitPrice" DOUBLE PRECISION,
	"useType" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Cate" (
	"cateId" VARCHAR PRIMARY KEY,
	"cateCode" VARCHAR,
	"cateName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Subcate" (
	"subcateId" VARCHAR PRIMARY KEY,
	"subcateCode" VARCHAR,
	"subcateName" VARCHAR,
	"cateId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRtc" (
	"docRtcId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"rentalTypeId" VARCHAR,
	"periodId" VARCHAR,
	"rentalPeriod" INTEGER,
	"deliveryMethodId" VARCHAR,
	"paymentConditionId" VARCHAR,
	"renterAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"workSite" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"attachedDoc" OBJECT(STRICT) AS (
		"citizenCard" boolean,
		"houseRegistration" boolean,
		"bankBook" boolean,
		"legalEntityRegister" boolean,
		"vatRegister" boolean,
		"constructionContract" boolean,
		"purchaseContract" boolean,
		"grtContract" boolean
	),
	"contact" OBJECT(STRICT) AS (
		"telephone" varchar,
		"mobile" varchar,
		"email" varchar
	),
	"rentalPurpose" VARCHAR,
	"startDate" TIMESTAMP WITH TIME ZONE,
	"endDate" TIMESTAMP WITH TIME ZONE,
	"stotalRtp" DOUBLE PRECISION,
	"discRate" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"stotalAfd" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"gtotalRtp" DOUBLE PRECISION,
	"gtotalGrtAmt" DOUBLE PRECISION,
	"note" TEXT,
	"assessedGrtAmt" DOUBLE PRECISION,
	"receiveGrtAmt" DOUBLE PRECISION,
	"deliveryCharges" DOUBLE PRECISION,
	"applyVat" BOOLEAN,
	"excludeVat" BOOLEAN,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRtcItem" (
	"docRtcItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docRtcId" VARCHAR,
	"assetId" VARCHAR,
	"rentalPeriod" INTEGER,
	"periodId" VARCHAR,
	"rentedQty" INTEGER,
	"rtp" DOUBLE PRECISION,
	"totalRtp" DOUBLE PRECISION,
	"grtAmt" DOUBLE PRECISION,
	"totalGrtAmt" DOUBLE PRECISION,
	"schdrd" TIMESTAMP WITH TIME ZONE,
	"returnedDate" TIMESTAMP WITH TIME ZONE,
	"returnedQty" INTEGER,
	"damagedQty" INTEGER,
	"lostQty" INTEGER,
	"note" TEXT,
	"status" VARCHAR,
	"assetLocId" VARCHAR,
	"uomId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Period" (
	"periodId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"periodCode" VARCHAR,
	"periodName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Rtp" (
	"rtpId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"assetId" VARCHAR,
	"periodId" VARCHAR,
	"priceIncludeTax" BOOLEAN,
	"rtp" DOUBLE PRECISION,
	"grtAmt" DOUBLE PRECISION,
	"price1" DOUBLE PRECISION,
	"price2" DOUBLE PRECISION,
	"price3" DOUBLE PRECISION,
	"price4" DOUBLE PRECISION,
	"price5" DOUBLE PRECISION,
	"remark" VARCHAR,
	"cascadedRtp" ARRAY(OBJECT(STRICT) AS (
		"numOfPeriods" integer,
		"rtp" double precision,
		"price1" double precision,
		"price2" double precision,
		"price3" double precision,
		"price4" double precision,
		"price5" double precision
	))
);

CREATE TABLE IF NOT EXISTS  "Korato"."CountryTranslationOption" (
	"countryTranslationOptionId" VARCHAR PRIMARY KEY,
	"languageId" VARCHAR,
	"name" VARCHAR,
	"baseLanguageId" VARCHAR,
	"labels" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"messages" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"countries" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"provinces" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"districts" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"status" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"version" VARCHAR,
	"releaseDate" TIMESTAMP WITH TIME ZONE,
	"releaseNote" TEXT,
	"credit" TEXT,
	"countryId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."BizTranslationOption" (
	"bizTranslationOptionId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"languageId" VARCHAR,
	"name" VARCHAR,
	"baseLanguageId" VARCHAR,
	"labels" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"messages" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"countries" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"provinces" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"districts" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"status" ARRAY(OBJECT(STRICT) AS (
		"translationKey" varchar,
		"translationBase" varchar,
		"translate" varchar
	)),
	"version" VARCHAR,
	"releaseDate" TIMESTAMP WITH TIME ZONE,
	"releaseNote" TEXT,
	"credit" TEXT
);

CREATE TABLE IF NOT EXISTS  "Korato"."AppMenu" (
	"appMenuId" VARCHAR PRIMARY KEY,
	"title" VARCHAR,
	"subtitle" VARCHAR,
	"type" VARCHAR,
	"icon" VARCHAR,
	"children" ARRAY(OBJECT(STRICT) AS (
		"title" varchar,
		"subtitle" varchar,
		"type" varchar,
		"icon" varchar,
		"children" ARRAY(OBJECT(STRICT) AS (
			"title" varchar,
			"subtitle" varchar,
			"type" varchar,
			"hidden" boolean,
			"active" boolean,
			"disabled" boolean,
			"tooltip" varchar,
			"fragment" varchar,
			"preserveFragment" varchar,
			"queryParams" OBJECT,
			"queryParamsHandling" text,
			"externalLink" boolean,
			"target" varchar,
			"exectMatch" boolean,
			"isActiveMatchOption" text,
			"function" text,
			"classes" OBJECT(STRICT) AS (
				"title" integer,
				"subtitle" integer,
				"icon" integer,
				"wrapper" integer
			),
			"icon" varchar,
			"badge" OBJECT(STRICT) AS (
				"title" integer,
				"classes" integer
			),
			"meta" text,
			"link" varchar
		))
	))
);

CREATE TABLE IF NOT EXISTS  "Korato"."UserToken" (
	"userTokenId" VARCHAR PRIMARY KEY,
	"userId" VARCHAR,
	"refreshToken" VARCHAR,
	"bid" VARCHAR,
	"brid" VARCHAR,
	"deviceInfo" OBJECT(STRICT) AS (
		"platform" varchar
	)
);

CREATE TABLE IF NOT EXISTS  "Korato"."Asset" (
	"assetId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"assetNo" VARCHAR,
	"assetName" VARCHAR,
	"uomId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"orQty" DOUBLE PRECISION,
	"pcfLost" DOUBLE PRECISION,
	"pcfDamaged" DOUBLE PRECISION,
	"status" VARCHAR,
	"pdCateId" VARCHAR,
	"pdSubcateId" VARCHAR,
	"brandId" VARCHAR,
	"colorId" VARCHAR,
	"remark" VARCHAR,
	"defaultImgUrl" VARCHAR,
	"defaultWhId" VARCHAR,
	"defaultLocId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."AssetLoc" (
	"assetLocId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locId" VARCHAR,
	"assetId" VARCHAR,
	"ohQty" INTEGER
);

CREATE TABLE IF NOT EXISTS  "Korato"."AppType" (
	"appTypeId" VARCHAR PRIMARY KEY,
	"appTypeCode" VARCHAR,
	"appTypeName" VARCHAR,
	"monthlyRate" DOUBLE PRECISION,
	"yearlyRate" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."Supp" (
	"suppId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"suppCode" VARCHAR,
	"suppName" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"contact" OBJECT(STRICT) AS (
		"telephone" varchar,
		"mobile" varchar,
		"email" varchar
	),
	"suppGroupId" VARCHAR,
	"logoUrl" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdSupp" (
	"pdSuppId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"suppId" VARCHAR,
	"pdId" VARCHAR,
	"suppPdNo" VARCHAR,
	"suppPdName" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"usePriceIncludeTax" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocSo" (
	"docSoId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"dueDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"billtoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"shiptoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"subtotalAmt" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"whtAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"salesChannelId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DeliveryMethod" (
	"deliveryMethodId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"deliveryMethodCode" VARCHAR,
	"deliveryMethodName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."RentalType" (
	"rentalTypeId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"rentalTypeCode" VARCHAR,
	"rentalTypeName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PaymentCondition" (
	"paymentConditionId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"paymentConditionCode" VARCHAR,
	"paymentConditionName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Brand" (
	"brandId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"brandCode" VARCHAR,
	"brandName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Color" (
	"colorId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"colorCode" VARCHAR,
	"colorName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocCdj" (
	"docCdjId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"suppId" VARCHAR,
	"payeeName" VARCHAR,
	"payerName" VARCHAR,
	"subtotalAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Expense" (
	"expenseId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"expenseCode" VARCHAR,
	"expenseName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Revenue" (
	"revenueId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"revenueCode" VARCHAR,
	"revenueName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocCdjItem" (
	"docCdjItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docCdjId" VARCHAR,
	"expenseId" VARCHAR,
	"qty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocCrj" (
	"docCrjId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"payerName" VARCHAR,
	"payeeName" VARCHAR,
	"subtotalAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocCrjItem" (
	"docCrjItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docCrjId" VARCHAR,
	"revenueId" VARCHAR,
	"qty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgr" (
	"docRgrId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"docRtcId" VARCHAR,
	"stotalRtp" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"gtotalRtp" DOUBLE PRECISION,
	"gtotalGrtAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgm" (
	"docRgmId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"docRtcId" VARCHAR,
	"stotalAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgd" (
	"docRgdId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"docRtcId" VARCHAR,
	"stotalAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgmItem" (
	"docRgmItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docRgmId" VARCHAR,
	"assetId" VARCHAR,
	"lostQty" DOUBLE PRECISION,
	"pcfLost" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"refId" VARCHAR,
	"branchId" VARCHAR,
	"uomId" VARCHAR,
	"docRtcItemId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgdItem" (
	"docRgdItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docRgdId" VARCHAR,
	"assetId" VARCHAR,
	"damagedQty" DOUBLE PRECISION,
	"pcfDamaged" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"refId" VARCHAR,
	"branchId" VARCHAR,
	"uomId" VARCHAR,
	"docRtcItemId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocNar" (
	"docNarId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"docDesc" VARCHAR,
	"status" VARCHAR,
	"branchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocNarItem" (
	"docNarItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNarId" VARCHAR,
	"assetId" VARCHAR,
	"receivedQty" DOUBLE PRECISION,
	"branchId" VARCHAR,
	"uomId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdBranch" (
	"pdBranchId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"pdId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"ropQty" INTEGER,
	"uomId" VARCHAR,
	"defaultPdLocId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."AssetBranch" (
	"assetBranchId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"assetId" VARCHAR,
	"assetNo" VARCHAR,
	"assetName" VARCHAR,
	"uomId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"orQty" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgrItem" (
	"docRgrItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docRgrId" VARCHAR,
	"assetId" VARCHAR,
	"rentalPeriod" INTEGER,
	"periodId" VARCHAR,
	"rentedQty" INTEGER,
	"rtp" DOUBLE PRECISION,
	"totalRtp" DOUBLE PRECISION,
	"grtAmt" DOUBLE PRECISION,
	"totalGrtAmt" DOUBLE PRECISION,
	"schdrd" TIMESTAMP WITH TIME ZONE,
	"returnedDate" TIMESTAMP WITH TIME ZONE,
	"dateDiff" INTEGER,
	"returnedQty" INTEGER,
	"qtyDiff" INTEGER,
	"note" TEXT,
	"status" VARCHAR,
	"assetLocId" VARCHAR,
	"branchId" VARCHAR,
	"uomId" VARCHAR,
	"docRtcItemId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocReceipt" (
	"docReceiptId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"custId" VARCHAR,
	"paymentChannelId" VARCHAR,
	"refSrc" VARCHAR,
	"refId" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"bankTransfer" ARRAY(OBJECT(STRICT) AS (
		"fromBankId" varchar,
		"bankAccountId" varchar,
		"transferDate" TIMESTAMP WITH TIME ZONE,
		"slipImgUrl" varchar,
		"transferAmt" double precision,
		"note" text
	)),
	"paymentGateway" ARRAY(OBJECT(STRICT) AS (
		"paymentGatewayId" varchar,
		"paymentDate" TIMESTAMP WITH TIME ZONE,
		"slipImgUrl" varchar,
		"paidAmt" double precision,
		"note" text
	)),
	"creditCard" ARRAY(OBJECT(STRICT) AS (
		"cardTypeId" varchar,
		"cardNo" varchar,
		"cardHolderName" varchar,
		"slipNo" varchar,
		"paidAmt" double precision,
		"note" text
	)),
	"cheque" ARRAY(OBJECT(STRICT) AS (
		"chequeNo" varchar,
		"chequeDate" TIMESTAMP WITH TIME ZONE,
		"chequeAmt" double precision,
		"chequeTypeId" varchar,
		"payerName" varchar,
		"bankId" varchar,
		"bankBranch" varchar,
		"note" text
	)),
	"status" VARCHAR,
	"cashAmt" DOUBLE PRECISION,
	"subtotalAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"discRate" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"totalReceiptAmt" DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS  "Korato"."BankAccountType" (
	"bankAccountTypeId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"bankAccountTypeCode" VARCHAR,
	"bankAccountTypeName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."BankAccount" (
	"bankAccountId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"bankAccountCode" VARCHAR,
	"bankAccountName" VARCHAR,
	"bankAccountTypeId" VARCHAR,
	"bankId" VARCHAR,
	"branchName" VARCHAR,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."CardType" (
	"cardTypeId" VARCHAR PRIMARY KEY,
	"cardTypeCode" VARCHAR,
	"cardTypeName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PaymentGateway" (
	"paymentGatewayId" VARCHAR PRIMARY KEY,
	"paymentGatewayCode" VARCHAR,
	"paymentGatewayName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocReceiptItem" (
	"docReceiptItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docReceiptId" VARCHAR,
	"code" VARCHAR,
	"description" VARCHAR,
	"qty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"refDocNo" VARCHAR,
	"refDocDate" TIMESTAMP WITH TIME ZONE,
	"refDueDate" TIMESTAMP WITH TIME ZONE,
	"note" TEXT,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PaymentChannel" (
	"paymentChannelId" VARCHAR PRIMARY KEY,
	"paymentChannelCode" VARCHAR,
	"paymentChannelName" VARCHAR,
	"channelType" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."AppRoute" (
	"appRouteId" VARCHAR PRIMARY KEY,
	"routeCode" VARCHAR,
	"title" VARCHAR,
	"subtitle" VARCHAR,
	"link" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Attribute" (
	"attributeId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"attributeCode" VARCHAR,
	"attributeName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Wh" (
	"whId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whCode" VARCHAR,
	"whName" VARCHAR,
	"addr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"contact" OBJECT(STRICT) AS (
		"telephone" varchar,
		"mobile" varchar,
		"email" varchar
	),
	"virtual" BOOLEAN,
	"suspended" BOOLEAN
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdWh" (
	"pdWhId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"pdId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"ropQty" DOUBLE PRECISION,
	"status" VARCHAR,
	"pdBranchId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."SalesChannel" (
	"salesChannelId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"salesChannelCode" VARCHAR,
	"salesChannelName" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdLot" (
	"pdLotId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdId" VARCHAR,
	"lotNo" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"mfgDate" TIMESTAMP WITH TIME ZONE,
	"expireDate" TIMESTAMP WITH TIME ZONE,
	"suppLotNo" VARCHAR,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdLotLoc" (
	"pdLotLocId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"pdId" VARCHAR,
	"pdLotId" VARCHAR,
	"locId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"pdLocId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdSn" (
	"pdSnId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"pdId" VARCHAR,
	"sn" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPl" (
	"docPlId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"whId" VARCHAR,
	"custId" VARCHAR,
	"docSoId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPlItem" (
	"docPlItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docPlId" VARCHAR,
	"pdId" VARCHAR,
	"pickQty" DOUBLE PRECISION,
	"uomId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPlSo" (
	"docPlSoId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docPlItemId" VARCHAR,
	"docNo" VARCHAR,
	"custName" VARCHAR,
	"orderedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"dueDate" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocPlLot" (
	"docPlLotId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docPlItemId" VARCHAR,
	"pdLotLocId" VARCHAR,
	"pickQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."Variant" (
	"variantId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"variantCode" VARCHAR,
	"variantName" VARCHAR,
	"variantGroupId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."VariantGroup" (
	"variantGroupId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"variantGroupCode" VARCHAR,
	"variantGroupName" VARCHAR,
	"pdGroupId" VARCHAR,
	"pdCateId" VARCHAR,
	"pdSubcateId" VARCHAR,
	"attributeId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdCustLoc" (
	"pdCustLocId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locId" VARCHAR,
	"pdCustId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"ropQty" DOUBLE PRECISION,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."PdSuppLoc" (
	"pdSuppLocId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locId" VARCHAR,
	"pdSuppId" VARCHAR,
	"ohQty" DOUBLE PRECISION,
	"ropQty" DOUBLE PRECISION,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocDso" (
	"docDsoId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"dueDate" TIMESTAMP WITH TIME ZONE,
	"suppId" VARCHAR,
	"billtoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"custId" VARCHAR,
	"shiptoAddr" OBJECT(STRICT) AS (
		"addr1" varchar,
		"addr2" varchar,
		"country" varchar,
		"province" varchar,
		"district" varchar,
		"town" varchar,
		"zip" varchar
	),
	"subtotalAmt" DOUBLE PRECISION,
	"discAmt" DOUBLE PRECISION,
	"taxRate" DOUBLE PRECISION,
	"taxAmt" DOUBLE PRECISION,
	"totalAmt" DOUBLE PRECISION,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocDsoItem" (
	"docDsoItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"docDsoId" VARCHAR,
	"pdId" VARCHAR,
	"orderedQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"unitPrice" DOUBLE PRECISION,
	"totalPrice" DOUBLE PRECISION,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."BizAllowed" (
	"bizAllowedId" VARCHAR PRIMARY KEY,
	"userId" VARCHAR,
	"refBizId" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."InvMms" (
	"invMmsId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locId" VARCHAR,
	"pdId" VARCHAR,
	"pdLotId" VARCHAR,
	"transDate" TIMESTAMP WITH TIME ZONE,
	"transSrc" VARCHAR,
	"refNo" VARCHAR,
	"refPdNo" VARCHAR,
	"refId" INTEGER,
	"refItemId" INTEGER,
	"origQty" DOUBLE PRECISION,
	"origUomId" VARCHAR,
	"cnvFactor" DOUBLE PRECISION,
	"transQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"sn" VARCHAR,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."AssetMms" (
	"assetMmsId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"whId" VARCHAR,
	"locId" VARCHAR,
	"assetId" VARCHAR,
	"transDate" TIMESTAMP WITH TIME ZONE,
	"transSrc" VARCHAR,
	"transQty" DOUBLE PRECISION,
	"uomId" VARCHAR,
	"refNo" VARCHAR,
	"refAssetNo" VARCHAR,
	"refId" INTEGER,
	"refItemId" INTEGER,
	"status" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgs" (
	"docRgsId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docNo" VARCHAR,
	"docDate" TIMESTAMP WITH TIME ZONE,
	"docRtcId" VARCHAR,
	"status" VARCHAR,
	"mmsStatus" VARCHAR
);

CREATE TABLE IF NOT EXISTS  "Korato"."DocRgsItem" (
	"docRgsItemId" VARCHAR PRIMARY KEY,
	"bizId" VARCHAR,
	"branchId" VARCHAR,
	"docRgsId" VARCHAR,
	"assetId" VARCHAR,
	"shippedQty" INTEGER,
	"uomId" VARCHAR,
	"assetLocId" VARCHAR,
	"docRtcItemId" VARCHAR,
	"status" VARCHAR,
	"mmsStatus" VARCHAR
);

