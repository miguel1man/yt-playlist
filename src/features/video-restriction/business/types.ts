export interface Video {
  id: string;
  title: string;
  channel: string;
}

export interface BlockedVideo extends Video {
  allowed: string[];
  blocked: string[];
  allItems: {
    id: string;
    title: string;
    channel: string;
  }[];
}

export type PlaylistRestrictionStatus = {
  allowedVideosCount: number;
  blockedVideos: BlockedVideo[];
};
