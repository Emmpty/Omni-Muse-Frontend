/**
 * Enums
 */
export namespace $Enums {
  export const StripeConnectStatus = {
    PendingOnboarding: 'PendingOnboarding',
    Approved: 'Approved',
    PendingVerification: 'PendingVerification',
    Rejected: 'Rejected',
  };

  export type StripeConnectStatus = (typeof StripeConnectStatus)[keyof typeof StripeConnectStatus];

  export const BuzzWithdrawalRequestStatus = {
    Requested: 'Requested',
    Canceled: 'Canceled',
    Rejected: 'Rejected',
    Approved: 'Approved',
    Reverted: 'Reverted',
    Transferred: 'Transferred',
    ExternallyResolved: 'ExternallyResolved',
  };

  export type BuzzWithdrawalRequestStatus =
    (typeof BuzzWithdrawalRequestStatus)[keyof typeof BuzzWithdrawalRequestStatus];

  export const Currency = {
    USD: 'USD',
    BUZZ: 'BUZZ',
  };

  export type Currency = (typeof Currency)[keyof typeof Currency];

  export const UserEngagementType = {
    Follow: 'Follow',
    Hide: 'Hide',
  };

  export type UserEngagementType = (typeof UserEngagementType)[keyof typeof UserEngagementType];

  export const MetricTimeframe = {
    Day: 'Day',
    Week: 'Week',
    Month: 'Month',
    Year: 'Year',
    AllTime: 'AllTime',
  };

  export type MetricTimeframe = (typeof MetricTimeframe)[keyof typeof MetricTimeframe];

  export const LinkType = {
    Sponsorship: 'Sponsorship',
    Social: 'Social',
    Other: 'Other',
  };

  export type LinkType = (typeof LinkType)[keyof typeof LinkType];

  export const ImportStatus = {
    Pending: 'Pending',
    Processing: 'Processing',
    Failed: 'Failed',
    Completed: 'Completed',
  };

  export type ImportStatus = (typeof ImportStatus)[keyof typeof ImportStatus];

  export const ModelType = {
    Checkpoint: 'Checkpoint',
    TextualInversion: 'TextualInversion',
    Hypernetwork: 'Hypernetwork',
    AestheticGradient: 'AestheticGradient',
    LORA: 'LORA',
    LoCon: 'LoCon',
    DoRA: 'DoRA',
    Controlnet: 'Controlnet',
    Upscaler: 'Upscaler',
    MotionModule: 'MotionModule',
    VAE: 'VAE',
    Poses: 'Poses',
    Wildcards: 'Wildcards',
    Workflows: 'Workflows',
    Other: 'Other',
  };

  export type ModelType = (typeof ModelType)[keyof typeof ModelType];

  export const ModelStatus = {
    Draft: 'Draft',
    Training: 'Training',
    Published: 'Published',
    Scheduled: 'Scheduled',
    Unpublished: 'Unpublished',
    UnpublishedViolation: 'UnpublishedViolation',
    GatherInterest: 'GatherInterest',
    Deleted: 'Deleted',
  };

  export type ModelStatus = (typeof ModelStatus)[keyof typeof ModelStatus];

  export const CheckpointType = {
    Trained: 'Trained',
    Merge: 'Merge',
  };

  export type CheckpointType = (typeof CheckpointType)[keyof typeof CheckpointType];

  export const ModelUploadType = {
    Created: 'Created',
    Trained: 'Trained',
  };

  export type ModelUploadType = (typeof ModelUploadType)[keyof typeof ModelUploadType];

  export const ModelModifier = {
    Archived: 'Archived',
    TakenDown: 'TakenDown',
  };

  export type ModelModifier = (typeof ModelModifier)[keyof typeof ModelModifier];

  export const Availability = {
    Public: 'Public',
    Unsearchable: 'Unsearchable',
    Private: 'Private',
  };

  export type Availability = (typeof Availability)[keyof typeof Availability];

  export const CommercialUse = {
    None: 'None',
    Image: 'Image',
    RentCivit: 'RentCivit',
    Rent: 'Rent',
    Sell: 'Sell',
  };

