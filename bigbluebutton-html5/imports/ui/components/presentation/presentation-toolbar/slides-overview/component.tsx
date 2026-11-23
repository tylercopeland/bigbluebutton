import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import Auth from '/imports/ui/services/auth';
import { CloseIcon } from '../icons';
import { SLIDE_THUMBNAILS_QUERY, SlideThumbnailsResponse } from './queries';
import Styled from './styles';

const intlMessages = defineMessages({
  title: {
    id: 'app.presentation.allSlides.title',
    description: 'Title of the grid with every slide',
    defaultMessage: 'All slides',
  },
  count: {
    id: 'app.presentation.allSlides.count',
    description: 'Number of slides in the presentation',
    defaultMessage: '{count, plural, one {# slide} other {# slides}}',
  },
  close: {
    id: 'app.presentation.allSlides.close',
    description: 'Label for the button that closes the grid with every slide',
    defaultMessage: 'Close all slides',
  },
  goToSlide: {
    id: 'app.presentation.presentationToolbar.goToSlide',
    description: 'button for slide select',
  },
});

const MAX_TITLE_LENGTH = 60;

const getSlideTitle = (content: string | null) => (
  (content ?? '').split('\n').map((line) => line.trim()).find(Boolean)?.slice(0, MAX_TITLE_LENGTH) ?? ''
);

interface SlidesOverviewProps {
  presentationId: string;
  presentationName: string;
  currentSlideNum: number;
  numberOfSlides: number;
  onSelect: (slideNum: number) => void;
  onClose: () => void;
}

const SlidesOverview: React.FC<SlidesOverviewProps> = ({
  presentationId, presentationName, currentSlideNum, numberOfSlides, onSelect, onClose,
}) => {
  const intl = useIntl();
  const currentRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery<SlideThumbnailsResponse>(SLIDE_THUMBNAILS_QUERY, {
    variables: { presentationId },
    fetchPolicy: 'cache-and-network',
  });
  const thumbnails = data?.pres_page ?? [];

  useEffect(() => {
    currentRef.current?.focus();
  }, [thumbnails.length]);

  const title = intl.formatMessage(intlMessages.title);

  return (
    <Styled.Overview role="dialog" aria-label={title} data-test="slidesOverview">
      <Styled.Header>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Details>
          <bdi>{presentationName}</bdi>
          {' · '}
          {intl.formatMessage(intlMessages.count, { count: numberOfSlides })}
        </Styled.Details>
        <Styled.Close
          type="button"
          aria-label={intl.formatMessage(intlMessages.close)}
          data-test="closeSlidesOverview"
          onClick={onClose}
        >
          <CloseIcon />
        </Styled.Close>
      </Styled.Header>
      <Styled.Grid>
        {thumbnails.map(({
          pageId, num, content, thumbnailUrl,
        }) => {
          const isCurrent = num === currentSlideNum;
          const slideTitle = getSlideTitle(content);
          const label = intl.formatMessage(intlMessages.goToSlide, { slideNumber: num });
          return (
            <Styled.Slide
              key={pageId}
              ref={isCurrent ? currentRef : undefined}
              type="button"
              aria-label={slideTitle ? `${label}: ${slideTitle}` : label}
              aria-current={isCurrent}
              data-test={`slideThumbnail${num}`}
              onClick={() => onSelect(num)}
            >
              <Styled.Thumbnail $isCurrent={isCurrent}>
                {thumbnailUrl && <img src={Auth.authenticateURL(thumbnailUrl)} alt="" draggable={false} />}
              </Styled.Thumbnail>
              <Styled.Caption>
                <Styled.Number $isCurrent={isCurrent}>{num}</Styled.Number>
                <Styled.SlideTitle dir="auto">{slideTitle}</Styled.SlideTitle>
              </Styled.Caption>
            </Styled.Slide>
          );
        })}
      </Styled.Grid>
    </Styled.Overview>
  );
};

export default SlidesOverview;
