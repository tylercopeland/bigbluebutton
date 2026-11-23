import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { colorPrimary, panelLive, pollBarColor } from '/imports/ui/stylesheets/styled-components/palette';
import Styled from '../styles';
import { ResponseInfo, UserInfo } from '../queries';
import logger from '/imports/startup/client/logger';
import { getSettingsSingletonInstance } from '/imports/ui/services/settings';
import useCurrentPoll from '../useCurrentPoll';
import connectionStatus from '/imports/ui/core/graphql/singletons/connectionStatus';
import Tooltip from '../../common/tooltip/component';

const intlMessages = defineMessages({
  usersTitle: {
    id: 'app.poll.liveResult.usersTitle',
    description: 'heading label for poll users',
  },
  responsesTitle: {
    id: 'app.poll.liveResult.responsesTitle',
    description: 'heading label for poll responses',
  },
  doneLabel: {
    id: 'app.createBreakoutRoom.doneLabel',
    description: 'label shown when all users have responded',
  },
  waitingLabel: {
    id: 'app.poll.waitingLabel',
    description: 'label shown while waiting for responses',
  },
  secretPollLabel: {
    id: 'app.poll.liveResult.secretLabel',
    description: 'label shown instead of users in poll responses if poll is secret',
  },
  resultsPrivate: {
    id: 'app.poll.liveResult.resultsPrivate',
    description: 'tells the presenter when live poll results are shown to everyone',
    defaultMessage: 'Results are not shown to everyone until you publish them.',
  },
  true: {
    id: 'app.poll.t',
    description: 'Poll true option value',
  },
  false: {
    id: 'app.poll.f',
    description: 'Poll false option value',
  },
  yes: {
    id: 'app.poll.y',
    description: 'Poll yes option value',
  },
  no: {
    id: 'app.poll.n',
    description: 'Poll no option value',
  },
  abstention: {
    id: 'app.poll.abstention',
    description: 'Poll Abstention option value',
  },
  correctAnswerTitle: {
    id: 'app.poll.quiz.liveResult.title.correct',
    description: 'Title for correct answer in quiz poll live result',
  },
  correctOption: {
    id: 'app.poll.quiz.options.correct',
    description: 'Label for correct answer option in quiz poll',
  },
  incorrectOption: {
    id: 'app.poll.quiz.options.incorrect',
    description: 'Label for incorrect answer option in quiz poll',
  },
});

const getPercentage = (count: number, total: number) => (
  `${total > 0 ? Math.round((count / total) * 100) : 0}%`
);

interface LiveResultProps {
  questionText: string;
  responses: Array<ResponseInfo>;
  usersCount: number;
  respondedUsersCount: number;
  animations: boolean;
  users: Array<UserInfo>;
  isSecret: boolean;
  isQuiz: boolean;
}

