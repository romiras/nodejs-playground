export type TStatusID = string;
export type TStatusAttributes = {
    author: Object;
    counts: Object;
    social_type: TSocialType;
};
export type TSocialType = number;
export type TStatus = {
    status_id: string;
    social_type: TSocialType;
    attrs: TStatusAttributes;
    sentiment: TSentiment;
};
export type TStreamID = string;
export type TBusinessProfileID = number;
export type TBusinessProfileMetric = {
    max_engagements: number;
    max_followers: number;
};
export type TScore = number;
export type TSentiment = {
    value: number
};