  export type CommercialUse = (typeof CommercialUse)[keyof typeof CommercialUse];

  export const ModelEngagementType = {
    Favorite: 'Favorite',
    Hide: 'Hide',
    Mute: 'Mute',
    Notify: 'Notify',
  };

  export type ModelEngagementType = (typeof ModelEngagementType)[keyof typeof ModelEngagementType];

  export const ModelVersionSponsorshipSettingsType = {
    FixedPrice: 'FixedPrice',
    Bidding: 'Bidding',
  };

  export type ModelVersionSponsorshipSettingsType =
    (typeof ModelVersionSponsorshipSettingsType)[keyof typeof ModelVersionSponsorshipSettingsType];

  export const ModelVersionMonetizationType = {
    PaidAccess: 'PaidAccess',
    PaidEarlyAccess: 'PaidEarlyAccess',
    PaidGeneration: 'PaidGeneration',
    CivitaiClubOnly: 'CivitaiClubOnly',
    MySubscribersOnly: 'MySubscribersOnly',
    Sponsored: 'Sponsored',
  };

  export type ModelVersionMonetizationType =
    (typeof ModelVersionMonetizationType)[keyof typeof ModelVersionMonetizationType];

  export const TrainingStatus = {
    Pending: 'Pending',
    Submitted: 'Submitted',
    Processing: 'Processing',
    InReview: 'InReview',
    Failed: 'Failed',
    Approved: 'Approved',
  };

  export type TrainingStatus = (typeof TrainingStatus)[keyof typeof TrainingStatus];

  export const ModelVersionEngagementType = {
    Notify: 'Notify',
  };

  export type ModelVersionEngagementType =
    (typeof ModelVersionEngagementType)[keyof typeof ModelVersionEngagementType];

  export const ModelHashType = {
    AutoV1: 'AutoV1',
    AutoV2: 'AutoV2',
    AutoV3: 'AutoV3',
    SHA256: 'SHA256',
    CRC32: 'CRC32',
    BLAKE3: 'BLAKE3',
  };

  export type ModelHashType = (typeof ModelHashType)[keyof typeof ModelHashType];

  export const ScanResultCode = {
    Pending: 'Pending',
    Success: 'Success',
    Danger: 'Danger',
    Error: 'Error',
  };

  export type ScanResultCode = (typeof ScanResultCode)[keyof typeof ScanResultCode];

  export const ModelFileVisibility = {
    Sensitive: 'Sensitive',
    Private: 'Private',
    Public: 'Public',
  };

  export type ModelFileVisibility = (typeof ModelFileVisibility)[keyof typeof ModelFileVisibility];

  export const AssociationType = {
    Suggested: 'Suggested',
  };

  export type AssociationType = (typeof AssociationType)[keyof typeof AssociationType];

  export const ReportReason = {
    TOSViolation: 'TOSViolation',
    NSFW: 'NSFW',
    Ownership: 'Ownership',
    AdminAttention: 'AdminAttention',
    Claim: 'Claim',
    CSAM: 'CSAM',
  };

