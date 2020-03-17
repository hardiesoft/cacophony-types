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
// TODO: Unify this with the TagMode type in the API, extract both into a third Types/Interfaces repo.
export type TagMode =
  | "any"
  | "no-human"
  | "tagged"
  | "human-tagged"
  | "automatic-tagged"
  | "both-tagged"
  | "untagged";

export type JsonString = string;

export interface FetchResult<T> {
  result: T;
  success: boolean;
  //status: number;
}

export interface Device {
  id: DeviceId;
  devicename: string;
  groupId: GroupId;
  active: boolean;
  users?: User[];
}

export interface Location {
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

export type Mp4File = "string";
export type CptvFile = "string";
export type Seconds = number;
export type Rectangle = [number, number, number, number];

export interface RequestResult {
  messages: string[];
  success: boolean;
}

export interface Recording {
  messages: [];
  recording: RecordingInfo;
  rawSize: number; // CPTV size
  fileSize: number; // MP4 size
  downloadFileJWT: JwtToken<Mp4File>;
  downloadRawJWT: JwtToken<CptvFile>;
  success: boolean;
}

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

export interface DeviceUsers {
  admin: boolean;
  createdAt: UtcTimestamp;
  updatedAt: UtcTimestamp;
  DeviceId: DeviceId;
  UserId: UserId;
}

export interface User {
  username: string;
  id?: UserId; // FIXME(jon): We always want this.
  email: string;
  globalPermission: "read" | "write" | "off";

  // FIXME(jon): Returned by devices: - but this seems unnecessary.
  DeviceUsers: DeviceUsers;
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
  limit?: string; // NOTE(jon): Actually, a number, but comes back as a string...
  messages: string[];
  offset?: string; // NOTE(jon): Actually, a number, but comes back as a string...
  rows: T[];
  success: boolean;
}

export interface RecordingQuery {
  where: JsonString; // Stringified: { duration: { $gte: number }; type: RecordingType; }
  limit: number;
  offset: number;
  tagMode?: TagMode;
  tags?: string[];
  order?: any; // TODO - It's not clear what order accepts (it's a sequelize thing), but nobody seems to use it right now.
}

export interface RecordingToTag {
  id: RecordingId;
  deviceId: DeviceId;
  tracks: Track[];
}
