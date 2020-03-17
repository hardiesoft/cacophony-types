declare namespace cacophony {
    // Types go here

    export type DeviceId = number;
    export type RecordingId = number;
    export type TrackId = number;
    export type TagId = number;
    export type UserId = number;
    export type TrackTagId = number;
    export type GroupId = number;
    export type JwtToken<T> = string;
    type UtcTimestamp = string;

    interface FetchResult<T> {
        result: T;
        success: boolean;
        status: number;
    }

    interface Device {
        id: DeviceId;
        devicename: string;
    }

    interface Location {
        type: "Point" | string;
        coordinates: [number, number];
    }

    export type RecordingType = "thermalRaw" | "audio";

    export interface RecordingInfo {
        id: RecordingId;
        type: RecordingType;
        recordingDateTime: UtcTimestamp;
        rawMimeType: string;
        fileMimeType: string;
        processingState: "FINISHED"; // Or?
        duration: number; //seconds
        location: Location;
        batteryLevel: null;
        DeviceId: DeviceId;
        GroupId: GroupId;
        Group: {
            groupname: string;
        };
        Tags: Tag[];
        Tracks: Track[];
        Device: Device;

        fileKey?: string;
        comment?: string | null;
        rawFileKey?: string;
        relativeToDawn?: null;
        relativeToDusk?: null;
        version?: null;
        batteryCharging?: null;
        airplaneModeOn?: null;
        additionalMetadata?: {
            algorithm: number;
            previewSecs: number;
        };
    }

    export interface LimitedTrack {
        TrackId: TrackId;
        data: {
            start_s: number;
            end_s: number;
            positions: [Seconds, Rectangle][];
            num_frames: number;
        };
        tags: string[];
        needsTagging: boolean;
    }

    export interface TagLimitedRecording {
        RecordingId: RecordingId;
        DeviceId: DeviceId;
        tracks: LimitedTrack[];
        recordingJWT: JwtToken<Mp4File>;
        tagJWT: JwtToken<TrackTag>;
    }

    type Mp4File = "string";
    type CptvFile = "string";
    export interface Recording {
        messages: [];
        recording: RecordingInfo;
        rawSize: number; // CPTV size
        fileSize: number; // MP4 size
        downloadFileJWT: JwtToken<Mp4File>;
        downloadRawJWT: JwtToken<CptvFile>;
        success: boolean;
    }

    type Seconds = number;
    type Rectangle = [number, number, number, number];

    export interface Track {
        id: TrackId;
        data: {
            positions: [Seconds, Rectangle][];
            start_s: Seconds;
            end_s: Seconds;
            tag: string;
            label: string;
            clarity: number;
            confidence: number;
            num_frames: number;
            max_novelty: number;
            average_novelty: number;
            all_class_confidences: Record<string, number>;
        };
        createdAt: UtcTimestamp;
        updatedAt: UtcTimestamp;
        archivedAt: UtcTimestamp | null;
        AlgorithmId: number;
        TrackTags: TrackTag[];
    }

    export interface User {
        username: string;
        id?: number;
        email: string;
        globalPermission: "read" | "write" | "off";
    }

    export interface TrackTag {
        id: TrackTagId;
        TrackId: TrackId;
        UserId?: UserId;
        what: string;
        confidence?: number;
        automatic?: boolean;
        data?: "";
        createdAt?: UtcTimestamp;
        updatedAt?: UtcTimestamp;
        User?: User;
    }

    export interface LimitedTrackTag {
        TrackTagId: TrackTagId;
        what: string;
    }

    export interface Tag {
        what: string;
        confidence: number;
    }

    export interface QueryResultCount {
        count: number;
        success: boolean;
        messages: string[];
    }

    export interface QueryResult<T> {
        count: number;
        limit: string; // NOTE(jon): Actually, a number, but comes back as a string...
        messages: string[];
        offset: string; // NOTE(jon): Actually, a number, but comes back as a string...
        rows: T[];
        success: boolean;
    }

// TODO: Unify this with the TagMode type in the API, extract both into a third Types/Interfaces repo.
    export type TagMode =
        | "any"
        | "no-human"
        | "tagged"
        | "human-tagged"
        | "automatic-tagged"
        | "both-tagged"
        | "untagged";

    type JsonString = string;

    export interface RecordingQuery {
        where: JsonString; // Stringified: { duration: { $gte: number }; type: RecordingType; }
        limit: number;
        offset: number;
        tagMode?: TagMode;
        tags?: string[];
        order?: any; // TODO - It's not clear what order accepts (it's a sequelize thing), but nobody seems to use it right now.
    }
}

export default cacophony;