const LiveResult: React.FC<LiveResultProps> = ({
  questionText,
  responses,
  usersCount,
  respondedUsersCount,
  animations,
  users,
  isSecret,
  isQuiz,
}) => {
  const intl = useIntl();

  const translatedResponses = responses.map((response) => {
    const translationKey = intlMessages[response.optionDesc.toLowerCase() as keyof typeof intlMessages];
    const optionDesc = translationKey ? intl.formatMessage(translationKey) : response.optionDesc;
    return {
      ...response,
      optionDesc,
    };
  });

  const highestCount = Math.max(0, ...responses.map((r) => r.optionResponsesCount));

  return (
    <div>
      <Styled.LiveStatus>
        <Styled.LiveStatusText data-test="pollStatus">
          {usersCount !== respondedUsersCount
            ? intl.formatMessage(intlMessages.waitingLabel, {
              current: respondedUsersCount,
              total: usersCount,
            })
            : intl.formatMessage(intlMessages.doneLabel)}
        </Styled.LiveStatusText>
        <Styled.Track $height={6} aria-hidden>
          <Styled.Fill
            $color={panelLive}
            $animations={animations}
            style={{ width: getPercentage(respondedUsersCount, usersCount) }}
          />
        </Styled.Track>
      </Styled.LiveStatus>
      {questionText
        ? <Styled.Title data-test="currentPollQuestion" dir="auto">{questionText}</Styled.Title>
        : null}
      <Styled.Results data-test="pollLiveResults">
        {translatedResponses.map((response) => {
          const count = response.optionResponsesCount;
          const isLeading = count > 0 && count === highestCount;
          const percentage = getPercentage(count, respondedUsersCount);
          return (
            <li key={response.optionDesc}>
              <Styled.ResultHeader $leading={isLeading}>
                <Styled.ResultLabel>{response.optionDesc}</Styled.ResultLabel>
                <Styled.ResultCount $leading={isLeading}>
                  <bdi dir="ltr">
                    {`${count} · `}
                    <b>{percentage}</b>
                  </bdi>
                </Styled.ResultCount>
              </Styled.ResultHeader>
              <Styled.Track $height={10} aria-hidden>
                <Styled.Fill
                  $color={isLeading ? colorPrimary : pollBarColor}
                  $animations={animations}
                  style={{ width: percentage }}
                />
              </Styled.Track>
            </li>
          );
        })}
      </Styled.Results>
      <Styled.Note>{intl.formatMessage(intlMessages.resultsPrivate)}</Styled.Note>
      {
        !isSecret
          ? (
            <Styled.LiveResultTable>
              <tbody>
                <tr>
                  <Styled.THeading>{intl.formatMessage(intlMessages.usersTitle)}</Styled.THeading>
                  <Styled.THeading>{intl.formatMessage(intlMessages.responsesTitle)}</Styled.THeading>
                  {
                    isQuiz ? (
                      <Styled.THeading>{intl.formatMessage(intlMessages.correctAnswerTitle)}</Styled.THeading>
                    ) : null
                  }
                </tr>
                {
                  users.map((user) => (
                    <tr key={user.user.userId}>
                      <Styled.ResultLeft>{user.user.name}</Styled.ResultLeft>
                      <Styled.ResultRight data-test="userVoteLiveResult">
                        {
                          user.optionDescIds.map((optDesc) => {
                            const translationKey = intlMessages[optDesc.toLowerCase() as keyof typeof intlMessages];
                            return translationKey ? intl.formatMessage(translationKey) : optDesc;
                          }).join()
                        }
                      </Styled.ResultRight>
                      {
                        isQuiz ? user.optionDescIds.length > 0 && (
                          <Styled.ResultRight>
                            {user.optionDescIds.filter((opt) => {
                              const response = responses.find((r) => r.optionDesc === opt);
                              return response && response.correctOption;
                            }).length > 0
                              ? (
                                <Tooltip title={intl.formatMessage(intlMessages.correctOption)}>
                                  <span aria-label={intl.formatMessage(intlMessages.correctOption)}>✅</span>
                                </Tooltip>
                              )
                              : (
                                <Tooltip title={intl.formatMessage(intlMessages.incorrectOption)}>
                                  <span aria-label={intl.formatMessage(intlMessages.incorrectOption)}>❌</span>
                                </Tooltip>
                              )}
                          </Styled.ResultRight>
                        ) : null
                      }
                    </tr>
                  ))
                }
              </tbody>
            </Styled.LiveResultTable>
          )
          : (
            <Styled.Note>
              {intl.formatMessage(intlMessages.secretPollLabel)}
            </Styled.Note>
          )
      }
    </div>
  );
};

const LiveResultContainer: React.FC = () => {
  const {
    currentPoll,
    loading: currentPollLoading,
    error: currentPollDataError,
    respondedUsersCount,
    usersCount,
  } = useCurrentPoll();

  // This is the single place the poll subscription's failure is reported, so a failure is
  // logged once no matter how many components are reading the poll.
  if (currentPollDataError) {
    connectionStatus.setSubscriptionFailed(true);
    logger.error(
      {
        logCode: 'subscription_Failed',
        extraInfo: {
          error: currentPollDataError,
        },
      },
      'Subscription failed to load',
    );
    return null;
  }

  if (currentPollLoading || !currentPoll) return null;

  const Settings = getSettingsSingletonInstance();
  // @ts-ignore - JS code
  const { animations } = Settings.application;
  const {
    questionText,
    responses,
    users,
    secret: isSecret,
    quiz: isQuiz,
  } = currentPoll;

  return (
    <LiveResult
      questionText={questionText}
      responses={responses}
      isSecret={isSecret}
      usersCount={usersCount}
      respondedUsersCount={respondedUsersCount}
      animations={animations}
      users={users}
      isQuiz={isQuiz}
    />
  );
};

export default LiveResultContainer;