  export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];

  export const ReportStatus = {
    Pending: 'Pending',
    Processing: 'Processing',
    Actioned: 'Actioned',
    Unactioned: 'Unactioned',
  };

  export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

  export const ReviewReactions = {
    Like: 'Like',
    Dislike: 'Dislike',
    Laugh: 'Laugh',
    Cry: 'Cry',
    Heart: 'Heart',
  };

  export type ReviewReactions = (typeof ReviewReactions)[keyof typeof ReviewReactions];

  export const MediaType = {
    image: 'image',
    video: 'video',
    audio: 'audio',
  };

  export type MediaType = (typeof MediaType)[keyof typeof MediaType];

  export const NsfwLevel = {
    None: 'None',
    Soft: 'Soft',
    Mature: 'Mature',
    X: 'X',
    Blocked: 'Blocked',
  };

  export type NsfwLevel = (typeof NsfwLevel)[keyof typeof NsfwLevel];

  export const ImageGenerationProcess = {
    txt2img: 'txt2img',
    txt2imgHiRes: 'txt2imgHiRes',
    img2img: 'img2img',
    inpainting: 'inpainting',
  };

  export type ImageGenerationProcess =
    (typeof ImageGenerationProcess)[keyof typeof ImageGenerationProcess];

  export const ImageIngestionStatus = {
    Pending: 'Pending',
    Scanned: 'Scanned',
    Error: 'Error',
    Blocked: 'Blocked',
    NotFound: 'NotFound',
  };

  export type ImageIngestionStatus =
    (typeof ImageIngestionStatus)[keyof typeof ImageIngestionStatus];

  export const ImageEngagementType = {
    Favorite: 'Favorite',
    Hide: 'Hide',
  };

  export type ImageEngagementType = (typeof ImageEngagementType)[keyof typeof ImageEngagementType];

  export const TagType = {
    UserGenerated: 'UserGenerated',
    Label: 'Label',
    Moderation: 'Moderation',
    System: 'System',
  };

  export type TagType = (typeof TagType)[keyof typeof TagType];

  export const TagTarget = {
    Model: 'Model',
    Question: 'Question',
    Image: 'Image',
    Post: 'Post',
    Tag: 'Tag',
    Article: 'Article',
    Bounty: 'Bounty',
  };

  export type TagTarget = (typeof TagTarget)[keyof typeof TagTarget];

  export const TagsOnTagsType = {
    Parent: 'Parent',
    Replace: 'Replace',
    Append: 'Append',
  };

  export type TagsOnTagsType = (typeof TagsOnTagsType)[keyof typeof TagsOnTagsType];

  export const TagSource = {
    User: 'User',
    Rekognition: 'Rekognition',
    WD14: 'WD14',
    Computed: 'Computed',
  };

  export type TagSource = (typeof TagSource)[keyof typeof TagSource];

  export const PartnerPricingModel = {
    Duration: 'Duration',
    PerImage: 'PerImage',
  };

  export type PartnerPricingModel = (typeof PartnerPricingModel)[keyof typeof PartnerPricingModel];

  export const KeyScope = {
    Read: 'Read',
    Write: 'Write',
  };

  export type KeyScope = (typeof KeyScope)[keyof typeof KeyScope];

  export const NotificationCategory = {
    Comment: 'Comment',
    Update: 'Update',
    Milestone: 'Milestone',
    Bounty: 'Bounty',
    Buzz: 'Buzz',
    System: 'System',
    Other: 'Other',
  };

  export type NotificationCategory =
    (typeof NotificationCategory)[keyof typeof NotificationCategory];

  export const TagEngagementType = {
    Hide: 'Hide',
    Follow: 'Follow',
    Allow: 'Allow',
  };

  export type TagEngagementType = (typeof TagEngagementType)[keyof typeof TagEngagementType];

  export const CosmeticType = {
    Badge: 'Badge',
    NamePlate: 'NamePlate',
    ContentDecoration: 'ContentDecoration',
  };

  export type CosmeticType = (typeof CosmeticType)[keyof typeof CosmeticType];

  export const CosmeticSource = {
    Trophy: 'Trophy',
    Purchase: 'Purchase',
    Event: 'Event',
    Membership: 'Membership',
    Claim: 'Claim',
  };

  export type CosmeticSource = (typeof CosmeticSource)[keyof typeof CosmeticSource];

  export const ArticleEngagementType = {
    Favorite: 'Favorite',
    Hide: 'Hide',
  };

  export type ArticleEngagementType =
    (typeof ArticleEngagementType)[keyof typeof ArticleEngagementType];

  export const GenerationSchedulers = {
    EulerA: 'EulerA',
    Euler: 'Euler',
    LMS: 'LMS',
    Heun: 'Heun',
    DPM2: 'DPM2',
    DPM2A: 'DPM2A',
    DPM2SA: 'DPM2SA',
    DPM2M: 'DPM2M',
    DPMSDE: 'DPMSDE',
    DPMFast: 'DPMFast',
    DPMAdaptive: 'DPMAdaptive',
    LMSKarras: 'LMSKarras',
    DPM2Karras: 'DPM2Karras',
    DPM2AKarras: 'DPM2AKarras',
    DPM2SAKarras: 'DPM2SAKarras',
    DPM2MKarras: 'DPM2MKarras',
    DPMSDEKarras: 'DPMSDEKarras',
    DDIM: 'DDIM',
  };

  export type GenerationSchedulers =
    (typeof GenerationSchedulers)[keyof typeof GenerationSchedulers];

  export const CollectionWriteConfiguration = {
    Private: 'Private',
    Public: 'Public',
    Review: 'Review',
  };

  export type CollectionWriteConfiguration =
    (typeof CollectionWriteConfiguration)[keyof typeof CollectionWriteConfiguration];

  export const CollectionReadConfiguration = {
    Private: 'Private',
    Public: 'Public',
    Unlisted: 'Unlisted',
  };

  export type CollectionReadConfiguration =
    (typeof CollectionReadConfiguration)[keyof typeof CollectionReadConfiguration];

  export const CollectionType = {
    Model: 'Model',
    Article: 'Article',
    Post: 'Post',
    Image: 'Image',
  };

  export type CollectionType = (typeof CollectionType)[keyof typeof CollectionType];

  export const CollectionMode = {
    Contest: 'Contest',
    Bookmark: 'Bookmark',
  };

  export type CollectionMode = (typeof CollectionMode)[keyof typeof CollectionMode];

  export const CollectionItemStatus = {
    ACCEPTED: 'ACCEPTED',
    REVIEW: 'REVIEW',
    REJECTED: 'REJECTED',
  };

  export type CollectionItemStatus =
    (typeof CollectionItemStatus)[keyof typeof CollectionItemStatus];

  export const CollectionContributorPermission = {
    VIEW: 'VIEW',
    ADD: 'ADD',
    ADD_REVIEW: 'ADD_REVIEW',
    MANAGE: 'MANAGE',
  };

  export type CollectionContributorPermission =
    (typeof CollectionContributorPermission)[keyof typeof CollectionContributorPermission];

  export const HomeBlockType = {
    Collection: 'Collection',
    Announcement: 'Announcement',
    Leaderboard: 'Leaderboard',
    Social: 'Social',
    Event: 'Event',
  };

  export type HomeBlockType = (typeof HomeBlockType)[keyof typeof HomeBlockType];

  export const BountyMode = {
    Individual: 'Individual',
    Split: 'Split',
  };

  export type BountyMode = (typeof BountyMode)[keyof typeof BountyMode];

  export const BountyEntryMode = {
    Open: 'Open',
    BenefactorsOnly: 'BenefactorsOnly',
  };

  export type BountyEntryMode = (typeof BountyEntryMode)[keyof typeof BountyEntryMode];

  export const BountyType = {
    // ModelCreation: 'ModelCreation',
    // LoraCreation: 'LoraCreation',
    // EmbedCreation: 'EmbedCreation',
    // DataSetCreation: 'DataSetCreation',
    // DataSetCaption: 'DataSetCaption',
    // ImageCreation: 'ImageCreation',
    // VideoCreation: 'VideoCreation',
    // Other: 'Other',
    Checkpoint: 'Checkpoint',
    TextualInversion: 'TextualInversion',
    Hypernetwork: 'Hypernetwork',
    LoRA: 'LoRA',
    LyCORIS: 'LyCORIS',
    Controlnet: 'Controlnet',
    Wildcards: 'Wildcards'
  };

  export type BountyType = (typeof BountyType)[keyof typeof BountyType];

  export const BountyEngagementType = {
    Favorite: 'Favorite',
    Track: 'Track',
  };

  export type BountyEngagementType =
    (typeof BountyEngagementType)[keyof typeof BountyEngagementType];

  export const ClubAdminPermission = {
    ManageMemberships: 'ManageMemberships',
    ManageTiers: 'ManageTiers',
    ManagePosts: 'ManagePosts',
    ManageClub: 'ManageClub',
    ManageResources: 'ManageResources',
    ViewRevenue: 'ViewRevenue',
    WithdrawRevenue: 'WithdrawRevenue',
  };

  export type ClubAdminPermission = (typeof ClubAdminPermission)[keyof typeof ClubAdminPermission];

  export const ChatMemberStatus = {
    Invited: 'Invited',
    Joined: 'Joined',
    Ignored: 'Ignored',
    Left: 'Left',
    Kicked: 'Kicked',
  };

  export type ChatMemberStatus = (typeof ChatMemberStatus)[keyof typeof ChatMemberStatus];

  export const ChatMessageType = {
    Markdown: 'Markdown',
  };

  export type ChatMessageType = (typeof ChatMessageType)[keyof typeof ChatMessageType];

  export const PurchasableRewardUsage = {
    SingleUse: 'SingleUse',
    MultiUse: 'MultiUse',
  };

  export type PurchasableRewardUsage =
    (typeof PurchasableRewardUsage)[keyof typeof PurchasableRewardUsage];

  export const JobQueueType = {
    CleanUp: 'CleanUp',
    UpdateMetrics: 'UpdateMetrics',
    UpdateNsfwLevel: 'UpdateNsfwLevel',
    UpdateSearchIndex: 'UpdateSearchIndex',
  };

  export type JobQueueType = (typeof JobQueueType)[keyof typeof JobQueueType];

  export const EntityType = {
    Image: 'Image',
    Post: 'Post',
    Article: 'Article',
    Bounty: 'Bounty',
    BountyEntry: 'BountyEntry',
    ModelVersion: 'ModelVersion',
    Model: 'Model',
    Collection: 'Collection',
  };

  export type EntityType = (typeof EntityType)[keyof typeof EntityType];

  export const VaultItemStatus = {
    Pending: 'Pending',
    Stored: 'Stored',
    Failed: 'Failed',
  };

  export type VaultItemStatus = (typeof VaultItemStatus)[keyof typeof VaultItemStatus];
}

