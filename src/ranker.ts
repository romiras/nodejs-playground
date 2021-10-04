import { logger } from "./logger";
import {
	TStatus,
	TStatusID,
	TStreamID,
	TBusinessProfileID,
	TBusinessProfileMetric,
	TScore
} from "./types";
import { GetStatusesByIDs } from "./repositories/elasticsearch";

export interface IRanker {
	Rank(ids: Array<TStatusID>): void
}

export class Ranker implements IRanker {
	Rank(ids: Array<TStatusID>): void {
		const statuses = GetStatusesByIDs(ids);
		logger.log('debug', statuses);

		statuses.forEach(status => {
			let stream_ids = GetStatusStreamIDs(status);

			let bp_ids = GetBusinessProfileIDs(stream_ids);
			// handle error

			let scores: Map<TStatusID, TScore> = new Map();

			bp_ids.forEach(bp_id => {
				let bp_metric = GetBusinessProfileMetric(bp_id, status.social_type);
				// handle error

				let new_score = this.GetStatusScore(status, bp_metric)
				this.SetStatusScore(scores, status.status_id, new_score)
			});

			this.UpdateStatusScores(scores)
		});
	}

	// update status's score
	private SetStatusScore(scores: Map<TStatusID, TScore>, status_id: TStatusID, new_score: TScore): void {
		let score = scores.get(status_id);

		if (score === undefined) {
			scores.set(status_id, new_score);
		} else if (new_score > score) {
			scores.set(status_id, new_score); // set to max score across all BPs
		}
	}

	// returns calculated status's score
	private GetStatusScore(status: TStatus, bp_metric: TBusinessProfileMetric): TScore {
		let attrs = status.attrs;

		let author_counts = attrs.author.counts || {};
		let max_engagements = bp_metric.max_engagements || 0;
	
		// for now networks where there are follower counts are calculated the same as networks
		// that don't have follower counts. it is generally acceptable when a social network is
		// only compared to itself, but in our use-case this is not the case, so we'll need to
		// calculate it differently on different networks
		let followers_count = author_counts.followers || 0;

		let max_followers = bp_metric.max_followers || 0;

		// assign better scores to non-neutral statuses
		let sentiment_score = NEUTRAL_SET.include(sentiment.value) ? 0.0 : 1.0;

		// R NOTE: for some reason, favorites and replies on Twitter are strings,
		// even though the Elastic mapping is "long". need to check further.
		let engagements = this.GetEngagementsCount(attrs.counts, attrs.social_type)

		// RNOTE: why 50?
		let engagement_score = (max_engagements > 0) ? 50.0 * (engagements / max_engagements.toFixed(3)) : 0.0;
	
		let identity_score = (max_followers > 0) ? (followers_count.toFixed(3) / max_followers.toFixed(3)) : 0.0;

		// RNOTE: no idea why we use another parameter with the identity score
		let impact_score = 0.25 * identity_score;

		// temporarily removed mentioned from the score since we need to devise a proper
		// mechanism for selecting which mentions count, and how it performs across different
		// streams and business profiles
	
		// in an ideal scenario, the weights for each independent variable should be
		// determined by calculating the weight's significance among a dataset of documents
		// that were manually ranked. unfortunately, instead, we have this
		let score = 10 * (
			(engagement_score * 0.5) +
			(impact_score * 0.2) +
			(sentiment_score * 0.3)
		);

		return score
	}

	private GetEngagementsCount(counts: Object, social_type: string): number {
		// TODO implement GetEngagementsCount

		switch (social_type) {
			case Constants::SocialType::GP, Constants::SocialType::TP, Constants::SocialType::IOS:
				return 10 - counts.rating.to_i;

			case Constants::SocialType::Twitter:
				return counts[:favorites].to_i +
				counts.hasOwnPropertyreplies.to_i +
				(counts.shares.to_i || 0);

			default:
				return 0;
		}
	}

	private UpdateStatusScores(scores: Map<TStatusID, TScore>): void {
		// TODO implement UpdateStatusScores

		for (let [status_id, score] of scores) {
			// update status.counts.score in ES
		}
	}
}

// get stream IDs from status
function GetStatusStreamIDs(status: TStatus): Array<TStreamID> {
	// TODO implement GetStatusStreamIDs

	// let attrs = status.attrs;
	// return attrs.stream_ids || attrs.properties&.stream_ids || []

	return Array<TStreamID>();
}

// get BPs' IDs by stream IDs
function GetBusinessProfileIDs(streamIDs: Array<TStreamID>): Array<TBusinessProfileID> {
	// TODO implement GetBusinessProfileIDs

	return Array<TBusinessProfileID>();
}

// get BP's metric
function GetBusinessProfileMetric(id: number, social_type: string): TBusinessProfileMetric {
	// TODO implement GetBusinessProfileMetric

	return {}
}
