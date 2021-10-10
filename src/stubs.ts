import { TBusinessProfileMetric, TSocialType } from "./types";

export function GetBusinessProfileMetricStub(bpID: number, social_type: TSocialType): TBusinessProfileMetric {
	return {
		max_faves: 49287.0,
		avg_faves: 19.4177,
		max_replies: 6351.0,
		avg_replies: 2.4554,
		max_shares: 170.0,
		avg_shares: 0.0926,
		avg_rating: 0,
		max_followers: 0,
		avg_followers: 0,
		max_engagements: 55808,
	};
}