export type StripeConnectStatus = $Enums.StripeConnectStatus;

export const StripeConnectStatus: typeof $Enums.StripeConnectStatus = $Enums.StripeConnectStatus;

export type BuzzWithdrawalRequestStatus = $Enums.BuzzWithdrawalRequestStatus;

export const BuzzWithdrawalRequestStatus: typeof $Enums.BuzzWithdrawalRequestStatus =
  $Enums.BuzzWithdrawalRequestStatus;

export type Currency = $Enums.Currency;

export const Currency: typeof $Enums.Currency = $Enums.Currency;

export type UserEngagementType = $Enums.UserEngagementType;

export const UserEngagementType: typeof $Enums.UserEngagementType = $Enums.UserEngagementType;

export type MetricTimeframe = $Enums.MetricTimeframe;

export const MetricTimeframe: typeof $Enums.MetricTimeframe = $Enums.MetricTimeframe;

export type LinkType = $Enums.LinkType;

export const LinkType: typeof $Enums.LinkType = $Enums.LinkType;

export type ImportStatus = $Enums.ImportStatus;

export const ImportStatus: typeof $Enums.ImportStatus = $Enums.ImportStatus;

export type ModelType = $Enums.ModelType;

export const ModelType: typeof $Enums.ModelType = $Enums.ModelType;

