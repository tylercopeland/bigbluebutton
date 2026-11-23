import { gql } from '@apollo/client';

export interface SlideThumbnail {
  pageId: string;
  num: number;
  content: string | null;
  thumbnailUrl: string | null;
}

export interface SlideThumbnailsResponse {
  pres_page: SlideThumbnail[];
}

export const SLIDE_THUMBNAILS_QUERY = gql`
query SlideThumbnails($presentationId: String!) {
  pres_page(
    where: { presentationId: { _eq: $presentationId } },
    order_by: { num: asc }
  ) {
    pageId
    num
    content
    thumbnailUrl: urlsJson(path: "$.thumb")
  }
}`;
