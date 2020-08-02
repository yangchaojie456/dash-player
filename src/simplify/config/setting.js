module.exports = {
    playerSettings: {
        streaming: {
            metricsMaxListDepth: 1000,
            abandonLoadTimeout: 10000,
            liveDelayFragmentCount: NaN,
            liveDelay: null,
            scheduleWhilePaused: true,
            fastSwitchEnabled: false,
            bufferPruningInterval: 10,
            bufferToKeep: 20,
            bufferAheadToKeep: 80,
            jumpGaps: true,
            smallGapLimit: 1.5,
            stableBufferTime: 12,
            bufferTimeAtTopQuality: 30,
            bufferTimeAtTopQualityLongForm: 60,
            longFormContentDurationThreshold: 600,
            wallclockTimeUpdateInterval: 50,
            lowLatencyEnabled: false,
            keepProtectionMediaKeys: false,
            useManifestDateHeaderTimeSource: true,
            useSuggestedPresentationDelay: true,
            useAppendWindowEnd: true,
            manifestUpdateRetryInterval: 100,
            liveCatchUpMinDrift: 0.02,
            liveCatchUpMaxDrift: 0,
            liveCatchUpPlaybackRate: 0.5,
            lastBitrateCachingInfo: { enabled: true, ttl: 360000 },
            lastMediaSettingsCachingInfo: { enabled: true, ttl: 360000 },
            cacheLoadThresholds: { video: 50, audio: 5 },
            retryIntervals: {
                MPD: 500,
                XLinkExpansion: 500,
                InitializationSegment: 1000,
                IndexSegment: 1000,
                MediaSegment: 1000,
                BitstreamSwitchingSegment: 1000,
                other: 1000,
                lowLatencyReductionFactor: 10
            },
            retryAttempts: {
                MPD: 3,
                XLinkExpansion: 1,
                InitializationSegment: 3,
                IndexSegment: 3,
                MediaSegment: 3,
                BitstreamSwitchingSegment: 3,
                other: 3,
                lowLatencyMultiplyFactor: 5
            },
            abr: {
                movingAverageMethod: 'slidingWindow',
                ABRStrategy: 'abrDynamic',
                bandwidthSafetyFactor: 0.9,
                useDefaultABRRules: true,
                useBufferOccupancyABR: false,
                useDeadTimeLatency: true,
                limitBitrateByPortal: false,
                usePixelRatioInLimitBitrateByPortal: false,
                maxBitrate: { audio: -1, video: -1 },
                minBitrate: { audio: -1, video: -1 },
                maxRepresentationRatio: { audio: 1, video: 1 },
                initialBitrate: { audio: -1, video: -1 },
                initialRepresentationRatio: { audio: -1, video: -1 },
                autoSwitchBitrate: { audio: true, video: true }
            },
            cmcd: {
                enabled: false,
                sid: null,
                cid: null,
                did: null
            }
        }
    }
}