export type ModelStatus = $Enums.ModelStatus;

export const ModelStatus: typeof $Enums.ModelStatus = $Enums.ModelStatus;

export type CheckpointType = $Enums.CheckpointType;

export const CheckpointType: typeof $Enums.CheckpointType = $Enums.CheckpointType;

export type ModelUploadType = $Enums.ModelUploadType;

export const ModelUploadType: typeof $Enums.ModelUploadType = $Enums.ModelUploadType;

export type ModelModifier = $Enums.ModelModifier;

export const ModelModifier: typeof $Enums.ModelModifier = $Enums.ModelModifier;

export type Availability = $Enums.Availability;

export const Availability: typeof $Enums.Availability = $Enums.Availability;

export type CommercialUse = $Enums.CommercialUse;

export const CommercialUse: typeof $Enums.CommercialUse = $Enums.CommercialUse;

export type ModelEngagementType = $Enums.ModelEngagementType;

export const ModelEngagementType: typeof $Enums.ModelEngagementType = $Enums.ModelEngagementType;

export type ModelVersionSponsorshipSettingsType = $Enums.ModelVersionSponsorshipSettingsType;

export const ModelVersionSponsorshipSettingsType: typeof $Enums.ModelVersionSponsorshipSettingsType =
  $Enums.ModelVersionSponsorshipSettingsType;

