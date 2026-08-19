export const CONSTANTS = {
    // Follows the region the CDK CLI resolved from your AWS profile.
    // Falls back to the original value when the CLI did not set it.
    // Both frames must resolve to the SAME region: devteam2-frame imports
    // main-frame's CloudFormation exports, and exports are region-scoped.
    REGION: process.env.CDK_DEFAULT_REGION || 'ap-northeast-2',
    PROJECT_NAME: 'CDKDemo',
}