export type ModelVersionMonetizationType = $Enums.ModelVersionMonetizationType;

export const ModelVersionMonetizationType: typeof $Enums.ModelVersionMonetizationType =
  $Enums.ModelVersionMonetizationType;

export type TrainingStatus = $Enums.TrainingStatus;

export const TrainingStatus: typeof $Enums.TrainingStatus = $Enums.TrainingStatus;

export type ModelVersionEngagementType = $Enums.ModelVersionEngagementType;

export const ModelVersionEngagementType: typeof $Enums.ModelVersionEngagementType =
  $Enums.ModelVersionEngagementType;

export type ModelHashType = $Enums.ModelHashType;

export const ModelHashType: typeof $Enums.ModelHashType = $Enums.ModelHashType;

export type ScanResultCode = $Enums.ScanResultCode;

export const ScanResultCode: typeof $Enums.ScanResultCode = $Enums.ScanResultCode;

export type ModelFileVisibility = $Enums.ModelFileVisibility;

export const ModelFileVisibility: typeof $Enums.ModelFileVisibility = $Enums.ModelFileVisibility;

export type AssociationType = $Enums.AssociationType;

export const AssociationType: typeof $Enums.AssociationType = $Enums.AssociationType;

export type ReportReason = $Enums.ReportReason;

export const ReportReason: typeof $Enums.ReportReason = $Enums.ReportReason;

export type ReportStatus = $Enums.ReportStatus;

export const ReportStatus: typeof $Enums.ReportStatus = $Enums.ReportStatus;

export type ReviewReactions = $Enums.ReviewReactions;

export const ReviewReactions: typeof $Enums.ReviewReactions = $Enums.ReviewReactions;

export type MediaType = $Enums.MediaType;

export const MediaType: typeof $Enums.MediaType = $Enums.MediaType;

export type NsfwLevel = $Enums.NsfwLevel;

export const NsfwLevel: typeof $Enums.NsfwLevel = $Enums.NsfwLevel;

export type ImageGenerationProcess = $Enums.ImageGenerationProcess;

export const ImageGenerationProcess: typeof $Enums.ImageGenerationProcess =
  $Enums.ImageGenerationProcess;

export type ImageIngestionStatus = $Enums.ImageIngestionStatus;

export const ImageIngestionStatus: typeof $Enums.ImageIngestionStatus = $Enums.ImageIngestionStatus;

export type ImageEngagementType = $Enums.ImageEngagementType;

export const ImageEngagementType: typeof $Enums.ImageEngagementType = $Enums.ImageEngagementType;

export type TagType = $Enums.TagType;

export const TagType: typeof $Enums.TagType = $Enums.TagType;

export type TagTarget = $Enums.TagTarget;

export const TagTarget: typeof $Enums.TagTarget = $Enums.TagTarget;

export type TagsOnTagsType = $Enums.TagsOnTagsType;

export const TagsOnTagsType: typeof $Enums.TagsOnTagsType = $Enums.TagsOnTagsType;

export type TagSource = $Enums.TagSource;

export const TagSource: typeof $Enums.TagSource = $Enums.TagSource;

export type PartnerPricingModel = $Enums.PartnerPricingModel;

export const PartnerPricingModel: typeof $Enums.PartnerPricingModel = $Enums.PartnerPricingModel;

export type KeyScope = $Enums.KeyScope;

export const KeyScope: typeof $Enums.KeyScope = $Enums.KeyScope;

export type NotificationCategory = $Enums.NotificationCategory;

export const NotificationCategory: typeof $Enums.NotificationCategory = $Enums.NotificationCategory;

export type TagEngagementType = $Enums.TagEngagementType;

export const TagEngagementType: typeof $Enums.TagEngagementType = $Enums.TagEngagementType;

export type CosmeticType = $Enums.CosmeticType;

export const CosmeticType: typeof $Enums.CosmeticType = $Enums.CosmeticType;

export type CosmeticSource = $Enums.CosmeticSource;

export const CosmeticSource: typeof $Enums.CosmeticSource = $Enums.CosmeticSource;

export type ArticleEngagementType = $Enums.ArticleEngagementType;

export const ArticleEngagementType: typeof $Enums.ArticleEngagementType =
  $Enums.ArticleEngagementType;

export type GenerationSchedulers = $Enums.GenerationSchedulers;

export const GenerationSchedulers: typeof $Enums.GenerationSchedulers = $Enums.GenerationSchedulers;

export type CollectionWriteConfiguration = $Enums.CollectionWriteConfiguration;

export const CollectionWriteConfiguration: typeof $Enums.CollectionWriteConfiguration =
  $Enums.CollectionWriteConfiguration;

export type CollectionReadConfiguration = $Enums.CollectionReadConfiguration;

export const CollectionReadConfiguration: typeof $Enums.CollectionReadConfiguration =
  $Enums.CollectionReadConfiguration;

export type CollectionType = $Enums.CollectionType;

export const CollectionType: typeof $Enums.CollectionType = $Enums.CollectionType;

export type CollectionMode = $Enums.CollectionMode;

export const CollectionMode: typeof $Enums.CollectionMode = $Enums.CollectionMode;

export type CollectionItemStatus = $Enums.CollectionItemStatus;

export const CollectionItemStatus: typeof $Enums.CollectionItemStatus = $Enums.CollectionItemStatus;

export type CollectionContributorPermission = $Enums.CollectionContributorPermission;

export const CollectionContributorPermission: typeof $Enums.CollectionContributorPermission =
  $Enums.CollectionContributorPermission;

export type HomeBlockType = $Enums.HomeBlockType;

export const HomeBlockType: typeof $Enums.HomeBlockType = $Enums.HomeBlockType;

export type BountyMode = $Enums.BountyMode;

export const BountyMode: typeof $Enums.BountyMode = $Enums.BountyMode;

export type BountyEntryMode = $Enums.BountyEntryMode;

export const BountyEntryMode: typeof $Enums.BountyEntryMode = $Enums.BountyEntryMode;

export type BountyType = $Enums.BountyType;

export const BountyType: typeof $Enums.BountyType = $Enums.BountyType;

export type BountyEngagementType = $Enums.BountyEngagementType;

export const BountyEngagementType: typeof $Enums.BountyEngagementType = $Enums.BountyEngagementType;

export type ClubAdminPermission = $Enums.ClubAdminPermission;

export const ClubAdminPermission: typeof $Enums.ClubAdminPermission = $Enums.ClubAdminPermission;

export type ChatMemberStatus = $Enums.ChatMemberStatus;

export const ChatMemberStatus: typeof $Enums.ChatMemberStatus = $Enums.ChatMemberStatus;

export type ChatMessageType = $Enums.ChatMessageType;

export const ChatMessageType: typeof $Enums.ChatMessageType = $Enums.ChatMessageType;

export type PurchasableRewardUsage = $Enums.PurchasableRewardUsage;

export const PurchasableRewardUsage: typeof $Enums.PurchasableRewardUsage =
  $Enums.PurchasableRewardUsage;

export type JobQueueType = $Enums.JobQueueType;

export const JobQueueType: typeof $Enums.JobQueueType = $Enums.JobQueueType;

export type EntityType = $Enums.EntityType;

export const EntityType: typeof $Enums.EntityType = $Enums.EntityType;

export type VaultItemStatus = $Enums.VaultItemStatus;

export const VaultItemStatus: typeof $Enums.VaultItemStatus = $Enums.VaultItemStatus;
